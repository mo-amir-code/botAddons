import { BsChatTextFill } from "react-icons/bs"
import { FaFolderOpen } from "react-icons/fa6"
import { IoSettingsSharp } from "react-icons/io5"
import { MdDelete } from "react-icons/md"
import { TbPrompt } from "react-icons/tb"

export type ButtonIconType =
  | "settings"
  | "folders"
  | "chats"
  | "delete"
  | "prompt"

type ButtonType = {
  icon?: ButtonIconType
  title: string
  func?: Function
  isEnabled?: boolean
}

const Button = ({ icon, title, func, isEnabled }: ButtonType) => {
  return (
    <button
      onClick={() => {
        if (func) func(icon)
      }}
      className={`flex items-center justify-center gap-2 border rounded-full px-3 py-2 ${isEnabled ? "border-primary-red bg-white" : "border-primary-off-white"}`}>
      {!!icon && (
        <span>
          {(() => {
            switch (icon) {
              case "settings":
                return (
                  <IoSettingsSharp
                    className={`w-6 h-6 ${isEnabled ? "text-primary-red" : ""} `}
                  />
                )
              case "folders":
                return (
                  <FaFolderOpen
                    className={`w-6 h-6 ${isEnabled ? "text-primary-red" : ""} `}
                  />
                )
              case "chats":
                return (
                  <BsChatTextFill
                    className={`w-6 h-6 ${isEnabled ? "text-primary-red" : ""} `}
                  />
                )
              case "delete":
                return (
                  <MdDelete
                    className={`w-6 h-6 ${isEnabled ? "text-primary-red" : ""} `}
                  />
                )
              case "prompt":
                return (
                  <TbPrompt
                    className={`w-6 h-6 ${isEnabled ? "text-primary-red" : ""} `}
                  />
                )
              default:
                return
            }
          })()}
        </span>
      )}
      <span className="text-xl font-semibold">{title}</span>
    </button>
  )
}

export default Button
