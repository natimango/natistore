import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { authMiddleware } from './middleware/auth';

// Import routes
import customerRoutes from './routes/customer';
import marketingRoutes from './routes/marketing';
import analyticsRoutes from './routes/analytics';
import aiRoutes from './routes/ai';

// Import services
import { initializeAIService } from './services/aiService';
import { initializeDatabase } from './config/database';
import { initializeRedis } from './config/redis';
import { initializeQueue } from './config/queue';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.AI_SERVICE_PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'NATI AI Service',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API Routes
app.use('/api/v1/customers', authMiddleware, customerRoutes);
app.use('/api/v1/marketing', authMiddleware, marketingRoutes);
app.use('/api/v1/analytics', authMiddleware, analyticsRoutes);
app.use('/api/v1/ai', authMiddleware, aiRoutes);

// WebSocket connection for real-time updates
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('join-customer-room', (customerId: string) => {
    socket.join(`customer-${customerId}`);
    logger.info(`Client ${socket.id} joined customer room: ${customerId}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Initialize services
async function initializeServices() {
  try {
    logger.info('Initializing NATI AI Service...');
    
    // Initialize database
    await initializeDatabase();
    logger.info('Database initialized');
    
    // Initialize Redis
    await initializeRedis();
    logger.info('Redis initialized');
    
    // Initialize queue
    await initializeQueue();
    logger.info('Queue initialized');
    
    // Initialize AI service
    await initializeAIService();
    logger.info('AI service initialized');
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`🚀 NATI AI Service running on port ${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`🔗 API Documentation: http://localhost:${PORT}/api/v1/docs`);
    });
    
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Start the application
initializeServices(); 