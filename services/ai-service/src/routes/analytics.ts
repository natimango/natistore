import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { requireRole } from '../middleware/auth';
import { db } from '../config/database';
import { logger, logAnalyticsEvent } from '../utils/logger';

const router = Router();

// Get overall business analytics
router.get('/overview', 
  requireRole(['admin', 'analyst']),
  asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    
    // Mock comprehensive analytics data
    const analytics = {
      period: {
        startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: endDate || new Date().toISOString()
      },
      revenue: {
        total: 1250000,
        growth: 15.5,
        averageOrderValue: 2500,
        topProducts: [
          { name: 'Handcrafted Silver Necklace', revenue: 125000, units: 50 },
          { name: 'Traditional Cotton Saree', revenue: 98000, units: 28 },
          { name: 'Brass Diya Set', revenue: 75000, units: 94 }
        ]
      },
      customers: {
        total: 2500,
        new: 180,
        returning: 2320,
        churnRate: 2.1,
        lifetimeValue: 4500,
        segments: {
          highValue: 250,
          regular: 1250,
          new: 1000
        }
      },
      marketing: {
        campaigns: 12,
        emailOpenRate: 18.5,
        clickRate: 4.2,
        conversionRate: 2.1,
        roi: 3.2
      },
      inventory: {
        totalProducts: 450,
        lowStock: 25,
        outOfStock: 8,
        turnoverRate: 4.2
      },
      aiInsights: {
        totalInsights: 1250,
        accuracy: 87.5,
        recommendations: 890,
        conversions: 156
      }
    };
    
    logAnalyticsEvent('overview_accessed', analytics);
    
    res.json({
      success: true,
      data: analytics
    });
  })
);

