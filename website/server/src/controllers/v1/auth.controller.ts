import { createUser, getUserByIDorEmail } from "../../db/services/user.db.service.js";
import { apiHandler, ErrorHandlerClass, ok } from "../../services/errorHandling/index.js";
import { RegisterUserType, SignInUserType } from "../../types/controllers/v1/auth.js";
import { BAD_REQUEST_STATUS_CODE, UNAUTHORIZED_REQUEST_STATUS_CODE } from "../../utils/constants/common.js";
import { EMAIL_OR_PASS_IS_WRONG_RES_MSG, USER_ALREADY_REGISTERED_RES_MSG, USER_IS_NOT_REGISTERED_RES_MSG } from "../../utils/constants/serverResponseMessages.js";
import { compareHash, convertToHash } from "../../utils/controllers/v1/auth.utils.js";


const registerUser = apiHandler(async (req, res, next) => {
    const data = req.body as RegisterUserType;
    const isUserExist = await getUserByIDorEmail(data.email);

    if (isUserExist && isUserExist?.isVerified) {
        return next(new ErrorHandlerClass(USER_ALREADY_REGISTERED_RES_MSG, BAD_REQUEST_STATUS_CODE));
    } else if (isUserExist) {
        req.user.id = isUserExist.id;
        return next();
    } else {
        const newData = {
            ...data,
            password: await convertToHash(data.password)
        }
        const newUser = await createUser(newData);
        req.user.id = newUser.id;
        return next();
    }
});

const sendOtp = apiHandler(async (req, res, next) => {
    // const { userId, from, email } = req.body;
    // const user: UserType | null = await User.findById(userId);

    // if (!user) {
    //   return next(new ErrorHandler("User not found.", 400));
    // }

    // let saltRoundString: string | undefined = BCRYPT_SALT_ROUND;

    // if (!jwtSecretKey || !saltRoundString) {
    //   return next(new ErrorHandler("Internal Error Occurred!", 500));
    // }

    // const otp: number = generateOTP();
    // const otpToken: string = jwt.sign({ userId: user._id }, jwtSecretKey, { expiresIn:JWT_AGE_15_MIN });

    // let mailOption: MailOptions;

    // if (!from) {
    //   mailOption = {
    //     to: [user.email],
    //     subject: "OTP to verify your account.",
    //     html: createEmailTemplate({name:user.name, link:`${CLIENT_ORIGIN}/auth/verify?token=${otpToken}`, message:VERIFY_ACCOUNT_MSG, otp, expireTime:OTP_EXPIRY_IN_MINUTES}),
    //   };
    // } else if (from === "forgotPassword") {
    //   mailOption = {
    //     to: [user.email],
    //     subject: "OTP to change your password.",
    //     html: createEmailTemplate({name:user.name, link:`${CLIENT_ORIGIN}/auth/reset-password?token=${otpToken}`, message:CHANGE_ACCOUNT_PASS, otp, expireTime:OTP_EXPIRY_IN_MINUTES}),
    //   };
    // } else{
    //   mailOption = {
    //     to: [email],
    //     subject: "OTP to verify your new email.",
    //     html: createEmailTemplate({name: user.name, message: CHANGE_EMAIL_MSG, expireTime:OTP_EXPIRY_IN_MINUTES, otp}),
    //   };
    // }

    // const { success, msg } =  await sendMail(mailOption);

    // if(!success){
    //   return next(new ErrorHandler(msg, 400));
    // }


    // let saltRound: number = parseInt(saltRoundString);

    // const otpHash: string = await bcrypt.hash(otp.toString(), saltRound);

    // user.otp = otpHash;
    // user.otpExpiry =  Date.now() + 15 * 60 * 1000;
    // user.otpToken = otpToken;
    // await user.save();

    // res.cookie("otptoken", otpToken, {
    //   maxAge:  COOKIE_AGE_15_MIN, // 15 minutes
    //   domain: ROOT_DOMAIN, // Set to the root domain
    //   secure: true, // Ensure the cookie is sent only over HTTPS
    //   httpOnly: true,  // Makes the cookie accessible only via HTTP(S) requests, not JavaScript 
    //   sameSite: 'none'
    // });

    // return res.status(200).json({
    //   success: true,
    //   message: "OTP sent successfully"
    // });
});



const signInUser = apiHandler(async (req, res, next) => {
    const data = req.body as SignInUserType;

    const user = await getUserByIDorEmail(data.email);
    if (!user) {
        return next(new ErrorHandlerClass(USER_IS_NOT_REGISTERED_RES_MSG, UNAUTHORIZED_REQUEST_STATUS_CODE));
    }

    const isPassCorrect = await compareHash(user.password, data.password);
    if(!isPassCorrect) {
        return next(new ErrorHandlerClass(EMAIL_OR_PASS_IS_WRONG_RES_MSG, UNAUTHORIZED_REQUEST_STATUS_CODE));
    }

    

});



export {
    registerUser,
    signInUser
}