import { NextRequest, NextResponse } from 'next/server'

// In-memory cart storage (replace with Redis/PostgreSQL in production)
const carts = new Map()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
    }

    const cart = carts.get(customerId) || {
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Calculate totals
    cart.subtotal = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    cart.tax = cart.subtotal * 0.18 // 18% GST
    cart.shipping = cart.subtotal > 1000 ? 0 : 100 // Free shipping over ₹1000
    cart.total = cart.subtotal + cart.tax + cart.shipping - cart.discount

    // Add AI insights
    const aiInsights = await generateCartInsights(cart, customerId)

    return NextResponse.json({
      success: true,
      cart: {
        ...cart,
        ai_insights: aiInsights
      }
    })

  } catch (error) {
    console.error('Cart API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch cart' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, customer_id, data } = await request.json()

    if (!customer_id) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
    }

    let cart = carts.get(customer_id) || {
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    switch (action) {
      case 'add':
        await handleAddToCart(cart, data, customer_id)
        break

      case 'update':
        await handleUpdateCart(cart, data, customer_id)
        break

      case 'remove':
        await handleRemoveFromCart(cart, data, customer_id)
        break

      case 'clear':
        await handleClearCart(cart, customer_id)
        break

      case 'apply_coupon':
        await handleApplyCoupon(cart, data, customer_id)
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Update cart timestamp
    cart.updated_at = new Date().toISOString()

    // Save cart
    carts.set(customer_id, cart)

    // Track cart event
    await trackCartEvent(action, cart, customer_id, data)

    return NextResponse.json({
      success: true,
      cart: {
        ...cart,
        ai_insights: await generateCartInsights(cart, customer_id)
      }
    })

  } catch (error) {
    console.error('Cart API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to update cart' 
    }, { status: 500 })
  }
}

async function handleAddToCart(cart: any, data: any, customerId: string) {
  const { product_id, variant_id, quantity = 1 } = data

  // Get product details
  const productResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products?action=view`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'view',
      data: {
        customer_id: customerId,
        product_id,
        variant_id
      }
    })
  })

  // Check if item already exists
  const existingItemIndex = cart.items.findIndex((item: any) => 
    item.product_id === product_id && item.variant_id === variant_id
  )

  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += quantity
  } else {
    // Add new item (simplified - in production, fetch from product database)
    cart.items.push({
      product_id,
      variant_id,
      name: data.name || 'Product',
      price: data.price || 0,
      quantity,
      added_at: new Date().toISOString()
    })
  }
}

async function handleUpdateCart(cart: any, data: any, customerId: string) {
  const { product_id, variant_id, quantity } = data

  const itemIndex = cart.items.findIndex((item: any) => 
    item.product_id === product_id && item.variant_id === variant_id
  )

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1)
    } else {
      cart.items[itemIndex].quantity = quantity
    }
  }
}

async function handleRemoveFromCart(cart: any, data: any, customerId: string) {
  const { product_id, variant_id } = data

  const itemIndex = cart.items.findIndex((item: any) => 
    item.product_id === product_id && item.variant_id === variant_id
  )

  if (itemIndex >= 0) {
    cart.items.splice(itemIndex, 1)
  }
}

async function handleClearCart(cart: any, customerId: string) {
  cart.items = []
  cart.discount = 0
}

async function handleApplyCoupon(cart: any, data: any, customerId: string) {
  const { coupon_code } = data

  // Get customer profile for personalized coupons
  const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp?action=profile&customer_id=${customerId}`)
  const profileData = await profileResponse.json()

  // Simple coupon logic (replace with database lookup)
  const coupons: Record<string, any> = {
    'WELCOME10': { discount: 0.10, min_amount: 500, max_discount: 200 },
    'LOYALTY20': { discount: 0.20, min_amount: 1000, max_discount: 500 },
    'FREESHIP': { free_shipping: true, min_amount: 500 }
  }

  const coupon = coupons[coupon_code]

  if (coupon) {
    if (coupon.free_shipping) {
      cart.shipping = 0
    } else if (coupon.discount) {
      const discountAmount = Math.min(
        cart.subtotal * coupon.discount,
        coupon.max_discount
      )
      cart.discount = discountAmount
    }
  }
}

async function trackCartEvent(action: string, cart: any, customerId: string, data: any) {
  const eventType = action === 'add' ? 'cart_add' : 
                   action === 'update' ? 'cart_update' :
                   action === 'remove' ? 'cart_remove' :
                   action === 'clear' ? 'cart_clear' : 'cart_action'

  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'capture_event',
      data: {
        customer_id: customerId,
        event_type: eventType,
        event_category: 'commerce',
        context: {
          timestamp: new Date().toISOString()
        },
        data: {
          action,
          cart_value: cart.subtotal,
          cart_items_count: cart.items.length,
          cart_items: cart.items.map((item: any) => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price: item.price
          })),
          ...data
        }
      }
    })
  })
}

