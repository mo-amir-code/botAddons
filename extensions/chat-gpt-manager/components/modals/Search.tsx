import { useExtension } from "@/contexts/extensionContext"
import { contextLength } from "@/utils/constants"
import { formatTimestamp } from "@/utils/services"
import type { ConversationObjectType } from "@/utils/types/components/search"
import { useEffect, useState } from "react"

import Toggle from "../buttons/Toggle"
import { BallLoader } from "../loaders"

const Search = () => {
  const { conversations } = useExtension()
  const [searchResults, setSearchResults] = useState<
    ConversationObjectType<string, number>[]
  >([])
  const [exactMatchStatus, setExactMatchStatus] = useState<boolean>(false)
  const [query, setQuery] = useState<string>("")
  const [to, setTO] = useState<any>(null)
  const [isConversationsLoading, setIsConversationsLoading] = useState(false)

  const handleSearchOnChange = async (query: string) => {
    to && clearTimeout(to)
    setIsConversationsLoading(true);
    const timeoutId = setTimeout(() => {
      setQuery(query.trim())
      setIsConversationsLoading(false);
    }, 500)
    setTO(timeoutId)
  }

  const filterAndHighlightConversations = (query: string) => {
    const replaceWord = (text: string, word: string, replacement: string) => {
      const trimmedWord = word.trim()
      const regex = new RegExp(`\\b${trimmedWord}\\b\\s*`, "g")
      return text.replace(regex, `${replacement} `)
    }

    const highlightTextWithContext = (text: string, query: string) => {
      const regex = exactMatchStatus
        ? new RegExp(`\\b${query.trim()}\\b`, "gi") // Match exact word
        : new RegExp(`(${query.trim()})`, "gi")
      const match = regex.exec(text)

      if (match) {
        const start = Math.max(0, match.index - contextLength)
        const end = Math.min(
          text?.length,
          match.index + match[0]?.length + contextLength
        )
        const prefix = start > 0 ? "..." : ""
        const suffix = end < text.length ? "..." : ""
        const context = text.slice(start, end)
        // console.log("Context: ", context)

        const replacementStr = `<span style="background-color: yellow; color: black">${match[0]}</span>`

        return `${prefix}${
          exactMatchStatus
            ? replaceWord(context, match[0], replacementStr)
            : context.replace(match[0], replacementStr)
        }${suffix}`
      }
    }

    const isMatched = (text: string) => {
      const lowerText = (text || "").toLowerCase()
      if (exactMatchStatus) {
        const trimmedQuery = query.trim()
        const regex = new RegExp(`\\b${trimmedQuery}\\b`, "i") // Match whole phrase, case insensitive
        return regex.test(text) ? true : false
      } else {
        return lowerText.includes(query?.toLowerCase())
      }
    }

    return conversations
      .map((conversation) => {
        const titleMatch = isMatched(conversation.title)
        const messagesMatch = conversation.messages.some((message) =>
          isMatched(message)
        )

        if (titleMatch || messagesMatch) {
          return {
            ...conversation,
            title: titleMatch
              ? highlightTextWithContext(conversation.title, query)
              : conversation.title,
            messages: conversation.messages
              .filter((message) => isMatched(message))
              .map((message) => highlightTextWithContext(message, query))
          }
        }

        return null
      })
      .filter(Boolean) // Remove null results
  }

  useEffect(() => {
    if (query.length && conversations.length) {
      const results = filterAndHighlightConversations(query)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [query, exactMatchStatus])

  return (
    <div className="pt-8 pb-4">
      {/* Header */}
      <div className=" border-b border-white/60 pb-6">
        <div className="flex items-center text-white/80 gap-2 text-xl font-medium">
          <span>Exact Match</span>
          <Toggle isOpen={exactMatchStatus} setIsOpen={setExactMatchStatus} />
        </div>
      </div>

      {/* Search Input Field */}
      <div className="mt-8 mb-4 p-2 flex items-center rounded-md border border-white/60">
        <input
          type="text"
          placeholder="Search"
          autoFocus
          className="w-full bg-transparent outline-none text-white/80"
          onChange={(e: any) => handleSearchOnChange(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <span>Found: </span>
          {searchResults.length}
        </div>
      </div>

      <div className="h-[300px] relative">
        {isConversationsLoading ? (
          <div className="w-full h-full bg-black/5 backdrop-blur-md absolute top-0 left-0">
            <BallLoader />
          </div>
        ) : (
          <div className="overflow-height space-y-6">
            {searchResults.map((conversation, index) => (
              <div key={index}>
                <a
                  href={`/c/${conversation.id}`}
                  target="_self"
                  className="space-y-2">
                  <div className="flex pr-4 items-center justify-between pb-3 border-b border-white/60">
                    <h3
                      className="text-2xl font-semibold"
                      dangerouslySetInnerHTML={{ __html: conversation.title }}
                    />
                    <div className="font-semibold">
                      {formatTimestamp({
                        timestamp: conversation.update_time,
                        type: "date"
                      }) || ""}
                    </div>
                  </div>
                  <div className="flex gap-4 pl-6">
                    <div className="w-[2px] bg-gray-600 min-h-full rounded-full" />
                    <ul className="flex-grow space-y-2">
                      {conversation.messages.map((message, i) => (
                        <li
                          key={i}
                          className="text-lg smooth-transition hover:shadow-md shadow-white py-1"
                          dangerouslySetInnerHTML={{ __html: message }}
                        />
                      ))}
                    </ul>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
