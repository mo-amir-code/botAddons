import bcrypt from "bcrypt"
import { BCRYPT_SALT_ROUND, JWT_SECRET_KEY } from "../../../config/constants.js"
import { OriginType } from "../../../types/index.js"
import { TOKEN_AGE_15_MINUTE_IN_NUMBERS } from "../../constants/cookies.js"
import jwt from "jsonwebtoken";
import { JWTTokenVerifierType } from "../../../types/controllers/v1/auth.js";

const convertToHash = async (data: string): Promise<string> => {
    return await bcrypt.hash(data, BCRYPT_SALT_ROUND)
}

const compareHash = async (bufferString: string, plainText: string): Promise<boolean> => {
    return await bcrypt.compare(bufferString, plainText)
}

const getDomainRoot = (origin: OriginType): string => {
    switch (origin) {
        case "chatgpt":
            return "https://chatgpt.com"
        case "claude":
            return "https://claude.ai"
        default:
            return "https://botAddons.com"
    }
}

const generateOTP = (): number => {
    return Math.floor(100000 + Math.random() * 900000);
};

const generateOTPToken = async ({
    userId
}: {
    userId: number
}): Promise<string> => {
    const token = await jwt.sign({ userId }, JWT_SECRET_KEY as string, {
        expiresIn: TOKEN_AGE_15_MINUTE_IN_NUMBERS,
    });
    return token;
};

const generateHashCode = async (str: string): Promise<string> => {
    const hashedString = await bcrypt.hash(str, BCRYPT_SALT_ROUND);
    return hashedString;
};

const JWTTokenVerifier = (token: string): JWTTokenVerifierType | null => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY as string) as JWTTokenVerifierType;
    } catch (err) {
        return null;
    }
};


export {
    convertToHash,
    compareHash,
    getDomainRoot,
    generateOTP,
    generateOTPToken,
    generateHashCode,
    JWTTokenVerifier
}