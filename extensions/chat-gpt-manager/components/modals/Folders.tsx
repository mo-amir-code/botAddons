import { useExtension } from "@/contexts/extensionContext"
import { stringTimeIntoNumber } from "@/utils/services"
import { httpAxios } from "@/utils/services/axios"
import { fetchFolders } from "@/utils/services/queries/folder"
import type { FetchFoldersQueryType } from "@/utils/types/services/queries"
import { useEffect, useState } from "react"

import Button from "../buttons/Button"
import { SearchField, SelectAll } from "../common"
import Item from "../common/Item"

const Folders = () => {
  const [query, setQuery] = useState<string>("")
  const [selectedItemsId, setSelectedItemsId] = useState<string[]>([])

  const { foldersWindow, dispatch, folderAllFiles } = useExtension()

  const handleSelectItems = ({
    isAllSelect,
    id
  }: {
    isAllSelect?: boolean
    id: string
  }) => {
    let updatedSelectedItemsId = [...selectedItemsId]
    if (isAllSelect) {
      updatedSelectedItemsId = folderAllFiles.items.map(
        (item) => item.id
      ) as string[]
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
        data: { ids: selectedItemsId }
      })
      let newFolderAllFiles = { ...folderAllFiles }
      newFolderAllFiles.items = newFolderAllFiles.items.filter(
        (item) => !selectedItemsId.includes(item.id as string)
      )
      dispatch({ type: "FOLDER_ALL_FILES", payload: newFolderAllFiles })
    } catch (error) {
      console.log(error)
    }
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
        const data = res.data.data
        dispatch({ type: "FOLDER_ALL_FILES", payload: data })
        dispatch({ type: "CURRENT_FOLDER_INFO", payload: data?.info })
      } catch (error) {
        console.error(error)
      }
    }

    fetchNow()
  }, [foldersWindow])

  return (
    <div className="relative">
      <SearchField placeholder="Search Folder" func={setQuery} />
      <SelectAll
        selectedConversations={selectedItemsId.length}
        func={handleSelectItems}
      />

      <ul className="mt-2">
        {folderAllFiles?.items?.map(({ id, title, createdAt, isFolder }) => (
          <Item
            key={id}
            id={id}
            isSelected={isSelected}
            onChatSelectChange={handleSelectItems}
            title={title}
            update_time={stringTimeIntoNumber(createdAt)}
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
