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

interface FolderFileType {
  isRoot: boolean
  info?: FolderInfoType
  items: FolderItemType[]
}

type FolderInfoType = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

type FolderItemType = {
  id: string | number
  title: string
  isFolder: boolean
  totalItems?: number
  createdAt: string | number
  updatedAt: string | number
} & (
  | { content: string; conversationId?: never }
  | { conversationId: string; content?: never }
)

type PromptTriggerType = {
  isPromptOpen: boolean
  promptQuery: string
}

export type {
  ModalType,
  PromptFileType,
  FolderFileType,
  FolderInfoType,
  FolderItemType,
  PromptTriggerType
}
