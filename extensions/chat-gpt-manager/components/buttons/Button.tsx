import { BsChatTextFill } from "react-icons/bs"
import { FaFolderOpen } from "react-icons/fa6"
import { IoSettingsSharp } from "react-icons/io5"

type ButtonType = {
  icon: "settings" | "folders" | "chats"
  title: string
}

const Button = ({ icon, title }: ButtonType) => {
  return (
    <button className="flex items-center justify-center gap-2 border rounded-full px-3 py-2 border-primary-off-white">
      <span>
        {(() => {
          switch (icon) {
            case "settings":
              return <IoSettingsSharp className="w-6 h-6" />
            case "folders":
              return <FaFolderOpen className="w-6 h-6" />
            case "chats":
              return <BsChatTextFill className="w-6 h-6" />
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
