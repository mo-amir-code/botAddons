// SERVER RESPONSE
const BAD_REQUEST_STATUS_CODE = 400;
const UNAUTHORIZED_REQUEST_STATUS_CODE = 401;


// JWT
const CURRENT_DATE_IN_JWT_FORM = Math.floor(Date.now() / 1000);

export {
    BAD_REQUEST_STATUS_CODE,
    UNAUTHORIZED_REQUEST_STATUS_CODE,
    CURRENT_DATE_IN_JWT_FORM
}

// MAIL 
const VERIFY_ACCOUNT_SUBJECT_MSG = "Your One-Time Password (OTP) for verify your account";
const VERIFY_ACCOUNT_BODY_MSG = "Your One-Time Password (OTP) for verifying your account is:";
const FORGOT_PASSWORD_REQUEST_SUBJECT_MSG = "Your One-Time Password (OTP) for reset your account"
const FORGOT_PASSWORD_REQUEST_BODY_MSG =
    "We received a request to change the password for your account. Please use the following One-Time Password (OTP) to proceed with the password change:";
const OTP_EXPIRY_IN_MINUTES = "15 Minutes"

export { VERIFY_ACCOUNT_SUBJECT_MSG, VERIFY_ACCOUNT_BODY_MSG, FORGOT_PASSWORD_REQUEST_BODY_MSG, FORGOT_PASSWORD_REQUEST_SUBJECT_MSG, OTP_EXPIRY_IN_MINUTES }


