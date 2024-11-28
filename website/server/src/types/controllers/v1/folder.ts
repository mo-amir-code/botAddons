import { FolderPlatformType, FolderType } from "../../db/schema/index.js"

interface CreateFolderType {
    userId: string
    title: string
    type: FolderType
    platform: FolderPlatformType
}

export type {
    CreateFolderType
}