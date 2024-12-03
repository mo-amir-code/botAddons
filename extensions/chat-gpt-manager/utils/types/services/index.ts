

interface FormatTimestampType {
    timestamp: string | number
    type: FormatTimestampTypeType
}

type FormatTimestampTypeType = "date" | "time" | "both"

export type {
    FormatTimestampType,
    FormatTimestampTypeType
}