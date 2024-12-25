import express, { Router } from "express";
import authRoutes from "./auth.routes.js";
import folderRoutes from "./folder.routes.js";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/folder", folderRoutes);

export default router;