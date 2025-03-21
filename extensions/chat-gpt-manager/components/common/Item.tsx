import { useExtension } from "@/contexts/extensionContext"
import { formatTimestamp } from "@/utils/services"
import type { OpenModalType } from "@/utils/types/components/sidebar"
import React from "react"
import { BsChatTextFill } from "react-icons/bs"
import { FaFolderOpen } from "react-icons/fa6"
import { MdOpenInNew } from "react-icons/md"
import { TbPrompt } from "react-icons/tb"

interface ItemType {
  id: number | string
  title: string
  update_time?: number | string
  itemType?: "folder" | "chat" | "prompt"
  isSelected: Function
  onChatSelectChange: Function
  modalType: OpenModalType
  content?: string
}

const Item = ({
  id,
  title,
  update_time,
  itemType = "folder",
  isSelected,
  onChatSelectChange,
  modalType,
  content
}: ItemType) => {
  const { dispatch, foldersWindow, headerStates } = useExtension()

  const handleClick = (e: any) => {
    if (
      headerStates.isAddChatsOpen ||
      modalType === "chats" ||
      (modalType === "folders" && itemType === "chat")
    ) {
      onChatSelectChange({ id })
      return
    }
    if (itemType === "chat") handleRedirectToChat(e)
    if (itemType === "prompt") handleEditPrompt()
    if (itemType !== "folder") return
    const newFoldersWindow = { ...foldersWindow }
    newFoldersWindow.type = modalType === "folders" ? "chats" : "prompts"
    newFoldersWindow.folders.push({
      folderName: title,
      id: id as string
    })
    dispatch({ type: "FOLDERS_WINDOW", payload: newFoldersWindow })
  }

  const handleRedirectToChat = (e: any) => {
    let url = `/c/${id}`
    if (e.ctrlKey || e.metaKey) {
      window.open(url, "_blank")
    } else {
      window.location.href = url
    }
  }

  const handleEditPrompt = () => {
    dispatch({ type: "TOGGLE_HEADER_STATE", payload: "isAddPromptOpen" })
    let data = {
      id: id as string,
      title,
      content
    }
    dispatch({ type: "CURRENT_EDITING_FILE_INFO", payload: data })
  }

  return (
    <li
      className={`select-none ${itemType === "chat" ? "border-b" : ""} border-white/60 cursor-pointer hover:bg-secondary-bg px-4 rounded-xl transition-all duration-200 ease-in-out`}>
      <div className="flex items-center w-full gap-4">
        <div className="flex items-center">
          <input
            onChange={() => onChatSelectChange({ id })}
            checked={isSelected(id)}
            type="checkbox"
          />
        </div>
        <div
          onClick={(e) => handleClick(e)}
          className="flex items-center justify-between w-full py-2 ">
          <div className="flex items-center gap-2">
            <div>
              {(() => {
                switch (itemType) {
                  case "folder":
                    return <FaFolderOpen className="w-5 h-5" />
                  case "chat":
                    return <BsChatTextFill className="w-5 h-5" />
                  case "prompt":
                    return <TbPrompt className="w-5 h-5" />
                  default:
                    return
                }
              })()}
            </div>
            <span>{title}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            {itemType === "chat" ? (
              <button
                onClick={(e: any) => handleRedirectToChat(e)}
                className="cursor-pointer">
                <MdOpenInNew className="w-6 h-6" />
              </button>
            ) : (
              ""
            )}
            {!!update_time && (
              <span
                className={`${itemType !== "folder" ? "underline decoration-2 underline-offset-4 decoration-primary-white" : ""} text-primary-white`}>
                {formatTimestamp({
                  timestamp: update_time,
                  type: "date"
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}

export default Item
