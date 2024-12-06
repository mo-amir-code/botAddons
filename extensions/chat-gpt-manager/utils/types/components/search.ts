

interface ConversationObjectType<MessageType, UpdateTimeType> {
    id: string
    title: string
    messages: MessageType[]
    update_time: UpdateTimeType
    is_archived: boolean
    isArchived?: boolean
    updateTime?: number
}

type DefaultMessageType = {
    id: string
    content: string
    text?: string
    role: string
}


export type {
    ConversationObjectType,
    DefaultMessageType,

}