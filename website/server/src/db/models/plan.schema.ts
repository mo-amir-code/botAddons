import mongoose, { Schema } from "mongoose"
import { PlanSchemaType } from "../../types/db/schema/index.js"
import { PLAN_COLLECTION_NAME } from "../../config/constants.js";

const planSchema: Schema<PlanSchemaType> = new Schema<PlanSchemaType>({
    name: { type: String, required: [true, "Name is required"] },
    description: { type: String, required: [true, "Description is required"] },
    price: { type: Number, required: [true, "Price is required"] },
    durationDays: { type: Number, required: [true, "Days are required"] },
    currency: { type: String, required: [true, "Currency is required"], enum: ["inr", "usd"] },
    features: { type: Object, required: [true, "Features are required"] },
}, { timestamps: true });

export default mongoose.models[PLAN_COLLECTION_NAME] || mongoose.model<PlanSchemaType>(PLAN_COLLECTION_NAME, planSchema)