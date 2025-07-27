import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { CustomError } from './errorHandler';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new CustomError('Access denied. No token provided.', 401);
    }
    
    const secret = process.env.JWT_SECRET || 'nati-secret-key';
    const decoded = jwt.verify(token, secret) as any;
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions || []
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new CustomError('Invalid token.', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new CustomError('Token expired.', 401));
    } else {
      next(error);
    }
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new CustomError('Authentication required.', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new CustomError('Insufficient permissions.', 403));
    }
    
    next();
  };
};

export const requirePermission = (permissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new CustomError('Authentication required.', 401));
    }
    
    const hasPermission = permissions.some(permission => 
      req.user!.permissions.includes(permission)
    );
    
    if (!hasPermission) {
      return next(new CustomError('Insufficient permissions.', 403));
    }
    
    next();
  };
}; 