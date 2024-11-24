import { z } from "zod";
import { ZOD_REQUIRED_ERR } from "../../utils/constants/auth.js";

const registerUserZodSchema = z.object({
    body: z.object({
        fullName: z.string({
            required_error: ZOD_REQUIRED_ERR.replace("{field}", "Full name")
        }),
        email: z.string({
            required_error: ZOD_REQUIRED_ERR.replace("{field}", "Email")
        }).email("Not a valid email"),
        password: z.string({
            required_error: ZOD_REQUIRED_ERR.replace("{field}", "Password")
        }).min(6, "Password length must be at least 6 characters")
    })
})


export {
    registerUserZodSchema
}