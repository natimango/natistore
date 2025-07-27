import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const customerId = searchParams.get('customer_id')
    const period = searchParams.get('period') || '7d'
    const metric = searchParams.get('metric')

    switch (action) {
      case 'dashboard':
        return await getDashboardMetrics(period)
      
      case 'customer_journey':
        return await getCustomerJourney(customerId, period)
      
      case 'conversion_funnel':
        return await getConversionFunnel(period)
      
      case 'product_performance':
        return await getProductPerformance(period)
      
      case 'customer_segments':
        return await getCustomerSegments(period)
      
      case 'revenue_analytics':
        return await getRevenueAnalytics(period)
      
      case 'ai_insights':
        return await getAIInsights(period)
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json({ 
      error: 'Analytics failed' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'generate_report':
        return await generateCustomReport(data)
      
      case 'export_data':
        return await exportAnalyticsData(data)
      
      case 'set_alert':
        return await setAnalyticsAlert(data)
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json({ 
      error: 'Analytics operation failed' 
    }, { status: 500 })
  }
}

async function getDashboardMetrics(period: string) {
  try {
    // Get events from CDP
    const eventsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp?action=events&limit=1000`)
    const eventsData = await eventsResponse.json()

    if (!eventsData.success) {
      throw new Error('Failed to fetch events')
    }

    const events = eventsData.events || []
    const filteredEvents = filterEventsByPeriod(events, period)

    const metrics = {
      overview: {
        total_visitors: getUniqueVisitors(filteredEvents),
        total_sessions: getTotalSessions(filteredEvents),
        total_orders: getTotalOrders(filteredEvents),
        total_revenue: getTotalRevenue(filteredEvents),
        average_order_value: getAverageOrderValue(filteredEvents),
        conversion_rate: getConversionRate(filteredEvents)
      },
      trends: {
        visitor_trend: getVisitorTrend(filteredEvents, period),
        revenue_trend: getRevenueTrend(filteredEvents, period),
        conversion_trend: getConversionTrend(filteredEvents, period)
      },
      top_performers: {
        top_products: getTopProducts(filteredEvents),
        top_categories: getTopCategories(filteredEvents),
        top_customers: await getTopCustomers(filteredEvents)
      },
      ai_insights: await generateDashboardInsights(filteredEvents, period)
    }

    return NextResponse.json({
      success: true,
      period,
      metrics
    })

  } catch (error) {
    console.error('Error getting dashboard metrics:', error)
    return NextResponse.json({ 
      error: 'Failed to get dashboard metrics' 
    }, { status: 500 })
  }
}

async function getCustomerJourney(customerId: string, period: string) {
  try {
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
    }

    // Get customer events
    const eventsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp?action=events&customer_id=${customerId}&limit=100`)
    const eventsData = await eventsResponse.json()

    if (!eventsData.success) {
      throw new Error('Failed to fetch customer events')
    }

    const events = eventsData.events || []
    const filteredEvents = filterEventsByPeriod(events, period)

    // Get customer profile
    const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp?action=profile&customer_id=${customerId}`)
    const profileData = await profileResponse.json()

    const journey = {
      customer_profile: profileData.profile,
      touchpoints: analyzeTouchpoints(filteredEvents),
      funnel_progression: analyzeFunnelProgression(filteredEvents),
      engagement_metrics: calculateEngagementMetrics(filteredEvents),
      conversion_opportunities: identifyConversionOpportunities(filteredEvents, profileData.profile),
      next_best_actions: await getNextBestActions(customerId, filteredEvents)
    }

    return NextResponse.json({
      success: true,
      customer_id: customerId,
      period,
      journey
    })

  } catch (error) {
    console.error('Error getting customer journey:', error)
    return NextResponse.json({ 
      error: 'Failed to get customer journey' 
    }, { status: 500 })
  }
}

async function getConversionFunnel(period: string) {
  try {
    // Get events from CDP
    const eventsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp?action=events&limit=1000`)
    const eventsData = await eventsResponse.json()

    if (!eventsData.success) {
      throw new Error('Failed to fetch events')
    }

    const events = eventsData.events || []
    const filteredEvents = filterEventsByPeriod(events, period)

    const funnel = {
      stages: [
        {
          name: 'awareness',
          count: getEventCount(filteredEvents, 'page_view'),
          conversion_rate: 100
        },
        {
          name: 'consideration',
          count: getEventCount(filteredEvents, 'product_view'),
          conversion_rate: calculateStageConversionRate(filteredEvents, 'page_view', 'product_view')
        },
        {
          name: 'intent',
          count: getEventCount(filteredEvents, 'cart_add'),
          conversion_rate: calculateStageConversionRate(filteredEvents, 'product_view', 'cart_add')
        },
        {
          name: 'purchase',
          count: getEventCount(filteredEvents, 'purchase_completed'),
          conversion_rate: calculateStageConversionRate(filteredEvents, 'cart_add', 'purchase_completed')
        }
      ],
      drop_off_analysis: analyzeDropOffPoints(filteredEvents),
      optimization_suggestions: await getFunnelOptimizationSuggestions(filteredEvents)
    }

    return NextResponse.json({
      success: true,
      period,
      funnel
    })

  } catch (error) {
    console.error('Error getting conversion funnel:', error)
    return NextResponse.json({ 
      error: 'Failed to get conversion funnel' 
    }, { status: 500 })
  }
}

