import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { ErrorHandlerClass } from "../errorHandling/index.js";
import { BAD_REQUEST_STATUS_CODE } from "../../utils/constants/common.js";


const zodValidation = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        })
        return next();
    } catch (error: any) {
        const msgs = JSON.parse(error?.message);
        return next(new ErrorHandlerClass(msgs[0]?.message, BAD_REQUEST_STATUS_CODE));
    }
}

export {
    zodValidation
}