import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import { errorHandler } from "./services/errorHandling/index.js";
import apiRoutes from "./routes/index.js";

const app: Express = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(apiRoutes);
app.use(errorHandler);

export {
    app
}