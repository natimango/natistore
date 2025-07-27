import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

const config: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'nati_ai',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000')
};

class Database {
  private pool: Pool;
  private static instance: Database;

  private constructor() {
    this.pool = new Pool(config);
    
    this.pool.on('error', (err) => {
      logger.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const client = await this.getClient();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}

export const db = Database.getInstance();

export async function initializeDatabase(): Promise<void> {
  try {
    // Test connection
    const result = await db.query('SELECT NOW()');
    logger.info('Database connected successfully');
    
    // Create tables if they don't exist
    await createTables();
    logger.info('Database tables initialized');
    
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}

async function createTables(): Promise<void> {
  const tables = [
    // Customer Intelligence Table
    `CREATE TABLE IF NOT EXISTS customer_intelligence (
      id SERIAL PRIMARY KEY,
      customer_id VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255),
      name VARCHAR(255),
      phone VARCHAR(50),
      total_orders INTEGER DEFAULT 0,
      total_spent DECIMAL(10,2) DEFAULT 0,
      average_order_value DECIMAL(10,2) DEFAULT 0,
      last_purchase_date TIMESTAMP,
      first_purchase_date TIMESTAMP,
      preferred_categories TEXT[],
      customer_segment VARCHAR(100),
      churn_risk VARCHAR(20),
      lifetime_value DECIMAL(10,2) DEFAULT 0,
      engagement_score INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Marketing Campaigns Table
    `CREATE TABLE IF NOT EXISTS marketing_campaigns (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100) NOT NULL,
      status VARCHAR(50) DEFAULT 'draft',
      target_audience JSONB,
      content JSONB,
      schedule JSONB,
      metrics JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // AI Insights Table
    `CREATE TABLE IF NOT EXISTS ai_insights (
      id SERIAL PRIMARY KEY,
      customer_id VARCHAR(255),
      insight_type VARCHAR(100) NOT NULL,
      insight_data JSONB NOT NULL,
      confidence_score DECIMAL(3,2),
      generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP,
      is_active BOOLEAN DEFAULT true
    )`,

    // Product Recommendations Table
    `CREATE TABLE IF NOT EXISTS product_recommendations (
      id SERIAL PRIMARY KEY,
      customer_id VARCHAR(255),
      product_id VARCHAR(255),
      recommendation_score DECIMAL(3,2),
      reason TEXT,
      category VARCHAR(100),
      price DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP
    )`,

    // Pricing Intelligence Table
    `CREATE TABLE IF NOT EXISTS pricing_intelligence (
      id SERIAL PRIMARY KEY,
      product_id VARCHAR(255) NOT NULL,
      current_price DECIMAL(10,2),
      recommended_price DECIMAL(10,2),
      competitor_prices JSONB,
      demand_forecast JSONB,
      pricing_strategy VARCHAR(100),
      confidence_score DECIMAL(3,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Inventory Forecasting Table
    `CREATE TABLE IF NOT EXISTS inventory_forecasting (
      id SERIAL PRIMARY KEY,
      product_id VARCHAR(255) NOT NULL,
      current_stock INTEGER,
      predicted_demand INTEGER,
      recommended_reorder_quantity INTEGER,
      reorder_point INTEGER,
      lead_time_days INTEGER,
      forecast_period VARCHAR(50),
      confidence_score DECIMAL(3,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Customer Journey Events Table
    `CREATE TABLE IF NOT EXISTS customer_journey_events (
      id SERIAL PRIMARY KEY,
      customer_id VARCHAR(255) NOT NULL,
      event_type VARCHAR(100) NOT NULL,
      event_data JSONB,
      session_id VARCHAR(255),
      page_url VARCHAR(500),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ip_address INET,
      user_agent TEXT
    )`,

    // AI Service Logs Table
    `CREATE TABLE IF NOT EXISTS ai_service_logs (
      id SERIAL PRIMARY KEY,
      service_name VARCHAR(100) NOT NULL,
      operation VARCHAR(100) NOT NULL,
      status VARCHAR(50) NOT NULL,
      request_data JSONB,
      response_data JSONB,
      error_message TEXT,
      execution_time_ms INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const table of tables) {
    await db.query(table);
  }

  // Create indexes for better performance
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_customer_intelligence_customer_id ON customer_intelligence(customer_id)',
    'CREATE INDEX IF NOT EXISTS idx_customer_intelligence_segment ON customer_intelligence(customer_segment)',
    'CREATE INDEX IF NOT EXISTS idx_customer_intelligence_churn_risk ON customer_intelligence(churn_risk)',
    'CREATE INDEX IF NOT EXISTS idx_ai_insights_customer_id ON ai_insights(customer_id)',
    'CREATE INDEX IF NOT EXISTS idx_ai_insights_type ON ai_insights(insight_type)',
    'CREATE INDEX IF NOT EXISTS idx_product_recommendations_customer_id ON product_recommendations(customer_id)',
    'CREATE INDEX IF NOT EXISTS idx_customer_journey_events_customer_id ON customer_journey_events(customer_id)',
    'CREATE INDEX IF NOT EXISTS idx_customer_journey_events_timestamp ON customer_journey_events(timestamp)',
    'CREATE INDEX IF NOT EXISTS idx_ai_service_logs_created_at ON ai_service_logs(created_at)'
  ];

  for (const index of indexes) {
    await db.query(index);
  }
} 