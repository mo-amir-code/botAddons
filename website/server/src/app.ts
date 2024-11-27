import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import { errorHandler } from "./services/errorHandling/index.js";
import apiRoutes from "./routes/index.js";
import { connectToMongo } from "./config/dbConnection.js";
import { commonMiddleware } from "./middlewares/commonMiddleware.js";

const app: Express = express();

connectToMongo();
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(commonMiddleware)
app.use(apiRoutes);
app.use(errorHandler);

export {
    app
}