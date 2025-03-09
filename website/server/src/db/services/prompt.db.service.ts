import { AddPromptBodyType } from "../../types/controllers/v1/prompt.js";
import { PromptSchemaType } from "../../types/db/schema/index.js";
import { Prompt } from "../models/index.js";

const getPrompts = async ({
  userId,
}: {
  userId: string;
}): Promise<PromptSchemaType[]> => {
  return await Prompt.find({ userId });
};

const createPrompt = async (
  data: AddPromptBodyType
): Promise<PromptSchemaType> => {
  return await Prompt.create(data);
};

export { createPrompt, getPrompts };
