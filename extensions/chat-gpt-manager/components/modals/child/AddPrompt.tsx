import Button from "@/components/buttons/Button"
import { SearchField } from "@/components/common"
import { useExtension } from "@/contexts/extensionContext"
import { useState } from "react"

const AddPrompt = () => {
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const { dispatch } = useExtension()

  const handleContent = (content: string) => {
    if (content.length > 3000) return
    setContent(content)
  }

  const handleSubmit = () => {
    alert(title)
  }

  const handleClose = () => {
    dispatch({ type: "RESET_HEADER_STATES" })
  }

  return (
    <div className="w-[600px]">
      <SearchField placeholder={"Enter Prompt Title"} func={setTitle} />
      <div>
        <div className="mb-4 p-2 flex items-center rounded-md border border-white/60">
          <textarea
            placeholder={"Start Writing Your Prompt..."}
            autoFocus
            rows={8}
            value={content}
            className="w-full bg-transparent outline-none text-white/80"
            onChange={(e: any) => handleContent(e.target.value)}
          />
        </div>
        <span>{content.length + "/" + 3000}</span>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <Button title="Close" func={handleClose} />
        <Button title={"Add"} func={handleSubmit} />
      </div>
    </div>
  )
}

export default AddPrompt
