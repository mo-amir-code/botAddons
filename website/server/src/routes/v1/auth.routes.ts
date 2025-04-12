import express from "express";
import { zodValidation } from "../../services/zod/index.js";
import {
  autoAuthZodSchema,
  forgotPasswordZodSchema,
  registerUserZodSchema,
  resetPasswordZodSchema,
  signInUserZodSchema,
  verifyOTPZodSchema,
} from "../../services/zod/auth.zod.js";
import {
  autoAuth,
  forgotPassword,
  registerUser,
  resetPassword,
  sendOTP,
  signInUser,
  verifyOTP,
} from "../../controllers/v1/auth.controller.js";

const router = express.Router();

router.post(
  "/register",
  zodValidation(registerUserZodSchema),
  registerUser,
  sendOTP
);
router.post("/signin", zodValidation(signInUserZodSchema), signInUser);
router.post("/verify", zodValidation(verifyOTPZodSchema), verifyOTP);
router.post(
  "/forgot-password",
  zodValidation(forgotPasswordZodSchema),
  forgotPassword,
  sendOTP
);
router.post(
  "/reset-password",
  zodValidation(resetPasswordZodSchema),
  resetPassword
);
router.post("/auto", zodValidation(autoAuthZodSchema), autoAuth);

export default router;
