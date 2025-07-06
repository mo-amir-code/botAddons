import { useLanguage } from "@/contexts/languageContext"

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
  const { t } = useLanguage()

  return (
    <div className="flex border-b text-white border-white items-center justify-between py-3">
      <label className="flex gap-2 items-center">
        <input
          onChange={(e: any) => func({ isAllSelect: e.target.checked })}
          checked={isChecked}
          type="checkbox"
        />
        <span>{t("selectAllChats")}</span>
      </label>
      <div className="flex items- gap-2">
        <span>{t("selectedChats")}:</span>
        <span>{selectedConversations}</span>
      </div>
    </div>
  )
}

export default SelectAll
