import express from "express";
import { zodValidation } from "../../services/zod/index.js";
import { addPromptZodSchema, updatePromptZodSchema } from "../../services/zod/prompt.zod.js";
import { addPromptHandler, getPromptHandler, updatePromptHandler } from "../../controllers/v1/prompt.controller.js";

const router = express.Router();

router.get("/", getPromptHandler);
router.post("/", zodValidation(addPromptZodSchema), addPromptHandler);
router.patch("/", zodValidation(updatePromptZodSchema), updatePromptHandler);

export default router;
