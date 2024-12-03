import { SignInForm } from "@/components/popup"
import { ExtensionProvider } from "@/contexts/extensionContext"

import "./style.css"

function IndexPopup() {
  return (
    <ExtensionProvider>
      <div className="w-[350px] p-4">
        <SignInForm />
      </div>
    </ExtensionProvider>
  )
}

export default IndexPopup
