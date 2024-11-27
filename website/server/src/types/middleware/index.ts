
interface GetDomainRootType {
    origin: OriginURLType | undefined,
    forCookie?: boolean
}

type OriginURLType = "https://chatgpt.com" | "https://claude.ai" | "https://botaddons.com" | "https://localhost:5173"

export type {
    GetDomainRootType,
    OriginURLType
}