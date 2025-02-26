import { getFolderById } from "../../db/services/folder.db.service.js";
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

  return ok({
    res,
    message: CHATS_ADDED_RES_MSG,
  });
});

export { addPromptHandler };
