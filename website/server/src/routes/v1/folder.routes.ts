import express from "express";
import { zodValidation } from "../../services/zod/index.js";
import {
  createFolderHandler,
  deleteFolderByIdHandler,
  getFoldersHandler,
  updateFolderHandler,
} from "../../controllers/v1/folder.controller.js";
import {
  createFolderZodSchema,
  deleteFolderByIdZodSchema,
  getFoldersByUserIdZodSchema,
  updateFolderZodSchema,
} from "../../services/zod/folder.zod.js";

const router = express.Router();

router.post("/", zodValidation(createFolderZodSchema), createFolderHandler);
router.delete(
  "/",
  zodValidation(deleteFolderByIdZodSchema),
  deleteFolderByIdHandler
);
router.patch("/", zodValidation(updateFolderZodSchema), updateFolderHandler);
router.get("/", zodValidation(getFoldersByUserIdZodSchema), getFoldersHandler);

export default router;
