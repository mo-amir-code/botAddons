import { getFolderById } from "../../db/services/folder.db.service.js";
import { createPrompt } from "../../db/services/prompt.db.service.js";
import {
  apiHandler,
  ErrorHandlerClass,
  ok,
} from "../../services/errorHandling/index.js";
import { AddPromptBodyType } from "../../types/controllers/v1/prompt.js";
import { BAD_REQUEST_STATUS_CODE } from "../../utils/constants/common.js";
import {
  CHATS_ADDED_RES_MSG,
  SOMETHING_WENT_WRONG,
} from "../../utils/constants/serverResponseMessages.js";

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
    message: CHATS_ADDED_RES_MSG,
    data: {
      promptId: newPrompt._id,
      updatedAt: newPrompt.updatedAt
    },
  });
});

export { addPromptHandler };
