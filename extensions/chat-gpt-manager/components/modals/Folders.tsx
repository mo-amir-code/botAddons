import { ITEMS_DELETE_MSG, TOAST_TIME_IN_MS } from "@/config/constants"
import { useExtension } from "@/contexts/extensionContext"
import { useLanguage } from "@/contexts/languageContext"
import { useToast } from "@/contexts/toastContext"
import {
  getDataFromLocalStorage,
  setDataInLocalStorage,
  type LocalStorageKeyTypes
} from "@/utils/services/auth"
import { httpAxios } from "@/utils/services/axios"
import { handleDataInLocalStorage } from "@/utils/services/localstorage"
import { fetchFolders } from "@/utils/services/queries/folder"
import type { FolderItemType } from "@/utils/types/components/modal"
import type { FetchFoldersQueryType } from "@/utils/types/services/queries"
import { useEffect, useState } from "react"

import Button from "../buttons/Button"
import { SearchField, SelectAll } from "../common"
import Item from "../common/Item"
import { BallLoader } from "../loaders"

const Folders = () => {
  const [selectedItemsId, setSelectedItemsId] = useState<string[]>([])
  const [results, setResults] = useState<FolderItemType[]>([])
  const [isChatUpdating, setIsChatUpdating] = useState<boolean>(false)

  const {
    foldersWindow,
    dispatch,
    folderAllFiles,
    allConversations,
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
        if (item.isFolder) return item.id
        return item.conversationId
      }) as string[]
      setSelectedItemsId(updatedSelectedItemsId)
      return
    } else if (isAllSelect === false) {
      setSelectedItemsId([])
      return
    }

    const isExist = updatedSelectedItemsId.find((cId) => cId == id)

    if (isExist) {
      updatedSelectedItemsId = updatedSelectedItemsId.filter(
        (cId) => cId !== id
      )
    } else {
      updatedSelectedItemsId.push(id)
    }

    setSelectedItemsId(updatedSelectedItemsId)
  }

  const isSelected = (id: string) => {
    return selectedItemsId.find((cId) => cId === id) ? true : false
  }

  const handleDelete = async () => {
    if (selectedItemsId.length === 0 || !isUserLoggedIn) return

    try {
      await httpAxios.delete("/folder", {
        data: {
          ids: selectedItemsId,
          folderId: currentFolderInfo?.id,
          type: "chats"
        }
      })
      let newFolderAllFiles = { ...folderAllFiles }
      newFolderAllFiles.items = newFolderAllFiles.items.filter(
        (item) =>
          !selectedItemsId.includes(item.conversationId || (item.id as string))
      )
      await handleDataInLocalStorage({
        data: selectedItemsId,
        foldersWindow,
        operationType: "deleteItems"
      })
      dispatch({ type: "FOLDER_ALL_FILES", payload: newFolderAllFiles })

      addToast(ITEMS_DELETE_MSG, "success", TOAST_TIME_IN_MS)
      setSelectedItemsId([])
    } catch (error) {
      console.log(error)
    }
  }

  const handleQuery = (query: string) => {
    setIsChatUpdating(true)
    setResults(
      folderAllFiles.items.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          selectedItemsId.includes(item.id as string)
      )
    )
    setIsChatUpdating(false)
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
          "folders",
          persistedFolderDataKey
        )

        if (foldersData) {
          dispatch({ type: "FOLDER_ALL_FILES", payload: foldersData })
          dispatch({ type: "CURRENT_FOLDER_INFO", payload: foldersData?.info })
          return
        }

        if (!isUserLoggedIn) return

        let obj: FetchFoldersQueryType = { type: "chats" }
        if (foldersWindow.folders.length) {
          obj["id"] = foldersWindow.folders[foldersWindow.folders.length - 1].id
        }
        const res = await fetchFolders(obj)
        let data = res.data.data
        data.items = data.items.map((item) => {
          if (item.isFolder) return item
          const conv = allConversations.find(
            (c) => c.id === item.conversationId
          )
          return {
            ...item,
            title: conv?.title,
            updatedAt: conv?.update_time
          }
        })

        let persistData = {
          data,
          key: "folders" as LocalStorageKeyTypes
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
  }, [foldersWindow, allConversations, isUserLoggedIn])

  useEffect(() => {
    setResults(folderAllFiles.items)
    setSelectedItemsId([])
  }, [folderAllFiles])

  return (
    <div className="relative">
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
          .map(({ id, title, updatedAt, isFolder, conversationId }) => (
            <Item
              key={id}
              id={isFolder ? id : conversationId}
              isSelected={isSelected}
              onChatSelectChange={handleSelectItems}
              title={title}
              update_time={updatedAt ? updatedAt : undefined}
              itemType={isFolder ? "folder" : "chat"}
              modalType="folders"
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

export default Folders
