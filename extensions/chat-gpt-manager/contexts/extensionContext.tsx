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
  extensionLoading: boolean
  isUserLoggedIn: boolean
  plan: PlansNameType
  userInfo: UserInfoType | null
}

const initialState: ExtensionState = {
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
         state.extensionLoading = action.payload;
         return state;
      case "auth":
         state.isUserLoggedIn = action.payload;
         return state;
      case "userInfo":
         state.userInfo = action.payload;
         return state;
      case "plan":
         state.plan = action.payload;
         return state;
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
