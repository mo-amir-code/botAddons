import type { ReactNode } from "react";
import type { OpenModalType } from "./sidebar";


interface ModalType {
    children: ReactNode
    openModal: OpenModalType
    setOpenModal: Function
    title: string
}

export type {
    ModalType
}