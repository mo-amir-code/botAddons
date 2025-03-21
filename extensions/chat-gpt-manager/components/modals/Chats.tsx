import { CHAT_TOAST_MSG, TOAST_TIME_IN_MS } from "@/config/constants"
import { useExtension } from "@/contexts/extensionContext"
import { useLanguage } from "@/contexts/languageContext"
import { useToast } from "@/contexts/toastContext"
import { updateConversation } from "@/utils/services/queries/conversations"
import type { ChatTabType, DBActionType } from "@/utils/types/components/chat"
import type { ConversationObjectType } from "@/utils/types/components/search"
import { useEffect, useRef, useState } from "react"

import { SearchField, SelectAll } from "../common"
import Item from "../common/Item"
import useDebounce from "../hooks/debounce/useDebouce"
import { BallLoader } from "../loaders"

const Chats = () => {
  const [results, setResults] = useState<
    ConversationObjectType<string, number>[]
  >([])
  const { allConversations, chatsLoaded, dispatch } = useExtension()
  const { t } = useLanguage()
  const [currentTab, setCurrentTab] = useState<ChatTabType>("active")
  const [selectedConversationsId, setSelectedConversationsId] = useState<
    string[]
  >([])
  const [isChatUpdating, setIsChatUpdating] = useState<boolean>(false)
  const [query, setQuery] = useState<string>("")
  const debounceQuery = useDebounce<string>(query, 200)
  const { addToast } = useToast()
  const searchFieldRef = useRef<HTMLInputElement>(null)

  const handleResetRef = () => {
    if (searchFieldRef.current) {
      setQuery("")
      searchFieldRef.current.value = ""
    }
  }

  const handleUpdateAllConversations = ({
    action
  }: {
    action: DBActionType
  }) => {
    let updatedAllConversations = allConversations
    switch (action) {
      case "archive":
        updatedAllConversations = allConversations.map((conv) => {
          if (selectedConversationsId.includes(conv.id)) {
            conv["is_archived"] = true
            return conv
          }
          return conv
        })
        break
      case "unarchive":
        updatedAllConversations = allConversations.map((conv) => {
          if (selectedConversationsId.includes(conv.id)) {
            conv["is_archived"] = false
            return conv
          }
          return conv
        })
        break
      case "delete":
        updatedAllConversations = allConversations.filter(
          (conv) => !selectedConversationsId.includes(conv.id)
        )
        break
    }

    dispatch({ type: "ALL_CONVERSATIONS", payload: updatedAllConversations })
    setSelectedConversationsId([])
  }

  const handleDBUpdate = async (action: DBActionType) => {
    if (!selectedConversationsId.length) return
    handleResetRef()

    let promises = []

    setIsChatUpdating(true)
    let msg = CHAT_TOAST_MSG

    // Performing actions
    switch (action) {
      case "archive":
        selectedConversationsId.forEach(async (id) => {
          promises.push(
            updateConversation({ conversationId: id, archive: "archive" })
          )
        })
        msg = msg.replace("{msg}", "archived")
        break
      case "unarchive":
        selectedConversationsId.forEach(async (id) => {
          promises.push(
            updateConversation({ conversationId: id, archive: "unarchive" })
          )
        })
        msg = msg.replace("{msg}", "unArchived")
        break
      case "delete":
        selectedConversationsId.forEach(async (id) => {
          promises.push(
            updateConversation({ conversationId: id, isVisible: true })
          )
        })
        msg = msg.replace("{msg}", "deleted")
        break
    }

    await Promise.all(promises)
    addToast(msg, "success", TOAST_TIME_IN_MS)
    handleUpdateAllConversations({ action })
    setIsChatUpdating(false)
  }

  const handleOnChatSelectChange = ({
    isAllSelect = false,
    id
  }: {
    isAllSelect?: any
    id?: string
  }) => {
    let updatedConversationsId = []
    if (isAllSelect) {
      updatedConversationsId = results.map((c) => c.id)
    } else if (!isAllSelect && !id) {
      updatedConversationsId = []
    } else {
      const isExist = selectedConversationsId.find((cId) => cId === id)
      if (!isExist) {
        updatedConversationsId = [...selectedConversationsId, id]
      } else {
        const filteredConvIds = selectedConversationsId.filter(
          (cId) => cId !== id
        )
        updatedConversationsId = filteredConvIds
      }
    }

    setSelectedConversationsId(updatedConversationsId)
  }

  const isSelected = (id: string) => {
    return selectedConversationsId.find((cId) => cId === id) ? true : false
  }

  const handleSearchOnChange = (query: string) => {
    setQuery(query)
  }

  const handleFilterChats = async (tab: ChatTabType) => {
    setIsChatUpdating(true)
    let filteredConversations = []
    if (tab === "active")
      filteredConversations = await new Promise((resolved) =>
        resolved(allConversations.filter((c) => !c.is_archived))
      )
    else
      filteredConversations = await new Promise((resolved) =>
        resolved(allConversations.filter((c) => c.is_archived))
      )
    setResults(filteredConversations)
    setIsChatUpdating(false)
    handleResetRef()
  }

  useEffect(() => {
    handleFilterChats(currentTab)
  }, [currentTab, allConversations])

  useEffect(() => {
    if (chatsLoaded === 100) setIsChatUpdating(false)
    else setIsChatUpdating(true)
  }, [chatsLoaded])

  useEffect(() => {
    const filteredConversations = allConversations.filter((c) => {
      if (currentTab === "active")
        return (
          !c.is_archived &&
          (c.title.toLowerCase().includes(debounceQuery) ||
            selectedConversationsId.includes(c.id))
        )
      return (
        c.is_archived &&
        (c.title.toLowerCase().includes(debounceQuery) ||
          selectedConversationsId.includes(c.id))
      )
    })
    setResults(filteredConversations)
  }, [debounceQuery, selectedConversationsId])

  return (
    <div className="space-y-4">
      {/* Content */}
      <div className="flex gap-4">
        <aside className="flex-[2] px-2 space-y-3">
          <button
            onClick={() => setCurrentTab("active")}
            className="text-xl font-semibold border border-white py-2 text-white w-full">
            {t("activeChats")}
          </button>
          <button
            onClick={() => setCurrentTab("archived")}
            className="text-xl font-semibold border border-white py-2 text-white w-full">
            {t("archivedChats")}
          </button>
        </aside>
        <div className="flex-[6] space-y-3">
          {/* Search Input Field */}
          <div>
            <SearchField
              func={handleSearchOnChange}
              placeholder={t("searchChats")}
              inputRef={searchFieldRef}
            />
            <SelectAll
              isChecked={
                selectedConversationsId.length === results.length &&
                results.length > 0
              }
              selectedConversations={selectedConversationsId.length}
              func={handleOnChatSelectChange}
            />
          </div>

          {/* Results */}
          <div className="overflow-height">
            <ul className="space-y-2 text-white">
              {results.map(({ id, title, update_time }, idx) => (
                <Item
                  key={id + idx}
                  id={id}
                  isSelected={isSelected}
                  onChatSelectChange={handleOnChatSelectChange}
                  title={title}
                  update_time={update_time}
                  itemType="chat"
                  modalType="chats"
                />
              ))}
            </ul>

            {!!isChatUpdating && (
              <div className="w-full h-full bg-black/5 backdrop-blur-md absolute top-0 left-0">
                <BallLoader />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => handleDBUpdate("delete")}
              className={`text-xl font-semibold border ${selectedConversationsId.length ? "text-white border-white" : "text-white/60 border-white/60 bg-black/60"} smooth-transition py-3 w-full`}>
              {t("delete")}
            </button>
            <button
              onClick={() =>
                handleDBUpdate(
                  currentTab !== "active" ? "unarchive" : "archive"
                )
              }
              className={`text-xl font-semibold border ${selectedConversationsId.length ? "text-white border-white" : "text-white/60 border-white/60 bg-black/60"} smooth-transition py-3 w-full`}>
              {currentTab !== "active" ? t("unarchive") : t("archive")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chats
