import { z } from "zod";
import { ZOD_REQUIRED_ERR } from "../../utils/constants/auth.js";

const addPromptZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "Title"),
    }),
    content: z.string({
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "Content"),
    }),
    folderId: z.string().optional(),
  }),
});

export { addPromptZodSchema };
