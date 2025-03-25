import { Folder, Prompt } from "../../db/models/index.js";
import {
  createFolder,
  findFolderByIdAndUpdate,
  getFolderById,
} from "../../db/services/folder.db.service.js";
import {
  apiHandler,
  ErrorHandlerClass,
  ok,
} from "../../services/errorHandling/index.js";
import { redisClient } from "../../services/redis/connect.js";
import { getFolderRedisKey } from "../../services/redis/helper.js";
import { FOLDERS_KEY } from "../../services/redis/keys.js";
import {
  CreateFolderBodyType,
  CreateFolderType,
  DeleteFoldersBodyType,
} from "../../types/controllers/v1/folder.js";
import {
  FolderSchemaType,
  FolderType,
  PromptSchemaType,
} from "../../types/db/schema/index.js";
import {
  FindFolderByIdAndUpdate,
  GetFoldersType,
} from "../../types/db/services/folder.types.js";
import {
  BAD_REQUEST_STATUS_CODE,
  CONFLICT_REQUEST_STATUS_CODE,
} from "../../utils/constants/common.js";
import {
  DUPLICATE_FOLDER_RES_MSG,
  FOLDER_CREATED_RES_MSG,
  FOLDER_DELETED_RES_MSG,
  FOLDER_FETCHED_RES_MSG,
  FOLDER_FILES_FETCHED_RES_MSG,
  FOLDER_UPDATE_RES_MSG,
  SOMETHING_WENT_WRONG,
} from "../../utils/constants/serverResponseMessages.js";

const createFolderHandler = apiHandler(async (req, res, next) => {
  const data = req.body as CreateFolderBodyType;
  let origin = req.origin as any;
  origin = origin === "website" ? "all" : origin;

  let newFolderData: CreateFolderType = {
    ...data,
    platform: origin,
    userId: req.user.id,
  };

  const folder = await Folder.findOne(newFolderData);
  if (folder) {
    return next(
      new ErrorHandlerClass(
        DUPLICATE_FOLDER_RES_MSG,
        CONFLICT_REQUEST_STATUS_CODE
      )
    );
  }

  const newFolder = await createFolder(newFolderData);

  const resData = {
    id: newFolder._id,
    title: newFolder.title,
    isFolder: true,
    totalItems: 0,
    createdAt: newFolder.createdAt,
    updatedAt: newFolder.updatedAt,
  };

  const key = getFolderRedisKey({
    userId: req.user.id,
    type: newFolder.type,
    root: newFolder.parent as string | undefined,
  });

  let cachedData = await redisClient?.get(key);

  if (cachedData) {
    cachedData = JSON.parse(cachedData);
    cachedData.items.unshift(resData);
    await redisClient?.set(key, JSON.stringify(cachedData));
  }

  return ok({
    res,
    message: FOLDER_CREATED_RES_MSG,
    data: resData,
  });
});

const deleteFolderByIdHandler = apiHandler(async (req, res, next) => {
  const { ids, folderId, type, promptIds } = req.body as DeleteFoldersBodyType;
  const userId = req.user.id;

  const key = getFolderRedisKey({ userId: req.user.id, type, root: folderId });
  let cachedData = await redisClient?.get(key);

  let deletedPromptIds = [];

  if (type === "prompts") {
    deletedPromptIds = await Promise.all(
      ids.map((folderId) =>
        deleteFolderRecursively({ folderId: folderId.toString(), type, userId })
      )
    );

    deletedPromptIds = deletedPromptIds.flat(2);

    await Prompt.deleteMany({ _id: { $in: promptIds } });

    if (cachedData) {
      cachedData = JSON.parse(cachedData);
      let items = cachedData.items.filter(
        (item: any) => !promptIds?.includes(item.id) && !ids.includes(item.id)
      );
      cachedData = { ...cachedData, items };
    }
  } else {
    const folderIds = ids.filter((id) => !id.includes("-"));

    for (const childFolderId of folderIds) {
      deleteFolderRecursively({ folderId: childFolderId, type, userId });
    }

    const chatIds = ids.filter((id) => id.includes("-"));

    if (folderId) {
      const folder = await getFolderById(folderId);

      if (!folder) {
        return next(
          new ErrorHandlerClass(SOMETHING_WENT_WRONG, BAD_REQUEST_STATUS_CODE)
        );
      }

      folder.chats = folder.chats.filter((cId) => !chatIds.includes(cId));
      await folder.save();
    }

    if (cachedData) {
      cachedData = JSON.parse(cachedData);
      let items = cachedData.items.filter(
        (item: any) =>
          !chatIds.includes(item.id || item?.conversationId) &&
          !folderIds.includes(item.id || item?.conversationId)
      );
      cachedData = { ...cachedData, items };
    }
  }

  if (cachedData) {
    await redisClient?.set(key, JSON?.stringify(cachedData));
  }

  return ok({
    res,
    message: FOLDER_DELETED_RES_MSG,
    data: {
      deletedPromptIds,
    },
  });
});

