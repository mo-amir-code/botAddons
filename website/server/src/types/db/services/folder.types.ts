import { FolderPlatformType, FolderType } from "../schema/index.js";

interface FindFolderByIdAndUpdate {
  id: string;
  userId?: string;
  title?: string;
  chats?: string[];
  prompts?: string[];
  type?: FolderType;
  platform?: FolderPlatformType;
}

type GetFoldersType = {
  type: FolderType;
  id?: string;
};

export type { FindFolderByIdAndUpdate, GetFoldersType };
