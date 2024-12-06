import type { ModalType } from "@/utils/types/components/modal"
import { useRef } from "react"
import { IoCloseOutline } from "react-icons/io5"

import { Chats, Search } from "./modals"

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
      className=" fixed top-0 left-0 modal bg-black/60 backdrop-blur-sm w-full h-full flex items-center justify-center">
      <div
        ref={modalChildRef}
        className="w-[60vw] min-w-[650px] max-h-[65vh] overflow-hidden bg-black border border-white/50 rounded-xl p-4 shadow-md relative">
        {/* Header */}
        <div className="">
          <h2 className="text-3xl font-semibold">
            {
              (() => {
                switch(openModal){
                  case "search": return "Legendary Conversation History";
                  case "chats": return "Manage Conversations";
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