const updateFolderHandler = apiHandler(async (req, res) => {
  const data = req.body as FindFolderByIdAndUpdate;

  const folder = (await findFolderByIdAndUpdate(data)) as FolderSchemaType;

  // Updating Parent Folder Item Name
  const parentKey = getFolderRedisKey({
    userId: req.user.id,
    type: folder.type as string,
    root: folder.parent as string | undefined,
  });
  let parentCachedData = await redisClient?.get(parentKey);

  if (parentCachedData) {
    parentCachedData = JSON.parse(parentCachedData);
    parentCachedData.items = parentCachedData.items.map((it: any) => {
      let obj = { ...it };
      if (obj.id == folder._id) {
        obj["title"] = folder.title;
      }
      return obj;
    });
    await redisClient?.set(parentKey, JSON.stringify(parentCachedData));
  }

  // Updating Current Folder Name
  const key = getFolderRedisKey({
    userId: req.user.id,
    type: folder.type as string,
    root: folder._id.toString(),
  });
  let cachedData = await redisClient?.get(key);

  if (cachedData) {
    cachedData = JSON.parse(cachedData)
    cachedData.info.title = folder.title;
    await redisClient?.set(key, JSON.stringify(cachedData));
  }

  return ok({
    res,
    message: FOLDER_UPDATE_RES_MSG,
  });
});

const getFoldersHandler = apiHandler(async (req, res) => {
  const { type, id } = req.query as GetFoldersType;
  const { id: userId } = req.user;

  let files;

  let key = FOLDERS_KEY.replace("{userId}", userId).replace("{type}", type);
  if (id) key = key.replace("{root}", id);

  const cachedData = await redisClient?.get(key);

  if (cachedData) {
    return ok({
      res,
      message: FOLDER_FETCHED_RES_MSG,
      data: JSON.parse(cachedData),
    });
  }

  if (!id) {
    files = await Folder.find({ userId, type, parent: undefined }).select(
      "title chats createdAt updatedAt"
    );

    files = await Promise.all(
      files.map(async (item) => {
        let promptCount;
        if (item.type != "chats")
          promptCount = await Prompt.countDocuments({ folderId: item._id });
        return {
          id: item._id,
          title: item.title,
          isFolder: true,
          totalItems: item.type === "chats" ? item.chats.length : promptCount,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      })
    );

    let items: any = [];

    if (type === "prompts") {
      items = await Prompt.find({ userId, folderId: undefined });

      items = items.map((item: PromptSchemaType) => {
        return {
          id: item._id,
          title: item.title,
          content: item.content,
          isFolder: false,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      });
    }

    files = {
      isRoot: true,
      items: [...files, ...items],
    };
  } else {
    files = await Folder.findById(id);

    let items =
      files?.chats?.map((convId: string, idx: number) => {
        return {
          id: idx,
          conversationId: convId,
          isFolder: false,
        };
      }) || [];

    if (files.type === "prompts") {
      files.prompts = await Prompt.find({ folderId: files._id });

      items = files.prompts.map((item: PromptSchemaType) => {
        return {
          id: item._id,
          title: item.title,
          content: item.content,
          isFolder: false,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      });
    }

    let folders = await Folder.find({ parent: id }).select(
      "title chats createdAt updatedAt"
    );

    folders = await Promise.all(
      folders.map(async (item) => {
        let promptCount;
        if (item.type != "chats")
          promptCount = await Prompt.countDocuments({ folderId: item._id });
        return {
          id: item._id,
          title: item.title,
          isFolder: true,
          totalItems: type === "chats" ? item.chats.length : promptCount,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      })
    );

    items = [...folders, ...items];

    files = {
      isRoot: false,
      info: {
        id: files._id,
        title: files.title,
        createdAt: files.createdAt,
        updatedAt: files.updatedAt,
      },
      items,
    };
  }

  await redisClient?.set(key, JSON.stringify(files));

  return ok({
    res,
    message: FOLDER_FETCHED_RES_MSG,
    data: files,
  });
});

// Not Used
const getFolderFilesHandler = apiHandler(async (req, res) => {
  const { id } = req.query as { id: string };
  let files = await Folder.findById(id);

  if (files.type === "prompts") {
    files.prompts = await Prompt.find({ folderId: id });
  }

  const folders = await Folder.find({ parent: id }).select("-userId -platform");
  files["folders"] = folders;

  return ok({
    res,
    message: FOLDER_FILES_FETCHED_RES_MSG,
    data: files,
  });
});

const deleteFolderRecursively = async ({
  folderId,
  userId,
  type,
}: {
  folderId: string;
  userId: string;
  type?: FolderType;
}) => {
  try {
    // Find all child folders
    const childFolders = await Folder.find({ parent: folderId });

    let deletedPromptIds: any = [];

    if (childFolders.length > 0) {
      const childResults =
        (await Promise.all(
          childFolders.map((child) =>
            deleteFolderRecursively({
              folderId: child._id.toString(),
              userId,
              type,
            })
          )
        ));

      deletedPromptIds = childResults.flat() || [];
    }

    const key = getFolderRedisKey({
      userId,
      type: type == "chats" ? "chats" : "prompts",
      root: folderId,
    });
    
    await redisClient?.del(key);

    await Folder.findByIdAndDelete(folderId);

    if (type == "prompts") {
      let promptsIds = await Prompt.find({ folderId: folderId }).select("_id");
      promptsIds = promptsIds.map((item) => item._id);
      await Prompt.deleteMany({ folderId: folderId });
      deletedPromptIds = [...deletedPromptIds, ...promptsIds];
    }

    return deletedPromptIds;
  } catch (error) {
    console.error("Error deleting folder:", error);
    return []
  }
};

export {
  createFolderHandler,
  deleteFolderByIdHandler,
  updateFolderHandler,
  getFoldersHandler,
  getFolderFilesHandler,
};
