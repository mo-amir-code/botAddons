import { useExtension } from "@/contexts/extensionContext"
import { formatTimestamp } from "@/utils/services"
import type { OpenModalType } from "@/utils/types/components/sidebar"
import React from "react"
import { BsChatTextFill } from "react-icons/bs"
import { FaFolderOpen } from "react-icons/fa6"

interface ItemType {
  id: number | string
  title: string
  update_time: number
  itemType?: "folder" | "chat"
  isSelected: Function
  onChatSelectChange: Function
  modalType: OpenModalType
}

const Item = ({
  id,
  title,
  update_time,
  itemType = "folder",
  isSelected,
  onChatSelectChange,
  modalType
}: ItemType) => {
  const { dispatch, foldersWindow } = useExtension()

  const handleDoubleClick = () => {
    if (itemType !== "folder") return;
    const newFoldersWindow = { ...foldersWindow }
    newFoldersWindow.type = modalType === "folders" ? "chats" : "prompts"
    newFoldersWindow.folders.push(title)
    dispatch({ type: "FOLDERS_WINDOW", payload: newFoldersWindow })
  }

  return (
    <li
      onDoubleClick={() => handleDoubleClick()}
      className={`py-2 select-none ${itemType === "chat" ? "border-b" : ""} border-white/60 cursor-pointer`}>
      <label className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            onChange={() => onChatSelectChange({ id })}
            checked={isSelected(id)}
            type="checkbox"
          />
          <div className="flex items-center gap-2">
            <div>
              {(() => {
                switch (itemType) {
                  case "folder":
                    return <FaFolderOpen className="w-5 h-5" />
                  case "chat":
                    return <BsChatTextFill className="w-5 h-5" />
                  default:
                    return
                }
              })()}
            </div>
            <span>{title}</span>
          </div>
        </div>
        <span
          className={`${itemType === "chat" ? "bg-yellow-500 text-black" : "text-primary-white"}`}>
          {formatTimestamp({
            timestamp: update_time,
            type: "date"
          })}
        </span>
      </label>
    </li>
  )
}

export default Item
