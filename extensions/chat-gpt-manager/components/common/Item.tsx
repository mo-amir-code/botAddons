import { formatTimestamp } from "@/utils/services"
import React from "react"
import { BsChatTextFill } from "react-icons/bs"
import { FaFolderOpen } from "react-icons/fa6"

interface ItemType {
  id: number | string
  title: string
  update_time: number
  type?: "folder" | "chat"
  isSelected: Function
  onChatSelectChange: Function
}

const Item = ({
  id,
  title,
  update_time,
  type = "folder",
  isSelected,
  onChatSelectChange
}: ItemType) => {
  return (
    <li
      className={`py-2 select-none ${type === "chat" ? "border-b" : ""} border-white/60 cursor-pointer`}>
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
                switch (type) {
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
          className={`${type === "chat" ? "bg-yellow-500 text-black" : "text-primary-white"}`}>
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
