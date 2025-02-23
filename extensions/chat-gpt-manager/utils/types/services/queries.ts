import type { FoldersType } from "../components/search"


interface ConversationUpdateType {
    archive?: "archive" | "unarchive"
    isVisible?: boolean
    conversationId: string
}

interface FetchFoldersQueryType {
    type: FoldersType
    id?: string
}

export type {
    ConversationUpdateType,
    FetchFoldersQueryType
}
