import { ExtensionProvider } from "@/contexts/extensionContext"
import React, { type ReactNode } from "react"

const Provider = ({ children }: { children: ReactNode }) => {
  return <ExtensionProvider>{children}</ExtensionProvider>
}

export default Provider
