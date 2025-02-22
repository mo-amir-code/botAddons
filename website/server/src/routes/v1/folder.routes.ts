import express, { Router } from "express";
import { zodValidation } from "../../services/zod/index.js";
import {
  createFolderHandler,
  deleteFolderByIdHandler,
  getFolderFilesHandler,
  getFoldersHandler,
  updateFolderHandler,
} from "../../controllers/v1/folder.controller.js";
import {
  createFolderZodSchema,
  deleteFolderByIdZodSchema,
  getFoldersByUserIdZodSchema,
  getFoldersFilesZodSchema,
  updateFolderZodSchema,
} from "../../services/zod/folder.zod.js";

const router: Router = express.Router();

router.post("/", zodValidation(createFolderZodSchema), createFolderHandler);
router.delete(
  "/",
  zodValidation(deleteFolderByIdZodSchema),
  deleteFolderByIdHandler
);
router.patch("/", zodValidation(updateFolderZodSchema), updateFolderHandler);
router.get("/", zodValidation(getFoldersByUserIdZodSchema), getFoldersHandler);
router.get(
  "/files",
  zodValidation(getFoldersFilesZodSchema),
  getFolderFilesHandler
);

export default router;