async function generateCartInsights(cart: any, customerId: string): Promise<any> {
  try {
    // Get customer profile
    const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp?action=profile&customer_id=${customerId}`)
    const profileData = await profileResponse.json()

    const insights = {
      cart_value_insights: {
        current_value: cart.subtotal,
        free_shipping_threshold: 1000,
        amount_to_free_shipping: Math.max(0, 1000 - cart.subtotal),
        savings_opportunity: calculateSavingsOpportunity(cart, profileData.profile)
      },
      recommendations: {
        cross_sell_products: await getCrossSellRecommendations(cart, customerId),
        upsell_opportunities: await getUpsellOpportunities(cart, customerId),
        loyalty_benefits: await getLoyaltyBenefits(cart, customerId)
      },
      conversion_optimization: {
        cart_abandonment_risk: calculateAbandonmentRisk(cart, profileData.profile),
        suggested_actions: getSuggestedActions(cart, profileData.profile),
        urgency_indicators: getUrgencyIndicators(cart)
      }
    }

    return insights
  } catch (error) {
    console.error('Error generating cart insights:', error)
    return {}
  }
}

function calculateSavingsOpportunity(cart: any, profile: any): any[] {
  const opportunities: any[] = []

  // Free shipping opportunity
  if (cart.subtotal < 1000) {
    opportunities.push({
      type: 'free_shipping',
      message: `Add ₹${1000 - cart.subtotal} more for free shipping`,
      potential_savings: 100
    })
  }

  // Loyalty tier opportunity
  if (profile?.loyalty?.tier === 'bronze' && cart.subtotal > 500) {
    opportunities.push({
      type: 'loyalty_upgrade',
      message: 'Upgrade to Silver tier for 5% extra discount',
      potential_savings: cart.subtotal * 0.05
    })
  }

  return opportunities
}

async function getCrossSellRecommendations(cart: any, customerId: string): Promise<any[]> {
  // Get product categories in cart
  const cartCategories = [...new Set(cart.items.map((item: any) => item.category))]

  // Simple cross-sell logic (replace with AI recommendations)
  const crossSellMap = {
    'jewelry': ['accessories', 'clothing'],
    'accessories': ['jewelry', 'clothing'],
    'clothing': ['jewelry', 'accessories']
  }

  const recommendedCategories = cartCategories.flatMap(cat => crossSellMap[cat as keyof typeof crossSellMap] || [])

  return recommendedCategories.slice(0, 3).map(category => ({
    category,
    reason: 'Frequently bought together',
    confidence: 0.8
  }))
}

async function getUpsellOpportunities(cart: any, customerId: string): Promise<any[]> {
  const opportunities: any[] = []

  // Check for premium variants
  cart.items.forEach((item: any) => {
    if (item.price < 500) {
      opportunities.push({
        product_id: item.product_id,
        type: 'premium_variant',
        message: 'Upgrade to premium version for better quality',
        potential_value: item.price * 0.3
      })
    }
  })

  return opportunities
}

async function getLoyaltyBenefits(cart: any, customerId: string): Promise<any> {
  // Get loyalty profile
  const loyaltyResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/loyalty-points?action=profile&customer_id=${customerId}`)
  const loyaltyData = await loyaltyResponse.json()

  const pointsEarned = Math.floor(cart.subtotal * 0.1) // 10% points
  const pointsToNextTier = loyaltyData.profile?.points_to_next_tier || 0

  return {
    points_earned: pointsEarned,
    points_to_next_tier: pointsToNextTier,
    tier_benefits: getTierBenefits(loyaltyData.profile?.tier || 'bronze'),
    redemption_opportunities: getRedemptionOpportunities(loyaltyData.profile?.points_balance || 0, cart.subtotal)
  }
}

function getTierBenefits(tier: string): any {
  const benefits = {
    bronze: { discount: 0.05, shipping: 'Paid' },
    silver: { discount: 0.10, shipping: 'Free over ₹500' },
    gold: { discount: 0.15, shipping: 'Free' },
    platinum: { discount: 0.20, shipping: 'Free + Priority' }
  }
  return benefits[tier as keyof typeof benefits] || benefits.bronze
}

function getRedemptionOpportunities(pointsBalance: number, cartValue: number): any[] {
  const opportunities = []

  if (pointsBalance >= 100) {
    opportunities.push({
      type: 'points_redemption',
      message: `Redeem ${pointsBalance} points for ₹${pointsBalance * 0.1} discount`,
      potential_savings: pointsBalance * 0.1
    })
  }

  return opportunities
}

function calculateAbandonmentRisk(cart: any, profile: any): number {
  let risk = 0.3 // Base risk

  // Higher risk for new customers
  if (profile?.ai_insights?.primary_segment === 'new_customer') {
    risk += 0.2
  }

  // Higher risk for high-value carts
  if (cart.subtotal > 2000) {
    risk += 0.15
  }

  // Lower risk for returning customers
  if (profile?.behavior?.session_frequency > 3) {
    risk -= 0.1
  }

  return Math.min(Math.max(risk, 0), 1)
}

function getSuggestedActions(cart: any, profile: any): string[] {
  const actions = []

  if (cart.subtotal < 1000) {
    actions.push('Add more items for free shipping')
  }

  if (profile?.loyalty?.tier === 'bronze') {
    actions.push('Complete purchase to earn loyalty points')
  }

  if (cart.items.length === 1) {
    actions.push('Consider adding complementary items')
  }

  return actions
}

function getUrgencyIndicators(cart: any): any {
  return {
    low_stock_items: cart.items.filter((item: any) => item.stock < 5).length,
    limited_time_offers: 2, // Mock data
    popular_items: cart.items.filter((item: any) => item.ratings?.average > 4.5).length
  }
} 