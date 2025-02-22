import { z } from "zod";
import { ZOD_REQUIRED_ERR } from "../../utils/constants/auth.js";

const createFolderZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "User ID"),
    }),
    title: z.string({
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "Title"),
    }),
    type: z.enum(["chats", "prompts"], {
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "Type"),
    }),
    platform: z.enum(["chatgpt", "claude", "all"], {
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "Type"),
    }),
  }),
});

const deleteFolderByIdZodSchema = z.object({
  body: z.object({
    folderId: z.string({
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "Folder ID"),
    }),
  }),
});

const getFoldersByUserIdZodSchema = z.object({
  query: z.object({
    userId: z.string({
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "User ID"),
    }),
    type: z.enum(["chats", "prompts"], {
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "Type"),
    }),
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

const getFoldersFilesZodSchema = z.object({
  query: z.object({
    id: z.string({
      required_error: ZOD_REQUIRED_ERR.replace("{field}", "Folder ID"),
    }),
  }),
});

export {
  createFolderZodSchema,
  deleteFolderByIdZodSchema,
  updateFolderZodSchema,
  getFoldersByUserIdZodSchema,
  getFoldersFilesZodSchema,
};
