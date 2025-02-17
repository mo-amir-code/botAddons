import Button from "@/components/buttons/Button"
import { SearchField, SelectAll } from "@/components/common"
import Item from "@/components/common/Item"
import { useExtension } from "@/contexts/extensionContext"
import { useState } from "react"

const AddChat = () => {
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { dispatch } = useExtension()

  const handleSelect = ({ isSelectAll }: { isSelectAll?: boolean }) => {
    setIsAllSelected(isAllSelected ? true : false)
  }

  const isSelected = (id: string) => {
    return false
  }

  const handleAddChats = () => {}

  const handleClose = () => {
    dispatch({ type: "RESET_HEADER_STATES" })
  }

  return (
    <div className="w-[600px] relative">
      <SearchField placeholder={"Search Chats"} func={setSearchQuery} />
      <SelectAll selectedConversations={1} func={handleSelect} />

      <div className="overflow-height mt-2">
        <ul className="space-y-2 text-white">
          <Item
            id={1}
            isSelected={isSelected}
            onChatSelectChange={handleSelect}
            title={"testing"}
            update_time={929829382}
            itemType="chat"
            modalType="folders"
          />
          <Item
            id={1}
            isSelected={isSelected}
            onChatSelectChange={handleSelect}
            title={"testing"}
            update_time={929829382}
            itemType="chat"
            modalType="folders"
          />
          <Item
            id={1}
            isSelected={isSelected}
            onChatSelectChange={handleSelect}
            title={"testing"}
            update_time={929829382}
            itemType="chat"
            modalType="folders"
          />
        </ul>
      </div>

      <div className="absolute bottom-2 right-2 flex items-center justify-end gap-2">
        <Button title="Close" func={handleClose} />
        <Button title="Add" func={handleAddChats} />
      </div>
    </div>
  )
}

export default AddChat
