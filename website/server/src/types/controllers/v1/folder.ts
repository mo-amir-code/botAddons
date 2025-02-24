import { FolderPlatformType, FolderType } from "../../db/schema/index.js";

interface CreateFolderBodyType {
  title: string;
  type: FolderType;
}

interface CreateFolderType extends CreateFolderBodyType {
  userId: string;
  platform: FolderPlatformType;
}

export type { CreateFolderBodyType, CreateFolderType };
