import { Document, Schema, Types } from "mongoose"


interface MongoDBSchemaDefaultFieldType extends Document {
    _id: Types.ObjectId
    createdAt: Date;
    updatedAt: Date;
}


interface UserSchemaType extends Document {
    fullName: string
    email: string
    password: string
    sessions?: SessionType[]
    otp?: string
    otpToken?: string
}

type SessionType = {
    platform: SessionPlatformType
    sessionId: string
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
    amount: number
    status: PaymentStatusType
    paymentDate: number
    paymentMethod: PaymentMethodType
}

type PaymentStatusType = "success" | "failed" | "pending";
type PaymentMethodType = "upi" | "card" | "net banking";


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
    PaymentMethodType
}