async function getProductPerformance(period: string) {
  try {
    // Get events from CDP
    const eventsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp?action=events&limit=1000`)
    const eventsData = await eventsResponse.json()

    if (!eventsData.success) {
      throw new Error('Failed to fetch events')
    }

    const events = eventsData.events || []
    const filteredEvents = filterEventsByPeriod(events, period)

    const performance = {
      top_products: getTopProductsByMetric(filteredEvents, 'revenue'),
      trending_products: getTrendingProducts(filteredEvents, period),
      category_performance: getCategoryPerformance(filteredEvents),
      inventory_insights: await getInventoryInsights(filteredEvents),
      product_recommendations: await getProductRecommendations(filteredEvents)
    }

    return NextResponse.json({
      success: true,
      period,
      performance
    })

  } catch (error) {
    console.error('Error getting product performance:', error)
    return NextResponse.json({ 
      error: 'Failed to get product performance' 
    }, { status: 500 })
  }
}

async function getCustomerSegments(period: string) {
  try {
    // Get events from CDP
    const eventsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp?action=events&limit=1000`)
    const eventsData = await eventsResponse.json()

    if (!eventsData.success) {
      throw new Error('Failed to fetch events')
    }

    const events = eventsData.events || []
    const filteredEvents = filterEventsByPeriod(events, period)

    const segments = {
      segment_distribution: getSegmentDistribution(filteredEvents),
      segment_performance: getSegmentPerformance(filteredEvents),
      segment_insights: await getSegmentInsights(filteredEvents),
      targeting_recommendations: await getTargetingRecommendations(filteredEvents)
    }

    return NextResponse.json({
      success: true,
      period,
      segments
    })

  } catch (error) {
    console.error('Error getting customer segments:', error)
    return NextResponse.json({ 
      error: 'Failed to get customer segments' 
    }, { status: 500 })
  }
}

async function getRevenueAnalytics(period: string) {
  try {
    // Get events from CDP
    const eventsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp?action=events&limit=1000`)
    const eventsData = await eventsResponse.json()

    if (!eventsData.success) {
      throw new Error('Failed to fetch events')
    }

    const events = eventsData.events || []
    const filteredEvents = filterEventsByPeriod(events, period)

    const revenue = {
      total_revenue: getTotalRevenue(filteredEvents),
      revenue_trend: getRevenueTrend(filteredEvents, period),
      revenue_by_category: getRevenueByCategory(filteredEvents),
      revenue_by_customer_segment: getRevenueByCustomerSegment(filteredEvents),
      revenue_forecast: await getRevenueForecast(filteredEvents, period),
      revenue_optimization: await getRevenueOptimizationSuggestions(filteredEvents)
    }

    return NextResponse.json({
      success: true,
      period,
      revenue
    })

  } catch (error) {
    console.error('Error getting revenue analytics:', error)
    return NextResponse.json({ 
      error: 'Failed to get revenue analytics' 
    }, { status: 500 })
  }
}

async function getAIInsights(period: string) {
  try {
    // Get events from CDP
    const eventsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp?action=events&limit=1000`)
    const eventsData = await eventsResponse.json()

    if (!eventsData.success) {
      throw new Error('Failed to fetch events')
    }

    const events = eventsData.events || []
    const filteredEvents = filterEventsByPeriod(events, period)

    const insights = {
      business_insights: await generateBusinessInsights(filteredEvents),
      customer_insights: await generateCustomerInsights(filteredEvents),
      product_insights: await generateProductInsights(filteredEvents),
      marketing_insights: await generateMarketingInsights(filteredEvents),
      actionable_recommendations: await generateActionableRecommendations(filteredEvents)
    }

    return NextResponse.json({
      success: true,
      period,
      insights
    })

  } catch (error) {
    console.error('Error getting AI insights:', error)
    return NextResponse.json({ 
      error: 'Failed to get AI insights' 
    }, { status: 500 })
  }
}

