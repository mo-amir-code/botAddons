import mongoose, { Schema } from "mongoose"
import { PromptSchemaType } from "../../types/db/schema/index.js"

const promptSchema: Schema<PromptSchemaType> = new Schema<PromptSchemaType>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: [true, "User ID is required"] },
    title: { type: String, required: [true, "Title is required"] },
    content: { type: String, required: [true, "Content is required"] },
}, { timestamps: true });

export default mongoose.models.Prompt || mongoose.model<PromptSchemaType>("Prompt", promptSchema)