import {
  AddChat,
  AddFolder,
  AddPrompt,
  Settings
} from "@/components/modals/child"
import { useExtension } from "@/contexts/extensionContext"
import { useLanguage } from "@/contexts/languageContext"
import type { TranslationKeys } from "@/utils/data/language"
import { useEffect, useRef, useState } from "react"
import { IoCloseOutline } from "react-icons/io5"

export type ChildModalType =
  | "addChat"
  | "addFolder"
  | "addPrompt"
  | "settings"
  | "folderEditing"

const ChildModal = () => {
  const {
    headerStates: {
      isAddChatsOpen,
      isAddFolderOpen,
      isSettingsOpen,
      isAddPromptOpen,
      isFolderEditingOpen
    },
    dispatch
  } = useExtension()
  const { t } = useLanguage()
  const [childModalState, setChildModalState] = useState<ChildModalType | null>(
    null
  )
  const modalChildRef = useRef<HTMLDivElement>()

  const handleClose = (e: any) => {
    if (!modalChildRef?.current?.contains(e.target)) {
      dispatch({ type: "RESET_HEADER_STATES" })
      dispatch({ type: "CURRENT_EDITING_FILE_INFO", payload: null });
      setChildModalState(null)
    }
  }

  useEffect(() => {
    if (isAddChatsOpen) setChildModalState("addChat")
    else if (isAddFolderOpen) setChildModalState("addFolder")
    else if (isSettingsOpen) setChildModalState("settings")
    else if (isAddPromptOpen) setChildModalState("addPrompt")
    else if (isFolderEditingOpen) setChildModalState("folderEditing")
    else setChildModalState(null)
  }, [
    isAddChatsOpen,
    isAddFolderOpen,
    isAddPromptOpen,
    isSettingsOpen,
    isFolderEditingOpen
  ])

  return (
    !!childModalState && (
      <dialog
        onClick={(e) => handleClose(e)}
        className=" fixed top-0 left-0 select-none bg-black/60 backdrop-blur-sm w-full h-full flex items-center justify-center z-10">
        <div
          ref={modalChildRef}
          className="bg-primary-bg border border-primary-off-white/50 rounded-xl p-4 shadow-md relative">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/60 mb-4 pb-2">
            <h3 className="text-2xl font-semibold text-primary-white">
              {t(childModalState as TranslationKeys)
                ? t(childModalState as TranslationKeys)
                : (() => {
                    switch (childModalState) {
                      case "addFolder":
                        return "Add Folder"
                      case "addChat":
                        return "Add Chats"
                      case "addPrompt":
                        return "Add Prompt"
                      case "settings":
                        return "Settings"
                      case "folderEditing":
                        return "Edit Folder"
                      default:
                        return
                    }
                  })()}
            </h3>
          </div>

          {/* Rendering Childs */}
          {(() => {
            switch (childModalState) {
              case "addFolder":
                return <AddFolder />
              case "folderEditing":
                return <AddFolder />
              case "addChat":
                return <AddChat />
              case "addPrompt":
                return <AddPrompt />
              case "settings":
                return <Settings />
            }
          })()}

          {/* Close Button */}
          <button
            onClick={() => dispatch({ type: "RESET_HEADER_STATES" })}
            className="p-1 bg-white text-black rounded-full absolute top-2 right-2">
            <IoCloseOutline className="text-xl" />
          </button>
        </div>
      </dialog>
    )
  )
}

export default ChildModal
