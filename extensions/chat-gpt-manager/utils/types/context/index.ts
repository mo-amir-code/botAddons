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

type ActionType =
  | "EXTENSION_LOADING"
  | "AUTH"
  | "USER_INFO"
  | "PLAN"
  | "CONVERSATIONS"
  | "ALL_CONVERSATIONS"
  | "CHAT_LOADED"
  | "TOGGLE_HEADER_STATE"

interface HeaderStatesType {
  exactMatchStatus: boolean
  isSettingsOpen: boolean
  isAddChatsOpen: boolean
  isAddFolderOpen: boolean
}

type HeaderStatesName =
  | "exactMatchStatus"
  | "isSettingsOpen"
  | "isAddChatsOpen"
  | "isAddFolderOpen"

export type {
  PlansNameType,
  UserInfoType,
  ReducerActionType,
  ActionType,
  HeaderStatesType,
  HeaderStatesName
}
