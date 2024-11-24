import { apiHandler, ok } from "../../services/errorHandling/index.js";


const registerUser = apiHandler(async (req, res, next) => {
    
    
    return ok({
        res,
        message: "Registered"
    })
});


export {
    registerUser
}