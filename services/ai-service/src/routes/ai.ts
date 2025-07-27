import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { requireRole } from '../middleware/auth';
import { aiService } from '../services/aiService';
import { db } from '../config/database';
import { logger } from '../utils/logger';

const router = Router();

// Test AI service connection
router.get('/test', 
  requireRole(['admin', 'analyst']),
  asyncHandler(async (req, res) => {
    const testResult = await aiService.testConnection();
    
    res.json({
      success: testResult.success,
      data: {
        status: testResult.success ? 'connected' : 'error',
        message: testResult.content,
        error: testResult.error,
        timestamp: new Date().toISOString()
      }
    });
  })
);

// Generate pricing strategy for a product
router.post('/pricing-strategy', 
  requireRole(['admin', 'analyst']),
  asyncHandler(async (req, res) => {
    const { productData, marketData } = req.body;
    
    if (!productData || !productData.id) {
      return res.status(400).json({
        success: false,
        error: 'Product data with ID is required'
      });
    }
    
    const strategy = await aiService.generatePricingStrategy(productData, marketData || {});
    
    res.json({
      success: true,
      data: strategy
    });
  })
);

// Generate inventory forecast
router.post('/inventory-forecast', 
  requireRole(['admin', 'analyst']),
  asyncHandler(async (req, res) => {
    const { productData, historicalData } = req.body;
    
    if (!productData || !productData.id) {
      return res.status(400).json({
        success: false,
        error: 'Product data with ID is required'
      });
    }
    
    const forecast = await aiService.generateInventoryForecast(productData, historicalData || {});
    
    res.json({
      success: true,
      data: forecast
    });
  })
);

// Batch generate insights for multiple customers
router.post('/batch-insights', 
  requireRole(['admin', 'analyst']),
  asyncHandler(async (req, res) => {
    const { customerIds, insightTypes } = req.body;
    
    if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Customer IDs array is required'
      });
    }
    
    const results = [];
    
    for (const customerId of customerIds) {
      try {
        // Get customer data
        const customerResult = await db.query(
          'SELECT * FROM customer_intelligence WHERE customer_id = $1',
          [customerId]
        );
        
        if (customerResult.rows.length === 0) {
          results.push({
            customerId,
            success: false,
            error: 'Customer not found'
          });
          continue;
        }
        
        const customerData = customerResult.rows[0];
        
        // Generate insights based on requested types
        const insights: any = {};
        
        if (!insightTypes || insightTypes.includes('customer_intelligence')) {
          insights.customerIntelligence = await aiService.generateCustomerInsights(customerData);
        }
        
        if (insightTypes && insightTypes.includes('churn_prevention')) {
          const riskFactors = {
            daysSinceLastPurchase: customerData.last_purchase_date 
              ? Math.floor((Date.now() - new Date(customerData.last_purchase_date).getTime()) / (1000 * 60 * 60 * 24))
              : 999,
            engagementLevel: customerData.engagement_score,
            complaints: [],
            competitorActivity: []
          };
          insights.churnPrevention = await aiService.generateChurnPrevention(customerData, riskFactors);
        }
        
        results.push({
          customerId,
          success: true,
          insights
        });
        
      } catch (error) {
        results.push({
          customerId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    res.json({
      success: true,
      data: {
        totalProcessed: customerIds.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      }
    });
  })
);

// Get AI service logs
router.get('/logs', 
  requireRole(['admin']),
  asyncHandler(async (req, res) => {
    const { serviceName, operation, status, limit = 100, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM ai_service_logs WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;
    
    if (serviceName) {
      paramCount++;
      query += ` AND service_name = $${paramCount}`;
      params.push(serviceName);
    }
    
    if (operation) {
      paramCount++;
      query += ` AND operation = $${paramCount}`;
      params.push(operation);
    }
    
    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(Number(limit), Number(offset));
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  })
);

// Get AI insights by type
router.get('/insights/:insightType', 
  requireRole(['admin', 'analyst']),
  asyncHandler(async (req, res) => {
    const { insightType } = req.params;
    const { customerId, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM ai_insights WHERE insight_type = $1';
    const params: any[] = [insightType];
    let paramCount = 1;
    
    if (customerId) {
      paramCount++;
      query += ` AND customer_id = $${paramCount}`;
      params.push(customerId);
    }
    
    query += ` ORDER BY generated_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(Number(limit), Number(offset));
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  })
);

// Generate content for marketing materials
router.post('/content-generation', 
  requireRole(['admin', 'marketing']),
  asyncHandler(async (req, res) => {
    const { contentType, context, targetAudience, tone, length } = req.body;
    
    if (!contentType || !context) {
      return res.status(400).json({
        success: false,
        error: 'Content type and context are required'
      });
    }
    
    const prompt = `
      Generate ${contentType} content for NATI (handcrafted Indian products):
      
      Context: ${context}
      Target Audience: ${targetAudience || 'General Indian consumers'}
      Tone: ${tone || 'Warm and authentic'}
      Length: ${length || 'Medium'}
      
      Requirements:
      - Highlight the handcrafted nature and artisan stories
      - Be culturally sensitive and authentic
      - Include relevant product mentions where appropriate
      - Maintain the specified tone throughout
      - Focus on the unique value proposition of handcrafted Indian products
      
      Return the content in a clear, well-structured format.
    `;
    
    const response = await aiService['generateResponse'](prompt);
    
    if (!response.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate content'
      });
    }
    
    const generatedContent = {
      contentType,
      content: response.content,
      context,
      targetAudience,
      tone,
      length,
      generatedAt: new Date().toISOString(),
      usage: response.usage
    };
    
    res.json({
      success: true,
      data: generatedContent
    });
  })
);

// Analyze customer sentiment
router.post('/sentiment-analysis', 
  requireRole(['admin', 'analyst']),
  asyncHandler(async (req, res) => {
    const { text, customerId, source } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text content is required for sentiment analysis'
      });
    }
    
    const prompt = `
      Analyze the sentiment of this customer feedback for NATI (handcrafted Indian products):
      
      Text: "${text}"
      Source: ${source || 'Unknown'}
      Customer ID: ${customerId || 'Unknown'}
      
      Please provide a comprehensive sentiment analysis in JSON format:
      {
        "sentiment": "positive/negative/neutral",
        "confidence": "confidence score 0-1",
        "emotions": ["array of detected emotions"],
        "keyTopics": ["array of key topics mentioned"],
        "suggestions": ["array of improvement suggestions"],
        "priority": "high/medium/low"
      }
    `;
    
    const response = await aiService['generateResponse'](prompt);
    
    if (!response.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to analyze sentiment'
      });
    }
    
    try {
      const analysis = JSON.parse(response.content);
      
      const sentimentResult = {
        text,
        customerId,
        source,
        analysis,
        analyzedAt: new Date().toISOString(),
        usage: response.usage
      };
      
      res.json({
        success: true,
        data: sentimentResult
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to parse sentiment analysis result'
      });
    }
  })
);

export default router; 