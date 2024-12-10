import type { ConversationObjectType } from "@/utils/types/components/search"
import type {
  PlansNameType,
  ReducerActionType,
  UserInfoType
} from "@/utils/types/context"
import React, {
  createContext,
  useContext,
  useReducer,
  type Dispatch
} from "react"

interface ExtensionState {
  chatsLoaded: number
  conversations: ConversationObjectType<string, number>[]
  allConversations: ConversationObjectType<string, number>[]
  extensionLoading: boolean
  isUserLoggedIn: boolean
  plan: PlansNameType
  userInfo: UserInfoType | null
}

const initialState: ExtensionState = {
  chatsLoaded: 0,
  conversations: [],
  allConversations: [],
  extensionLoading: false,
  isUserLoggedIn: false,
  plan: "basic",
  userInfo: null
}

interface ExtensionActions {
  dispatch: Dispatch<ReducerActionType>
}

interface ExtensionContext extends ExtensionState, ExtensionActions {}

const ExtensionContext = createContext<ExtensionContext | undefined>(undefined)

export function useExtension() {
  const context = useContext(ExtensionContext)

  if (!context) {
    throw new Error("useExtension must be used within a ExtensionProvider")
  }

  return context
}

interface ExtensionProviderProps {
  children: React.ReactNode
}

export function ExtensionProvider({ children }: ExtensionProviderProps) {
  const handleReducer = (state: ExtensionState, action: ReducerActionType) => {
    switch (action.type) {
      case "extensionLoading":
        return { ...state, extensionLoading: action.payload }
      case "auth":
        return { ...state, isUserLoggedIn: action.payload }
      case "userInfo":
        return { ...state, userInfo: action.payload }
      case "plan":
        return { ...state, plan: action.payload }
      case "conversations":
        return { ...state, conversations: action.payload }
      case "allConversations":
        return { ...state, allConversations: action.payload }
      case "chatLoaded":
        return { ...state, chatsLoaded: action.payload }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(handleReducer, initialState)

  return (
    <ExtensionContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ExtensionContext.Provider>
  )
}
