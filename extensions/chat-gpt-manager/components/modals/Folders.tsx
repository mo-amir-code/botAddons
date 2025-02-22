import type { FolderFileType } from "@/utils/types/components/modal"
import type { ConversationObjectType } from "@/utils/types/components/search"
import { useEffect, useState } from "react"

import Button from "../buttons/Button"
import { SearchField, SelectAll } from "../common"
import Item from "../common/Item"

const Folders = () => {
  const [folderFiles, setFolderFiles] = useState<FolderFileType<string>[]>([])
  const [chatsFiles, setChatsFiles] = useState<
    ConversationObjectType<string, number>[]
  >([])
  const [query, setQuery] = useState<string>("")

  const handleSelectItems = ({
    isAllSelect,
    id
  }: {
    isAllSelect?: boolean
    id: number
  }) => {}

  const dummy = () => {}

  useEffect(() => {
    
  }, [])

  return (
    <div className="relative">
      <SearchField placeholder="Search Folder" func={setQuery} />
      <SelectAll selectedConversations={1} func={handleSelectItems} />

      <ul className="mt-2">
        <Item
          id={1}
          isSelected={dummy}
          onChatSelectChange={dummy}
          title="Hello"
          update_time={8292927381}
          itemType="folder"
          modalType="folders"
        />
      </ul>

      <div className="pt-4 flex items-center justify-end">
        <Button title="Delete" func={dummy} icon="delete" />
      </div>
    </div>
  )
}

export default Folders
