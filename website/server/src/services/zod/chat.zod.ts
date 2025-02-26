import { z } from "zod";
import { ZOD_REQUIRED_ERR } from "../../utils/constants/auth.js";

const addChatsZodSchema = z.object({
  body: z.object({
    ids: z
      .string({
        required_error: ZOD_REQUIRED_ERR.replace("{field}", "Chat Ids"),
      })
      .array(),
    folderId: z.string({
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "Folder Id"),
    }),
  }),
});

export { addChatsZodSchema };
