import mongoose, { Schema } from "mongoose"
import { PaymentSchemaType } from "../../types/db/schema/index.js"
import { COUPON_COLLECTION_NAME, PAYMENT_COLLECTION_NAME, SUBSCRIPTION_COLLECTION_NAME } from "../../config/constants.js";

const paymentSchema: Schema<PaymentSchemaType> = new Schema<PaymentSchemaType>({
    subscriptionId: { type: Schema.Types.ObjectId, required: [true, "Subscription ID is required"], ref: SUBSCRIPTION_COLLECTION_NAME },
    amount: { type: Object, required: [true, "Amount details is required"] },
    couponId: { type: Schema.Types.ObjectId, ref: COUPON_COLLECTION_NAME },
    status: { type: String, required: [true, "Status is required"], enum: ["success", "failed", "pending"] },
    paymentDate: { type: Number, required: [true, "Payment date is required"] },
    paymentMethod: { type: String, required: [true, "Payment method is required"], enum: ["upi", "card", "net banking"] },
}, { timestamps: true });

export default mongoose.models[PAYMENT_COLLECTION_NAME] || mongoose.model<PaymentSchemaType>(PAYMENT_COLLECTION_NAME, paymentSchema)