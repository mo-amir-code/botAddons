import { CookieOptions } from "express"


const ACCESS_TOKEN_EXPIRY_TIME = "7d";
const REFRESH_TOKEN_EXPIRY_TIME = "21d";

const SINGLE_MINUTE_IN_NUMBERS = 1000 * 60;
const TOKEN_AGE_15_MINUTE_IN_NUMBERS = 15 * SINGLE_MINUTE_IN_NUMBERS;

const SINGLE_DAY_IN_NUMBERS = SINGLE_MINUTE_IN_NUMBERS * 60 * 24;

const COOKIE_AGE_21_DAY = 21 * SINGLE_DAY_IN_NUMBERS;
const COOKIE_AGE_7_DAY = 7 * SINGLE_DAY_IN_NUMBERS;

const ACCESS_TOKEN_NAME = "accesstoken";
const REFRESH_TOKEN_NAME = "refreshtoken";
const OTP_TOKEN_NAME = "otptoken";

const commonCookieTokenOptions: CookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "none",
};

const accessCookieOptions: CookieOptions = {
    ...commonCookieTokenOptions,
    maxAge: COOKIE_AGE_21_DAY
};

const refreshCookieOptions: CookieOptions = {
    ...commonCookieTokenOptions,
    maxAge: COOKIE_AGE_7_DAY
};

const otpTokenCookieOptions: CookieOptions = {
    ...commonCookieTokenOptions,
    maxAge: TOKEN_AGE_15_MINUTE_IN_NUMBERS
};


export {
    accessCookieOptions,
    refreshCookieOptions,
    ACCESS_TOKEN_EXPIRY_TIME,
    REFRESH_TOKEN_EXPIRY_TIME,
    SINGLE_MINUTE_IN_NUMBERS,
    TOKEN_AGE_15_MINUTE_IN_NUMBERS,
    SINGLE_DAY_IN_NUMBERS,
    ACCESS_TOKEN_NAME,
    REFRESH_TOKEN_NAME,
    otpTokenCookieOptions,
    OTP_TOKEN_NAME
}