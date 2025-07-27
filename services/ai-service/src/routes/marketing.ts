import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { requireRole } from '../middleware/auth';
import { aiService } from '../services/aiService';
import { db } from '../config/database';
import { logger, logMarketingCampaign } from '../utils/logger';

const router = Router();

// Create new marketing campaign
router.post('/campaigns', 
  requireRole(['admin', 'marketing']),
  asyncHandler(async (req, res) => {
    const { name, type, targetAudience, content, schedule } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        error: 'Campaign name and type are required'
      });
    }
    
    const result = await db.query(
      `INSERT INTO marketing_campaigns (name, type, target_audience, content, schedule)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, type, JSON.stringify(targetAudience), JSON.stringify(content), JSON.stringify(schedule)]
    );
    
    const campaign = result.rows[0];
    logMarketingCampaign(campaign.id, 'campaign_created', campaign);
    
    res.status(201).json({
      success: true,
      data: campaign
    });
  })
);

// Get all campaigns
router.get('/campaigns', 
  requireRole(['admin', 'marketing', 'analyst']),
  asyncHandler(async (req, res) => {
    const { status, type, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM marketing_campaigns WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;
    
    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }
    
    if (type) {
      paramCount++;
      query += ` AND type = $${paramCount}`;
      params.push(type);
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

// Get campaign by ID
router.get('/campaigns/:campaignId', 
  requireRole(['admin', 'marketing', 'analyst']),
  asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    
    const result = await db.query(
      'SELECT * FROM marketing_campaigns WHERE id = $1',
      [campaignId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  })
);

// Update campaign
router.put('/campaigns/:campaignId', 
  requireRole(['admin', 'marketing']),
  asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    const updateData = req.body;
    
    const allowedFields = ['name', 'type', 'status', 'target_audience', 'content', 'schedule'];
    const updateFields = Object.keys(updateData).filter(key => allowedFields.includes(key));
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }
    
    const setClause = updateFields.map((field, index) => {
      if (field === 'target_audience' || field === 'content' || field === 'schedule') {
        return `${field} = $${index + 2}::jsonb`;
      }
      return `${field} = $${index + 2}`;
    }).join(', ');
    
    const values = [campaignId, ...updateFields.map(field => 
      ['target_audience', 'content', 'schedule'].includes(field) 
        ? JSON.stringify(updateData[field])
        : updateData[field]
    )];
    
    const result = await db.query(
      `UPDATE marketing_campaigns 
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }
    
    logMarketingCampaign(campaignId, 'campaign_updated', updateData);
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  })
);

// Optimize campaign using AI
router.post('/campaigns/:campaignId/optimize', 
  requireRole(['admin', 'marketing']),
  asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    
    // Get campaign data
    const campaignResult = await db.query(
      'SELECT * FROM marketing_campaigns WHERE id = $1',
      [campaignId]
    );
    
    if (campaignResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }
    
    const campaignData = campaignResult.rows[0];
    
    // Mock performance data (in real app, this would come from analytics)
    const performanceData = {
      openRate: '15%',
      clickRate: '3%',
      conversionRate: '1.2%',
      revenue: 25000,
      feedback: ['Good messaging', 'Could be more personalized']
    };
    
    // Generate optimization recommendations
    const optimization = await aiService.generateCampaignOptimization(campaignData, performanceData);
    
    logMarketingCampaign(campaignId, 'campaign_optimized', optimization);
    
    res.json({
      success: true,
      data: optimization
    });
  })
);

