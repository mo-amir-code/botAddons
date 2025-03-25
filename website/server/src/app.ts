import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./services/errorHandling/index.js";
import apiRoutes from "./routes/index.js";
import { connectToMongo } from "./config/dbConnection.js";
import { commonMiddleware } from "./middlewares/commonMiddleware.js";
import morgan from "morgan";
import { WHITELISTED_ORIGINS } from "./config/constants.js";

const app: Express = express();

connectToMongo();
app.use(
  cors({
    origin: function (origin: any, callback: any) {
      if (WHITELISTED_ORIGINS.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("You are very chalak bro....."));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(commonMiddleware);
app.use(apiRoutes);
app.use(errorHandler);

export { app };
