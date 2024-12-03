import { contextLength, dbAndStores } from "@/utils/constants"
import { formatTimestamp } from "@/utils/services"
import type {
  ConversationObjectType,
  DefaultMessageType
} from "@/utils/types/components/search"
import { useEffect, useState } from "react"

import Toggle from "../buttons/Toggle"

const Search = () => {
  const [conversations, setConversations] = useState<
    ConversationObjectType<string, number>[]
  >([])
  const [searchResults, setSearchResults] = useState<
    ConversationObjectType<string, number>[]
  >([])
  const [exactMatchStatus, setExactMatchStatus] = useState<boolean>(false)
  const [query, setQuery] = useState<string>("")
  const [to, setTO] = useState<any>(null)

  const handleSearchOnChange = async (query: string) => {
    to && clearTimeout(to)
    const timeoutId = setTimeout(() => {
      setQuery(query)
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
      const lowerText = text?.toLowerCase()
      if (exactMatchStatus) {
        const trimmedQuery = query.trim()
        const regex = new RegExp(`\\b${trimmedQuery}\\b`, "i") // Match whole phrase, case insensitive
        return regex.test(text) ? true : false
      } else {
        return lowerText?.includes(query?.toLowerCase())
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

  useEffect(() => {
    const fetchNow = async () => {
      // To get a conversations
      function getConversations(dbName: string, storeName: string) {
        return new Promise((resolve, reject) => {
          // Open the database
          const request = indexedDB.open(dbName)

          request.onsuccess = function (event) {
            const db = (event.target as any).result

            // Start a transaction and access the `conversations` object store
            const transaction = db.transaction(storeName, "readonly")
            const objectStore = transaction.objectStore(storeName)

            // Get all data from the store
            const getAllRequest = objectStore.getAll()

            getAllRequest.onsuccess = function () {
              resolve(getAllRequest.result) // Resolve with the retrieved items
            }

            getAllRequest.onerror = function () {
              reject(getAllRequest.error) // Handle errors
            }
          }

          request.onerror = function () {
            reject(request.error) // Handle database opening errors
          }
        })
      }

      let conversations =
        (await Promise.all(
          dbAndStores.map(
            async ({ dbName, storeName }) =>
              await getConversations(dbName, storeName)
          )
        )) || []

      conversations = conversations.flat()

      conversations = conversations.map(
        ({
          id,
          title,
          messages,
          update_time
        }: ConversationObjectType<DefaultMessageType, string>) => {
          return {
            id,
            title,
            messages: messages.map((msg: DefaultMessageType) => msg.content),
            update_time: new Date(update_time).getTime()
          }
        }
      ) as ConversationObjectType<string, number>[]

      setConversations(
        conversations as ConversationObjectType<string, number>[]
      )
    }
    fetchNow()
  }, [])

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
      <div className="mt-8 mb-4 p-2 rounded-md border border-white/60">
        <input
          type="text"
          placeholder="Search"
          autoFocus
          className="w-full bg-transparent outline-none text-white/80"
          onChange={(e: any) => handleSearchOnChange(e.target.value)}
        />
      </div>

      <div className="overflow-y-auto h-[250px] space-y-6">
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
    </div>
  )
}

export default Search
