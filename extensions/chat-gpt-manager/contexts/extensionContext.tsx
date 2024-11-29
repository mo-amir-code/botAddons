import React, { createContext, useContext, useState } from "react"

interface ExtensionState {
  extensionLoading: boolean
}

const initialState: ExtensionState = {
  extensionLoading: false
}

interface ExtensionActions {
  setExtensionLoading: (loading: boolean) => void
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
  const [extensionLoading, setExtensionLoading] = useState<boolean>(
    initialState.extensionLoading
  )

  function resetExtension() {
    setExtensionLoading(initialState.extensionLoading)
  }

  const value = {
    extensionLoading,
    setExtensionLoading,
    resetExtension
  }

  return (
    <ExtensionContext.Provider value={value}>
      {children}
    </ExtensionContext.Provider>
  )
}
