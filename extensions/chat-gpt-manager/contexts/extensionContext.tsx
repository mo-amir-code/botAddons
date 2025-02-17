import type {
  ConversationObjectType,
  FoldersWindow
} from "@/utils/types/components/search"
import type {
  HeaderStatesType,
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
  headerStates: HeaderStatesType
  foldersWindow: FoldersWindow
}

const initialState: ExtensionState = {
  chatsLoaded: 0,
  conversations: [],
  allConversations: [],
  extensionLoading: false,
  isUserLoggedIn: false,
  plan: "basic",
  userInfo: null,
  headerStates: {
    exactMatchStatus: false,
    isAddChatsOpen: false,
    isAddFolderOpen: false,
    isSettingsOpen: false,
    isAddPromptOpen: false,
    isFolderEditingOpen: false
  },
  foldersWindow: {
    type: null,
    folders: []
  }
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
      case "EXTENSION_LOADING":
        return { ...state, extensionLoading: action.payload }
      case "AUTH":
        return { ...state, isUserLoggedIn: action.payload }
      case "USER_INFO":
        return { ...state, userInfo: action.payload }
      case "PLAN":
        return { ...state, plan: action.payload }
      case "CONVERSATIONS":
        return { ...state, conversations: action.payload }
      case "ALL_CONVERSATIONS":
        return { ...state, allConversations: action.payload }
      case "CHAT_LOADED":
        return { ...state, chatsLoaded: action.payload }
      case "TOGGLE_HEADER_STATE":
        const updatedHeader = state.headerStates
        updatedHeader[action.payload] = !updatedHeader[action.payload]
        return { ...state, headerStates: updatedHeader }
      case "FOLDERS_WINDOW":
        return { ...state, foldersWindow: action.payload }
      case "RESET_HEADER_STATES":
        const newHeaderStates = { ...state.headerStates }
        for (let obj in newHeaderStates) newHeaderStates[obj] = false
        return { ...state, headerStates: newHeaderStates }
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
