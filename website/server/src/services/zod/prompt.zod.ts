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

const updatePromptZodSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "ID"),
    }),
    title: z.string().optional(),
    content: z.string().optional(),
  }),
});

export { addPromptZodSchema, updatePromptZodSchema };
