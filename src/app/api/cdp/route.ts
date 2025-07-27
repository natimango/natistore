import { NextRequest, NextResponse } from 'next/server'

// AI-Optimized Customer Data Platform Schema
export interface CustomerProfile {
  id: string
  // Core Identity
  email?: string
  phone?: string
  name?: string
  avatar?: string
  
  // Demographics (for AI personalization)
  demographics: {
    age?: number
    gender?: 'male' | 'female' | 'other'
    location?: {
      city?: string
      state?: string
      country?: string
      postal_code?: string
    }
    language?: string
    timezone?: string
  }
  
  // Behavioral Patterns (AI training data)
  behavior: {
    // Engagement patterns
    engagement_score: number // 0-100
    session_frequency: number // avg sessions per week
    session_duration: number // avg minutes per session
    last_active: Date
    
    // Shopping behavior
    preferred_categories: string[]
    preferred_price_range: {
      min: number
      max: number
    }
    preferred_brands: string[]
    shopping_cart_abandonment_rate: number
    checkout_completion_rate: number
    
    // Content preferences
    preferred_content_types: ('video' | 'image' | 'text' | 'interactive')[]
    preferred_channels: ('email' | 'whatsapp' | 'push' | 'social' | 'web')[]
    response_times: {
      email: number // avg hours to respond
      whatsapp: number
      push: number
    }
    
    // Device & platform preferences
    preferred_device: 'mobile' | 'desktop' | 'tablet'
    preferred_browser?: string
    preferred_os?: string
  }
  
  // Financial Profile (for AI pricing & offers)
  financial: {
    total_spent: number
    average_order_value: number
    lifetime_value: number
    payment_methods: string[]
    credit_score_tier?: 'excellent' | 'good' | 'fair' | 'poor'
    price_sensitivity: 'high' | 'medium' | 'low'
    discount_response_rate: number // % of times they use discounts
  }
  
  // Loyalty & Retention (for AI retention strategies)
  loyalty: {
    tier: 'bronze' | 'silver' | 'gold' | 'platinum'
    points_balance: number
    points_earned_total: number
    points_redeemed_total: number
    referral_count: number
    days_since_signup: number
    churn_risk_score: number // 0-100
    retention_probability: number // 0-100
  }
  
  // AI-Generated Insights
  ai_insights: {
    // Customer segmentation
    primary_segment: string
    secondary_segments: string[]
    
    // Predictive analytics
    next_purchase_probability: number // 0-100
    next_purchase_amount: number
    next_purchase_category: string
    next_purchase_timing: 'immediate' | 'week' | 'month' | 'quarter'
    
    // Personalization recommendations
    recommended_products: string[]
    recommended_categories: string[]
    recommended_offers: string[]
    recommended_messaging_tone: 'formal' | 'casual' | 'friendly' | 'luxury'
    recommended_channels: string[]
    
    // Marketing optimization
    optimal_discount_percentage: number
    optimal_send_time: string // HH:MM
    optimal_frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
    optimal_campaign_type: 'abandoned_cart' | 'winback' | 'upsell' | 'cross_sell' | 'new_product'
    
    // Risk indicators
    fraud_risk_score: number // 0-100
    return_risk_score: number // 0-100
    support_risk_score: number // 0-100
  }
  
  // Real-time Context (for immediate AI decisions)
  context: {
    current_session_id?: string
    current_page?: string
    current_cart_value: number
    current_cart_items: string[]
    last_search_terms: string[]
    current_campaign_id?: string
    current_offer_id?: string
    device_context: {
      user_agent: string
      screen_size: string
      connection_speed?: 'slow' | 'medium' | 'fast'
      location_consent: boolean
    }
  }
  
  // Timestamps
  created_at: Date
  updated_at: Date
  last_profile_update: Date
}

// AI-Optimized Event Schema
export interface CDPEvent {
  id: string
  customer_id: string
  event_type: string
  event_category: 'engagement' | 'commerce' | 'marketing' | 'loyalty' | 'ai' | 'system'
  
