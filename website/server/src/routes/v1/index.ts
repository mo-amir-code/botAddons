import express, { Router } from "express";
import authRoutes from "./auth.routes.js";
import folderRoutes from "./folder.routes.js";
import chatRoutes from "./chat.routes.js";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/folder", folderRoutes);
router.use("/chat", chatRoutes);

export default router;