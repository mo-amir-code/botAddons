import mongoose, { Schema } from "mongoose"
import { ChatSchemaType } from "../../types/db/schema/index.js"
import { CHAT_COLLECTION_NAME, USER_COLLECTION_NAME } from "../../config/constants.js";

const chatSchema: Schema<ChatSchemaType> = new Schema<ChatSchemaType>({
    userId: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: [true, "User ID is required"] },
    title: { type: String, required: [true, "Title is required"] },
    chatId: { type: String, required: [true, "Chat ID is required"] },
    isArchived: { type: Boolean, default: false },
    platform: { type: String, required: [true, "Platform is required"], enum: ["chatgpt", "claude"] },
}, { timestamps: true });

export default mongoose.models[CHAT_COLLECTION_NAME] || mongoose.model<ChatSchemaType>(CHAT_COLLECTION_NAME, chatSchema)