import { useExtension } from "@/contexts/extensionContext"
import { httpAxios } from "@/utils/services/axios"
import { fetchFolders } from "@/utils/services/queries/folder"
import type { FolderItemType } from "@/utils/types/components/modal"
import type { FetchFoldersQueryType } from "@/utils/types/services/queries"
import { useEffect, useState } from "react"

import Button from "../buttons/Button"
import { SearchField, SelectAll } from "../common"
import Item from "../common/Item"

const Folders = () => {
  const [selectedItemsId, setSelectedItemsId] = useState<string[]>([])
  const [results, setResults] = useState<FolderItemType[]>([])

  const {
    foldersWindow,
    dispatch,
    folderAllFiles,
    allConversations,
    currentFolderInfo
  } = useExtension()

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
    try {
      await httpAxios.delete("/folder", {
        data: { ids: selectedItemsId, folderId: currentFolderInfo.id }
      })
      let newFolderAllFiles = { ...folderAllFiles }
      newFolderAllFiles.items = newFolderAllFiles.items.filter(
        (item) =>
          !selectedItemsId.includes(item.conversationId || (item.id as string))
      )
      dispatch({ type: "FOLDER_ALL_FILES", payload: newFolderAllFiles })
    } catch (error) {
      console.log(error)
    }
  }

  const handleQuery = (query: string) => {
    setResults(
      folderAllFiles.items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    )
  }

  useEffect(() => {
    const fetchNow = async () => {
      try {
        let obj: FetchFoldersQueryType = { type: "chats" }
        if (foldersWindow.folders.length) {
          obj["id"] = foldersWindow.folders[foldersWindow.folders.length - 1]
          const file = folderAllFiles?.items?.find((f) => f.title == obj["id"])
          obj["id"] = file.id as string
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
        dispatch({ type: "FOLDER_ALL_FILES", payload: data })
        dispatch({ type: "CURRENT_FOLDER_INFO", payload: data?.info })
      } catch (error) {
        console.error(error)
      }
    }

    fetchNow()
  }, [foldersWindow, allConversations])

  useEffect(() => {
    setResults(folderAllFiles.items)
  }, [folderAllFiles])

  return (
    <div className="relative">
      <SearchField placeholder="Search Folder" func={handleQuery} />
      <SelectAll
        selectedConversations={selectedItemsId.length}
        func={handleSelectItems}
      />

      <ul className="mt-2">
        {results?.map(({ id, title, updatedAt, isFolder, conversationId }) => (
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
        <Button title="Delete" func={handleDelete} icon="delete" />
      </div>
    </div>
  )
}

export default Folders
