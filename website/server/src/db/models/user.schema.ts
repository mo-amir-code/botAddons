import mongoose, { Schema } from "mongoose"
import { UserSchemaType } from "../../types/db/schema/index.js"
import { USER_COLLECTION_NAME } from "../../config/constants.js";

const userSchema: Schema<UserSchemaType> = new Schema<UserSchemaType>({
    fullName: { type: String, required: [true, "Full name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    password: { type: String, required: [true, "Password is required"] },
    sessions: [
        {
            platform: { type: String, enum: ["chatgpt", "claude", "website"] },
            sessionId: { type: String, required: [true, "Session ID is required"] }
        }
    ],
    otp: { type: String },
    otpToken: { type: String }
}, { timestamps: true });

export default mongoose.models[USER_COLLECTION_NAME] || mongoose.model<UserSchemaType>(USER_COLLECTION_NAME, userSchema)