// Generate personalized marketing message
router.post('/messages/generate', 
  requireRole(['admin', 'marketing']),
  asyncHandler(async (req, res) => {
    const { customerId, campaignType, productId, context } = req.body;
    
    if (!customerId || !campaignType) {
      return res.status(400).json({
        success: false,
        error: 'Customer ID and campaign type are required'
      });
    }
    
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
    
    // Generate customer insights for messaging
    const insights = await aiService.generateCustomerInsights(customerData);
    
    // Create personalized message context
    const messageContext = {
      customerName: customerData.name,
      customerSegment: insights.segment,
      preferredCategories: customerData.preferred_categories,
      campaignType,
      productId,
      context: context || {}
    };
    
    // Generate personalized message using AI
    const prompt = `
      Create a personalized marketing message for NATI (handcrafted Indian products):
      
      Customer: ${messageContext.customerName}
      Segment: ${messageContext.customerSegment}
      Preferred Categories: ${messageContext.preferredCategories?.join(', ')}
      Campaign Type: ${messageContext.campaignType}
      Product: ${messageContext.productId || 'General'}
      Context: ${JSON.stringify(messageContext.context)}
      
      Requirements:
      - Personalized and culturally sensitive
      - Highlight handcrafted nature and artisan stories
      - Include a clear call-to-action
      - Keep it under 150 words
      - Warm and authentic tone
      
      Return only the message text.
    `;
    
    const response = await aiService['generateResponse'](prompt);
    
    if (!response.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate message'
      });
    }
    
    const personalizedMessage = {
      customerId,
      message: response.content,
      campaignType,
      productId,
      generatedAt: new Date().toISOString(),
      context: messageContext
    };
    
    res.json({
      success: true,
      data: personalizedMessage
    });
  })
);

// Get campaign performance analytics
router.get('/campaigns/:campaignId/analytics', 
  requireRole(['admin', 'marketing', 'analyst']),
  asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    const { startDate, endDate } = req.query;
    
    // Get campaign data
    const campaignResult = await db.query(
      'SELECT * FROM marketing_campaigns WHERE id = $1',
      [campaignId]
    );
    
    if (campaignResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }
    
    const campaign = campaignResult.rows[0];
    
    // Mock analytics data (in real app, this would come from tracking systems)
    const analytics = {
      campaignId,
      campaignName: campaign.name,
      type: campaign.type,
      status: campaign.status,
      metrics: {
        totalSent: 1500,
        delivered: 1420,
        opened: 213,
        clicked: 45,
        converted: 12,
        revenue: 45000,
        openRate: '15%',
        clickRate: '3.2%',
        conversionRate: '0.8%',
        revenuePerEmail: 30
      },
      performance: {
        openRate: '15%',
        clickRate: '3.2%',
        conversionRate: '0.8%',
        revenue: 45000,
        roi: 2.5
      },
      audienceInsights: {
        topSegments: ['High-Value', 'Regular', 'New'],
        bestPerformingContent: 'Product recommendations',
        optimalSendTime: 'Tuesday 10 AM',
        engagementTrends: 'Increasing'
      },
      recommendations: [
        'Personalize subject lines based on customer preferences',
        'Send follow-up emails to non-openers',
        'Test different call-to-action buttons',
        'Segment audience by purchase history'
      ]
    };
    
    res.json({
      success: true,
      data: analytics
    });
  })
);

// A/B test campaign variations
router.post('/campaigns/:campaignId/ab-test', 
  requireRole(['admin', 'marketing']),
  asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    const { variations, testDuration, successMetric } = req.body;
    
    if (!variations || variations.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'At least 2 variations are required for A/B testing'
      });
    }
    
    // Create A/B test configuration
    const abTest = {
      campaignId,
      variations: variations.map((variation: any, index: number) => ({
        id: `var_${index + 1}`,
        name: variation.name,
        subject: variation.subject,
        content: variation.content,
        audiencePercentage: Math.floor(100 / variations.length)
      })),
      testDuration: testDuration || 7, // days
      successMetric: successMetric || 'conversion_rate',
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + (testDuration || 7) * 24 * 60 * 60 * 1000).toISOString()
    };
    
    logMarketingCampaign(campaignId, 'ab_test_created', abTest);
    
    res.status(201).json({
      success: true,
      data: abTest
    });
  })
);

export default router; 