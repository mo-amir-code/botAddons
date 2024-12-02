import { dbAndStores } from "@/utils/constants"
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
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [query, setQuery] = useState<string>("")
  const [to, setTO] = useState<any>(null)

  const handleSearchOnChange = async (query: string) => {
    to && clearTimeout(to)
    const timeoutId = setTimeout(() => {
      setQuery(query)
    }, 500)
    setTO(timeoutId)
  }

  useEffect(() => {
    if(query.length){
      
    }
  }, [query]);

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
    <div className="py-8">
      {/* Header */}
      <div className=" border-b border-white/60 pb-6">
        <div className="flex items-center text-white/80 gap-2 text-xl font-medium">
          <span>Exact Match</span>
          <Toggle isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>

      {/* Search Input Field */}
      <div className="mt-8 mb-4 p-2 rounded-md border border-white/60">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent outline-none text-white/80"
          onChange={(e: any) => handleSearchOnChange(e.target.value)}
        />
      </div>
    </div>
  )
}

export default Search
