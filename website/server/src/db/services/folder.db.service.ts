import { Folder} from "../models/index.js";
import { FolderSchemaType } from "../../types/db/schema/index.js";
import { CreateFolderType } from "../../types/controllers/v1/folder.js";
import { FindFolderByIdAndUpdate } from "../../types/db/services/folder.types.js";


const createFolder = async (data: CreateFolderType): Promise<FolderSchemaType> => {
    return await Folder.create(data);
}

const deleteFolderById = async (folderId: string): Promise<FolderSchemaType | null> => {
    return await Folder.findByIdAndDelete(folderId);
}

const findFolderByIdAndUpdate = async (data: FindFolderByIdAndUpdate): Promise<FolderSchemaType | null> => {
    return await Folder.findByIdAndUpdate(data.id, { ...data });
}

const getFolderById = async (id: string): Promise<FolderSchemaType | null> => {
    return await Folder.findById(id)
}

const getFoldersByUserId = async (userId: string): Promise<FolderSchemaType[] | null> => {
    return await Folder.find({ userId });
}


export {
    createFolder,
    deleteFolderById,
    findFolderByIdAndUpdate,
    getFolderById,
    getFoldersByUserId
}