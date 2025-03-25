import { Redis } from "@upstash/redis";
import { REDIS_TOKEN, REDIS_URL } from "../../config/constants.js";

let redisClient:any;

if (REDIS_URL && REDIS_TOKEN) {
  try {
    redisClient = new Redis({
      url: REDIS_URL,
      token: REDIS_TOKEN,
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log("Redis connected");
  }
}

export { redisClient };
