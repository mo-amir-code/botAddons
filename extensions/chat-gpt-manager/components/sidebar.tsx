import { features } from "@/utils/data"
import type { OpenModalType } from "@/utils/types/components/sidebar"
import React, { useEffect, useState } from "react"
import { BsJournalCode } from "react-icons/bs"
import { FaFolderTree } from "react-icons/fa6"
import { IoIosChatbubbles, IoIosSearch } from "react-icons/io"

import Modal from "./Modal"
import { Search } from "./modals"

const Sidebar = () => {
  const [openModal, setOpenModal] = useState<OpenModalType>(null)

  const getCssVariable = (name: string) => {
    const rootStyle = getComputedStyle(document.documentElement)
    return rootStyle.getPropertyValue(name).trim()
  }
  // const backgroundColor = getCssVariable("--main-surface-primary")

  useEffect(() => {}, [])

  return (
    <main className={`antialiased w-full`}>
      <h3 className="text-[12px] p-2 w-full cursor-pointer text-ellipsis font-semibold">
        ChatGPT Manager - Premium
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

      <Modal
        openModal={openModal}
        setOpenModal={setOpenModal}
        children={<Search />}
      />
    </main>
  )
}

export default Sidebar
