import { getFolderById } from "../../db/services/folder.db.service.js";
import {
  apiHandler,
  ErrorHandlerClass,
  ok,
} from "../../services/errorHandling/index.js";
import { AddChatsBodyType } from "../../types/controllers/v1/chat.js";
import { BAD_REQUEST_STATUS_CODE } from "../../utils/constants/common.js";
import {
  CHATS_ADDED_RES_MSG,
  SOMETHING_WENT_WRONG,
} from "../../utils/constants/serverResponseMessages.js";

const addChatsHandler = apiHandler(async (req, res, next) => {
  const { ids, folderId } = req.body as AddChatsBodyType;
  const folder = await getFolderById(folderId);

  if (!folder) {
    return next(
      new ErrorHandlerClass(SOMETHING_WENT_WRONG, BAD_REQUEST_STATUS_CODE)
    );
  }

  folder.chats.push(...ids);
  await folder.save();

  return ok({
    res,
    message: CHATS_ADDED_RES_MSG,
  });
});

export { addChatsHandler };
