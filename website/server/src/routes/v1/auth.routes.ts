import express, { Router } from "express";
import { zodValidation } from "../../services/zod/index.js";
import { registerUserZodSchema, signInUserZodSchema, verifyOTPZodSchema } from "../../services/zod/auth.zod.js";
import { registerUser, sendOTP, verifyOTP } from "../../controllers/v1/auth.controller.js";

const router: Router = express.Router();

router.post("/register", zodValidation(registerUserZodSchema), registerUser, sendOTP);
router.post("/signin", zodValidation(signInUserZodSchema), registerUser);
router.post("/verify", zodValidation(verifyOTPZodSchema), verifyOTP);

export default router;