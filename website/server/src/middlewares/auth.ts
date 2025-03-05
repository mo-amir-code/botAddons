import { getUserByIDorEmail } from "../db/services/user.db.service.js";
import {
  apiHandler,
  ErrorHandlerClass,
} from "../services/errorHandling/index.js";
import { generateRefreshAndAccessToken } from "../services/jwt/index.js";
import { OriginType } from "../types/index.js";
import { UNAUTHORIZED_REQUEST_STATUS_CODE } from "../utils/constants/common.js";
import {
  ACCESS_TOKEN_NAME,
  accessCookieOptions,
} from "../utils/constants/cookies.js";
import {
  SESSION_EXPIRED_RES_MSG,
  UNAUTHORIZED_REQUEST_RES_MSG,
} from "../utils/constants/serverResponseMessages.js";
import {
  getDomainURL,
  JWTTokenVerifier,
} from "../utils/controllers/v1/auth.utils.js";
import jwt from "jsonwebtoken";
import { getDomainRoot } from "../utils/middleware/index.js";

const isUserAuthenticated = apiHandler(async (req, res, next) => {
  const { accesstoken } = req.cookies;
  const origin = req.origin as OriginType;

  if (!accesstoken) {
    return next(
      new ErrorHandlerClass(
        UNAUTHORIZED_REQUEST_RES_MSG,
        UNAUTHORIZED_REQUEST_STATUS_CODE
      )
    );
  }

  let payload = JWTTokenVerifier(accesstoken);
  if (payload) {
    req.user.id = payload.userId;
    return next();
  }

  payload = jwt.decode(accesstoken) as any;

  if (!payload) {
    return next(
      new ErrorHandlerClass(
        UNAUTHORIZED_REQUEST_RES_MSG,
        UNAUTHORIZED_REQUEST_STATUS_CODE
      )
    );
  }

  const user = await getUserByIDorEmail({ type: "id", data: payload.userId });

  if (!user) {
    return next(
      new ErrorHandlerClass(
        UNAUTHORIZED_REQUEST_RES_MSG,
        UNAUTHORIZED_REQUEST_STATUS_CODE
      )
    );
  }

  const session = user.sessions?.find((s) => s.platform === origin);

  if (!session) {
    return next(
      new ErrorHandlerClass(
        UNAUTHORIZED_REQUEST_RES_MSG,
        UNAUTHORIZED_REQUEST_STATUS_CODE
      )
    );
  }

  payload = JWTTokenVerifier(session.refreshToken);

  if (payload) {
    const { accessToken } = await generateRefreshAndAccessToken({
      userId: user._id,
    });

    const domainRoot = getDomainRoot({
      origin: getDomainURL(origin),
      forCookie: true,
    });

    res.cookie(ACCESS_TOKEN_NAME, accessToken, {
      ...accessCookieOptions,
      domain: domainRoot,
    });

    req.user.id = user._id;
    return next();
  }

  return next(
    new ErrorHandlerClass(
      SESSION_EXPIRED_RES_MSG,
      UNAUTHORIZED_REQUEST_STATUS_CODE
    )
  );
});

export { isUserAuthenticated };
