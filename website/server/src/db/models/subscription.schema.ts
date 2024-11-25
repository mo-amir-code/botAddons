import mongoose, { Schema } from "mongoose"
import { SubscriptionSchemaType } from "../../types/db/schema/index.js"
import { PLAN_COLLECTION_NAME, SUBSCRIPTION_COLLECTION_NAME, USER_COLLECTION_NAME } from "../../config/constants.js";

const subscriptionSchema: Schema<SubscriptionSchemaType> = new Schema<SubscriptionSchemaType>({
    userId: { type: Schema.Types.ObjectId, required: [true, "User ID is required"], ref: USER_COLLECTION_NAME },
    planId: { type: Schema.Types.ObjectId, required: [true, "Plan ID is required"], ref: PLAN_COLLECTION_NAME },
    startDate: { type: Number, required: [true, "Start date is required"] },
    endDate: { type: Number, required: [true, "End date is required"] },
    status: { type: String, required: [true, "Status is required"], enum: ["active", "cancelled", "expired"] },
}, { timestamps: true });

export default mongoose.models[SUBSCRIPTION_COLLECTION_NAME] || mongoose.model<SubscriptionSchemaType>(SUBSCRIPTION_COLLECTION_NAME, subscriptionSchema)