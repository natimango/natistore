import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

const rateLimitConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
};

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  // Get or create rate limit data for this IP
  let rateLimitData = requestCounts.get(clientIP);
  
  if (!rateLimitData || now > rateLimitData.resetTime) {
    // Reset or create new rate limit data
    rateLimitData = {
      count: 1,
      resetTime: now + rateLimitConfig.windowMs
    };
    requestCounts.set(clientIP, rateLimitData);
  } else {
    // Increment request count
    rateLimitData.count++;
  }
  
  // Check if rate limit exceeded
  if (rateLimitData.count > rateLimitConfig.maxRequests) {
    logger.warn('Rate limit exceeded', {
      ip: clientIP,
      count: rateLimitData.count,
      maxRequests: rateLimitConfig.maxRequests
    });
    
    return res.status(429).json({
      success: false,
      error: rateLimitConfig.message,
      retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000)
    });
  }
  
  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
    'X-RateLimit-Remaining': (rateLimitConfig.maxRequests - rateLimitData.count).toString(),
    'X-RateLimit-Reset': new Date(rateLimitData.resetTime).toISOString()
  });
  
  next();
};

// Clean up old rate limit data periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(ip);
    }
  }
}, 60 * 1000); // Clean up every minute 