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

export type { CreateFolderBodyType, CreateFolderType };