  // Rich context for AI analysis
  context: {
    session_id: string
    page_url?: string
    referrer?: string
    user_agent: string
    ip_address?: string
    timestamp: Date
    
    // Device & platform context
    device: {
      type: 'mobile' | 'desktop' | 'tablet'
      os: string
      browser: string
      screen_resolution: string
    }
    
    // Geographic context
    location?: {
      country: string
      region: string
      city: string
      latitude?: number
      longitude?: number
    }
    
    // Campaign context
    campaign?: {
      id: string
      name: string
      source: string
      medium: string
      term?: string
      content?: string
    }
  }
  
  // Event-specific data (structured for AI)
  data: Record<string, any>
  
  // AI processing metadata
  ai_processed: boolean
  ai_insights?: {
    intent_detected?: string
    sentiment_score?: number
    urgency_level?: 'low' | 'medium' | 'high'
    conversion_probability?: number
    next_best_action?: string
    personalization_opportunity?: string
  }
  
  // Timestamps
  created_at: Date
  processed_at?: Date
}

// In-memory storage (replace with PostgreSQL in production)
const customerProfilesDB: Map<string, CustomerProfile> = new Map()
const cdpEventsDB: CDPEvent[] = []

// AI-optimized data capture functions
export class CDPDataCapture {
  
  // Capture customer profile with AI-ready structure
  static async captureProfile(customerData: Partial<CustomerProfile>): Promise<CustomerProfile> {
    const customerId = customerData.id || `customer_${Date.now()}`
    
    const profile: CustomerProfile = {
      id: customerId,
      email: customerData.email,
      phone: customerData.phone,
      name: customerData.name,
      avatar: customerData.avatar,
      
      demographics: {
        age: customerData.demographics?.age,
        gender: customerData.demographics?.gender,
        location: customerData.demographics?.location,
        language: customerData.demographics?.language || 'en',
        timezone: customerData.demographics?.timezone || 'UTC'
      },
      
      behavior: {
        engagement_score: customerData.behavior?.engagement_score || 50,
        session_frequency: customerData.behavior?.session_frequency || 0,
        session_duration: customerData.behavior?.session_duration || 0,
        last_active: new Date(),
        preferred_categories: customerData.behavior?.preferred_categories || [],
        preferred_price_range: customerData.behavior?.preferred_price_range || { min: 0, max: 1000 },
        preferred_brands: customerData.behavior?.preferred_brands || [],
        shopping_cart_abandonment_rate: customerData.behavior?.shopping_cart_abandonment_rate || 0,
        checkout_completion_rate: customerData.behavior?.checkout_completion_rate || 0,
        preferred_content_types: customerData.behavior?.preferred_content_types || ['image'],
        preferred_channels: customerData.behavior?.preferred_channels || ['web'],
        response_times: customerData.behavior?.response_times || { email: 24, whatsapp: 2, push: 1 },
        preferred_device: customerData.behavior?.preferred_device || 'desktop'
      },
      
      financial: {
        total_spent: customerData.financial?.total_spent || 0,
        average_order_value: customerData.financial?.average_order_value || 0,
        lifetime_value: customerData.financial?.lifetime_value || 0,
        payment_methods: customerData.financial?.payment_methods || [],
        price_sensitivity: customerData.financial?.price_sensitivity || 'medium',
        discount_response_rate: customerData.financial?.discount_response_rate || 0
      },
      
      loyalty: {
        tier: customerData.loyalty?.tier || 'bronze',
        points_balance: customerData.loyalty?.points_balance || 0,
        points_earned_total: customerData.loyalty?.points_earned_total || 0,
        points_redeemed_total: customerData.loyalty?.points_redeemed_total || 0,
        referral_count: customerData.loyalty?.referral_count || 0,
        days_since_signup: customerData.loyalty?.days_since_signup || 0,
        churn_risk_score: customerData.loyalty?.churn_risk_score || 50,
        retention_probability: customerData.loyalty?.retention_probability || 50
      },
      
      ai_insights: {
        primary_segment: customerData.ai_insights?.primary_segment || 'new_customer',
        secondary_segments: customerData.ai_insights?.secondary_segments || [],
        next_purchase_probability: customerData.ai_insights?.next_purchase_probability || 0,
        next_purchase_amount: customerData.ai_insights?.next_purchase_amount || 0,
        next_purchase_category: customerData.ai_insights?.next_purchase_category || '',
        next_purchase_timing: customerData.ai_insights?.next_purchase_timing || 'month',
        recommended_products: customerData.ai_insights?.recommended_products || [],
        recommended_categories: customerData.ai_insights?.recommended_categories || [],
        recommended_offers: customerData.ai_insights?.recommended_offers || [],
        recommended_messaging_tone: customerData.ai_insights?.recommended_messaging_tone || 'friendly',
        recommended_channels: customerData.ai_insights?.recommended_channels || ['email'],
        optimal_discount_percentage: customerData.ai_insights?.optimal_discount_percentage || 10,
        optimal_send_time: customerData.ai_insights?.optimal_send_time || '10:00',
        optimal_frequency: customerData.ai_insights?.optimal_frequency || 'weekly',
        optimal_campaign_type: customerData.ai_insights?.optimal_campaign_type || 'new_product',
        fraud_risk_score: customerData.ai_insights?.fraud_risk_score || 0,
        return_risk_score: customerData.ai_insights?.return_risk_score || 0,
        support_risk_score: customerData.ai_insights?.support_risk_score || 0
      },
      
      context: {
        current_cart_value: customerData.context?.current_cart_value || 0,
        current_cart_items: customerData.context?.current_cart_items || [],
        last_search_terms: customerData.context?.last_search_terms || [],
        device_context: {
          user_agent: customerData.context?.device_context?.user_agent || '',
          screen_size: customerData.context?.device_context?.screen_size || '',
          location_consent: customerData.context?.device_context?.location_consent || false
        }
      },
      
      created_at: customerData.created_at || new Date(),
      updated_at: new Date(),
      last_profile_update: new Date()
    }
    
    customerProfilesDB.set(customerId, profile)
    return profile
  }
  
