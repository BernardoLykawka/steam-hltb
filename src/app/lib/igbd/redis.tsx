import Redis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("A variável de ambiente REDIS_URL não está definida.");
}

const redis = new Redis(process.env.REDIS_URL);

export default redis;
