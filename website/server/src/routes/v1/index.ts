import express, { Router } from "express";
import authRoutes from "./auth.routes.js";
import folderRoutes from "./folder.routes.js";
import { isUserAuthenticated } from "../../middlewares/auth.js";

const router: Router = express.Router();

router.use("/auth", authRoutes);
router.use("/folder", isUserAuthenticated, folderRoutes);

export default router;
