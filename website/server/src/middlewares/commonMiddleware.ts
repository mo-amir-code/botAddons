import { apiHandler } from "../services/errorHandling/index.js";
import { OriginType } from "../types/index.js";
import { OriginURLType } from "../types/middleware/index.js";
import { getDomainRoot } from "../utils/middleware/index.js";

const commonMiddleware = apiHandler(async (req, res, next) => {
    console.log(req.origin)
    console.log(req.get("Origin"))
    const origin = req.get("Origin") as OriginURLType;
    req.origin = getDomainRoot({ origin: origin }).split(".")[0] as OriginType;
    req.user = {};
    next();
})

export {
    commonMiddleware
}