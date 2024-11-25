import { CookieOptions } from "express"
import { ROOT_DOMAIN } from "../../config/constants.js"


const ACCESS_TOKEN_EXPIRY_TIME = "2d";
const REFRESH_TOKEN_EXPIRY_TIME = "8d";

const SINGLE_DAY_IN_NUMBERS = 1000 * 60 * 60 * 24;

const COOKIE_AGE_8_DAY = 8 * 24 * 60 * 60 * 1000;
const COOKIE_AGE_2_DAY = 2 * 24 * 60 * 60 * 1000;

const ACCESS_TOKEN_NAME = "accesstoken";
const REFRESH_TOKEN_NAME = "refreshtoken";


const accessCookieOptions: CookieOptions = {
    maxAge: COOKIE_AGE_2_DAY,
    domain: ROOT_DOMAIN,
    secure: true,
    httpOnly: true,
    sameSite: "none"
}


const refreshCookieOptions: CookieOptions = {
    maxAge: COOKIE_AGE_8_DAY,
    domain: ROOT_DOMAIN,
    secure: true,
    httpOnly: true,
    sameSite: "none"
}


export {
    accessCookieOptions,
    refreshCookieOptions,
    ACCESS_TOKEN_EXPIRY_TIME,
    REFRESH_TOKEN_EXPIRY_TIME,
    SINGLE_DAY_IN_NUMBERS,
    ACCESS_TOKEN_NAME,
    REFRESH_TOKEN_NAME
}