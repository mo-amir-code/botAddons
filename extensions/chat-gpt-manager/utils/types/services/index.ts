import type { ConversationObjectType } from "../components/search"


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

export type {
    FormatTimestampType,
    FormatTimestampTypeType,
    FilerChatsType,
    SortType
}