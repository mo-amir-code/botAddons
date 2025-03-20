import Button from "@/components/buttons/Button"
import { SearchField, SelectAll } from "@/components/common"
import Item from "@/components/common/Item"
import useDebounce from "@/components/hooks/debounce/useDebouce"
import { BallLoader } from "@/components/loaders"
import { CHATS_ADDED_MSG, TOAST_TIME_IN_MS } from "@/config/constants"
import { useExtension } from "@/contexts/extensionContext"
import { useLanguage } from "@/contexts/languageContext"
import { useToast } from "@/contexts/toastContext"
import { httpAxios } from "@/utils/services/axios"
import { handleDataInLocalStorage } from "@/utils/services/localstorage"
import type { FolderItemType } from "@/utils/types/components/modal"
import type { ConversationObjectType } from "@/utils/types/components/search"
import { useEffect, useState } from "react"

const AddChat = () => {
  const [results, setResults] = useState<
    ConversationObjectType<string, number>[]
  >([])
  const [selectedItemsId, setSelectedItemsId] = useState<string[]>([])
  const [isChatUpdating, setIsChatUpdating] = useState<boolean>(false)
  const {
    dispatch,
    allConversations,
    currentFolderInfo,
    folderAllFiles,
    foldersWindow,
    isUserLoggedIn
  } = useExtension()
  const { t } = useLanguage()
  const { addToast } = useToast()
  const [query, setQuery] = useState<string>("")
  const debounceQuery = useDebounce<string>(query, 200)

  const handleSelectItems = ({
    isAllSelect,
    id
  }: {
    isAllSelect?: boolean
    id: string
  }) => {
    let updatedSelectedItemsId = [...selectedItemsId]
    if (isAllSelect) {
      updatedSelectedItemsId = results
        .filter((c) => !c.is_archived)
        .map((c) => c.id)
      setSelectedItemsId(updatedSelectedItemsId)
      return
    } else if (isAllSelect === false) {
      setSelectedItemsId([])
      return
    }

    const isExist = updatedSelectedItemsId.find((cId) => cId == id)

    if (isExist) {
      updatedSelectedItemsId = updatedSelectedItemsId.filter(
        (cId) => cId !== id
      )
    } else {
      updatedSelectedItemsId.push(id)
    }

    setSelectedItemsId(updatedSelectedItemsId)
  }

  const isSelected = (id: string) => {
    return selectedItemsId.find((cId) => cId === id) ? true : false
  }

  const handleAddChats = async () => {
    if (!isUserLoggedIn) return

    try {
      await httpAxios.post("/chat", {
        ids: selectedItemsId,
        folderId: currentFolderInfo.id
      })
      const newItems: FolderItemType[] = selectedItemsId.map((cId) => {
        const conv = allConversations.find((item) => item.id === cId)
        const newItem: FolderItemType = {
          id: cId,
          conversationId: cId,
          title: conv.title,
          isFolder: false,
          updatedAt: conv.update_time,
          createdAt: conv.update_time
        }
        return newItem
      })
      const updatedFolderAllFiles = { ...folderAllFiles }
      updatedFolderAllFiles.items.push(...newItems)
      await handleDataInLocalStorage({
        data: newItems,
        foldersWindow,
        operationType: "addItems"
      })
      addToast(CHATS_ADDED_MSG, "success", TOAST_TIME_IN_MS)
      dispatch({ type: "FOLDER_ALL_FILES", payload: updatedFolderAllFiles })
    } catch (error) {
      console.error(error)
    }
  }

  const handleClose = () => {
    dispatch({ type: "RESET_HEADER_STATES" })
  }

  const handleSearchOnChange = (query: string) => {
    setQuery(query)
  }

  useEffect(() => {
    setIsChatUpdating(true)
    if (allConversations.length) {
      setResults(allConversations.filter((c) => !c.is_archived))
      setIsChatUpdating(false)
    }
  }, [allConversations])

  useEffect(() => {
    const filteredResults = results.filter(
      (c) => !folderAllFiles.items.some((it) => it?.conversationId === c.id)
    )
    if (filteredResults.length < results.length) {
      setResults(filteredResults)
    }
  }, [results, folderAllFiles])

  useEffect(() => {
    const filteredConversations = allConversations.filter((c) => {
      return (
        !c.is_archived &&
        (c.title.toLowerCase().includes(debounceQuery) ||
          selectedItemsId.includes(c.id))
      )
    })
    setResults(filteredConversations)
  }, [debounceQuery, selectedItemsId])

  return (
    <div className="w-[600px] relative">
      <SearchField placeholder={t("searchChats")} func={handleSearchOnChange} />
      <SelectAll
        selectedConversations={selectedItemsId.length}
        func={handleSelectItems}
      />

      <div className="overflow-height mt-2">
        <ul className="space-y-2 text-white">
          {results.map(({ id, title, update_time }, idx) => (
            <Item
              key={id + idx}
              id={id}
              isSelected={isSelected}
              onChatSelectChange={handleSelectItems}
              title={title}
              update_time={update_time}
              itemType="chat"
              modalType="folders"
            />
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-end gap-2 mt-2">
        <Button title={t("close")} func={handleClose} />
        <Button title={t("add")} func={handleAddChats} />
      </div>

      {!!isChatUpdating && (
        <div className="w-full h-full bg-black/5 backdrop-blur-md fixed top-0 left-0">
          <BallLoader />
        </div>
      )}
    </div>
  )
}

export default AddChat
