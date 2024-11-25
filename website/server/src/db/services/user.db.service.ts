import { Schema } from "mongoose";
import { RegisterUserType } from "../../types/controllers/v1/auth.js";
import { User } from "../models/index.js";
import { FindByIdAndUpdateUserType } from "../../types/db/services/user.types.js";
import { UserSchemaType } from "../../types/db/schema/index.js";


const createUser = async (data: RegisterUserType): Promise<UserSchemaType> => {
    return await User.create(data);
}

const deleteUserById = async (userId: Schema.Types.ObjectId): Promise<UserSchemaType | null> => {
    return await User.findByIdAndDelete(userId);
}

const findUserByIdAndUpdate = async (data: FindByIdAndUpdateUserType): Promise<UserSchemaType | null> => {
    return await User.findByIdAndUpdate(data.id, data);
}

const getUserByIDorEmail = async (data: string): Promise<UserSchemaType | null> => {
    return await User.findOne({ $or: [{ _id: data, email: data }] });
}


export {
    createUser,
    deleteUserById,
    findUserByIdAndUpdate,
    getUserByIDorEmail
}