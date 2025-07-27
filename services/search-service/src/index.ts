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
import searchRoutes from './routes/search';
import indexingRoutes from './routes/indexing';
import suggestionsRoutes from './routes/suggestions';

// Import services
import { initializeDatabase } from './config/database';
import { initializeRedis } from './config/redis';
import { initializeElasticsearch } from './config/elasticsearch';
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

const PORT = process.env.SEARCH_SERVICE_PORT || 3006;

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
    service: 'NATI Search Service',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API Routes
app.use('/api/v1/search', authMiddleware, searchRoutes);
app.use('/api/v1/indexing', authMiddleware, indexingRoutes);
app.use('/api/v1/suggestions', authMiddleware, suggestionsRoutes);

// WebSocket connection for real-time search updates
io.on('connection', (socket) => {
  logger.info(`Search client connected: ${socket.id}`);
  
  socket.on('subscribe-search-updates', (searchId: string) => {
    socket.join(`search-${searchId}`);
    logger.info(`Client ${socket.id} subscribed to search updates: ${searchId}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Search client disconnected: ${socket.id}`);
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
    logger.info('Initializing NATI Search Service...');
    
    // Initialize database
    await initializeDatabase();
    logger.info('Database initialized');
    
    // Initialize Redis
    await initializeRedis();
    logger.info('Redis initialized');
    
    // Initialize Elasticsearch
    await initializeElasticsearch();
    logger.info('Elasticsearch initialized');
    
    // Initialize queue
    await initializeQueue();
    logger.info('Queue initialized');
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`🚀 NATI Search Service running on port ${PORT}`);
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