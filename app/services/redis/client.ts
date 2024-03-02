import Redis from "ioredis";

const connectionUrl = `redis://default:${process.env.REDIS_TOKEN!}@${process.env
	.REDIS_URL!}:${process.env.REDIS_PORT!}`;

export const redis = new Redis(connectionUrl);
