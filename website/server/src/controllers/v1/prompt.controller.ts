import { Prompt } from "../../db/models/index.js";
import {
  createPrompt,
  findPromptByIdAndUpdate,
  getPrompts,
} from "../../db/services/prompt.db.service.js";
import {
  apiHandler,
  ErrorHandlerClass,
  ok,
} from "../../services/errorHandling/index.js";
import { redisClient } from "../../services/redis/connect.js";
import {
  getFolderRedisKey,
  getPromptRedisKey,
} from "../../services/redis/helper.js";
import {
  AddPromptBodyType,
  UpdatePromptBodyType,
} from "../../types/controllers/v1/prompt.js";
import { PromptSchemaType } from "../../types/db/schema/index.js";
import { CONFLICT_REQUEST_STATUS_CODE } from "../../utils/constants/common.js";
import {
  PROMPT_ADDED_RES_MSG,
  PROMPT_DUPLICATE_RES_MSG,
  PROMPT_UPDATED_RES_MSG,
  PROMPTS_FETCHED_RES_MSG,
} from "../../utils/constants/serverResponseMessages.js";

const getPromptHandler = apiHandler(async (req, res) => {
  const userId = req.user.id;

  const key = getPromptRedisKey({ userId });
  const cachedData = await redisClient?.get(key);

  if (cachedData) {
    return ok({
      res,
      message: PROMPTS_FETCHED_RES_MSG,
      data: JSON.parse(cachedData),
    });
  }

  let prompts: any = await getPrompts({ userId });
  prompts = prompts.map((prompt: PromptSchemaType) => {
    return {
      id: prompt._id,
      title: prompt.title,
      content: prompt.content,
    };
  });

  await redisClient?.set(key, JSON.stringify(prompts));

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

  let dbQuery: any = { title, userId };
  if (folderId) dbQuery["folderId"] = folderId;
  const prompt = await Prompt.findOne(dbQuery);

  if (prompt) {
    return next(
      new ErrorHandlerClass(
        PROMPT_DUPLICATE_RES_MSG,
        CONFLICT_REQUEST_STATUS_CODE
      )
    );
  }

  const newPrompt = await createPrompt(data);

  const key = getFolderRedisKey({ userId, type: "prompts", root: folderId });
  let cachedData = await redisClient?.get(key);

  if (cachedData) {
    cachedData = JSON.parse(cachedData);
    const nPrompt = {
      id: newPrompt._id,
      title: newPrompt.title,
      content: newPrompt.content,
      isFolder: false,
      createdAt: newPrompt.createdAt,
      updatedAt: newPrompt.updatedAt,
    };
    cachedData.items.push(nPrompt);
    await redisClient?.set(key, JSON.stringify(cachedData));
  }

  return ok({
    res,
    message: PROMPT_ADDED_RES_MSG,
    data: {
      promptId: newPrompt._id,
      updatedAt: newPrompt.updatedAt,
    },
  });
});

const updatePromptHandler = apiHandler(async (req, res) => {
  const data = req.body as UpdatePromptBodyType;
  const prompt = (await findPromptByIdAndUpdate(data)) as PromptSchemaType;

  const key = getFolderRedisKey({
    userId: req.user.id,
    type: "prompts",
    root: prompt.folderId?.toString(),
  });
  let cachedData = await redisClient?.get(key);

  if (cachedData) {
    cachedData = JSON.parse(cachedData);
    cachedData.items = cachedData.items.map((it: any) => {
      let obj = { ...it };
      if (obj.id == prompt._id) {
        obj["title"] = prompt.title;
        obj["content"] = prompt.content;
      }
      return obj;
    });
    await redisClient?.set(key, JSON.stringify(cachedData));
  }

  return ok({
    res,
    message: PROMPT_UPDATED_RES_MSG,
  });
});

export { addPromptHandler, getPromptHandler, updatePromptHandler };
