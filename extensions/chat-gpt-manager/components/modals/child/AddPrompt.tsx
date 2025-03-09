import Button from "@/components/buttons/Button"
import { SearchField } from "@/components/common"
import { useExtension } from "@/contexts/extensionContext"
import { httpAxios } from "@/utils/services/axios"
import { useRef, useState } from "react"

const AddPrompt = () => {
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const { dispatch, currentFolderInfo, folderAllFiles } = useExtension()
  const titleRef = useRef<HTMLInputElement>()

  const handleContent = (content: string) => {
    if (content.length > 3000) return
    setContent(content)
  }

  const handleSubmit = async () => {
    try {
      const res = await httpAxios.post("/prompt", {
        title,
        content,
        folderId: currentFolderInfo?.id
      })

      let updatedFolderAllFiles = { ...folderAllFiles }

      updatedFolderAllFiles.items.push({
        id: res.data.data.promptId,
        title,
        isFolder: false,
        content,
        createdAt: res.data.data.updatedAt,
        updatedAt: res.data.data.updatedAt
      })

      dispatch({ type: "FOLDER_ALL_FILES", payload: updatedFolderAllFiles })
      setTitle("")
      setContent("")
      if (titleRef?.current) titleRef.current.value = ""
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    dispatch({ type: "RESET_HEADER_STATES" })
  }

  return (
    <div className="w-[400px]">
      <SearchField
        placeholder={"Enter Prompt Title"}
        func={setTitle}
        inputRef={titleRef}
      />
      <div>
        <div className="mb-4 p-2 flex items-center rounded-md border border-white/60">
          <textarea
            placeholder={"Start Writing Your Prompt..."}
            autoFocus
            rows={16}
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
