import {
  createPrompt,
  getPrompts,
} from "../../db/services/prompt.db.service.js";
import { apiHandler, ok } from "../../services/errorHandling/index.js";
import { AddPromptBodyType } from "../../types/controllers/v1/prompt.js";
import { PromptSchemaType } from "../../types/db/schema/index.js";
import {
  PROMPT_ADDED_RES_MSG,
  PROMPTS_FETCHED_RES_MSG,
} from "../../utils/constants/serverResponseMessages.js";

const getPromptHandler = apiHandler(async (req, res) => {
  const userId = req.user.id;

  let prompts: any = await getPrompts({ userId });
  prompts = prompts.map((prompt: PromptSchemaType) => {
    return {
      id: prompt._id,
      title: prompt.title,
      content: prompt.content,
    };
  });

  return ok({
    res,
    message: PROMPTS_FETCHED_RES_MSG,
    data: prompts,
  });
});

const addPromptHandler = apiHandler(async (req, res, next) => {
  const { title, content, folderId } = req.body as AddPromptBodyType;
  const userId = req.user.id;

  const data = {
    title,
    content,
    folderId,
    userId,
  };

  const newPrompt = await createPrompt(data);

  return ok({
    res,
    message: PROMPT_ADDED_RES_MSG,
    data: {
      promptId: newPrompt._id,
      updatedAt: newPrompt.updatedAt,
    },
  });
});

export { addPromptHandler, getPromptHandler };
