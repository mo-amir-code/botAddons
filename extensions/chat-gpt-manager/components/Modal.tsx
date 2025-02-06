import type { ModalType } from "@/utils/types/components/modal"
import { useRef } from "react"
import { IoCloseOutline } from "react-icons/io5"

import { Chats, Folders, Search } from "./modals"

const Modal = ({ openModal, setOpenModal }: ModalType) => {
  const modalChildRef = useRef<HTMLDivElement>()

  const handleClose = (e: any) => {
    if (!modalChildRef?.current?.contains(e.target)) {
      setOpenModal(null)
    }
  }

  return openModal ? (
    <dialog
      onClick={(e) => handleClose(e)}
      className=" fixed top-0 left-0 modal select-none bg-black/60 backdrop-blur-sm w-full h-full flex items-center justify-center">
      <div
        ref={modalChildRef}
        className="w-[900px] overflow-hidden bg-primary-bg border border-primary-off-white/50 rounded-xl p-4 shadow-md relative">
        {/* Header */}
        <div className="pb-4">
          <h2 className="text-3xl font-semibold text-primary-white">
            {
              (() => {
                switch(openModal){
                  case "search": return "Legendary Conversation History";
                  case "chats": return "Manage Conversations";
                  case "folders": return "Manage Folders";
                }
              })()
            }
          </h2>
        </div>
        {/* Rendring Child */}
        {(() => {
          switch (openModal) {
            case "search":
              return <Search />
            case "chats":
              return <Chats />
            case "folders":
              return <Folders />
          }
        })()}
        {/* END Rendring Child */}

        {/* Close Button */}
        <button
          onClick={() => setOpenModal(null)}
          className="p-1 bg-white text-black rounded-full absolute top-4 right-4">
          <IoCloseOutline className="text-2xl" />
        </button>
      </div>
    </dialog>
  ) : (
    ""
  )
}

export default Modal
