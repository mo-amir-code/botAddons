import { Request } from "express";

// Extend the Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any; // Add the 'user' property of any type
    }
  }
}
