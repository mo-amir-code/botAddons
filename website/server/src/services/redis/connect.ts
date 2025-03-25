import { Redis } from "ioredis";
import { REDIS_URI } from "../../config/constants.js";

let redisClient: any;

if (REDIS_URI) {
  try {
    redisClient = new Redis(REDIS_URI, {
      connectTimeout: 10000,
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log("Redis connected");
  }
}

export { redisClient };
