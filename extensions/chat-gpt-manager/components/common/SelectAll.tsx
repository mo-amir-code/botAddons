interface SelectAllType {
  selectedConversations: number
  func: Function
  isChecked?: boolean
}

const SelectAll = ({
  selectedConversations,
  func,
  isChecked
}: SelectAllType) => {
  return (
    <div className="flex border-b border-white items-center justify-between py-3">
      <label className="flex gap-2 items-center">
        <input
          onChange={(e: any) => func({ isAllSelect: e.target.checked })}
          checked={isChecked}
          type="checkbox"
        />
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
