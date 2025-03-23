import { ITEMS_DELETE_MSG, SELECT_ERR_MSG, TOAST_TIME_IN_MS } from "@/config/constants"
import { useExtension } from "@/contexts/extensionContext"
import { useLanguage } from "@/contexts/languageContext"
import { useToast } from "@/contexts/toastContext"
import {
  getDataFromLocalStorage,
  setDataInLocalStorage,
  type LocalStorageKeyTypes
} from "@/utils/services/auth"
import { httpAxios } from "@/utils/services/axios"
import {
  handleDataInLocalStorage,
  handleDataOfPromptCommand
} from "@/utils/services/localstorage"
import { fetchFolders } from "@/utils/services/queries/folder"
import type { FolderItemType } from "@/utils/types/components/modal"
import type { FetchFoldersQueryType } from "@/utils/types/services/queries"
import { useEffect, useState } from "react"

import Button from "../buttons/Button"
import { SearchField, SelectAll } from "../common"
import Item from "../common/Item"
import { BallLoader } from "../loaders"

type SelectedItemType = {
  id: string
  isFolder: boolean
}

const Prompts = () => {
  const [selectedItemsId, setSelectedItemsId] = useState<SelectedItemType[]>([])
  const [results, setResults] = useState<FolderItemType[]>([])
  const [isChatUpdating, setIsChatUpdating] = useState<boolean>(false)
  const {
    folderAllFiles,
    foldersWindow,
    dispatch,
    currentFolderInfo,
    isUserLoggedIn
  } = useExtension()
  const { t } = useLanguage()
  const { addToast } = useToast()

  const handleSelectItems = ({
    isAllSelect,
    id
  }: {
    isAllSelect?: boolean
    id: string
  }) => {
    let updatedSelectedItemsId = [...selectedItemsId]
    if (isAllSelect) {
      updatedSelectedItemsId = results.map((item) => {
        return {
          isFolder: item.isFolder,
          id: item.id
        }
      }) as SelectedItemType[]
      setSelectedItemsId(updatedSelectedItemsId)
      return
    } else if (isAllSelect === false) {
      setSelectedItemsId([])
      return
    }

    const isExist = updatedSelectedItemsId.find((cId) => cId.id == id)

    if (isExist) {
      updatedSelectedItemsId = updatedSelectedItemsId.filter(
        (cId) => cId.id !== id
      )
    } else {
      updatedSelectedItemsId.push({
        id,
        isFolder: results.find((it) => it.id == id).isFolder
      })
    }

    setSelectedItemsId(updatedSelectedItemsId)
  }

  const isSelected = (id: string) => {
    return selectedItemsId.find((cId) => cId.id === id) ? true : false
  }

  const handleQuery = (query: string) => {
    setIsChatUpdating(true)
    setResults(
      folderAllFiles.items.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          selectedItemsId.some((it) => it.id == item.id)
      )
    )
    setIsChatUpdating(false)
  }

  const handleDelete = async () => {
    if (!isUserLoggedIn || selectedItemsId.length === 0) {
      addToast(SELECT_ERR_MSG, "failed", TOAST_TIME_IN_MS);
      return;
    }

    try {
      await httpAxios.delete("/folder", {
        data: {
          ids: selectedItemsId.filter((it) => it.isFolder).map((it) => it.id),
          folderId: currentFolderInfo?.id,
          promptIds: selectedItemsId
            .filter((it) => !it.isFolder)
            .map((it) => it.id),
          type: "prompts"
        }
      })
      let newFolderAllFiles = { ...folderAllFiles }
      newFolderAllFiles.items = newFolderAllFiles.items.filter(
        (item) =>
          !selectedItemsId.some(
            (it) => it.id == item.conversationId || item.id == it.id
          )
      )

      let deletedPromptsIds = await handleDataInLocalStorage({
        data: selectedItemsId.map((it) => it.id),
        foldersWindow,
        operationType: "deleteItems"
      }) || []
      await handleDataOfPromptCommand({
        data: deletedPromptsIds,
        operationType: "deleteItems"
      })

      dispatch({ type: "FOLDER_ALL_FILES", payload: newFolderAllFiles })
      addToast(ITEMS_DELETE_MSG, "success", TOAST_TIME_IN_MS)
      setSelectedItemsId([])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchNow = async () => {
      try {
        setIsChatUpdating(true)
        const nestedFolderLength = foldersWindow.folders.length
        let persistedFolderDataKey = `root`
        if (nestedFolderLength !== 0) {
          persistedFolderDataKey =
            foldersWindow.folders[nestedFolderLength - 1].id
        }

        const foldersData = await getDataFromLocalStorage(
          "prompts",
          persistedFolderDataKey
        )

        const currentPromptsList =
          foldersData?.items?.filter((it) => !it?.isFolder) || []
        const commandPromptsList =
          (await getDataFromLocalStorage("prompts")) || []

        if (currentPromptsList?.length > commandPromptsList.length) {
          setDataInLocalStorage({ data: currentPromptsList, key: "prompts" })
        }

        if (foldersData) {
          dispatch({ type: "FOLDER_ALL_FILES", payload: foldersData })
          dispatch({ type: "CURRENT_FOLDER_INFO", payload: foldersData?.info })
          return
        }

        if (!isUserLoggedIn) return

        let obj: FetchFoldersQueryType = { type: "prompts" }
        if (foldersWindow.folders.length) {
          obj["id"] = foldersWindow.folders[foldersWindow.folders.length - 1].id
        }
        const res = await fetchFolders(obj)
        let data = res.data.data

        let persistData = {
          data,
          key: "prompts" as LocalStorageKeyTypes
        }

        if (data.isRoot) {
          persistData["id"] = "root"
        } else {
          persistData["id"] = data.info.id
        }

        setDataInLocalStorage(persistData)

        dispatch({ type: "FOLDER_ALL_FILES", payload: data })
        dispatch({ type: "CURRENT_FOLDER_INFO", payload: data?.info })
      } catch (error) {
        console.error(error)
      } finally {
        setIsChatUpdating(false)
      }
    }

    fetchNow()
  }, [foldersWindow, isUserLoggedIn])

  useEffect(() => {
    setResults(folderAllFiles.items)
    setSelectedItemsId([])
  }, [folderAllFiles])

  return (
    <div>
      <SearchField placeholder={t("searchFolder")} func={handleQuery} />
      <SelectAll
        isChecked={
          selectedItemsId.length === folderAllFiles.items.length &&
          folderAllFiles.items.length > 0
        }
        selectedConversations={selectedItemsId.length}
        func={handleSelectItems}
      />

      <ul className="mt-2 overflow-height">
        {results
          ?.sort((a, b) =>
            a.isFolder === b.isFolder ? 0 : a.isFolder ? -1 : 1
          )
          ?.map(({ id, title, updatedAt, isFolder, content, totalItems }) => (
            <Item
              key={id}
              id={id}
              isSelected={isSelected}
              onChatSelectChange={handleSelectItems}
              title={title}
              update_time={updatedAt ? updatedAt : undefined}
              itemType={isFolder ? "folder" : "prompt"}
              modalType="prompts"
              content={content}
              totalItems={totalItems}
            />
          ))}
      </ul>

      <div className="pt-4 flex items-center justify-end">
        <Button
          title={t("delete")}
          func={handleDelete}
          icon="delete"
          isEnabled={selectedItemsId.length !== 0}
        />
      </div>

      {!!isChatUpdating && (
        <div className="w-full h-full bg-black/5 backdrop-blur-md fixed top-0 left-0">
          <BallLoader />
        </div>
      )}
    </div>
  )
}

export default Prompts
