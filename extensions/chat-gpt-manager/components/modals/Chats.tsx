import { useExtension } from "@/contexts/extensionContext"
import { filterChats, formatTimestamp } from "@/utils/services"
import type { ChatTabType } from "@/utils/types/components/chat"
import type { ConversationObjectType } from "@/utils/types/components/search"
import { useEffect, useState } from "react"

const Chats = () => {
  const [results, setResults] = useState<
    ConversationObjectType<string, number>[]
  >([])
  const { conversations } = useExtension()
  const [currentTab, setCurrentTab] = useState<ChatTabType>("active")

  const handleSearchOnChange = (query: string) => {
    const filteredConversations = conversations.filter((c) => {
      if (currentTab === "active")
        return !c.is_archived && c.title.includes(query)
      else return c.is_archived && c.title.includes(query)
    })
    setResults(filteredConversations);
  }

  useEffect(() => {
    let filteredConversations
    if (currentTab === "active")
      filteredConversations = conversations.filter((c) => !c.is_archived)
    else filteredConversations = conversations.filter((c) => c.is_archived)
    setResults(filteredConversations)
  }, [currentTab])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div></div>

      {/* Content */}
      <div className="flex">
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
        <div className="flex-[5]">
          {/* Search Input Field */}
          <div className="mt-8 mb-4 p-2 rounded-md border border-white/60">
            <input
              type="text"
              placeholder="Search"
              autoFocus
              className="w-full bg-transparent outline-none text-white/80"
              onChange={(e: any) => handleSearchOnChange(e.target.value)}
            />
          </div>

          {/* Results */}
          <ul className="space-y-2 text-white overflow-height">
            {results.map(({ id, title, update_time }, idx) => (
              <li
                key={id + idx}
                className="py-2 flex items-center justify-between border-b border-white/60">
                <div className="flex gap-2 items-center">
                  <input type="checkbox" />
                  <span>{title}</span>
                </div>
                <span className="bg-yellow-500 text-black">
                  {formatTimestamp({ timestamp: update_time, type: "date" })}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setCurrentTab("archived")}
              className="text-xl font-semibold border border-white py-3 text-white w-full">
              Delete
            </button>
            <button
              onClick={() => setCurrentTab("archived")}
              className="text-xl font-semibold border border-white py-3 text-white w-full">
              {currentTab === "active" ? "Un-Archive" : "Archive"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chats
