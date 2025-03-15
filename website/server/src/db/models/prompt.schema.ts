import mongoose, { Schema } from "mongoose"
import { PromptSchemaType } from "../../types/db/schema/index.js"
import { FOLDER_COLLECTION_NAME, PROMPT_COLLECTION_NAME, USER_COLLECTION_NAME } from "../../config/constants.js";

const promptSchema: Schema<PromptSchemaType> = new Schema<PromptSchemaType>({
    folderId: { type: Schema.Types.ObjectId, ref: FOLDER_COLLECTION_NAME },
    userId: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: [true, "User ID is required"] },
    title: { type: String, required: [true, "Title is required"] },
    content: { type: String, required: [true, "Content is required"] },
}, { timestamps: true });

export default mongoose.models[PROMPT_COLLECTION_NAME] || mongoose.model<PromptSchemaType>(PROMPT_COLLECTION_NAME, promptSchema)