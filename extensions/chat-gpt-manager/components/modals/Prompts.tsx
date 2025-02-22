import { useState } from "react"

import { SearchField, SelectAll } from "../common"
import Item from "../common/Item"
import Button from "../buttons/Button"

const Prompts = () => {
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
          title="A flying dog"
          update_time={8292927381}
          itemType="prompt"
          modalType="prompts"
        />
        <Item
          id={1}
          isSelected={dummy}
          onChatSelectChange={dummy}
          title="A flying dog"
          update_time={8292927381}
          itemType="folder"
          modalType="prompts"
        />
      </ul>

      <div className="pt-4 flex items-center justify-end">
        <Button title="Delete" func={dummy} icon="delete" />
      </div>
    </div>
  )
}

export default Prompts
