import mongoose, { Schema } from "mongoose"
import { FolderSchemaType } from "../../types/db/schema/index.js"

const folderSchema: Schema<FolderSchemaType> = new Schema<FolderSchemaType>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: [true, "User ID is required"] },
    title: { type: String, required: [true, "Title is required"] },
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat", required: [true, "Chat ID is required"] }],
    prompts: [{ type: Schema.Types.ObjectId, ref: "Prompt", required: [true, "Prompt ID is required"] }],
    type: { type: String, required: [true, "Folder type is required"], enum: ["chats", "prompts"] },
    platform: { type: String, required: [true, "Platform is required"], enum: ["chatgpt", "claude", "all"] },
}, { timestamps: true });

export default mongoose.models.Folder || mongoose.model<FolderSchemaType>("Folder", folderSchema)