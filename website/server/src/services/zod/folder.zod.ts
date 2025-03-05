import { z } from "zod";
import { ZOD_REQUIRED_ERR } from "../../utils/constants/auth.js";

const createFolderZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "Title"),
    }),
    type: z.enum(["chats", "prompts"], {
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "Type"),
    }),
    parent: z.string().optional(),
  }),
});

const deleteFolderByIdZodSchema = z.object({
  body: z.object({
    ids: z
      .string({
        required_error: ZOD_REQUIRED_ERR.replace("{field}", "Folder/Files Ids"),
      })
      .array(),
    folderId: z.string().optional(),
  }),
});

const getFoldersByUserIdZodSchema = z.object({
  query: z.object({
    type: z.enum(["chats", "prompts"], {
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "Type"),
    }),
    id: z.string().optional(),
  }),
});

const updateFolderZodSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "Folder ID"),
    }),
    userId: z.string().optional(),
    title: z.string().optional(),
    type: z.string().optional(),
    platform: z.string().optional(),
  }),
});

export {
  createFolderZodSchema,
  deleteFolderByIdZodSchema,
  updateFolderZodSchema,
  getFoldersByUserIdZodSchema,
};