// Helper functions for analytics calculations

function filterEventsByPeriod(events: any[], period: string): any[] {
  const now = new Date()
  let startDate: Date

  switch (period) {
    case '1d':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }

  return events.filter(event => new Date(event.created_at) >= startDate)
}

function getUniqueVisitors(events: any[]): number {
  const uniqueCustomers = new Set(events.map(event => event.customer_id))
  return uniqueCustomers.size
}

function getTotalSessions(events: any[]): number {
  const sessions = new Set(events.map(event => event.context?.session_id).filter(Boolean))
  return sessions.size
}

function getTotalOrders(events: any[]): number {
  return events.filter(event => event.event_type === 'purchase_completed').length
}

function getTotalRevenue(events: any[]): number {
  return events
    .filter(event => event.event_type === 'purchase_completed')
    .reduce((sum, event) => sum + (event.data?.order_value || 0), 0)
}

function getAverageOrderValue(events: any[]): number {
  const orders = events.filter(event => event.event_type === 'purchase_completed')
  if (orders.length === 0) return 0
  
  const totalRevenue = getTotalRevenue(events)
  return totalRevenue / orders.length
}

function getConversionRate(events: any[]): number {
  const visitors = getUniqueVisitors(events)
  const orders = getTotalOrders(events)
  
  if (visitors === 0) return 0
  return (orders / visitors) * 100
}

function getEventCount(events: any[], eventType: string): number {
  return events.filter(event => event.event_type === eventType).length
}

function calculateStageConversionRate(events: any[], fromEvent: string, toEvent: string): number {
  const fromCount = getEventCount(events, fromEvent)
  const toCount = getEventCount(events, toEvent)
  
  if (fromCount === 0) return 0
  return (toCount / fromCount) * 100
}

