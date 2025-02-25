import { useExtension } from "@/contexts/extensionContext"
import { stringTimeIntoNumber } from "@/utils/services"
import { fetchFolders } from "@/utils/services/queries/folder"
import type { FolderFileType } from "@/utils/types/components/modal"
import type { FetchFoldersQueryType } from "@/utils/types/services/queries"
import { useEffect, useState } from "react"

import Button from "../buttons/Button"
import { SearchField, SelectAll } from "../common"
import Item from "../common/Item"

const Folders = () => {
  const [allFiles, setAllFiles] = useState<FolderFileType>({
    isRoot: true,
    items: []
  })
  const [query, setQuery] = useState<string>("")

  const { foldersWindow, dispatch } = useExtension()

  const handleSelectItems = ({
    isAllSelect,
    id
  }: {
    isAllSelect?: boolean
    id: number
  }) => {}

  const dummy = () => {}

  useEffect(() => {
    const fetchNow = async () => {
      try {
        let obj: FetchFoldersQueryType = { type: "chats" }
        if (foldersWindow.folders.length) {
          obj["id"] = foldersWindow.folders[foldersWindow.folders.length - 1]
          const file = allFiles?.items?.find((f) => f.title == obj["id"])
          obj["id"] = file.id as string
        }
        const res = await fetchFolders(obj)
        const data = res.data.data
        setAllFiles(data)
        if (!data?.isRoot) {
          dispatch({ type: "CURRENT_FOLDER_INFO", payload: data?.info })
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchNow()
    console.log(foldersWindow)
  }, [foldersWindow])

  return (
    <div className="relative">
      <SearchField placeholder="Search Folder" func={setQuery} />
      <SelectAll selectedConversations={1} func={handleSelectItems} />

      <ul className="mt-2">
        {allFiles?.items?.map(({ id, title, createdAt, isFolder }) => (
          <Item
            key={id}
            id={id}
            isSelected={dummy}
            onChatSelectChange={dummy}
            title={title}
            update_time={stringTimeIntoNumber(createdAt)}
            itemType={isFolder ? "folder" : "chat"}
            modalType="folders"
          />
        ))}
      </ul>

      <div className="pt-4 flex items-center justify-end">
        <Button title="Delete" func={dummy} icon="delete" />
      </div>
    </div>
  )
}

export default Folders
