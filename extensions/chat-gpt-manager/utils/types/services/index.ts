

interface FormatTimestampType {
    timestamp: string
    type: FormatTimestampTypeType
}

type FormatTimestampTypeType = "date" | "time" | "both"

export type {
    FormatTimestampType,
    FormatTimestampTypeType
}