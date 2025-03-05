import { Schema } from "mongoose";
import {
  createUser,
  findUserByIdAndUpdate,
  getUserByIDorEmail,
} from "../../db/services/user.db.service.js";
import {
  apiHandler,
  ErrorHandlerClass,
  ok,
} from "../../services/errorHandling/index.js";
import { generateRefreshAndAccessToken } from "../../services/jwt/index.js";
import {
  RegisterUserType,
  SignInUserType,
} from "../../types/controllers/v1/auth.js";
import {
  BAD_REQUEST_STATUS_CODE,
  FORGOT_PASSWORD_REQUEST_BODY_MSG,
  FORGOT_PASSWORD_REQUEST_SUBJECT_MSG,
  UNAUTHORIZED_REQUEST_STATUS_CODE,
  VERIFY_ACCOUNT_BODY_MSG,
  VERIFY_ACCOUNT_SUBJECT_MSG,
} from "../../utils/constants/common.js";
import {
  EMAIL_OR_PASS_IS_WRONG_RES_MSG,
  OTP_EXPIRED_RES_MSG,
  OTP_IS_INCORRECT_RES_MSG,
  OTP_SENT_RES_MSG,
  PASS_CHANGED_RES_MSG,
  SOMETHING_WENT_WRONG,
  USER_ALREADY_REGISTERED_RES_MSG,
  USER_IS_NOT_EXIST_RES_MSG,
  USER_IS_NOT_REGISTERED_RES_MSG,
  USER_IS_NOT_VERIFIED_RES_MSG,
  USER_LOGGED_IN_RES_MSG,
  USER_VERIFIED_RES_MSG,
} from "../../utils/constants/serverResponseMessages.js";
import {
  compareHash,
  convertToHash,
  generateHashCode,
  generateOTP,
  generateOTPToken,
  getDomainURL,
  JWTTokenVerifier,
} from "../../utils/controllers/v1/auth.utils.js";
import { OriginType } from "../../types/index.js";
import {
  ACCESS_TOKEN_NAME,
  accessCookieOptions,
  OTP_TOKEN_NAME,
  otpTokenCookieOptions,
  TOKEN_AGE_15_MINUTE_IN_NUMBERS,
} from "../../utils/constants/cookies.js";
import { SendMailType } from "../../types/nodemailer/index.js";
import { createEmailTemplate } from "../../services/nodemailer/templates.js";
import { UserSchemaType } from "../../types/db/schema/index.js";
import { sendMail } from "../../services/nodemailer/sendMail.js";
import { getDomainRoot } from "../../utils/middleware/index.js";
import { Response } from "express";
import { ENVIRONMENT } from "../../config/constants.js";

const registerUser = apiHandler(async (req, res, next) => {
  const data = req.body as RegisterUserType;
  const isUserExist = await getUserByIDorEmail({
    data: data.email,
    type: "email",
  });

  if (isUserExist && isUserExist?.isVerified) {
    return next(
      new ErrorHandlerClass(
        USER_ALREADY_REGISTERED_RES_MSG,
        BAD_REQUEST_STATUS_CODE
      )
    );
  } else if (isUserExist) {
    req.user.id = isUserExist._id;
    return next();
  } else {
    const newData = {
      ...data,
      password: await convertToHash(data.password),
    };
    const newUser = await createUser(newData);
    req.user.id = newUser._id;
    return next();
  }
});

