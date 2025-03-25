import Button from "@/components/buttons/Button"
import { SearchField } from "@/components/common"
import { FOLDER_ADD_MSG, FOLDER_EDIT_MSG, TOAST_TIME_IN_MS } from "@/config/constants"
import { useExtension } from "@/contexts/extensionContext"
import { useLanguage } from "@/contexts/languageContext"
import { useToast } from "@/contexts/toastContext"
import { httpAxios } from "@/utils/services/axios"
// import { handleDataInLocalStorage } from "@/utils/services/localstorage"
import type { FolderFileType } from "@/utils/types/components/modal"
import { useRef, useState } from "react"

const AddFolder = () => {
  const [newFolderName, setNewFolderName] = useState<string>("")
  const {
    dispatch,
    headerStates: { isFolderEditingOpen },
    foldersWindow,
    currentFolderInfo,
    folderAllFiles,
    isUserLoggedIn
  } = useExtension()
  const { t } = useLanguage()
  const { addToast } = useToast();
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

    // await handleDataInLocalStorage({data: newFolderName, foldersWindow, operationType: "editFolder"})

    setNewFolderName("")
    addToast(FOLDER_EDIT_MSG, "success", TOAST_TIME_IN_MS);
    if (inputRef?.current) inputRef.current.value = ""
    dispatch({type: "IS_FETCHING", payload: false})
  }

  const handleSubmit = async () => {
    if(!isUserLoggedIn) return
    dispatch({type: "IS_FETCHING", payload: true})
    
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
      // await handleDataInLocalStorage({data: [data.data], foldersWindow, operationType: "addItems"})

      let payloadData: FolderFileType = { ...folderAllFiles }
      payloadData.items = [...folderAllFiles.items, data.data]

      dispatch({ type: "FOLDER_ALL_FILES", payload: payloadData })

      addToast(FOLDER_ADD_MSG, "success", TOAST_TIME_IN_MS);
      setNewFolderName("")
      if (inputRef?.current) inputRef.current.value = ""
    } catch (error) {
      console.error(error)
      if(error.response){
        addToast(error?.response?.data?.message, "failed", TOAST_TIME_IN_MS)
      }
    }finally{
      dispatch({type: "IS_FETCHING", payload: false})
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
          isFolderEditingOpen ? t("enterNewFolderName") : t("enterFolderName")
        }
        defaultValue={isFolderEditingOpen ? currentFolderInfo?.title : ""}
        func={setNewFolderName}
        handleSubmit={handleSubmit}
        inputRef={inputRef}
      />
      <div className="flex items-center justify-start gap-4">
        <Button title={t("close")} func={handleClose} />
        <Button
          title={isFolderEditingOpen ? t("editFolder") : t("addFolder")}
          func={handleSubmit}
        />
      </div>
    </div>
  )
}

export default AddFolder
