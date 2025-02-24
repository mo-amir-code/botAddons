// Privated Credentials
const APP_PORT = process.env.APP_PORT;
const PROF_EMAIL = process.env.PROF_EMAIL;
const PROF_EMAIL_PASS = process.env.PROF_EMAIL_PASS;
const BCRYPT_SALT_ROUND = Number.parseInt(
  process.env.BCRYPT_SALT_ROUND || "12"
);
const ROOT_DOMAIN = process.env.ROOT_DOMAIN;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const DB_URI = process.env.DB_URI!;
const COMPANY_NAME = process.env.COMPANY_NAME;
const ENVIRONMENT = process.env.ENVIRONMENT;

export {
  APP_PORT,
  PROF_EMAIL,
  PROF_EMAIL_PASS,
  BCRYPT_SALT_ROUND,
  ROOT_DOMAIN,
  JWT_SECRET_KEY,
  DB_URI,
  COMPANY_NAME,
  ENVIRONMENT,
};

// DOMAIN's
const CHAT_GPT_DOMAIN = "https://chatgpt.com";
const CLAUDE_DOMAIN = "https://claude.ai";

export { CHAT_GPT_DOMAIN, CLAUDE_DOMAIN };

// DB Schema's Name
const CHAT_COLLECTION_NAME = "Chat";
const COUPON_COLLECTION_NAME = "Coupon";
const FOLDER_COLLECTION_NAME = "Folder";
const PAYMENT_COLLECTION_NAME = "Payment";
const PLAN_COLLECTION_NAME = "Plan";
const PROMPT_COLLECTION_NAME = "Prompt";
const SUBSCRIPTION_COLLECTION_NAME = "Subscription";
const USER_COLLECTION_NAME = "User";

//Client Origins
const CLIENT_ORIGINS = ["https://chatgpt.com"];

export {
  CHAT_COLLECTION_NAME,
  COUPON_COLLECTION_NAME,
  FOLDER_COLLECTION_NAME,
  PAYMENT_COLLECTION_NAME,
  PLAN_COLLECTION_NAME,
  PROMPT_COLLECTION_NAME,
  SUBSCRIPTION_COLLECTION_NAME,
  USER_COLLECTION_NAME,
  CLIENT_ORIGINS
};