const sendOTP = apiHandler(async (req, res, next) => {
  const origin = req.origin;
  const userId = req.user.id;

  const user = await getUserByIDorEmail({ data: userId, type: "id" });

  if (!user) {
    return next(
      new ErrorHandlerClass(
        SOMETHING_WENT_WRONG,
        UNAUTHORIZED_REQUEST_STATUS_CODE
      )
    );
  }

  const domainURL = getDomainURL(origin);

  const otp: number = generateOTP();
  const otpToken: string = await generateOTPToken({
    userId,
  });

  let mailOption: SendMailType;

  switch (req.from) {
    case "forgot-password":
      mailOption = {
        to: [(user as UserSchemaType).email],
        subject: FORGOT_PASSWORD_REQUEST_SUBJECT_MSG,
        html: createEmailTemplate({
          otp,
          expireTime: TOKEN_AGE_15_MINUTE_IN_NUMBERS,
          message: FORGOT_PASSWORD_REQUEST_BODY_MSG,
          name: (user as UserSchemaType).fullName,
          link: `${domainURL}/auth/verify?token=${otpToken}`,
        }),
      };
      break;
    default:
      mailOption = {
        to: [(user as UserSchemaType).email],
        subject: VERIFY_ACCOUNT_SUBJECT_MSG,
        html: createEmailTemplate({
          otp,
          expireTime: TOKEN_AGE_15_MINUTE_IN_NUMBERS,
          message: VERIFY_ACCOUNT_BODY_MSG,
          name: (user as UserSchemaType).fullName,
          link: `${domainURL}/auth/verify?token=${otpToken}`,
        }),
      };
  }

  await sendMail(mailOption);

  const otpHash: string = await generateHashCode(otp.toString());

  user.otp = otpHash;
  user.otpToken = otpToken;
  await user.save();

  const domainRoot = getDomainRoot({ origin: domainURL, forCookie: true });

  res.cookie(OTP_TOKEN_NAME, otpToken, {
    ...otpTokenCookieOptions,
    domain: domainRoot,
  });

  return ok({
    res,
    message: OTP_SENT_RES_MSG,
  });
});

const verifyOTP = apiHandler(async (req, res, next) => {
  const { otp, otptoken: OT } = req.body;
  const OT_FROM_COOKIE = req.cookies?.otptoken;
  const otptoken = OT || OT_FROM_COOKIE;

  if (!otptoken) {
    return next(
      new ErrorHandlerClass(
        SOMETHING_WENT_WRONG,
        UNAUTHORIZED_REQUEST_STATUS_CODE
      )
    );
  }

  const payload = JWTTokenVerifier(otptoken);

  if (!payload) {
    return next(
      new ErrorHandlerClass(OTP_EXPIRED_RES_MSG, BAD_REQUEST_STATUS_CODE)
    );
  }

  const user = await getUserByIDorEmail({ data: payload.userId, type: "id" });

  if (!user) {
    return next(
      new ErrorHandlerClass(
        SOMETHING_WENT_WRONG,
        UNAUTHORIZED_REQUEST_STATUS_CODE
      )
    );
  }

  const isOTPCorrect = await compareHash(user.otp as string, otp.toString());

  if (!isOTPCorrect) {
    return next(
      new ErrorHandlerClass(
        OTP_IS_INCORRECT_RES_MSG,
        UNAUTHORIZED_REQUEST_STATUS_CODE
      )
    );
  }

  const updatedFields = {
    otp: undefined,
    otptoken: undefined,
    isVerified: true,
  };

  await findUserByIdAndUpdate({
    id: user._id as Schema.Types.ObjectId,
    ...updatedFields,
  });

  return ok({
    res,
    message: USER_VERIFIED_RES_MSG,
  });
});

const signInUser = apiHandler(async (req, res, next) => {
  const data = req.body as SignInUserType;
  const origin = req.origin as OriginType;

  const user = await getUserByIDorEmail({ data: data.email, type: "email" });

  if (!user) {
    return next(
      new ErrorHandlerClass(
        USER_IS_NOT_REGISTERED_RES_MSG,
        UNAUTHORIZED_REQUEST_STATUS_CODE
      )
    );
  }

  if (!user.isVerified) {
    return next(
      new ErrorHandlerClass(
        USER_IS_NOT_VERIFIED_RES_MSG,
        UNAUTHORIZED_REQUEST_STATUS_CODE
      )
    );
  }

  const isPassCorrect = await compareHash(user.password, data.password);

  if (!isPassCorrect) {
    return next(
      new ErrorHandlerClass(
        EMAIL_OR_PASS_IS_WRONG_RES_MSG,
        UNAUTHORIZED_REQUEST_STATUS_CODE
      )
    );
  }

  await handleSetCookies({ user, origin, res });

  return ok({
    res,
    message: USER_LOGGED_IN_RES_MSG,
  });
});

