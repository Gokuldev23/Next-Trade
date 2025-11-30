import { Redis } from "@upstash/redis";

declare const globalThis: {
  upstashRedis?: Redis;
};

const redis =
  globalThis.upstashRedis ??
  new Redis({
    url: process.env.REDIS_URL!,
    token: process.env.REDIS_TOKEN!,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.upstashRedis = redis;
}

export const getRedisClient = () => redis