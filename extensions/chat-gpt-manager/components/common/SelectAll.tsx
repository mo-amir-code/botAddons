interface SelectAllType {
  selectedConversations: number
  func: Function
}

const SelectAll = ({ selectedConversations, func }: SelectAllType) => {
  return (
    <div className="flex border-b border-white items-center justify-between py-3">
      <label
        onClick={(e) => func({ isAllSelect: e })}
        className="flex gap-2 items-center">
        <input type="checkbox" />
        <span>Select All Chats</span>
      </label>
      <div className="flex items-center gap-2">
        <span>Selected Chats:</span>
        <span>{selectedConversations}</span>
      </div>
    </div>
  )
}

export default SelectAll
