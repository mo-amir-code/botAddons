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

type FoldersType = "chats" | "prompts" | null

interface FoldersWindow {
  type: FoldersType
  folders: string[]
}

export type {
  ConversationObjectType,
  DefaultMessageType,
  FoldersType,
  FoldersWindow
}
