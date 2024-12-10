

interface ConversationUpdateType {
    archive?: "archive" | "unarchive"
    isVisible?: boolean
    conversationId: string
}

export type {
    ConversationUpdateType
}
