import React, { createContext, useContext, useState } from "react"

type Theme = "dark" | "light" | "system"
const defaultTheme = "system"
const storageKey = "vite-ui-theme"

interface ExtensionState {
  extensionTheme: Theme
  extensionLoading: boolean
}

const initialState: ExtensionState = {
  extensionTheme: "dark",
  extensionLoading: false
}

interface ExtensionActions {
  setExtensionLoading: (loading: boolean) => void
  setExtensionTheme: (theme: Theme) => void
  resetExtension: () => void
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
  const [extensionTheme, setExtensionTheme] = useState<Theme>(
    initialState.extensionTheme
  )
  const [extensionLoading, setExtensionLoading] = useState<boolean>(
    initialState.extensionLoading
  )

  function resetExtension() {
    setExtensionLoading(initialState.extensionLoading)
    setExtensionTheme(initialState.extensionTheme)
  }

  const value = {
    extensionLoading,
    extensionTheme,
    setExtensionLoading,
    setExtensionTheme,
    resetExtension
  }

  return (
    <ExtensionContext.Provider value={value}>
      {children}
    </ExtensionContext.Provider>
  )
}
