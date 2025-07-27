import { NextRequest, NextResponse } from 'next/server'

// Unified Event Schema for NATI's AI Marketing Brain
export interface UnifiedEvent {
  id: string
  source: 'website' | 'meta_ads' | 'google_ads' | 'email' | 'whatsapp' | 'push' | 'ai_agent' | 'admin'
  type: string
  user_id?: string
  session_id?: string
  customer_id?: string
  meta: Record<string, any>
  timestamp: Date
  funnel_stage?: 'awareness' | 'consideration' | 'purchase' | 'retention' | 'advocacy'
  attribution_data?: {
    campaign_id?: string
    ad_set_id?: string
    ad_id?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
  }
  ai_insights?: {
    predicted_ltv?: number
    churn_risk?: number
    next_best_action?: string
    segment?: string
  }
}

// In-memory storage for demo (replace with PostgreSQL in production)
const eventsDB: UnifiedEvent[] = []

// Event type definitions for comprehensive tracking
const EVENT_TYPES = {
  // Website Events
  WEBSITE: {
    PAGE_VIEW: 'page_view',
    PRODUCT_VIEW: 'product_view',
    CART_ADD: 'cart_add',
    CART_REMOVE: 'cart_remove',
    CART_UPDATE: 'cart_update',
    CHECKOUT_START: 'checkout_start',
    CHECKOUT_COMPLETE: 'checkout_complete',
    SEARCH: 'search',
    FILTER_APPLY: 'filter_apply',
    WISHLIST_ADD: 'wishlist_add',
    REVIEW_SUBMIT: 'review_submit',
    SIGNUP: 'signup',
    LOGIN: 'login',
    LOGOUT: 'logout'
  },
  
  // Marketing Events
  MARKETING: {
    AD_CLICK: 'ad_click',
    AD_IMPRESSION: 'ad_impression',
    EMAIL_OPEN: 'email_open',
    EMAIL_CLICK: 'email_click',
    EMAIL_BOUNCE: 'email_bounce',
    WHATSAPP_SENT: 'whatsapp_sent',
    WHATSAPP_DELIVERED: 'whatsapp_delivered',
    WHATSAPP_READ: 'whatsapp_read',
    WHATSAPP_REPLY: 'whatsapp_reply',
    PUSH_SENT: 'push_sent',
    PUSH_OPEN: 'push_open',
    PUSH_CLICK: 'push_click'
  },
  
  // Loyalty Events
  LOYALTY: {
    POINTS_EARNED: 'points_earned',
    POINTS_REDEEMED: 'points_redeemed',
    TIER_UPGRADE: 'tier_upgrade',
    BONUS_AWARDED: 'bonus_awarded',
    REFERRAL_SENT: 'referral_sent',
    REFERRAL_COMPLETED: 'referral_completed'
  },
  
  // AI Events
  AI: {
    RECOMMENDATION_GENERATED: 'ai_recommendation_generated',
    RECOMMENDATION_ACCEPTED: 'ai_recommendation_accepted',
    RECOMMENDATION_REJECTED: 'ai_recommendation_rejected',
    CAMPAIGN_AUTO_LAUNCHED: 'ai_campaign_launched',
    BUDGET_AUTO_ADJUSTED: 'ai_budget_adjusted',
    PRICING_AUTO_OPTIMIZED: 'ai_pricing_optimized',
    INVENTORY_AUTO_ORDERED: 'ai_inventory_ordered'
  },
  
  // Business Events
  BUSINESS: {
    ORDER_CREATED: 'order_created',
    ORDER_CANCELLED: 'order_cancelled',
    ORDER_REFUNDED: 'order_refunded',
    PAYMENT_SUCCESS: 'payment_success',
    PAYMENT_FAILED: 'payment_failed',
    SHIPPING_UPDATED: 'shipping_updated',
    DELIVERY_COMPLETED: 'delivery_completed'
  }
}

// Helper function to determine funnel stage
function determineFunnelStage(eventType: string, meta: any): 'awareness' | 'consideration' | 'purchase' | 'retention' | 'advocacy' {
  const awarenessEvents = ['ad_click', 'ad_impression', 'email_open', 'push_sent']
  const considerationEvents = ['page_view', 'product_view', 'search', 'filter_apply']
  const purchaseEvents = ['cart_add', 'checkout_start', 'checkout_complete', 'payment_success']
  const retentionEvents = ['login', 'points_earned', 'review_submit']
  const advocacyEvents = ['referral_sent', 'referral_completed']

  if (awarenessEvents.includes(eventType)) return 'awareness'
  if (considerationEvents.includes(eventType)) return 'consideration'
  if (purchaseEvents.includes(eventType)) return 'purchase'
  if (retentionEvents.includes(eventType)) return 'retention'
  if (advocacyEvents.includes(eventType)) return 'advocacy'
  
  return 'consideration' // default
}

