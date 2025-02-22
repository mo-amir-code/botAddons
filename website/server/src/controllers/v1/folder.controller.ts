import { Folder } from "../../db/models/index.js";
import {
  createFolder,
  deleteFolderById,
  findFolderByIdAndUpdate,
} from "../../db/services/folder.db.service.js";
import { apiHandler, ok } from "../../services/errorHandling/index.js";
import { CreateFolderType } from "../../types/controllers/v1/folder.js";
import {
  FindFolderByIdAndUpdate,
  GetFoldersType,
} from "../../types/db/services/folder.types.js";
// import { OriginType } from "../../types/index.js";
import {
  FOLDER_CREATED_RES_MSG,
  FOLDER_DELETED_RES_MSG,
  FOLDER_FETCHED_RES_MSG,
  FOLDER_FILES_FETCHED_RES_MSG,
  FOLDER_UPDATE_RES_MSG,
} from "../../utils/constants/serverResponseMessages.js";

const createFolderHandler = apiHandler(async (req, res) => {
  const data = req.body as CreateFolderType;
  const newFolder = await createFolder(data);
  return ok({
    res,
    message: FOLDER_CREATED_RES_MSG,
    data: newFolder,
  });
});

const deleteFolderByIdHandler = apiHandler(async (req, res) => {
  const { folderId } = req.body as { folderId: string };
  await deleteFolderById(folderId);

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
  const { userId, type } = req.query as GetFoldersType;

  const folders = await Folder.find({ userId, type, parent: undefined }).select(
    "-userId -platform"
  );

  return ok({
    res,
    message: FOLDER_FETCHED_RES_MSG,
    data: folders,
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

export {
  createFolderHandler,
  deleteFolderByIdHandler,
  updateFolderHandler,
  getFoldersHandler,
  getFolderFilesHandler,
};
