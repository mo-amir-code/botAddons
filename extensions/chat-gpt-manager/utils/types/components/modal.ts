import type { FoldersType } from "./search"
import type { OpenModalType } from "./sidebar"

interface ModalType {
  openModal: OpenModalType
  setOpenModal: Function
}

interface PromptFileType {
  id: string
  title: string
  content: string
}

interface FolderFileType<ChatType> {
  id: string
  parent?: string
  title: string
  chats: ChatType[]
  prompts: PromptFileType[]
  type: FoldersType
}

export type { ModalType, PromptFileType, FolderFileType }
