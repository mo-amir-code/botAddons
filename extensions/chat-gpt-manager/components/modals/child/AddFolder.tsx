import Button from "@/components/buttons/Button"
import { SearchField } from "@/components/common"
import { useExtension } from "@/contexts/extensionContext"
import { httpAxios } from "@/utils/services/axios"
import { useState } from "react"

const AddFolder = () => {
  const [newFolderName, setNewFolderName] = useState<string>("")
  const {
    dispatch,
    headerStates: { isFolderEditingOpen },
    foldersWindow
  } = useExtension()

  const handleSubmit = async () => {
    try {
      const res = await httpAxios.post("/folder", {
        title: newFolderName,
        type: foldersWindow.type
      })
      console.log(res);
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
        func={setNewFolderName}
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
