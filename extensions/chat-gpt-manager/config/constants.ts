const SERVER_ORIGIN = "http://localhost:8080"

export { SERVER_ORIGIN }

// HTML INJECT ID's
const SIDEBAR_ELEMENT_INJECT_ID =
  "nav > div:nth-of-type(2) > div > div:nth-of-type(3)"
const PROMPT_INPUT_ELEMENT_INJECT_ID = "#prompt-textarea > p"
const PROMPT_LIST_ELEMENT_INJECT_ID = "main form > div"

export {
  SIDEBAR_ELEMENT_INJECT_ID,
  PROMPT_INPUT_ELEMENT_INJECT_ID,
  PROMPT_LIST_ELEMENT_INJECT_ID
}

// TOAST
const TOAST_TIME_IN_MS = 3000

export { TOAST_TIME_IN_MS }

// TOAST Messages
const CHAT_TOAST_MSG = "Chat {msg} successfully"
const ITEMS_DELETE_MSG = "Items has been deleted"
const CHATS_ADDED_MSG = "Chats added"
const FOLDER_EDIT_MSG = "Folder edited"
const FOLDER_ADD_MSG = "Folder created"
const LANGUAGE_SELECTED_MSG = "{name} is applied"
const SELECT_ERR_MSG = "Please select any item"

export {
  CHAT_TOAST_MSG,
  ITEMS_DELETE_MSG,
  CHATS_ADDED_MSG,
  FOLDER_EDIT_MSG,
  FOLDER_ADD_MSG,
  LANGUAGE_SELECTED_MSG,
  SELECT_ERR_MSG
}
