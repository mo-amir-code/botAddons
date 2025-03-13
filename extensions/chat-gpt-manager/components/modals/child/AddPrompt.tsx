import Button from "@/components/buttons/Button"
import { SearchField } from "@/components/common"
import { useExtension } from "@/contexts/extensionContext"
import { useLanguage } from "@/contexts/languageContext"
import { useToast } from "@/contexts/toastContext"
import { httpAxios } from "@/utils/services/axios"
import { useEffect, useRef, useState } from "react"

const AddPrompt = () => {
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const {
    dispatch,
    currentFolderInfo,
    folderAllFiles,
    currentEditingFileInfo
  } = useExtension()
  const { t } = useLanguage()
  const { addToast } = useToast()
  const titleRef = useRef<HTMLInputElement>()

  const handleContent = (content: string) => {
    if (content.length > 3000) return
    setContent(content)
  }

  const handleSubmit = async () => {
    try {
      let updatedFolderAllFiles = { ...folderAllFiles }

      if (currentEditingFileInfo) {
        let payloadData = {
          id: currentEditingFileInfo.id
        }
        if (title != currentEditingFileInfo.title) payloadData["title"] = title
        if (content != currentEditingFileInfo.content)
          payloadData["content"] = content

        if (
          title == currentEditingFileInfo.title &&
          content == currentEditingFileInfo.content
        ) {
          addToast("Change title or content to update", "failed", 3000)
          return
        }

        // Calling Update API
        const res = await httpAxios.patch("/prompt", payloadData)
        addToast(res.data.message, "success", 3000)

        // Updating Current Documents
        updatedFolderAllFiles.items = updatedFolderAllFiles.items.map((it) => {
          if (it.id != currentEditingFileInfo.id) return it
          return {
            ...it,
            title,
            content
          } as any
        })

        dispatch({ type: "FOLDER_ALL_FILES", payload: updatedFolderAllFiles })
        return
      }

      const res = await httpAxios.post("/prompt", {
        title,
        content,
        folderId: currentFolderInfo?.id
      })

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

  useEffect(() => {
    if (currentEditingFileInfo) {
      setTitle(currentEditingFileInfo.title)
      setContent(currentEditingFileInfo.content)
    }
  }, [currentEditingFileInfo])

  return (
    <div className="w-[400px]">
      <SearchField
        placeholder={t("enterPromptTitle")}
        func={setTitle}
        inputRef={titleRef}
        defaultValue={currentEditingFileInfo.title}
      />
      <div>
        <div className="mb-4 p-2 flex items-center rounded-md border border-white/60">
          <textarea
            placeholder={t("startWritingYourPrompt") + "..."}
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
        <Button title={t("close")} func={handleClose} />
        <Button
          title={t(currentEditingFileInfo ? "editPrompt" : "add")}
          func={handleSubmit}
        />
      </div>
    </div>
  )
}

export default AddPrompt
