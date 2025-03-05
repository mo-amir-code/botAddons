import { FolderPlatformType, FolderType } from "../../db/schema/index.js";

interface CreateFolderBodyType {
  parent?: string;
  title: string;
  type: FolderType;
}

interface CreateFolderType extends CreateFolderBodyType {
  userId: string;
  platform: FolderPlatformType;
}

type DeleteFoldersBodyType = {
  ids: string[]
  folderId?: string
  type: FolderType
}

export type { CreateFolderBodyType, CreateFolderType, DeleteFoldersBodyType };
