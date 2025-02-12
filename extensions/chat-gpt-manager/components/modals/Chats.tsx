import { useExtension } from "@/contexts/extensionContext"
import { formatTimestamp } from "@/utils/services"
import { updateConversation } from "@/utils/services/queries/conversations"
import type { ChatTabType, DBActionType } from "@/utils/types/components/chat"
import type { ConversationObjectType } from "@/utils/types/components/search"
import { useEffect, useState } from "react"

import { BallLoader } from "../loaders"

const Chats = () => {
  const [results, setResults] = useState<
    ConversationObjectType<string, number>[]
  >([])
  const { allConversations, chatsLoaded, dispatch } = useExtension()
  const [currentTab, setCurrentTab] = useState<ChatTabType>("active")
  const [selectedConversationsId, setSelectedConversationsId] = useState<
    string[]
  >([])
  const [isChatUpdating, setIsChatUpdating] = useState<boolean>(false)

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

    dispatch({ type: "allConversations", payload: updatedAllConversations })
    setSelectedConversationsId([])
  }

  const handleDBUpdate = async (action: DBActionType) => {
    if (!selectedConversationsId.length) return

    let promises = []

    setIsChatUpdating(true)

    // Performing actions
    switch (action) {
      case "archive":
        selectedConversationsId.forEach(async (id) => {
          promises.push(
            updateConversation({ conversationId: id, archive: "archive" })
          )
        })
        break
      case "unarchive":
        selectedConversationsId.forEach(async (id) => {
          promises.push(
            updateConversation({ conversationId: id, archive: "unarchive" })
          )
        })
        break
      case "delete":
        selectedConversationsId.forEach(async (id) => {
          promises.push(
            updateConversation({ conversationId: id, isVisible: true })
          )
        })
        break
    }

    await Promise.all(promises)
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
    console.log(isAllSelect, id)
    let updatedConversationsId = []
    if (isAllSelect && isAllSelect?.target?.checked) {
      updatedConversationsId = results.map((c) => c.id)
    } else if (isAllSelect && !isAllSelect?.target?.checked) {
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
    const filteredConversations = allConversations.filter((c) => {
      if (currentTab === "active")
        return !c.is_archived && c.title.toLowerCase().includes(query)
      else return c.is_archived && c.title.toLowerCase().includes(query)
    })
    setResults(filteredConversations)
  }

  useEffect(() => {
    let filteredConversations = [];
    if (currentTab === "active")
      filteredConversations = allConversations.filter((c) => !c.is_archived)
    else filteredConversations = allConversations.filter((c) => c.is_archived)
    setResults(filteredConversations)
  }, [currentTab, allConversations])

  useEffect(() => {
    if (chatsLoaded === 100) setIsChatUpdating(false)
    else setIsChatUpdating(true)
  }, [chatsLoaded])

  return (
    <div className="space-y-4">

      {/* Content */}
      <div className="flex gap-4">
        <aside className="flex-[2] px-2 space-y-3">
          <button
            onClick={() => setCurrentTab("active")}
            className="text-xl font-semibold border border-white py-2 text-white w-full">
            Active Chats
          </button>
          <button
            onClick={() => setCurrentTab("archived")}
            className="text-xl font-semibold border border-white py-2 text-white w-full">
            Archived Chats
          </button>
        </aside>
        <div className="flex-[6] space-y-3">
          {/* Search Input Field */}
          <div>
            <div className="mb-4 p-2 rounded-md border border-white/60">
              <input
                type="text"
                placeholder="Search"
                autoFocus
                className="w-full bg-transparent outline-none text-white/80"
                onChange={(e: any) => handleSearchOnChange(e.target.value)}
              />
            </div>
            <div className="flex border-b border-white items-center justify-between py-3">
              <label
                onClick={(e) => handleOnChatSelectChange({ isAllSelect: e })}
                className="flex gap-2 items-center">
                <input type="checkbox" />
                <span>Select All Chats</span>
              </label>
              <div className="flex items-center gap-2">
                <span>Selected Chats:</span>
                <span>{selectedConversationsId.length}</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="overflow-height">
            <ul className="space-y-2 text-white">
              {results.map(({ id, title, update_time }, idx) => (
                <li
                  key={id + idx}
                  className="py-2 select-none border-b border-white/60">
                  <label className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <input
                        onChange={() => handleOnChatSelectChange({ id })}
                        checked={isSelected(id)}
                        type="checkbox"
                      />
                      <span>{title}</span>
                    </div>
                    <span className="bg-yellow-500 text-black">
                      {formatTimestamp({
                        timestamp: update_time,
                        type: "date"
                      })}
                    </span>
                  </label>
                </li>
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
              Delete
            </button>
            <button
              onClick={() =>
                handleDBUpdate(
                  currentTab !== "active" ? "unarchive" : "archive"
                )
              }
              className={`text-xl font-semibold border ${selectedConversationsId.length ? "text-white border-white" : "text-white/60 border-white/60 bg-black/60"} smooth-transition py-3 w-full`}>
              {currentTab !== "active" ? "Un-Archive" : "Archive"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chats
