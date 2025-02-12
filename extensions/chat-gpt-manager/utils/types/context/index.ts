import type { ConversationObjectType } from "../components/search"

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
  | { type: "extensionLoading"; payload: boolean }
  | { type: "auth"; payload: boolean }
  | { type: "userInfo"; payload: UserInfoType | null }
  | { type: "plan"; payload: PlansNameType }
  | { type: "conversations"; payload: ConversationObjectType<string, number>[] }
  | {
      type: "allConversations"
      payload: ConversationObjectType<string, number>[]
    }
  | { type: "chatLoaded"; payload: number }
  | { type: "toggleHeaderState"; payload: HeaderStatesName }

type ActionType =
  | "extensionLoading"
  | "auth"
  | "userInfo"
  | "plan"
  | "conversations"
  | "allConversations"
  | "chatLoaded"
  | "toggleHeaderState"

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
