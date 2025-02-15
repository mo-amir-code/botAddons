import { useState } from "react"

import { SearchField, SelectAll } from "../common"
import Item from "../common/Item"

const Folders = () => {
  const [query, setQuery] = useState<string>("")

  const handleSelectItems = ({
    isAllSelect,
    id
  }: {
    isAllSelect?: boolean
    id: number
  }) => {}

  const dummy = () => {}

  return (
    <div>
      <SearchField placeholder="Search Folder" func={setQuery} />
      <SelectAll selectedConversations={1} func={handleSelectItems} />

      <ul className="mt-2">
        <Item
          id={1}
          isSelected={dummy}
          onChatSelectChange={dummy}
          title="Hello"
          update_time={8292927381}
          type="folder"
        />
      </ul>
    </div>
  )
}

export default Folders
