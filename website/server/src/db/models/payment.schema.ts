import mongoose, { Schema } from "mongoose"
import { PaymentSchemaType, SubscriptionSchemaType } from "../../types/db/schema/index.js"

const paymentSchema: Schema<PaymentSchemaType> = new Schema<PaymentSchemaType>({
    subscriptionId: { type: Schema.Types.ObjectId, required: [true, "Subscription ID is required"], ref: "Subscription" },
    amount: { type: Number, required: [true, "Amount is required"] },
    status: { type: String, required: [true, "Status is required"], enum: ["success", "failed", "pending"] },
    paymentDate: { type: Number, required: [true, "Payment date is required"] },
    paymentMethod: { type: String, required: [true, "Payment method is required"], enum: ["upi", "card", "net banking"] },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model<PaymentSchemaType>("Payment", paymentSchema)