  // Capture AI-optimized event
  static async captureEvent(eventData: {
    customer_id: string
    event_type: string
    event_category: 'engagement' | 'commerce' | 'marketing' | 'loyalty' | 'ai' | 'system'
    context: any
    data: Record<string, any>
  }): Promise<CDPEvent> {
    const event: CDPEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customer_id: eventData.customer_id,
      event_type: eventData.event_type,
      event_category: eventData.event_category,
      context: {
        session_id: eventData.context.session_id || `session_${Date.now()}`,
        page_url: eventData.context.page_url,
        referrer: eventData.context.referrer,
        user_agent: eventData.context.user_agent || '',
        timestamp: new Date(),
        device: {
          type: eventData.context.device?.type || 'desktop',
          os: eventData.context.device?.os || '',
          browser: eventData.context.device?.browser || '',
          screen_resolution: eventData.context.device?.screen_resolution || ''
        },
        location: eventData.context.location,
        campaign: eventData.context.campaign
      },
      data: eventData.data,
      ai_processed: false,
      created_at: new Date()
    }
    
    cdpEventsDB.push(event)
    
    // Trigger AI analysis
    await this.triggerAIAnalysis(event)
    
    return event
  }
  
  // AI analysis for real-time personalization
  static async triggerAIAnalysis(event: CDPEvent): Promise<void> {
    const profile = customerProfilesDB.get(event.customer_id)
    if (!profile) return
    
    // Analyze event for AI insights
    const aiInsights = await this.analyzeEventForAI(event, profile)
    event.ai_insights = aiInsights
    event.ai_processed = true
    event.processed_at = new Date()
    
    // Update customer profile based on event
    await this.updateProfileFromEvent(profile, event)
  }
  
  // AI event analysis
  static async analyzeEventForAI(event: CDPEvent, profile: CustomerProfile): Promise<any> {
    // This would integrate with Gemini API for real analysis
    // For now, return mock insights based on event type
    
    const insights: any = {}
    
    switch (event.event_type) {
      case 'product_view':
        insights.intent_detected = 'browsing'
        insights.conversion_probability = 0.3
        insights.next_best_action = 'show_related_products'
        insights.personalization_opportunity = 'category_preference'
        break
        
      case 'cart_add':
        insights.intent_detected = 'purchasing'
        insights.conversion_probability = 0.7
        insights.next_best_action = 'abandoned_cart_email'
        insights.personalization_opportunity = 'price_sensitivity'
        break
        
      case 'checkout_complete':
        insights.intent_detected = 'converted'
        insights.conversion_probability = 1.0
        insights.next_best_action = 'post_purchase_upsell'
        insights.personalization_opportunity = 'loyalty_optimization'
        break
        
      case 'email_open':
        insights.intent_detected = 'engaged'
        insights.conversion_probability = 0.4
        insights.next_best_action = 'send_follow_up_email'
        insights.personalization_opportunity = 'timing_optimization'
        break
    }
    
    return insights
  }
  
  // Update profile based on event
  static async updateProfileFromEvent(profile: CustomerProfile, event: CDPEvent): Promise<void> {
    // Update engagement score
    profile.behavior.last_active = new Date()
    profile.behavior.engagement_score = Math.min(100, profile.behavior.engagement_score + 5)
    
    // Update context
    if (event.context.page_url) {
      profile.context.current_page = event.context.page_url
    }
    
    // Update based on event type
    switch (event.event_type) {
      case 'product_view':
        if (event.data.category) {
          if (!profile.behavior.preferred_categories.includes(event.data.category)) {
            profile.behavior.preferred_categories.push(event.data.category)
          }
        }
        break
        
      case 'cart_add':
        profile.context.current_cart_value += event.data.price || 0
        profile.context.current_cart_items.push(event.data.product_id)
        break
        
      case 'checkout_complete':
        profile.financial.total_spent += event.data.total || 0
        profile.financial.average_order_value = profile.financial.total_spent / 
          (profile.financial.total_spent > 0 ? 1 : 1)
        profile.context.current_cart_value = 0
        profile.context.current_cart_items = []
        break
    }
    
    profile.updated_at = new Date()
    customerProfilesDB.set(profile.id, profile)
  }
  
  // Get AI-ready customer data
  static async getCustomerForAI(customerId: string): Promise<CustomerProfile | null> {
    return customerProfilesDB.get(customerId) || null
  }
  
  // Get customer events for AI analysis
  static async getCustomerEvents(customerId: string, limit: number = 50): Promise<CDPEvent[]> {
    return cdpEventsDB
      .filter(event => event.customer_id === customerId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit)
  }
  
  // Get AI insights for personalization
  static async getPersonalizationInsights(customerId: string): Promise<any> {
    const profile = await this.getCustomerForAI(customerId)
    if (!profile) return null
    
    return {
      customer_id: customerId,
      segments: [profile.ai_insights.primary_segment, ...profile.ai_insights.secondary_segments],
      recommendations: {
        products: profile.ai_insights.recommended_products,
        categories: profile.ai_insights.recommended_categories,
        offers: profile.ai_insights.recommended_offers
      },
      messaging: {
        tone: profile.ai_insights.recommended_messaging_tone,
        channels: profile.ai_insights.recommended_channels,
        optimal_time: profile.ai_insights.optimal_send_time,
        optimal_frequency: profile.ai_insights.optimal_frequency
      },
      next_actions: {
        campaign_type: profile.ai_insights.optimal_campaign_type,
        discount_percentage: profile.ai_insights.optimal_discount_percentage,
        urgency_level: profile.behavior.engagement_score < 30 ? 'high' : 'medium'
      }
    }
  }
}

// API Routes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    
    switch (action) {
      case 'capture_profile':
        const profile = await CDPDataCapture.captureProfile(data)
        return NextResponse.json({ success: true, profile })
        
      case 'capture_event':
        const event = await CDPDataCapture.captureEvent(data)
        return NextResponse.json({ success: true, event })
        
      case 'get_personalization_insights':
        const insights = await CDPDataCapture.getPersonalizationInsights(data.customer_id)
        return NextResponse.json({ success: true, insights })
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('CDP API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')
    const action = searchParams.get('action')
    
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
    }
    
    switch (action) {
      case 'profile':
        const profile = await CDPDataCapture.getCustomerForAI(customerId)
        return NextResponse.json({ success: true, profile })
        
      case 'events':
        const limit = parseInt(searchParams.get('limit') || '50')
        const events = await CDPDataCapture.getCustomerEvents(customerId, limit)
        return NextResponse.json({ success: true, events })
        
      case 'insights':
        const insights = await CDPDataCapture.getPersonalizationInsights(customerId)
        return NextResponse.json({ success: true, insights })
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('CDP API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 