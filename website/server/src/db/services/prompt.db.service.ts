import {
  AddPromptBodyType,
  UpdatePromptBodyType,
} from "../../types/controllers/v1/prompt.js";
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

const findPromptByIdAndUpdate = async (
  data: UpdatePromptBodyType
): Promise<PromptSchemaType | null> => {
  return await Prompt.findByIdAndUpdate(data.id, { ...data });
};

export { createPrompt, getPrompts, findPromptByIdAndUpdate };
