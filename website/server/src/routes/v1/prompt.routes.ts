import express, { Router } from "express";
import { zodValidation } from "../../services/zod/index.js";
import { addPromptZodSchema } from "../../services/zod/prompt.zod.js";
import { addPromptHandler } from "../../controllers/v1/prompt.controller.js";

const router: Router = express.Router();

router.post("/", zodValidation(addPromptZodSchema), addPromptHandler);

export default router;
