import { Document, Schema } from "mongoose"


interface MongoDBSchemaDefaultFieldType extends Document {
    _id: Schema.Types.ObjectId
    createdAt: Date;
    updatedAt: Date;
}


interface UserSchemaType extends Document {
    fullName: string
    email: string
    role: UserRoleType
    password: string
    isVerified: boolean
    sessions?: SessionType[]
    otp?: string
    otpToken?: string
}

type UserRoleType = "user" | "admin";

type SessionType = {
    platform: SessionPlatformType
    accessToken: string
}

type SessionPlatformType = "chatgpt" | "claude" | "website";

interface FolderSchemaType extends MongoDBSchemaDefaultFieldType {
    userId: Schema.Types.ObjectId
    title: string
    chats: Schema.Types.ObjectId[]
    prompts: Schema.Types.ObjectId[]
    type: FolderType
    platform: FolderPlatformType
}

type FolderType = "chats" | "prompts";
type FolderPlatformType = "chatgpt" | "claude" | "all";

interface ChatSchemaType extends MongoDBSchemaDefaultFieldType {
    userId: Schema.Types.ObjectId
    title: string
    chatId: string
    isArchived: boolean
    platform: ChatPlatformType
}

type ChatPlatformType = "chatgpt" | "claude";

interface PromptSchemaType extends MongoDBSchemaDefaultFieldType {
    userId: Schema.Types.ObjectId
    title: string
    content: string
}

interface PlanSchemaType extends MongoDBSchemaDefaultFieldType {
    name: string
    description: string
    price: number
    durationDays: number
    currency: CurrencyType
    features: Object
}

type CurrencyType = "inr" | "usd";

interface SubscriptionSchemaType extends MongoDBSchemaDefaultFieldType {
    userId: Schema.Types.ObjectId
    planId: Schema.Types.ObjectId
    startDate: number
    endDate: number
    status: SubscriptionStatusType
}

type SubscriptionStatusType = "active" | "cancelled" | "expired";

interface PaymentSchemaType extends MongoDBSchemaDefaultFieldType {
    subscriptionId: Schema.Types.ObjectId
    amount: PaymentAmountType
    status: PaymentStatusType
    couponId: Schema.Types.ObjectId
    paymentDate: number
    paymentMethod: PaymentMethodType
}

interface PaymentAmountType extends MongoDBSchemaDefaultFieldType {
    subTotal: number
    discount: PaymentAmountDiscountType
    tax: number
    total: number
}

interface PaymentAmountDiscountType extends MongoDBSchemaDefaultFieldType {
    couponCode: string
    discountType: CouponCodeDiscountType
    discountValue: number
    discountedAmount: number
}

type CouponCodeDiscountType = "percentage" | "fixedAmount";

type PaymentStatusType = "success" | "failed" | "pending";
type PaymentMethodType = "upi" | "card" | "net banking";

interface CouponSchemaType extends MongoDBSchemaDefaultFieldType {
    generatedBy: Schema.Types.ObjectId
    title: string
    description: string
    code: string
    discountType: CouponCodeDiscountType
    discountValue: number
    userLimit: number
    supply: number
    usedCount: number
    status: CouponStatusType
    startDate: number
    endDate: number
}

type CouponStatusType = "active" | "inactive" | "expired";


export type {
    UserSchemaType,
    SessionType,
    SessionPlatformType,
    FolderSchemaType,
    FolderType,
    FolderPlatformType,
    ChatSchemaType,
    ChatPlatformType,
    PromptSchemaType,
    PlanSchemaType,
    CurrencyType,
    SubscriptionSchemaType,
    SubscriptionStatusType,
    PaymentSchemaType,
    PaymentStatusType,
    PaymentMethodType,
    UserRoleType,
    CouponCodeDiscountType,
    CouponSchemaType,
    CouponStatusType
}