import { useExtension } from "@/contexts/extensionContext"
import { fetchFolders } from "@/utils/services/queries/folder"
import type { FolderFileType } from "@/utils/types/components/modal"
import type { ConversationObjectType } from "@/utils/types/components/search"
import type { FetchFoldersQueryType } from "@/utils/types/services/queries"
import { useEffect, useState } from "react"

import Button from "../buttons/Button"
import { SearchField, SelectAll } from "../common"
import Item from "../common/Item"

const Folders = () => {
  const [allFiles, setAllFiles] = useState<any>([])
  const [query, setQuery] = useState<string>("")

  const {
    foldersWindow: { folders }
  } = useExtension()

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
      let obj: FetchFoldersQueryType = { type: "chats" }
      if (folders.length) {
        obj["id"] = folders[folders.length - 1]
        const file = allFiles.find((f) => f.title == obj["id"])
        obj["id"] = file.id
      }
      const res = await fetchFolders(obj)
      setAllFiles(res.data?.data || []);
    }

    fetchNow()
  }, [folders])

  return (
    <div className="relative">
      <SearchField placeholder="Search Folder" func={setQuery} />
      <SelectAll selectedConversations={1} func={handleSelectItems} />

      <ul className="mt-2">
        {allFiles.map(() => (
          <Item
            id={1}
            isSelected={dummy}
            onChatSelectChange={dummy}
            title="Hello"
            update_time={8292927381}
            itemType="folder"
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