const forgotPassword = apiHandler(async (req, res, next) => {
  const { email } = await req.body;

  const user = await getUserByIDorEmail({ data: email, type: "email" });

  if (!user) {
    return next(new ErrorHandlerClass(USER_IS_NOT_REGISTERED_RES_MSG, 400));
  }

  req.user.id = user._id;
  req.from = "forgot-password";
  next();
});

const resetPassword = apiHandler(async (req, res, next) => {
  const { otp, otptoken: OT, newPassword } = req.body;

  let otptoken = OT;

  if (!otptoken) {
    otptoken = req.cookies?.otptoken;
  }

  if (!otptoken) {
    return next(
      new ErrorHandlerClass(
        SOMETHING_WENT_WRONG,
        UNAUTHORIZED_REQUEST_STATUS_CODE
      )
    );
  }

  const jwtPayload = JWTTokenVerifier(otptoken);

  if (!jwtPayload) {
    return next(new ErrorHandlerClass(OTP_EXPIRED_RES_MSG, 401));
  }

  const user = await getUserByIDorEmail({
    data: jwtPayload.userId,
    type: "id",
  });

  if (!user) {
    return next(
      new ErrorHandlerClass(
        SOMETHING_WENT_WRONG,
        UNAUTHORIZED_REQUEST_STATUS_CODE
      )
    );
  }

  const isOTPCorrect = await compareHash(user.otp || "", otp.toString());

  if (!isOTPCorrect) {
    return next(
      new ErrorHandlerClass(
        OTP_IS_INCORRECT_RES_MSG,
        UNAUTHORIZED_REQUEST_STATUS_CODE
      )
    );
  }

  const hashedPassword = await generateHashCode(newPassword);

  const updatedUser = {
    id: user._id as Schema.Types.ObjectId,
    password: hashedPassword,
    otp: undefined,
    otptoken: undefined,
  };
  await findUserByIdAndUpdate(updatedUser);

  return ok({
    res,
    message: PASS_CHANGED_RES_MSG,
  });
});

const autoAuth = apiHandler(async (req, res, next) => {
  const { email } = req.body as { email: string };
  const { accesstoken } = req.cookies;
  const origin = req.origin as OriginType;
  const user = await getUserByIDorEmail({ type: "email", data: email });

  if (!user) {
    return next(
      new ErrorHandlerClass(USER_IS_NOT_EXIST_RES_MSG, BAD_REQUEST_STATUS_CODE)
    );
  }

  const payload = JWTTokenVerifier(accesstoken);
  
  if (!payload) {
    await handleSetCookies({ user, origin, res });
  }

  return ok({
    message: USER_LOGGED_IN_RES_MSG,
    res,
  });
});

// Common function to set cookie while authentication
const handleSetCookies = async ({
  user,
  origin,
  res,
}: {
  user: UserSchemaType;
  origin: OriginType;
  res: Response;
}) => {
  const { accessToken, refreshToken } = await generateRefreshAndAccessToken({
    userId: user._id as Schema.Types.ObjectId,
  });

  let userSessions = user.sessions || [];

  const isRefreshTokenExist = userSessions.find((s) => s.platform === origin);

  const newSession = {
    platform: origin,
    refreshToken: refreshToken,
  };

  if (isRefreshTokenExist) {
    const payload = JWTTokenVerifier(isRefreshTokenExist.refreshToken);

    if (!payload) {
      const idx = userSessions.findIndex((s) => s.platform === origin);
      userSessions[idx] = newSession;
    }
  }

  if (!userSessions?.length || !isRefreshTokenExist) {
    userSessions = [...userSessions, newSession];
  }

  user.sessions = userSessions;

  await user.save();
  const domainRoot = getDomainRoot({
    origin: ENVIRONMENT === "development" ? undefined : getDomainURL(origin),
    forCookie: true,
  });

  res.cookie(ACCESS_TOKEN_NAME, accessToken, {
    ...accessCookieOptions,
    domain: domainRoot,
  });
};

export {
  registerUser,
  signInUser,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  autoAuth,
};
