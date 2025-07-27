import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { requireRole } from '../middleware/auth';
import { aiService } from '../services/aiService';
import { db } from '../config/database';
import { logger, logCustomerActivity } from '../utils/logger';

const router = Router();

// Get customer intelligence insights
router.get('/:customerId/insights', 
  requireRole(['admin', 'analyst', 'marketing']),
  asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    
    // Get customer data from database
    const customerResult = await db.query(
      'SELECT * FROM customer_intelligence WHERE customer_id = $1',
      [customerId]
    );
    
    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    const customerData = customerResult.rows[0];
    
    // Generate fresh insights using AI
    const insights = await aiService.generateCustomerInsights(customerData);
    
    logCustomerActivity(customerId, 'insights_generated', insights);
    
    res.json({
      success: true,
      data: insights
    });
  })
);

// Get customer recommendations
router.get('/:customerId/recommendations', 
  requireRole(['admin', 'analyst', 'marketing']),
  asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    const { limit = 5 } = req.query;
    
    // Get customer profile
    const customerResult = await db.query(
      'SELECT * FROM customer_intelligence WHERE customer_id = $1',
      [customerId]
    );
    
    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    const customerProfile = customerResult.rows[0];
    
    // Get available products (mock data for now)
    const availableProducts = [
      { id: 'prod1', name: 'Handcrafted Silver Necklace', category: 'Jewelry', price: 2500 },
      { id: 'prod2', name: 'Traditional Cotton Saree', category: 'Textiles', price: 3500 },
      { id: 'prod3', name: 'Brass Diya Set', category: 'Home Decor', price: 800 },
      { id: 'prod4', name: 'Wooden Spice Box', category: 'Home Decor', price: 1200 },
      { id: 'prod5', name: 'Embroidered Cushion Cover', category: 'Textiles', price: 600 }
    ];
    
    // Generate recommendations
    const recommendations = await aiService.generateProductRecommendations(
      customerProfile, 
      availableProducts
    );
    
    // Limit results
    const limitedRecommendations = recommendations.slice(0, Number(limit));
    
    logCustomerActivity(customerId, 'recommendations_generated', limitedRecommendations);
    
    res.json({
      success: true,
      data: limitedRecommendations
    });
  })
);

// Get customer churn prevention strategy
router.get('/:customerId/churn-prevention', 
  requireRole(['admin', 'analyst', 'marketing']),
  asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    
    // Get customer data
    const customerResult = await db.query(
      'SELECT * FROM customer_intelligence WHERE customer_id = $1',
      [customerId]
    );
    
    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    const customerData = customerResult.rows[0];
    
    // Calculate risk factors
    const daysSinceLastPurchase = customerData.last_purchase_date 
      ? Math.floor((Date.now() - new Date(customerData.last_purchase_date).getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    
    const riskFactors = {
      daysSinceLastPurchase,
      engagementLevel: customerData.engagement_score,
      complaints: customerData.complaints || [],
      competitorActivity: []
    };
    
    // Generate churn prevention strategy
    const prevention = await aiService.generateChurnPrevention(customerData, riskFactors);
    
    logCustomerActivity(customerId, 'churn_prevention_generated', prevention);
    
    res.json({
      success: true,
      data: prevention
    });
  })
);

// Update customer data
router.put('/:customerId', 
  requireRole(['admin', 'analyst']),
  asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    const updateData = req.body;
    
    const allowedFields = [
      'name', 'email', 'phone', 'total_orders', 'total_spent', 
      'average_order_value', 'preferred_categories', 'customer_segment',
      'churn_risk', 'lifetime_value', 'engagement_score'
    ];
    
    const updateFields = Object.keys(updateData).filter(key => allowedFields.includes(key));
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }
    
    const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [customerId, ...updateFields.map(field => updateData[field])];
    
    const result = await db.query(
      `UPDATE customer_intelligence 
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE customer_id = $1 
       RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    logCustomerActivity(customerId, 'customer_updated', updateData);
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  })
);

// Get customer journey events
router.get('/:customerId/journey', 
  requireRole(['admin', 'analyst', 'marketing']),
  asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    const { limit = 50, eventType } = req.query;
    
    let query = 'SELECT * FROM customer_journey_events WHERE customer_id = $1';
    const params = [customerId];
    
    if (eventType) {
      query += ' AND event_type = $2';
      params.push(eventType as string);
    }
    
    query += ' ORDER BY timestamp DESC LIMIT $' + (params.length + 1);
    params.push(Number(limit));
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  })
);

// Record customer journey event
router.post('/:customerId/journey', 
  requireRole(['admin', 'analyst', 'marketing']),
  asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    const { eventType, eventData, sessionId, pageUrl, ipAddress, userAgent } = req.body;
    
    if (!eventType) {
      return res.status(400).json({
        success: false,
        error: 'Event type is required'
      });
    }
    
    const result = await db.query(
      `INSERT INTO customer_journey_events 
       (customer_id, event_type, event_data, session_id, page_url, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [customerId, eventType, JSON.stringify(eventData), sessionId, pageUrl, ipAddress, userAgent]
    );
    
    logCustomerActivity(customerId, 'journey_event_recorded', { eventType, eventData });
    
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  })
);

// Get customer analytics summary
router.get('/:customerId/analytics', 
  requireRole(['admin', 'analyst', 'marketing']),
  asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    
    // Get customer intelligence data
    const customerResult = await db.query(
      'SELECT * FROM customer_intelligence WHERE customer_id = $1',
      [customerId]
    );
    
    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    const customerData = customerResult.rows[0];
    
    // Get journey events count by type
    const eventsResult = await db.query(
      `SELECT event_type, COUNT(*) as count 
       FROM customer_journey_events 
       WHERE customer_id = $1 
       GROUP BY event_type`,
      [customerId]
    );
    
    // Get recent recommendations
    const recommendationsResult = await db.query(
      `SELECT * FROM product_recommendations 
       WHERE customer_id = $1 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [customerId]
    );
    
    // Get recent insights
    const insightsResult = await db.query(
      `SELECT * FROM ai_insights 
       WHERE customer_id = $1 AND insight_type = 'customer_intelligence'
       ORDER BY generated_at DESC 
       LIMIT 1`,
      [customerId]
    );
    
    const analytics = {
      customer: customerData,
      journeyEvents: eventsResult.rows,
      recentRecommendations: recommendationsResult.rows,
      latestInsight: insightsResult.rows[0] || null,
      summary: {
        totalEvents: eventsResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
        totalRecommendations: recommendationsResult.rows.length,
        lastActivity: customerData.updated_at,
        engagementLevel: customerData.engagement_score
      }
    };
    
    res.json({
      success: true,
      data: analytics
    });
  })
);

export default router; 