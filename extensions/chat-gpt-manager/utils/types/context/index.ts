

type PlansNameType = "basic" | "premium" | "lifetime";

interface UserInfoType {
    id: string
    fullName: string
    email: string
}

interface ReducerActionType {
    type: ActionType
    payload: any
}

type ActionType = "extensionLoading" | "auth" | "userInfo" | "plan" | "conversations" | "allConversations" | "chatLoaded"

export type {
    PlansNameType,
    UserInfoType,
    ReducerActionType,
    ActionType
}