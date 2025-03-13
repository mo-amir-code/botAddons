import type {
  FolderFileType,
  FolderInfoType,
  PromptFileType,
  PromptTriggerType
} from "../components/modal"
import type {
  ConversationObjectType,
  FoldersWindow
} from "../components/search"

type PlansNameType = "basic" | "premium" | "lifetime"

interface UserInfoType {
  id: string
  fullName: string
  email: string
}

// interface ReducerActionType {
//   type: ActionType
//   payload: any
// }

type ReducerActionType =
  | { type: "EXTENSION_LOADING"; payload: boolean }
  | { type: "AUTH"; payload: boolean }
  | { type: "USER_INFO"; payload: UserInfoType | null }
  | { type: "PLAN"; payload: PlansNameType }
  | { type: "CONVERSATIONS"; payload: ConversationObjectType<string, number>[] }
  | {
      type: "ALL_CONVERSATIONS"
      payload: ConversationObjectType<string, number>[]
    }
  | { type: "CHAT_LOADED"; payload: number }
  | { type: "TOGGLE_HEADER_STATE"; payload: HeaderStatesName }
  | { type: "FOLDERS_WINDOW"; payload: FoldersWindow }
  | { type: "RESET_HEADER_STATES" }
  | { type: "CURRENT_FOLDER_INFO"; payload: FolderInfoType | null }
  | { type: "FOLDER_ALL_FILES"; payload: FolderFileType }
  | { type: "CURRENT_EDITING_FILE_INFO"; payload: PromptFileType | null }

type ActionType =
  | "EXTENSION_LOADING"
  | "AUTH"
  | "USER_INFO"
  | "PLAN"
  | "CONVERSATIONS"
  | "ALL_CONVERSATIONS"
  | "CHAT_LOADED"
  | "TOGGLE_HEADER_STATE"
  | "CURRENT_FOLDER_INFO"
  | "FOLDER_ALL_FILES"
  | "CURRENT_EDITING_FILE_INFO"

interface HeaderStatesType {
  exactMatchStatus: boolean
  isSettingsOpen: boolean
  isAddChatsOpen: boolean
  isAddFolderOpen: boolean
  isAddPromptOpen: boolean
  isFolderEditingOpen: boolean
}

type HeaderStatesName =
  | "exactMatchStatus"
  | "isSettingsOpen"
  | "isAddChatsOpen"
  | "isAddFolderOpen"
  | "isAddPromptOpen"
  | "isFolderEditingOpen"

export type {
  PlansNameType,
  UserInfoType,
  ReducerActionType,
  ActionType,
  HeaderStatesType,
  HeaderStatesName
}
