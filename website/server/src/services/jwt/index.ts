import { JWT_SECRET_KEY } from "../../config/constants.js";
import jwt from "jsonwebtoken";
import { CURRENT_DATE_IN_JWT_FORM } from "../../utils/constants/common.js";
import { ACCESS_TOKEN_EXPIRY_TIME, REFRESH_TOKEN_EXPIRY_TIME } from "../../utils/constants/cookies.js";
import { GenerateRefreshAndAccessTokenType } from "../../types/services/jwt/index.js";
import { Schema } from "mongoose";

const isJwtTokenExpired = (token: string | undefined): boolean => {
    if (!token) {
        return true
    }

    const { exp } = jwt.verify(token, JWT_SECRET_KEY!) as { exp: number };

    if (CURRENT_DATE_IN_JWT_FORM > exp) {
        return true;
    }

    return false;
}

const generateRefreshAndAccessToken = async ({
    userId
}: {
    userId: Schema.Types.ObjectId
}): Promise<GenerateRefreshAndAccessTokenType> => {
    const refreshToken = await jwt.sign(
        { userId },
        JWT_SECRET_KEY as string,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY_TIME,
        }
    );
    const accessToken = await jwt.sign({ userId }, JWT_SECRET_KEY as string, {
        expiresIn: ACCESS_TOKEN_EXPIRY_TIME,
    });

    return {
        refreshToken,
        accessToken,
    };
};

export {
    isJwtTokenExpired,
    generateRefreshAndAccessToken
}