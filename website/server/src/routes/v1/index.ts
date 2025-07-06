import express from "express";
import authRoutes from "./auth.routes.js";
import folderRoutes from "./folder.routes.js";
import chatRoutes from "./chat.routes.js";
import promptRoutes from "./prompt.routes.js";
import { isUserAuthenticated } from "../../middlewares/auth.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/folder", isUserAuthenticated, folderRoutes);
router.use("/chat", isUserAuthenticated, chatRoutes);
router.use("/prompt", isUserAuthenticated, promptRoutes);

router.get("/ping", (_req, res) => {
  res.json("pong");
});

export default router;