// Helper function to generate AI insights
function generateAIInsights(event: UnifiedEvent): any {
  // In production, this would call your Gemini AI agent
  const insights = {
    predicted_ltv: Math.random() * 10000 + 1000, // Demo value
    churn_risk: Math.random() * 100, // Demo value
    next_best_action: 'send_personalized_email',
    segment: 'high_value_customer'
  }
  
  // Simple logic for demo
  if (event.type === 'checkout_complete' && event.meta.order_value > 500) {
    insights.segment = 'vip_customer'
    insights.next_best_action = 'send_vip_exclusive_offer'
  }
  
  if (event.type === 'logout' && event.meta.session_duration < 60) {
    insights.churn_risk = 85
    insights.next_best_action = 'send_reengagement_campaign'
  }
  
  return insights
}

// API Routes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, type, user_id, session_id, customer_id, meta, attribution_data } = body

    // Validate required fields
    if (!source || !type) {
      return NextResponse.json({ 
        error: 'Source and type are required' 
      }, { status: 400 })
    }

    // Create unified event
    const event: UnifiedEvent = {
      id: Math.random().toString(36).substr(2, 9),
      source,
      type,
      user_id,
      session_id,
      customer_id,
      meta: meta || {},
      timestamp: new Date(),
      funnel_stage: determineFunnelStage(type, meta),
      attribution_data,
      ai_insights: generateAIInsights({ source, type, meta } as UnifiedEvent)
    }

    // Store event
    eventsDB.push(event)

    // Emit real-time analytics (in production, this would be WebSocket/SSE)
    console.log('📊 UNIFIED EVENT:', {
      id: event.id,
      source: event.source,
      type: event.type,
      funnel_stage: event.funnel_stage,
      ai_insights: event.ai_insights
    })

    // Trigger AI analysis for high-value events
    if (['checkout_complete', 'points_earned', 'tier_upgrade'].includes(type)) {
      await triggerAIAnalysis(event)
    }

    return NextResponse.json({
      success: true,
      event_id: event.id,
      ai_insights: event.ai_insights
    })

  } catch (error) {
    console.error('Event collection error:', error)
    return NextResponse.json({ 
      error: 'Failed to collect event' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source')
  const type = searchParams.get('type')
  const customer_id = searchParams.get('customer_id')
  const limit = parseInt(searchParams.get('limit') || '100')

  let filteredEvents = eventsDB

  // Apply filters
  if (source) {
    filteredEvents = filteredEvents.filter(e => e.source === source)
  }
  if (type) {
    filteredEvents = filteredEvents.filter(e => e.type === type)
  }
  if (customer_id) {
    filteredEvents = filteredEvents.filter(e => e.customer_id === customer_id)
  }

  // Sort by timestamp (newest first) and limit
  const sortedEvents = filteredEvents
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)

  return NextResponse.json({
    success: true,
    events: sortedEvents,
    total: filteredEvents.length,
    filtered_by: { source, type, customer_id }
  })
}

// AI Analysis Trigger
async function triggerAIAnalysis(event: UnifiedEvent) {
  try {
    // In production, this would call your Gemini AI agent
    console.log('🤖 AI ANALYSIS TRIGGERED:', {
      event_type: event.type,
      customer_id: event.customer_id,
      insights: event.ai_insights
    })

    // Simulate AI analysis
    const aiResponse = await fetch('/api/ai-loyalty-integration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'trigger_ai_analysis',
        customer_id: event.customer_id,
        trigger_event: event.type,
        event_data: event
      })
    })

    const result = await aiResponse.json()
    console.log('🤖 AI ANALYSIS RESULT:', result)

  } catch (error) {
    console.error('AI analysis error:', error)
  }
}

// Analytics helper functions
export function getFunnelMetrics(events: UnifiedEvent[]) {
  const funnel = {
    awareness: events.filter(e => e.funnel_stage === 'awareness').length,
    consideration: events.filter(e => e.funnel_stage === 'consideration').length,
    purchase: events.filter(e => e.funnel_stage === 'purchase').length,
    retention: events.filter(e => e.funnel_stage === 'retention').length,
    advocacy: events.filter(e => e.funnel_stage === 'advocacy').length
  }

  return {
    ...funnel,
    total: events.length,
    conversion_rates: {
      awareness_to_consideration: funnel.awareness > 0 ? (funnel.consideration / funnel.awareness * 100).toFixed(2) : 0,
      consideration_to_purchase: funnel.consideration > 0 ? (funnel.purchase / funnel.consideration * 100).toFixed(2) : 0,
      purchase_to_retention: funnel.purchase > 0 ? (funnel.retention / funnel.purchase * 100).toFixed(2) : 0
    }
  }
}

export function getCustomerJourney(customerId: string) {
  const customerEvents = eventsDB
    .filter(e => e.customer_id === customerId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return {
    customer_id: customerId,
    total_events: customerEvents.length,
    first_interaction: customerEvents[0]?.timestamp,
    last_interaction: customerEvents[customerEvents.length - 1]?.timestamp,
    journey: customerEvents.map(e => ({
      timestamp: e.timestamp,
      source: e.source,
      type: e.type,
      funnel_stage: e.funnel_stage,
      meta: e.meta
    }))
  }
} 