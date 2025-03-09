import Button from "@/components/buttons/Button"
import { SearchField } from "@/components/common"
import { useExtension } from "@/contexts/extensionContext"
import { httpAxios } from "@/utils/services/axios"
import type { FolderFileType } from "@/utils/types/components/modal"
import { useRef, useState } from "react"

const AddFolder = () => {
  const [newFolderName, setNewFolderName] = useState<string>("")
  const {
    dispatch,
    headerStates: { isFolderEditingOpen },
    foldersWindow,
    currentFolderInfo,
    folderAllFiles
  } = useExtension()
  const inputRef = useRef<HTMLInputElement>()

  const handleEditFolder = async () => {
    await httpAxios.patch("/folder", {
      id: currentFolderInfo.id,
      title: newFolderName
    })

    dispatch({
      type: "CURRENT_FOLDER_INFO",
      payload: { ...currentFolderInfo, title: newFolderName }
    })

    setNewFolderName("")
    if (inputRef?.current) inputRef.current.value = ""
  }

  const handleSubmit = async () => {
    try {
      if (isFolderEditingOpen) return await handleEditFolder()

      let body = {
        title: newFolderName,
        type: foldersWindow.type
      }
      if (currentFolderInfo) {
        body["parent"] = currentFolderInfo.id
      }
      const res = await httpAxios.post("/folder", body)

      const data = res.data

      let payloadData: FolderFileType = { ...folderAllFiles }
      payloadData.items = [...folderAllFiles.items, data.data]

      dispatch({ type: "FOLDER_ALL_FILES", payload: payloadData })

      setNewFolderName("")
      if (inputRef?.current) inputRef.current.value = ""
    } catch (error) {
      console.error(error)
    }
  }

  const handleClose = () => {
    dispatch({
      type: "RESET_HEADER_STATES"
    })
  }

  return (
    <div className="w-[400px]">
      <SearchField
        placeholder={
          isFolderEditingOpen ? "Enter New Folder Name" : "Enter Folder Name"
        }
        defaultValue={isFolderEditingOpen ? currentFolderInfo?.title : ""}
        func={setNewFolderName}
        handleSubmit={handleSubmit}
        inputRef={inputRef}
      />
      <div className="flex items-center justify-start gap-4">
        <Button title="Close" func={handleClose} />
        <Button
          title={isFolderEditingOpen ? "Edit Folder" : "Add Folder"}
          func={handleSubmit}
        />
      </div>
    </div>
  )
}

export default AddFolder
