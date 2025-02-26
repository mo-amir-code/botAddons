import { useExtension } from "@/contexts/extensionContext"
import { httpAxios } from "@/utils/services/axios"
import { fetchFolders } from "@/utils/services/queries/folder"
import type { FolderItemType } from "@/utils/types/components/modal"
import type { FetchFoldersQueryType } from "@/utils/types/services/queries"
import { useEffect, useState } from "react"

import Button from "../buttons/Button"
import { SearchField, SelectAll } from "../common"
import Item from "../common/Item"

const Prompts = () => {
  const [selectedItemsId, setSelectedItemsId] = useState<string[]>([])
  const [results, setResults] = useState<FolderItemType[]>([])

  const { folderAllFiles, foldersWindow, dispatch } = useExtension()

  const handleSelectItems = ({
    isAllSelect,
    id
  }: {
    isAllSelect?: boolean
    id: number
  }) => {}

  const isSelected = (id: string) => {
    return selectedItemsId.find((cId) => cId === id) ? true : false
  }

  const handleQuery = (query: string) => {
    setResults(
      folderAllFiles.items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    )
  }

  const handleDelete = async () => {
    try {
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchNow = async () => {
      try {
        let obj: FetchFoldersQueryType = { type: "prompts" }
        if (foldersWindow.folders.length) {
          obj["id"] = foldersWindow.folders[foldersWindow.folders.length - 1]
          const file = folderAllFiles?.items?.find((f) => f.title == obj["id"])
          obj["id"] = file.id as string
        }
        const res = await fetchFolders(obj)
        let data = res.data.data
        dispatch({ type: "FOLDER_ALL_FILES", payload: data })
        dispatch({ type: "CURRENT_FOLDER_INFO", payload: data?.info })
      } catch (error) {
        console.error(error)
      }
    }

    fetchNow()
  }, [foldersWindow])

  useEffect(() => {
    setResults(folderAllFiles.items)
  }, [folderAllFiles])

  return (
    <div>
      <SearchField placeholder="Search Folder" func={handleQuery} />
      <SelectAll selectedConversations={1} func={handleSelectItems} />

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
            modalType="prompts"
          />
        ))}
      </ul>

      <div className="pt-4 flex items-center justify-end">
        <Button title="Delete" func={handleDelete} icon="delete" />
      </div>
    </div>
  )
}

export default Prompts
