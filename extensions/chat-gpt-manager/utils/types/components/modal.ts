import type { ReactNode } from "react";
import type { OpenModalType } from "./sidebar";


interface ModalType {
    children: ReactNode
    openModal: OpenModalType
    setOpenModal: Function
}

export type {
    ModalType
}