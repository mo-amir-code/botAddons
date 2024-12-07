import { useExtension } from "@/contexts/extensionContext"
import { dbAndStores } from "@/utils/constants"
import { formatTimestamp } from "@/utils/services"
import type { ChatTabType } from "@/utils/types/components/chat"
import type { ConversationObjectType } from "@/utils/types/components/search"
import { useEffect, useState } from "react"

const Chats = () => {
  const [results, setResults] = useState<
    ConversationObjectType<string, number>[]
  >([])
  const { conversations, dispatch } = useExtension()
  const [currentTab, setCurrentTab] = useState<ChatTabType>("active")
  const [selectedConversationsId, setSelectedConversationsId] = useState<
    string[]
  >([])

  const performActionOnDatabase = (
    action: string,
    id: string,
    dbName: string,
    storeName: string
  ) => {
    return new Promise((resolve) => {
      const dbRequest = indexedDB.open(dbName)

      dbRequest.onsuccess = function (event: any) {
        const db = event.target.result
        const transaction = db.transaction(storeName, "readwrite")
        const store = transaction.objectStore(storeName)

        const cursorRequest = store.openCursor()

        cursorRequest.onsuccess = function (event) {
          const cursor = event.target.result

          if (cursor) {
            const doc = cursor.value

            if (doc.id === id) {
              if (action === "delete") {
                const deleteRequest = cursor.delete()

                deleteRequest.onsuccess = function () {
                  console.log(`Deleted ID ${id} from ${dbName}/${storeName}`)
                }

                deleteRequest.onerror = function () {
                  console.error(`Error deleting ID ${id}:`, deleteRequest.error)
                }
              } else if (action === "archive" || action === "unarchive") {
                const key = "is_archived" in doc ? "is_archived" : "isArchived"
                doc[key] = !doc[key]

                const putRequest = store.put(doc)

                putRequest.onsuccess = function () {
                  console.log(
                    `Updated ID ${id} in ${dbName}/${storeName} to ${
                      doc[key] ? "archived" : "unarchived"
                    }`
                  )
                }

                putRequest.onerror = function () {
                  console.error(`Error updating ID ${id}:`, putRequest.error)
                }
              }

              resolve(true) // ID found and operation performed
              return
            }

            cursor.continue() // Continue to next document
          } else {
            resolve(false) // ID not found in this database
          }
        }

        cursorRequest.onerror = function () {
          console.error(`Error searching for ID ${id}:`, cursorRequest.error)
          resolve(false) // Resolve as not found
        }
      }

      dbRequest.onerror = function () {
        console.error(`Error opening database ${dbName}:`, dbRequest.error)
        resolve(false) // Resolve as not found
      }
    })
  }

  const handleDBUpdate = (action: "delete" | "archive" | "unarchive") => {
    if (!selectedConversationsId.length) return

    async function handleActions(action: string, ids: string[]) {
      for (const id of ids) {
        let found = false

        for (const { dbName, storeName } of dbAndStores) {
          found = (await performActionOnDatabase(action, id, dbName, storeName))
            ? true
            : false

          if (found) {
            console.log(
              `Action performed for ID ${id} in ${dbName}/${storeName}`
            )
            break // Stop checking other databases if ID is found
          }
        }

        if (!found) {
          console.warn(`ID ${id} not found in any database!`)
        }
      }
    }

    handleActions(action, selectedConversationsId).then(() => {
      let updatedConversations = []
      if (action === "archive" || action === "unarchive") {
        updatedConversations = conversations.map((c) => {
          return {
            ...c,
            is_archived: !c.is_archived
          }
        })
      } else {
        updatedConversations = conversations.filter(
          (c) => !selectedConversationsId.includes(c.id)
        )
      }
      dispatch({ type: "conversations", payload: updatedConversations })
      setSelectedConversationsId([])
    })
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
    const filteredConversations = conversations.filter((c) => {
      if (currentTab === "active")
        return !c.is_archived && c.title.includes(query)
      else return c.is_archived && c.title.includes(query)
    })
    setResults(filteredConversations)
  }

  useEffect(() => {
    let filteredConversations
    if (currentTab === "active")
      filteredConversations = conversations.filter((c) => !c.is_archived)
    else filteredConversations = conversations.filter((c) => c.is_archived)
    setResults(filteredConversations)
  }, [currentTab, conversations])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div></div>

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
            <div className="mt-8 mb-4 p-2 rounded-md border border-white/60">
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
          <ul className="space-y-2 text-white overflow-height">
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
                    {formatTimestamp({ timestamp: update_time, type: "date" })}
                  </span>
                </label>
              </li>
            ))}
          </ul>

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
