import { useExtension } from "@/contexts/extensionContext"
import { dbAndStores } from "@/utils/constants"
import { features } from "@/utils/data"
import { filterChats, removeDuplicatesItemsById } from "@/utils/services"
import { getAuthToken } from "@/utils/services/auth"
import type {
  ConversationObjectType,
  DefaultMessageType
} from "@/utils/types/components/search"
import type { OpenModalType } from "@/utils/types/components/sidebar"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { BsJournalCode } from "react-icons/bs"
import { FaFolderTree } from "react-icons/fa6"
import { IoIosChatbubbles, IoIosSearch } from "react-icons/io"

import Modal from "./Modal"

const Sidebar = () => {
  const [openModal, setOpenModal] = useState<OpenModalType>(null)
  const { plan, dispatch } = useExtension()

  const getCssVariable = (name: string) => {
    const rootStyle = getComputedStyle(document.documentElement)
    return rootStyle.getPropertyValue(name).trim()
  }
  // const backgroundColor = getCssVariable("--main-surface-primary")

  const getConv = async () => {
    const token = await getAuthToken()
    const res = await axios.get(
      "https://chatgpt.com/backend-api/conversations?offset=0&limit=100&order=updated&is_archived=false&s=true",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  }

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
          update_time,
          updateTime,
          is_archived,
          isArchived
        }: ConversationObjectType<DefaultMessageType, string>) => {
          const ts: number | string = update_time || updateTime
          return {
            id,
            title,
            messages: messages.map(
              (msg: DefaultMessageType) => msg.content || msg?.text
            ),
            update_time:
              typeof ts === "string" ? new Date(ts).getTime() : ts * 1000,
            is_archived: is_archived || isArchived
          }
        }
      ) as ConversationObjectType<string, number>[]
      conversations = removeDuplicatesItemsById(conversations as any)
      dispatch({
        type: "conversations",
        payload: filterChats({
          conversations: conversations as ConversationObjectType<
            string,
            number
          >[],
          sort: "desc",
          filter: "removeEmptyConversations"
        })
      })
    }
    fetchNow()
    // getConv()
  }, [])

  return (
    <main className={`antialiased w-full`}>
      <h3 className="text-[12px] p-2 w-full cursor-pointer text-ellipsis font-semibold">
        ChatGPT Manager - {plan.toUpperCase()}
      </h3>
      <ol className="text-white w-full">
        {features.map(({ slug, title }) => (
          <li
            key={slug}
            onClick={() => setOpenModal(slug as OpenModalType)}
            className="py-2 px-2 rounded-xl flex items-center gap-3 cursor-pointer w-full smooth-transition hover:bg-gray-500/15">
            <span className="text-white/60">
              {(() => {
                switch (slug) {
                  case "search":
                    return <IoIosSearch className="text-2xl" />
                  case "chats":
                    return <IoIosChatbubbles className="text-2xl" />
                  case "folders":
                    return <FaFolderTree className="text-2xl" />
                  case "prompts":
                    return <BsJournalCode className="text-2xl" />
                }
              })()}
            </span>
            <span>{title}</span>
          </li>
        ))}
      </ol>

      <Modal openModal={openModal} setOpenModal={setOpenModal} />
    </main>
  )
}

export default Sidebar
