import mongoose, { Schema } from "mongoose"
import { SubscriptionSchemaType } from "../../types/db/schema/index.js"

const subscriptionSchema: Schema<SubscriptionSchemaType> = new Schema<SubscriptionSchemaType>({
    userId: { type: Schema.Types.ObjectId, required: [true, "User ID is required"], ref: "User" },
    planId: { type: Schema.Types.ObjectId, required: [true, "Plan ID is required"], ref: "Plan" },
    startDate: { type: Number, required: [true, "Start date is required"] },
    endDate: { type: Number, required: [true, "End date is required"] },
    status: { type: String, required: [true, "Status is required"], enum: ["active", "cancelled", "expired"] },
}, { timestamps: true });

export default mongoose.models.Subscription || mongoose.model<SubscriptionSchemaType>("Subscription", subscriptionSchema)