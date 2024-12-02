

interface ConversationObjectType<MessageType, UpdateTimeType> {
    id: string
    title: string
    messages: MessageType[]
    update_time: UpdateTimeType
}

type DefaultMessageType = {
    id: string
    content: string
    role: string
}


export type {
    ConversationObjectType,
    DefaultMessageType,

}