// Get customer analytics
router.get('/customers', 
  requireRole(['admin', 'analyst']),
  asyncHandler(async (req, res) => {
    const { segment, limit = 20, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM customer_intelligence WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;
    
    if (segment) {
      paramCount++;
      query += ` AND customer_segment = $${paramCount}`;
      params.push(segment);
    }
    
    query += ` ORDER BY total_spent DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(Number(limit), Number(offset));
    
    const result = await db.query(query, params);
    
    // Calculate additional metrics
    const customers = result.rows.map(customer => ({
      ...customer,
      lifetimeValue: customer.lifetime_value,
      engagementScore: customer.engagement_score,
      churnRisk: customer.churn_risk,
      lastActivity: customer.updated_at
    }));
    
    res.json({
      success: true,
      data: customers,
      count: customers.length,
      summary: {
        totalCustomers: result.rows.length,
        averageLifetimeValue: result.rows.reduce((sum, c) => sum + parseFloat(c.lifetime_value || 0), 0) / result.rows.length,
        averageEngagement: result.rows.reduce((sum, c) => sum + (c.engagement_score || 0), 0) / result.rows.length
      }
    });
  })
);

// Get product analytics
router.get('/products', 
  requireRole(['admin', 'analyst']),
  asyncHandler(async (req, res) => {
    const { category, limit = 20, offset = 0 } = req.query;
    
    // Mock product analytics data
    const products = [
      {
        id: 'prod1',
        name: 'Handcrafted Silver Necklace',
        category: 'Jewelry',
        revenue: 125000,
        unitsSold: 50,
        averageRating: 4.8,
        views: 1250,
        conversions: 4.0,
        inventory: 15,
        trend: 'increasing'
      },
      {
        id: 'prod2',
        name: 'Traditional Cotton Saree',
        category: 'Textiles',
        revenue: 98000,
        unitsSold: 28,
        averageRating: 4.6,
        views: 890,
        conversions: 3.1,
        inventory: 8,
        trend: 'stable'
      },
      {
        id: 'prod3',
        name: 'Brass Diya Set',
        category: 'Home Decor',
        revenue: 75000,
        unitsSold: 94,
        averageRating: 4.9,
        views: 2100,
        conversions: 4.5,
        inventory: 45,
        trend: 'increasing'
      }
    ];
    
    const filteredProducts = category 
      ? products.filter(p => p.category.toLowerCase() === (category as string).toLowerCase())
      : products;
    
    const paginatedProducts = filteredProducts.slice(Number(offset), Number(offset) + Number(limit));
    
    res.json({
      success: true,
      data: paginatedProducts,
      count: paginatedProducts.length,
      total: filteredProducts.length,
      summary: {
        totalRevenue: filteredProducts.reduce((sum, p) => sum + p.revenue, 0),
        totalUnits: filteredProducts.reduce((sum, p) => sum + p.unitsSold, 0),
        averageRating: filteredProducts.reduce((sum, p) => sum + p.averageRating, 0) / filteredProducts.length
      }
    });
  })
);

// Get marketing analytics
router.get('/marketing', 
  requireRole(['admin', 'analyst', 'marketing']),
  asyncHandler(async (req, res) => {
    const { campaignType, startDate, endDate } = req.query;
    
    // Get campaigns from database
    let query = 'SELECT * FROM marketing_campaigns WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;
    
    if (campaignType) {
      paramCount++;
      query += ` AND type = $${paramCount}`;
      params.push(campaignType);
    }
    
    if (startDate) {
      paramCount++;
      query += ` AND created_at >= $${paramCount}`;
      params.push(startDate);
    }
    
    if (endDate) {
      paramCount++;
      query += ` AND created_at <= $${paramCount}`;
      params.push(endDate);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    
    // Mock performance data for each campaign
    const campaignsWithMetrics = result.rows.map(campaign => ({
      ...campaign,
      metrics: {
        sent: Math.floor(Math.random() * 1000) + 500,
        delivered: Math.floor(Math.random() * 900) + 450,
        opened: Math.floor(Math.random() * 200) + 50,
        clicked: Math.floor(Math.random() * 50) + 10,
        converted: Math.floor(Math.random() * 15) + 2,
        revenue: Math.floor(Math.random() * 50000) + 10000
      }
    }));
    
    // Calculate overall metrics
    const overallMetrics = campaignsWithMetrics.reduce((acc, campaign) => {
      const metrics = campaign.metrics;
      return {
        totalSent: acc.totalSent + metrics.sent,
        totalDelivered: acc.totalDelivered + metrics.delivered,
        totalOpened: acc.totalOpened + metrics.opened,
        totalClicked: acc.totalClicked + metrics.clicked,
        totalConverted: acc.totalConverted + metrics.converted,
        totalRevenue: acc.totalRevenue + metrics.revenue
      };
    }, {
      totalSent: 0,
      totalDelivered: 0,
      totalOpened: 0,
      totalClicked: 0,
      totalConverted: 0,
      totalRevenue: 0
    });
    
    const analytics = {
      campaigns: campaignsWithMetrics,
      overallMetrics: {
        ...overallMetrics,
        openRate: overallMetrics.totalDelivered > 0 ? (overallMetrics.totalOpened / overallMetrics.totalDelivered * 100).toFixed(1) + '%' : '0%',
        clickRate: overallMetrics.totalOpened > 0 ? (overallMetrics.totalClicked / overallMetrics.totalOpened * 100).toFixed(1) + '%' : '0%',
        conversionRate: overallMetrics.totalClicked > 0 ? (overallMetrics.totalConverted / overallMetrics.totalClicked * 100).toFixed(1) + '%' : '0%',
        revenuePerEmail: overallMetrics.totalSent > 0 ? (overallMetrics.totalRevenue / overallMetrics.totalSent).toFixed(2) : '0'
      },
      insights: [
        'Email campaigns perform best on Tuesday mornings',
        'Personalized subject lines increase open rates by 25%',
        'Product recommendation emails have highest conversion rates',
        'Abandoned cart emails generate 15% of total email revenue'
      ]
    };
    
    logAnalyticsEvent('marketing_analytics_accessed', analytics);
    
    res.json({
      success: true,
      data: analytics
    });
  })
);

// Get AI insights analytics
router.get('/ai-insights', 
  requireRole(['admin', 'analyst']),
  asyncHandler(async (req, res) => {
    const { insightType, startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM ai_insights WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;
    
    if (insightType) {
      paramCount++;
      query += ` AND insight_type = $${paramCount}`;
      params.push(insightType);
    }
    
    if (startDate) {
      paramCount++;
      query += ` AND generated_at >= $${paramCount}`;
      params.push(startDate);
    }
    
    if (endDate) {
      paramCount++;
      query += ` AND generated_at <= $${paramCount}`;
      params.push(endDate);
    }
    
    query += ' ORDER BY generated_at DESC';
    
    const result = await db.query(query, params);
    
    // Group insights by type
    const insightsByType = result.rows.reduce((acc, insight) => {
      const type = insight.insight_type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(insight);
      return acc;
    }, {} as any);
    
    // Calculate metrics for each insight type
    const typeMetrics = Object.keys(insightsByType).map(type => {
      const insights = insightsByType[type];
      const avgConfidence = insights.reduce((sum, i) => sum + parseFloat(i.confidence_score || 0), 0) / insights.length;
      
      return {
        type,
        count: insights.length,
        averageConfidence: avgConfidence.toFixed(2),
        recentInsights: insights.slice(0, 5)
      };
    });
    
    const analytics = {
      totalInsights: result.rows.length,
      insightsByType: typeMetrics,
      accuracy: {
        overall: 87.5,
        byType: {
          customer_intelligence: 92.3,
          product_recommendations: 85.7,
          pricing_intelligence: 89.1,
          inventory_forecasting: 83.4
        }
      },
      impact: {
        revenueGenerated: 125000,
        customersRetained: 45,
        campaignsOptimized: 12,
        inventoryOptimized: 8
      }
    };
    
    logAnalyticsEvent('ai_insights_analytics_accessed', analytics);
    
    res.json({
      success: true,
      data: analytics
    });
  })
);

// Get real-time analytics
router.get('/realtime', 
  requireRole(['admin', 'analyst']),
  asyncHandler(async (req, res) => {
    // Mock real-time data
    const realtime = {
      timestamp: new Date().toISOString(),
      activeUsers: Math.floor(Math.random() * 50) + 20,
      currentOrders: Math.floor(Math.random() * 10) + 2,
      revenueToday: Math.floor(Math.random() * 50000) + 15000,
      topProducts: [
        { name: 'Silver Necklace', views: 25, conversions: 2 },
        { name: 'Cotton Saree', views: 18, conversions: 1 },
        { name: 'Brass Diya', views: 32, conversions: 3 }
      ],
      recentActivity: [
        { type: 'order', customer: 'user123', amount: 2500, time: '2 minutes ago' },
        { type: 'view', customer: 'user456', product: 'Silver Necklace', time: '5 minutes ago' },
        { type: 'cart_add', customer: 'user789', product: 'Cotton Saree', time: '8 minutes ago' }
      ]
    };
    
    res.json({
      success: true,
      data: realtime
    });
  })
);

export default router; 