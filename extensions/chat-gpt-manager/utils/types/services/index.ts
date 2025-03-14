import type { FolderItemType } from "../components/modal"
import type { ConversationObjectType, FoldersWindow } from "../components/search"


interface FormatTimestampType {
    timestamp: string | number
    type: FormatTimestampTypeType
}

type FormatTimestampTypeType = "date" | "time" | "both"

interface FilerChatsType {
    conversations: ConversationObjectType<string, number>[]
    sort: SortType
    filter?: FilterType
}

type SortType = "asc" | "desc"
type FilterType = "removeEmptyConversations"

interface HandleLocalStorageDataType {
    data: FolderItemType | FolderItemType[] | string | string[]
    foldersWindow: FoldersWindow
    operationType: LocalStorageOperationType
}

type LocalStorageOperationType = "editFolder" | "newFolder" | "addItems" | "deleteItems" | "editPrompt"

export type {
    FormatTimestampType,
    FormatTimestampTypeType,
    FilerChatsType,
    SortType,
    HandleLocalStorageDataType,
    LocalStorageOperationType
}