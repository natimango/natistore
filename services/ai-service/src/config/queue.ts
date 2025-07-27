import Queue from 'bull';
import { logger } from '../utils/logger';

let aiQueue: Queue.Queue | null = null;
let emailQueue: Queue.Queue | null = null;
let analyticsQueue: Queue.Queue | null = null;

export async function initializeQueue(): Promise<void> {
  try {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    };

    // AI Processing Queue
    aiQueue = new Queue('ai-processing', {
      redis: redisConfig,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        },
        removeOnComplete: 100,
        removeOnFail: 50
      }
    });

    // Email Queue
    emailQueue = new Queue('email-processing', {
      redis: redisConfig,
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 5000
        },
        removeOnComplete: 50,
        removeOnFail: 25
      }
    });

    // Analytics Queue
    analyticsQueue = new Queue('analytics-processing', {
      redis: redisConfig,
      defaultJobOptions: {
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 1000
        },
        removeOnComplete: 200,
        removeOnFail: 100
      }
    });

    // Set up queue event handlers
    [aiQueue, emailQueue, analyticsQueue].forEach(queue => {
      if (queue) {
        queue.on('completed', (job) => {
          logger.info(`Job ${job.id} completed successfully`, {
            queue: job.queue.name,
            jobType: job.name,
            duration: Date.now() - job.timestamp
          });
        });

        queue.on('failed', (job, err) => {
          logger.error(`Job ${job.id} failed`, {
            queue: job.queue.name,
            jobType: job.name,
            error: err.message,
            attempts: job.attemptsMade
          });
        });

        queue.on('error', (error) => {
          logger.error('Queue error:', error);
        });
      }
    });

    logger.info('Queue system initialized successfully');

  } catch (error) {
    logger.error('Queue initialization failed:', error);
    throw error;
  }
}

export function getAIQueue(): Queue.Queue {
  if (!aiQueue) {
    throw new Error('AI queue not initialized');
  }
  return aiQueue;
}

export function getEmailQueue(): Queue.Queue {
  if (!emailQueue) {
    throw new Error('Email queue not initialized');
  }
  return emailQueue;
}

export function getAnalyticsQueue(): Queue.Queue {
  if (!analyticsQueue) {
    throw new Error('Analytics queue not initialized');
  }
  return analyticsQueue;
}

export async function closeQueues(): Promise<void> {
  const queues = [aiQueue, emailQueue, analyticsQueue];
  
  for (const queue of queues) {
    if (queue) {
      await queue.close();
    }
  }
  
  aiQueue = null;
  emailQueue = null;
  analyticsQueue = null;
  
  logger.info('All queues closed');
} 