function getTopProducts(events: any[]): any[] {
  const productViews = events.filter(event => event.event_type === 'product_view')
  const productCounts: Record<string, number> = {}
  
  productViews.forEach(event => {
    const productId = event.data?.product_id
    if (productId) {
      productCounts[productId] = (productCounts[productId] || 0) + 1
    }
  })
  
  return Object.entries(productCounts)
    .map(([productId, count]) => ({ product_id: productId, views: count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
}

function getTopCategories(events: any[]): any[] {
  const categoryViews = events.filter(event => event.event_type === 'product_view')
  const categoryCounts: Record<string, number> = {}
  
  categoryViews.forEach(event => {
    const category = event.data?.category
    if (category) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    }
  })
  
  return Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, views: count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
}

async function getTopCustomers(events: any[]): Promise<any[]> {
  const customerRevenue: Record<string, number> = {}
  
  events
    .filter(event => event.event_type === 'purchase_completed')
    .forEach(event => {
      const customerId = event.customer_id
      const revenue = event.data?.order_value || 0
      customerRevenue[customerId] = (customerRevenue[customerId] || 0) + revenue
    })
  
  return Object.entries(customerRevenue)
    .map(([customerId, revenue]) => ({ customer_id: customerId, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
}

// Placeholder functions for complex analytics (to be implemented with real data)

function getVisitorTrend(events: any[], period: string): any[] {
  // Mock visitor trend data
  return [
    { date: '2025-01-20', visitors: 45 },
    { date: '2025-01-21', visitors: 52 },
    { date: '2025-01-22', visitors: 48 },
    { date: '2025-01-23', visitors: 61 },
    { date: '2025-01-24', visitors: 58 },
    { date: '2025-01-25', visitors: 67 },
    { date: '2025-01-26', visitors: 73 }
  ]
}

function getRevenueTrend(events: any[], period: string): any[] {
  // Mock revenue trend data
  return [
    { date: '2025-01-20', revenue: 12500 },
    { date: '2025-01-21', revenue: 14200 },
    { date: '2025-01-22', revenue: 11800 },
    { date: '2025-01-23', revenue: 15600 },
    { date: '2025-01-24', revenue: 13800 },
    { date: '2025-01-25', revenue: 17200 },
    { date: '2025-01-26', revenue: 18900 }
  ]
}

function getConversionTrend(events: any[], period: string): any[] {
  // Mock conversion trend data
  return [
    { date: '2025-01-20', rate: 2.1 },
    { date: '2025-01-21', rate: 2.4 },
    { date: '2025-01-22', rate: 2.0 },
    { date: '2025-01-23', rate: 2.8 },
    { date: '2025-01-24', rate: 2.5 },
    { date: '2025-01-25', rate: 3.1 },
    { date: '2025-01-26', rate: 3.3 }
  ]
}

// Additional placeholder functions for comprehensive analytics

async function generateDashboardInsights(events: any[], period: string): Promise<any> {
  return {
    key_metrics: {
      visitor_growth: '+12.5%',
      revenue_growth: '+18.2%',
      conversion_improvement: '+0.8%'
    },
    alerts: [
      {
        type: 'warning',
        message: 'Cart abandonment rate increased by 5%',
        action: 'Review checkout process'
      }
    ],
    recommendations: [
      {
        type: 'optimization',
        message: 'Implement exit-intent popup for cart recovery',
        impact: 'High',
        effort: 'Medium'
      }
    ]
  }
}

function analyzeTouchpoints(events: any[]): any[] {
  return events.map(event => ({
    timestamp: event.created_at,
    touchpoint: event.event_type,
    channel: event.context?.channel || 'web',
    value: event.data?.order_value || 0
  }))
}

function analyzeFunnelProgression(events: any[]): any {
  return {
    awareness: getEventCount(events, 'page_view'),
    consideration: getEventCount(events, 'product_view'),
    intent: getEventCount(events, 'cart_add'),
    purchase: getEventCount(events, 'purchase_completed')
  }
}

function calculateEngagementMetrics(events: any[]): any {
  return {
    session_duration: 180, // seconds
    pages_per_session: 3.2,
    bounce_rate: 0.35,
    return_visitor_rate: 0.28
  }
}

function identifyConversionOpportunities(events: any[], profile: any): any[] {
  return [
    {
      type: 'abandoned_cart',
      value: 2500,
      action: 'Send recovery email'
    },
    {
      type: 'browse_no_purchase',
      value: 1800,
      action: 'Show personalized recommendations'
    }
  ]
}

async function getNextBestActions(customerId: string, events: any[]): Promise<any[]> {
  return [
    {
      action: 'Send welcome email',
      priority: 'High',
      expected_value: 500
    },
    {
      action: 'Show loyalty benefits',
      priority: 'Medium',
      expected_value: 300
    }
  ]
}

function analyzeDropOffPoints(events: any[]): any[] {
  return [
    {
      stage: 'cart_add',
      drop_off_rate: 0.35,
      reason: 'High shipping costs',
      solution: 'Free shipping threshold'
    }
  ]
}

async function getFunnelOptimizationSuggestions(events: any[]): Promise<any[]> {
  return [
    {
      stage: 'awareness',
      suggestion: 'Improve product images',
      impact: 'Medium',
      effort: 'Low'
    }
  ]
}

function getTopProductsByMetric(events: any[], metric: string): any[] {
  return [
    { product_id: 'necklace-001', metric_value: 12500, growth: '+15%' },
    { product_id: 'earrings-001', metric_value: 8900, growth: '+8%' }
  ]
}

function getTrendingProducts(events: any[], period: string): any[] {
  return [
    { product_id: 'scarf-001', trend: 'rising', growth_rate: '+25%' }
  ]
}

function getCategoryPerformance(events: any[]): any[] {
  return [
    { category: 'jewelry', revenue: 45000, growth: '+12%' },
    { category: 'accessories', revenue: 28000, growth: '+8%' }
  ]
}

async function getInventoryInsights(events: any[]): Promise<any> {
  return {
    low_stock_items: 5,
    out_of_stock_items: 2,
    overstock_items: 3,
    recommendations: [
      'Restock silver necklaces',
      'Reduce scarf inventory'
    ]
  }
}

async function getProductRecommendations(events: any[]): Promise<any[]> {
  return [
    {
      type: 'cross_sell',
      product_id: 'necklace-001',
      recommended_with: 'earrings-001',
      confidence: 0.85
    }
  ]
}

function getSegmentDistribution(events: any[]): any[] {
  return [
    { segment: 'new_customer', percentage: 45 },
    { segment: 'returning_customer', percentage: 35 },
    { segment: 'loyal_customer', percentage: 20 }
  ]
}

function getSegmentPerformance(events: any[]): any[] {
  return [
    { segment: 'new_customer', aov: 1200, conversion_rate: 1.2 },
    { segment: 'returning_customer', aov: 1800, conversion_rate: 2.8 },
    { segment: 'loyal_customer', aov: 2500, conversion_rate: 4.5 }
  ]
}

async function getSegmentInsights(events: any[]): Promise<any> {
  return {
    high_value_segments: ['loyal_customer'],
    growth_opportunities: ['returning_customer'],
    retention_focus: ['new_customer']
  }
}

async function getTargetingRecommendations(events: any[]): Promise<any[]> {
  return [
    {
      segment: 'new_customer',
      recommendation: 'Welcome email sequence',
      expected_impact: '+15% conversion'
    }
  ]
}

function getRevenueByCategory(events: any[]): any[] {
  return [
    { category: 'jewelry', revenue: 45000, percentage: 64 },
    { category: 'accessories', revenue: 28000, percentage: 36 }
  ]
}

function getRevenueByCustomerSegment(events: any[]): any[] {
  return [
    { segment: 'new_customer', revenue: 31500, percentage: 45 },
    { segment: 'returning_customer', revenue: 24500, percentage: 35 },
    { segment: 'loyal_customer', revenue: 14000, percentage: 20 }
  ]
}

async function getRevenueForecast(events: any[], period: string): Promise<any> {
  return {
    next_7_days: 52000,
    next_30_days: 185000,
    growth_rate: '+12%',
    confidence: 0.85
  }
}

async function getRevenueOptimizationSuggestions(events: any[]): Promise<any[]> {
  return [
    {
      suggestion: 'Implement dynamic pricing',
      expected_impact: '+8% revenue',
      effort: 'Medium'
    }
  ]
}

async function generateBusinessInsights(events: any[]): Promise<any[]> {
  return [
    {
      insight: 'Peak shopping hours are 2-4 PM',
      action: 'Schedule promotions during peak hours',
      impact: 'High'
    }
  ]
}

async function generateCustomerInsights(events: any[]): Promise<any[]> {
  return [
    {
      insight: 'New customers prefer jewelry category',
      action: 'Optimize jewelry landing pages',
      impact: 'Medium'
    }
  ]
}

async function generateProductInsights(events: any[]): Promise<any[]> {
  return [
    {
      insight: 'Silver necklaces have highest conversion rate',
      action: 'Increase inventory for silver necklaces',
      impact: 'High'
    }
  ]
}

async function generateMarketingInsights(events: any[]): Promise<any[]> {
  return [
    {
      insight: 'Email campaigns drive 40% of revenue',
      action: 'Increase email marketing budget',
      impact: 'High'
    }
  ]
}

async function generateActionableRecommendations(events: any[]): Promise<any[]> {
  return [
    {
      category: 'immediate',
      recommendations: [
        'Send abandoned cart recovery emails',
        'Implement exit-intent popups'
      ]
    },
    {
      category: 'short_term',
      recommendations: [
        'Optimize product images',
        'Add customer reviews'
      ]
    },
    {
      category: 'long_term',
      recommendations: [
        'Implement AI-powered recommendations',
        'Launch loyalty program'
      ]
    }
  ]
}

async function generateCustomReport(data: any) {
  // Implementation for custom report generation
  return NextResponse.json({
    success: true,
    report: {
      id: 'report_' + Date.now(),
      status: 'generating'
    }
  })
}

async function exportAnalyticsData(data: any) {
  // Implementation for data export
  return NextResponse.json({
    success: true,
    export_url: '/exports/analytics_data.csv'
  })
}

async function setAnalyticsAlert(data: any) {
  // Implementation for setting analytics alerts
  return NextResponse.json({
    success: true,
    alert_id: 'alert_' + Date.now()
  })
} 