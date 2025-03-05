import { Folder } from "../../db/models/index.js";
import {
  createFolder,
  deleteFolderById,
  findFolderByIdAndUpdate,
  getFolderById,
} from "../../db/services/folder.db.service.js";
import {
  apiHandler,
  ErrorHandlerClass,
  ok,
} from "../../services/errorHandling/index.js";
import {
  CreateFolderBodyType,
  CreateFolderType,
  DeleteFoldersBodyType,
} from "../../types/controllers/v1/folder.js";
import { PromptSchemaType } from "../../types/db/schema/index.js";
import {
  FindFolderByIdAndUpdate,
  GetFoldersType,
} from "../../types/db/services/folder.types.js";
import { BAD_REQUEST_STATUS_CODE } from "../../utils/constants/common.js";
import {
  FOLDER_CREATED_RES_MSG,
  FOLDER_DELETED_RES_MSG,
  FOLDER_FETCHED_RES_MSG,
  FOLDER_FILES_FETCHED_RES_MSG,
  FOLDER_UPDATE_RES_MSG,
  SOMETHING_WENT_WRONG,
} from "../../utils/constants/serverResponseMessages.js";

const createFolderHandler = apiHandler(async (req, res) => {
  const data = req.body as CreateFolderBodyType;
  let origin = req.origin as any;
  origin = origin === "website" ? "all" : origin;

  const newFolderData: CreateFolderType = {
    ...data,
    platform: origin,
    userId: req.user.id,
  };

  const newFolder = await createFolder(newFolderData);

  const resData = {
    id: newFolder._id,
    title: newFolder.title,
    isFolder: true,
    totalItems: 0,
    createdAt: newFolder.createdAt,
    updatedAt: newFolder.updatedAt,
  };

  return ok({
    res,
    message: FOLDER_CREATED_RES_MSG,
    data: resData,
  });
});

const deleteFolderByIdHandler = apiHandler(async (req, res, next) => {
  const { ids, folderId } = req.body as DeleteFoldersBodyType;
  const folderIds = ids.filter((id) => !id.includes("-"));

  for (const childFolderId of folderIds) {
    deleteFolderRecursively(childFolderId);
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

  return ok({
    res,
    message: FOLDER_DELETED_RES_MSG,
  });
});

const updateFolderHandler = apiHandler(async (req, res) => {
  const data = req.body as FindFolderByIdAndUpdate;
  await findFolderByIdAndUpdate(data);
  return ok({
    res,
    message: FOLDER_UPDATE_RES_MSG,
  });
});

const getFoldersHandler = apiHandler(async (req, res) => {
  const { type, id } = req.query as GetFoldersType;
  const { id: userId } = req.user;

  let files;

  if (!id) {
    files = await Folder.find({ userId, type, parent: undefined }).select(
      "title chats prompts createdAt updatedAt"
    );
    files = files.map((item) => {
      return {
        id: item._id,
        title: item.title,
        isFolder: true,
        totalItems: type === "chats" ? item.chats.length : item.prompts.length,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });
    files = {
      isRoot: true,
      items: files,
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
      files = await Folder.findById(id).populate("prompts");

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
      "title chats prompts createdAt updatedAt"
    );

    folders = folders.map((item) => {
      return {
        id: item._id,
        title: item.title,
        isFolder: true,
        totalItems: type === "chats" ? item.chats.length : item.prompts.length,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

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

  return ok({
    res,
    message: FOLDER_FETCHED_RES_MSG,
    data: files,
  });
});

const getFolderFilesHandler = apiHandler(async (req, res) => {
  const { id } = req.query as { id: string };
  let files = await Folder.findById(id);

  if (files.type === "prompts") {
    files = await Folder.findById(id).populate("prompts");
  }

  const folders = await Folder.find({ parent: id }).select("-userId -platform");
  files["folders"] = folders;

  return ok({
    res,
    message: FOLDER_FILES_FETCHED_RES_MSG,
    data: files,
  });
});

const deleteFolderRecursively = async (folderId: string) => {
  try {
    // Find all child folders
    const childFolders = await Folder.find({ parent: folderId });

    // Recursively delete child folders
    for (const child of childFolders) {
      await deleteFolderRecursively(child._id.toString());
    }

    // Finally, delete the folder itself
    await Folder.findByIdAndDelete(folderId);
  } catch (error) {
    console.error("Error deleting folder:", error);
  }
};

export {
  createFolderHandler,
  deleteFolderByIdHandler,
  updateFolderHandler,
  getFoldersHandler,
  getFolderFilesHandler,
};
