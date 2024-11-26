import { Request } from "express";
import { FromType, OriginType } from "./index.ts";

// Extend the Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any; // Add the 'user' property of any type
      origin: OriginType;
      from: FromType
    }
  }
}
