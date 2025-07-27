import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redisClient: Redis | null = null;

export async function initializeRedis(): Promise<void> {
  try {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    };

    redisClient = new Redis(redisConfig);

    redisClient.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redisClient.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });

    redisClient.on('close', () => {
      logger.warn('Redis connection closed');
    });

    redisClient.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

    // Test connection
    await redisClient.ping();
    logger.info('Redis connection test successful');

  } catch (error) {
    logger.error('Redis initialization failed:', error);
    throw error;
  }
}

export function getRedisClient(): Redis {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}

export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis connection closed');
  }
} 