import mongoose, { Schema } from "mongoose"
import { FolderSchemaType } from "../../types/db/schema/index.js"
import { CHAT_COLLECTION_NAME, FOLDER_COLLECTION_NAME, PROMPT_COLLECTION_NAME, USER_COLLECTION_NAME } from "../../config/constants.js";

const folderSchema: Schema<FolderSchemaType> = new Schema<FolderSchemaType>({
    userId: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: [true, "User ID is required"] },
    title: { type: String, required: [true, "Title is required"], unique: true },
    chats: [{ type: Schema.Types.ObjectId, ref: CHAT_COLLECTION_NAME, required: [true, "Chat ID is required"] }],
    prompts: [{ type: Schema.Types.ObjectId, ref: PROMPT_COLLECTION_NAME, required: [true, "Prompt ID is required"] }],
    type: { type: String, required: [true, "Folder type is required"], enum: ["chats", "prompts"] },
    platform: { type: String, required: [true, "Platform is required"], enum: ["chatgpt", "claude", "all"] },
}, { timestamps: true });

export default mongoose.models[FOLDER_COLLECTION_NAME] || mongoose.model<FolderSchemaType>(FOLDER_COLLECTION_NAME, folderSchema)