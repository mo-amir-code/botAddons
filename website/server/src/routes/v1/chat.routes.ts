import express, { Router } from "express";
import { zodValidation } from "../../services/zod/index.js";
import { addChatsZodSchema } from "../../services/zod/chat.zod.js";
import { addChatsHandler } from "../../controllers/v1/chat.controller.js";

const router: Router = express.Router();

router.post("/", zodValidation(addChatsZodSchema), addChatsHandler);

export default router;
