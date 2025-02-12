import { useExtension } from "@/contexts/extensionContext"
import type { ModalType } from "@/utils/types/components/modal"
import { useRef } from "react"
import { IoCloseOutline } from "react-icons/io5"

import Toggle from "./buttons/Toggle"
import { Chats, Folders, Search } from "./modals"

const Modal = ({ openModal, setOpenModal }: ModalType) => {
  const modalChildRef = useRef<HTMLDivElement>()
  const {
    headerStates: { exactMatchStatus },
    dispatch
  } = useExtension()

  const handleClose = (e: any) => {
    if (!modalChildRef?.current?.contains(e.target)) {
      setOpenModal(null)
    }
  }

  const handleExactMatchStatus = () => {
    dispatch({ type: "toggleHeaderState", payload: "exactMatchStatus" })
  }

  return openModal ? (
    <dialog
      onClick={(e) => handleClose(e)}
      className=" fixed top-0 left-0 modal select-none bg-black/60 backdrop-blur-sm w-full h-full flex items-center justify-center">
      <div
        ref={modalChildRef}
        className="w-[900px] overflow-hidden bg-primary-bg border border-primary-off-white/50 rounded-xl p-4 shadow-md relative">
        {/* Header */}
        <div className="border-b border-white/60 mb-4">
          <h2 className="text-3xl font-semibold text-primary-white">
            {(() => {
              switch (openModal) {
                case "search":
                  return "Legendary Conversation History"
                case "chats":
                  return "Manage Conversations"
                case "folders":
                  return "Manage Folders"
              }
            })()}
          </h2>

          <div className="my-4">
            {/* Exact Match Button for Search Modal */}
            {!!(openModal === "search") && (
              <div className="flex items-center text-white/80 gap-2 text-xl font-medium">
                <span>Exact Match</span>
                <Toggle
                  isOpen={exactMatchStatus}
                  setIsOpen={handleExactMatchStatus}
                />
              </div>
            )}
          </div>
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
