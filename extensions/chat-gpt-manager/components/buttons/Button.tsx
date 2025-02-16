import { BsChatTextFill } from "react-icons/bs"
import { FaFolderOpen } from "react-icons/fa6"
import { IoSettingsSharp } from "react-icons/io5"
import { MdDelete } from "react-icons/md";

export type ButtonIconType = "settings" | "folders" | "chats" | "delete";

type ButtonType = {
  icon?: ButtonIconType
  title: string
  func?: Function
}

const Button = ({ icon, title, func }: ButtonType) => {
  return (
    <button
      onClick={() => func && func(icon)}
      className="flex items-center justify-center gap-2 border rounded-full px-3 py-2 border-primary-off-white">
      <span>
        {(() => {
          switch (icon) {
            case "settings":
              return <IoSettingsSharp className="w-6 h-6" />
            case "folders":
              return <FaFolderOpen className="w-6 h-6" />
            case "chats":
              return <BsChatTextFill className="w-6 h-6" />
            case "delete":
              return <MdDelete className="w-6 h-6" />
            default:
              return
          }
        })()}
      </span>
      <span className="text-xl font-semibold">{title}</span>
    </button>
  )
}

export default Button
