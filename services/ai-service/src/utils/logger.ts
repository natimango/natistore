import winston from 'winston';
import path from 'path';

const logDir = 'logs';

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'nati-ai-service' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // File transport for error logs
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // File transport for AI service specific logs
    new winston.transports.File({
      filename: path.join(logDir, 'ai-service.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log')
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log')
    })
  ]
});

// Create a stream object for Morgan HTTP logging
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};

// Helper functions for structured logging
export const logCustomerActivity = (customerId: string, action: string, data?: any) => {
  logger.info('Customer activity', {
    customerId,
    action,
    data,
    category: 'customer-activity'
  });
};

export const logAIOperation = (operation: string, input: any, output: any, executionTime: number) => {
  logger.info('AI operation completed', {
    operation,
    input,
    output,
    executionTime,
    category: 'ai-operation'
  });
};

export const logMarketingCampaign = (campaignId: string, action: string, data?: any) => {
  logger.info('Marketing campaign activity', {
    campaignId,
    action,
    data,
    category: 'marketing-campaign'
  });
};

export const logAnalyticsEvent = (eventType: string, data: any) => {
  logger.info('Analytics event', {
    eventType,
    data,
    category: 'analytics'
  });
};

export const logError = (error: Error, context?: any) => {
  logger.error('Application error', {
    error: error.message,
    stack: error.stack,
    context,
    category: 'error'
  });
};

export const logPerformance = (operation: string, duration: number, metadata?: any) => {
  logger.info('Performance metric', {
    operation,
    duration,
    metadata,
    category: 'performance'
  });
}; 