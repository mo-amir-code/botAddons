import express, { Router } from "express";
import { zodValidation } from "../../services/zod/index.js";
import { registerUserZodSchema, signInUserZodSchema } from "../../services/zod/auth.zod.js";
import { registerUser } from "../../controllers/v1/auth.controller.js";

const router: Router = express.Router();

router.post("/register", zodValidation(registerUserZodSchema), registerUser)
router.post("/signin", zodValidation(signInUserZodSchema), registerUser)

export default router;