import { Schema } from "mongoose";
import { UserRoleType } from "../schema/index.js";

interface FindByIdAndUpdateUserType {
    id: Schema.Types.ObjectId
    fullName?: string
    email?: string
    isVerified?: boolean
    role?: UserRoleType
    password?: string
    sessions?: Object[]
    otp?: string
    otpToken?: string
}

export type {
    FindByIdAndUpdateUserType
}