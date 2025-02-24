import { useExtension } from "@/contexts/extensionContext"
import type { ModalType } from "@/utils/types/components/modal"
import type { HeaderStatesName } from "@/utils/types/context"
import { useEffect, useRef } from "react"
import { IoArrowBack, IoCloseOutline } from "react-icons/io5"
import { MdEditSquare } from "react-icons/md"

import Button, { type ButtonIconType } from "../components/buttons/Button"
import Toggle from "../components/buttons/Toggle"
import { Chats, Folders, Prompts, Search } from "../components/modals"

const Modal = ({ openModal, setOpenModal }: ModalType) => {
  const modalChildRef = useRef<HTMLDivElement>()
  const {
    headerStates: { exactMatchStatus },
    dispatch,
    foldersWindow
  } = useExtension()

  const handleClose = (e: any) => {
    if (!modalChildRef?.current?.contains(e.target)) {
      dispatch({ type: "FOLDERS_WINDOW", payload: { folders: [], type: null } })
      setOpenModal(null)
    }
  }

  const handleExactMatchStatus = () => {
    dispatch({ type: "TOGGLE_HEADER_STATE", payload: "exactMatchStatus" })
  }

  const handleHeaderButton = (btnIconType: ButtonIconType) => {
    let headerState: HeaderStatesName = "exactMatchStatus"
    if (btnIconType === "chats") headerState = "isAddChatsOpen"
    if (btnIconType === "folders") headerState = "isAddFolderOpen"
    if (btnIconType === "settings") headerState = "isSettingsOpen"
    if (btnIconType === "prompt") headerState = "isAddPromptOpen"
    dispatch({ type: "TOGGLE_HEADER_STATE", payload: headerState })
  }

  const handleBack = () => {
    const newFoldersWindow = { ...foldersWindow }
    if (newFoldersWindow.folders.length) newFoldersWindow.folders.pop()
    if (newFoldersWindow.folders.length === 0) {
      newFoldersWindow.type = null
    }
    dispatch({ type: "FOLDERS_WINDOW", payload: newFoldersWindow })
  }

  return openModal ? (
    <dialog
      onClick={(e) => handleClose(e)}
      className=" fixed top-0 left-0 select-none bg-black/60 backdrop-blur-sm w-full h-full flex items-center justify-center">
      <div
        ref={modalChildRef}
        className="w-[900px] overflow-hidden bg-primary-bg border border-primary-off-white/50 rounded-xl p-4 shadow-md relative">
        {/* Header */}
        <div className="border-b border-white/60 mb-4">
          <div className="flex items-center gap-4">
            {!!foldersWindow.type && (
              <div
                onClick={() => handleBack()}
                className="rounded-full w-10 h-10 border border-primary-off-white flex items-center justify-center">
                <IoArrowBack className="w-8 h-8" />
              </div>
            )}
            <h2 className="text-3xl font-semibold text-primary-white">
              {(() => {
                switch (openModal) {
                  case "search":
                    return "Legendary Conversation History"
                  case "chats":
                    return "Manage Conversations"
                  case "folders":
                    return "Manage Folders"
                  case "prompts":
                    return "Manage Prompts"
                }
              })()}
            </h2>
            {!!foldersWindow.type && (
              <div
                onClick={() =>
                  dispatch({
                    type: "TOGGLE_HEADER_STATE",
                    payload: "isFolderEditingOpen"
                  })
                }
                className="rounded-full w-10 h-10 flex items-center justify-center">
                <MdEditSquare className="w-9 h-9" />
              </div>
            )}
          </div>

          <div className="my-4 flex items-center gap-4">
            {/* Settings Button */}
            <Button
              icon="settings"
              title="Settings"
              func={handleHeaderButton}
            />

            {/* Folder Button */}
            {!!(openModal === "folders") && (
              <Button
                icon="folders"
                title="Add Folder"
                func={handleHeaderButton}
              />
            )}

            {/* Chats Button */}
            {!!(openModal === "folders" && foldersWindow.type === "chats") && (
              <Button
                icon="chats"
                title="Add Chats"
                func={handleHeaderButton}
              />
            )}

            {/* Prompt Button */}
            {!!(openModal === "prompts") && (
              <Button
                icon="prompt"
                title="Add Prompt"
                func={handleHeaderButton}
              />
            )}

            {/* Exact Match Button for Search Modal */}
            {!!(openModal === "search") && (
              <div className="flex items-center text-white/80 gap-2 text-xl font-medium">
                <span>Exact Match</span>
                <Toggle
                  isOpen={exactMatchStatus}
                  setIsOpen={handleExactMatchStatus}
                />
              </div>
            )}
          </div>
        </div>

        {/* Rendring Child */}
        {(() => {
          switch (openModal) {
            case "search":
              return <Search />
            case "chats":
              return <Chats />
            case "folders":
              return <Folders />
            case "prompts":
              return <Prompts />
          }
        })()}
        {/* END Rendring Child */}

        {/* Close Button */}
        <button
          onClick={() => setOpenModal(null)}
          className="p-1 bg-white text-black rounded-full absolute top-4 right-4">
          <IoCloseOutline className="text-2xl" />
        </button>
      </div>
    </dialog>
  ) : (
    ""
  )
}

export default Modal
