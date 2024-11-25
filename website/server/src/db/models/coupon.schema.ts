import mongoose, { Schema } from "mongoose"
import { CouponSchemaType } from "../../types/db/schema/index.js"
import { COUPON_COLLECTION_NAME, USER_COLLECTION_NAME } from "../../config/constants.js";

const couponSchema: Schema<CouponSchemaType> = new Schema<CouponSchemaType>({
    generatedBy: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: [true, "User ID is required"] },
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String, required: [true, "Description is required"] },
    code: { type: String, required: [true, "Code is required"], unique: true },
    discountType: { type: String, required: [true, "Discount type is required"], enum: ["percentage", "fixedAmount"] },
    discountValue: { type: Number, required: [true, "Discount value is required"] },
    userLimit: { type: Number, default: 1 },
    supply: { type: Number, required: [true, "Supply is required"] },
    usedCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive", "expired"], default: "active" },
    startDate: { type: Number, required: [true, "Start date is required"] },
    endDate: { type: Number, required: [true, "End date is required"] },
}, { timestamps: true });

export default mongoose.models[COUPON_COLLECTION_NAME] || mongoose.model<CouponSchemaType>(COUPON_COLLECTION_NAME, couponSchema)