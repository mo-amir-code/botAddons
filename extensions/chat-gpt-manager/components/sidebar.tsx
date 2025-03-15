import { TOAST_TIME_IN_MS } from "@/config/constants"
import { useExtension } from "@/contexts/extensionContext"
import { useLanguage } from "@/contexts/languageContext"
import { useToast } from "@/contexts/toastContext"
import { dbAndStores } from "@/utils/constants"
import { features } from "@/utils/data"
import { filterChats, removeDuplicatesItemsById } from "@/utils/services"
import {
  getDataFromLocalStorage,
  setAuthToken,
  setDataInLocalStorage
} from "@/utils/services/auth"
import { httpAxios } from "@/utils/services/axios"
import { getAllConversations } from "@/utils/services/queries/conversations"
import type {
  ConversationObjectType,
  DefaultMessageType,
  FoldersWindow
} from "@/utils/types/components/search"
import type { OpenModalType } from "@/utils/types/components/sidebar"
import type { UserInfoType } from "@/utils/types/context"
import React, { useEffect, useState } from "react"
import { BsJournalCode } from "react-icons/bs"
import { FaFolderTree } from "react-icons/fa6"
import { IoIosChatbubbles, IoIosSearch } from "react-icons/io"

import { ChildModal, Modal } from "../sections"

const Sidebar = () => {
  const [openModal, setOpenModal] = useState<OpenModalType>(null)
  const { plan, dispatch, chatsLoaded, chatgptUserInfo } = useExtension()
  const { t } = useLanguage()
  const { addToast } = useToast()

  const getCssVariable = (name: string) => {
    const rootStyle = getComputedStyle(document.documentElement)
    return rootStyle.getPropertyValue(name).trim()
  }
  // const backgroundColor = getCssVariable("--main-surface-primary")

  const getConv = async () => {
    let conversations = await getAllConversations({ chatsLoaded, dispatch })

    conversations = [
      ...conversations,
      ...(await getAllConversations({
        chatsLoaded,
        dispatch,
        archive: "archive"
      }))
    ]

    conversations = conversations.filter(
      (obj, index, self) => index === self.findIndex((o) => o.id === obj.id)
    )

    dispatch({ type: "ALL_CONVERSATIONS", payload: conversations })
  }

  const handleAutoAuth = async () => {
    try {
      const userInfo = await getDataFromLocalStorage("user")

      const res2 = await httpAxios.post("/auth/auto", {
        email: userInfo.email,
        name: userInfo.name
      })

      if (res2.status === 200) {
        dispatch({ type: "AUTH", payload: true })

        const user: UserInfoType = {
          id: res2.data.data.id,
          email: userInfo.email,
          fullName: userInfo.name
        }

        dispatch({ type: "USER_INFO", payload: user })

        const res = await httpAxios.get("/prompt")
        setDataInLocalStorage({ key: "prompts", data: res?.data?.data })
      }
    } catch (error) {
      console.error(error)
      addToast(error?.message, "failed", TOAST_TIME_IN_MS)
    }
  }

  useEffect(() => {
    const fetchNow = async () => {
      // To get a conversations
      function getConversations(dbName: string, storeName: string) {
        return new Promise((resolve) => {
          // Open the database
          const request = indexedDB.open(dbName)

          request.onupgradeneeded = function (event) {
            // Handle if the database structure needs to be upgraded
            const db = (event.target as any).result
            if (!db.objectStoreNames.contains(storeName)) {
              // If the store does not exist during upgrade, resolve with an empty array
              resolve([])
            }
          }

          request.onsuccess = function (event) {
            const db = (event.target as any).result

            // Check if the object store exists
            if (!db.objectStoreNames.contains(storeName)) {
              // Resolve with an empty array if the store does not exist
              resolve([])
              return
            }

            // Start a transaction and access the object store
            const transaction = db.transaction(storeName, "readonly")
            const objectStore = transaction.objectStore(storeName)

            // Get all data from the store
            const getAllRequest = objectStore.getAll()

            getAllRequest.onsuccess = function () {
              resolve(getAllRequest.result) // Resolve with the retrieved items
            }

            getAllRequest.onerror = function () {
              resolve([]) // If fetching fails, resolve with an empty array
            }
          }

          request.onerror = function () {
            // Handle database opening errors by resolving with an empty array
            resolve([])
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
        type: "CONVERSATIONS",
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
    setAuthToken(dispatch)
  }, [])

  useEffect(() => {
    if (chatgptUserInfo) {
      handleAutoAuth()
      getConv()
    }
  }, [chatgptUserInfo])

  useEffect(() => {
    const payload: FoldersWindow = {
      type: "chats",
      folders: []
    }
    if (openModal === "folders") {
      payload.type = "chats"
    } else if (openModal === "prompts") {
      payload.type = "prompts"
    }

    dispatch({
      type: "FOLDERS_WINDOW",
      payload
    })
  }, [openModal])

  return (
    <main className={`antialiased w-full`}>
      <h3 className="text-[12px] p-2 w-full cursor-pointer text-ellipsis font-semibold">
        {t("extensionName")} - {plan.toUpperCase()}
      </h3>
      <ol className="text-white w-full">
        {features.map(({ slug, title }, idx) => (
          <li
            key={slug}
            onClick={() => setOpenModal(slug as OpenModalType)}
            className="py-2 px-2 rounded-xl flex items-center gap-3 cursor-pointer w-full smooth-transition hover:bg-gray-500/15">
            <span className="text-white/60">
              {(() => {
                switch (slug) {
                  case "search":
                    return <IoIosSearch className="min-w-7 min-h-7" />
                  case "chats":
                    return <IoIosChatbubbles className="min-w-7 min-h-7" />
                  case "folders":
                    return <FaFolderTree className="min-w-7 min-h-7" />
                  case "prompts":
                    return <BsJournalCode className="min-w-7 min-h-7" />
                }
              })()}
            </span>
            <div className="flex flex-col ">
              <span className="text-start">
                {(() => {
                  const translationKey = (() => {
                    switch (title) {
                      case "Search History":
                        return "searchHistory"
                      case "Manage Chats":
                        return "manageChats"
                      case "Manage Folders":
                        return "manageFolders"
                      case "Manage Prompts":
                        return "managePrompts"
                      default:
                        return null
                    }
                  })()
                  return translationKey ? t(translationKey) : title
                })()}
              </span>
              {!!(idx === 0) && (
                <span className="text-sm w-full text-center text-white/60">
                  {chatsLoaded === 100
                    ? `Synced`
                    : `Loading history - ${chatsLoaded}%`}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>

      <Modal openModal={openModal} setOpenModal={setOpenModal} />
      <ChildModal />
    </main>
  )
}

export default Sidebar
