import type { ModalType } from "@/utils/types/components/modal"
import { useRef } from "react"
import { IoCloseOutline } from "react-icons/io5"

const Modal = ({ children, openModal, setOpenModal }: ModalType) => {
  const modalRef = useRef<HTMLDialogElement>()
  const modalChildRef = useRef<HTMLDivElement>()
  
  const handleClose = () => {
    if (
      modalRef?.current &&
      modalRef?.current?.contains(modalChildRef?.current)
    ) {
      setOpenModal(null)
    }
  }

  return openModal ? (
    <dialog
      ref={modalRef}
      onClick={() => handleClose()}
      className=" fixed top-0 left-0 modal bg-black/30 w-full h-full flex items-center justify-center">
      <div
        ref={modalChildRef}
        className="w-[70vw] h-[75vh] bg-black border border-white/50 rounded-xl p-4 shadow-md relative">
        {children}

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
