import mongoose, { Schema } from "mongoose"
import { PromptSchemaType } from "../../types/db/schema/index.js"
import { PROMPT_COLLECTION_NAME, USER_COLLECTION_NAME } from "../../config/constants.js";

const promptSchema: Schema<PromptSchemaType> = new Schema<PromptSchemaType>({
    userId: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: [true, "User ID is required"] },
    title: { type: String, required: [true, "Title is required"], unique: true },
    content: { type: String, required: [true, "Content is required"] },
}, { timestamps: true });

export default mongoose.models[PROMPT_COLLECTION_NAME] || mongoose.model<PromptSchemaType>(PROMPT_COLLECTION_NAME, promptSchema)