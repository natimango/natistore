import { NextRequest, NextResponse } from 'next/server'

// In-memory order storage (replace with PostgreSQL in production)
const orders = new Map()
let orderCounter = 1000

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const customerId = searchParams.get('customer_id')
    const orderId = searchParams.get('order_id')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (action === 'customer_orders' && customerId) {
      const customerOrders = Array.from(orders.values())
        .filter((order: any) => order.customer_id === customerId)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(offset, offset + limit)

      return NextResponse.json({
        success: true,
        orders: customerOrders,
        pagination: {
          total: customerOrders.length,
          limit,
          offset,
          has_more: offset + limit < customerOrders.length
        }
      })
    }

    if (action === 'order_details' && orderId) {
      const order = orders.get(orderId)
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      // Add AI insights to order
      const aiInsights = await generateOrderInsights(order, customerId)
      order.ai_insights = aiInsights

      return NextResponse.json({
        success: true,
        order
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Orders API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch orders' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'create':
        return await createOrder(data)
      
      case 'update_status':
        return await updateOrderStatus(data)
      
      case 'cancel':
        return await cancelOrder(data)
      
      case 'refund':
        return await processRefund(data)
      
      case 'track_event':
        return await trackOrderEvent(data)
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Orders API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to process order' 
    }, { status: 500 })
  }
}

async function createOrder(data: any) {
  const {
    customer_id,
    cart_items,
    shipping_address,
    billing_address,
    payment_method,
    coupon_code,
    customer_notes
  } = data

  // Validate cart
  if (!cart_items || cart_items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  // Calculate totals
  const subtotal = cart_items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.18 // 18% GST
  const shipping = subtotal > 1000 ? 0 : 100 // Free shipping over ₹1000
  
  // Apply coupon if provided
  let discount = 0
  if (coupon_code) {
    const coupons: Record<string, any> = {
      'WELCOME10': { discount: 0.10, max_discount: 200 },
      'LOYALTY20': { discount: 0.20, max_discount: 500 }
    }
    const coupon = coupons[coupon_code]
    if (coupon) {
      discount = Math.min(subtotal * coupon.discount, coupon.max_discount)
    }
  }

  const total = subtotal + tax + shipping - discount

  // Generate order ID
  const orderId = `NATI${++orderCounter}`

  // Create order object
  const order = {
    id: orderId,
    customer_id,
    items: cart_items,
    totals: {
      subtotal,
      tax,
      shipping,
      discount,
      total
    },
    addresses: {
      shipping: shipping_address,
      billing: billing_address
    },
    payment: {
      method: payment_method,
      status: 'pending',
      transaction_id: null
    },
    status: 'pending',
    status_history: [
      {
        status: 'pending',
        timestamp: new Date().toISOString(),
        note: 'Order created'
      }
    ],
    shipping: {
      method: 'standard',
      tracking_number: null,
      estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      actual_delivery: null
    },
    customer_notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  // Save order
  orders.set(orderId, order)

  // Track order creation event
  await trackOrderEvent({
    customer_id,
    order_id: orderId,
    event_type: 'order_created',
    data: {
      order_value: total,
      items_count: cart_items.length,
      payment_method,
      coupon_used: !!coupon_code
    }
  })

  // Award loyalty points
  const pointsEarned = Math.floor(subtotal * 0.1) // 10% points
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/loyalty-points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'award_purchase',
      customer_id,
      points: pointsEarned,
      order_id: orderId,
      order_value: subtotal
    })
  })

  // Update customer profile with purchase behavior
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'capture_event',
      data: {
        customer_id,
        event_type: 'purchase_completed',
        event_category: 'commerce',
        context: {
          timestamp: new Date().toISOString()
        },
        data: {
          order_id: orderId,
          order_value: total,
          items_count: cart_items.length,
          categories: [...new Set(cart_items.map((item: any) => item.category))],
          payment_method,
          coupon_used: !!coupon_code
        }
      }
    })
  })

  return NextResponse.json({
    success: true,
    order: {
      ...order,
      ai_insights: await generateOrderInsights(order, customer_id)
    }
  })
}

async function updateOrderStatus(data: any) {
  const { order_id, status, note } = data

  const order = orders.get(order_id)
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Update status
  order.status = status
  order.updated_at = new Date().toISOString()

  // Add to status history
  order.status_history.push({
    status,
    timestamp: new Date().toISOString(),
    note: note || `Order status updated to ${status}`
  })

  // Handle specific status updates
  if (status === 'confirmed') {
    order.payment.status = 'paid'
    order.payment.transaction_id = `TXN${Date.now()}`
  }

  if (status === 'shipped') {
    order.shipping.tracking_number = `TRK${Date.now()}`
  }

  if (status === 'delivered') {
    order.shipping.actual_delivery = new Date().toISOString()
  }

  // Track status update event
  await trackOrderEvent({
    customer_id: order.customer_id,
    order_id,
    event_type: 'order_status_updated',
    data: {
      new_status: status,
      previous_status: order.status_history[order.status_history.length - 2]?.status || 'unknown'
    }
  })

  // Send notifications based on status
  await sendStatusNotification(order, status)

  return NextResponse.json({
    success: true,
    order: {
      ...order,
      ai_insights: await generateOrderInsights(order, order.customer_id)
    }
  })
}

async function cancelOrder(data: any) {
  const { order_id, reason } = data

  const order = orders.get(order_id)
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (order.status === 'delivered') {
    return NextResponse.json({ error: 'Cannot cancel delivered order' }, { status: 400 })
  }

  // Update status
  order.status = 'cancelled'
  order.updated_at = new Date().toISOString()

  order.status_history.push({
    status: 'cancelled',
    timestamp: new Date().toISOString(),
    note: `Order cancelled: ${reason}`
  })

  // Process refund if payment was made
  if (order.payment.status === 'paid') {
    order.payment.status = 'refunded'
    order.payment.refund_id = `REF${Date.now()}`
  }

  // Track cancellation event
  await trackOrderEvent({
    customer_id: order.customer_id,
    order_id,
    event_type: 'order_cancelled',
    data: {
      reason,
      order_value: order.totals.total
    }
  })

  return NextResponse.json({
    success: true,
    order: {
      ...order,
      ai_insights: await generateOrderInsights(order, order.customer_id)
    }
  })
}

async function processRefund(data: any) {
  const { order_id, amount, reason } = data

  const order = orders.get(order_id)
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (order.payment.status !== 'paid') {
    return NextResponse.json({ error: 'Order not paid' }, { status: 400 })
  }

  // Process refund
  order.payment.status = 'refunded'
  order.payment.refund_id = `REF${Date.now()}`
  order.payment.refund_amount = amount
  order.payment.refund_reason = reason

  order.status_history.push({
    status: 'refunded',
    timestamp: new Date().toISOString(),
    note: `Refund processed: ${reason}`
  })

  // Track refund event
  await trackOrderEvent({
    customer_id: order.customer_id,
    order_id,
    event_type: 'order_refunded',
    data: {
      refund_amount: amount,
      reason
    }
  })

  return NextResponse.json({
    success: true,
    order: {
      ...order,
      ai_insights: await generateOrderInsights(order, order.customer_id)
    }
  })
}

async function trackOrderEvent(data: any) {
  const { customer_id, order_id, event_type, event_data } = data

  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'capture_event',
      data: {
        customer_id,
        event_type,
        event_category: 'commerce',
        context: {
          timestamp: new Date().toISOString()
        },
        data: {
          order_id,
          ...event_data
        }
      }
    })
  })

  return NextResponse.json({ success: true })
}

async function generateOrderInsights(order: any, customerId: string): Promise<any> {
  try {
    // Get customer profile
    const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp?action=profile&customer_id=${customerId}`)
    const profileData = await profileResponse.json()

    const insights = {
      order_analysis: {
        order_value_tier: getOrderValueTier(order.totals.total),
        customer_lifetime_value: calculateCLV(order, profileData.profile),
        repeat_purchase_probability: calculateRepeatPurchaseProbability(order, profileData.profile),
        churn_risk: calculateChurnRisk(order, profileData.profile)
      },
      recommendations: {
        next_purchase_suggestions: await getNextPurchaseSuggestions(order, customerId),
        cross_sell_opportunities: await getCrossSellOpportunities(order, customerId),
        retention_strategies: getRetentionStrategies(order, profileData.profile)
      },
      fulfillment_optimization: {
        delivery_optimization: getDeliveryOptimization(order),
        inventory_impact: calculateInventoryImpact(order),
        supplier_recommendations: getSupplierRecommendations(order)
      }
    }

    return insights
  } catch (error) {
    console.error('Error generating order insights:', error)
    return {}
  }
}

function getOrderValueTier(total: number): string {
  if (total >= 5000) return 'premium'
  if (total >= 2000) return 'high'
  if (total >= 1000) return 'medium'
  return 'low'
}

function calculateCLV(order: any, profile: any): number {
  const baseCLV = profile?.financial?.lifetime_value || 0
  return baseCLV + order.totals.total
}

function calculateRepeatPurchaseProbability(order: any, profile: any): number {
  let probability = 0.5 // Base probability

  // Higher probability for satisfied customers
  if (profile?.behavior?.engagement_score > 70) {
    probability += 0.2
  }

  // Higher probability for high-value orders
  if (order.totals.total > 2000) {
    probability += 0.15
  }

  // Lower probability for new customers
  if (profile?.ai_insights?.primary_segment === 'new_customer') {
    probability -= 0.1
  }

  return Math.min(Math.max(probability, 0), 1)
}

function calculateChurnRisk(order: any, profile: any): number {
  let risk = 0.3 // Base risk

  // Higher risk for low-value orders
  if (order.totals.total < 500) {
    risk += 0.2
  }

  // Higher risk for new customers
  if (profile?.ai_insights?.primary_segment === 'new_customer') {
    risk += 0.15
  }

  // Lower risk for loyal customers
  if (profile?.loyalty?.tier === 'gold' || profile?.loyalty?.tier === 'platinum') {
    risk -= 0.2
  }

  return Math.min(Math.max(risk, 0), 1)
}

async function getNextPurchaseSuggestions(order: any, customerId: string): Promise<any[]> {
  const categories = [...new Set(order.items.map((item: any) => item.category))]
  
  // Simple suggestion logic (replace with AI recommendations)
  const suggestions = categories.map(category => ({
    category,
    reason: 'Based on your recent purchase',
    confidence: 0.8,
    estimated_value: order.totals.total * 0.7
  }))

  return suggestions.slice(0, 3)
}

async function getCrossSellOpportunities(order: any, customerId: string): Promise<any[]> {
  const opportunities: any[] = []

  // Check for complementary products
  order.items.forEach((item: any) => {
    if (item.category === 'jewelry') {
      opportunities.push({
        type: 'complementary',
        category: 'accessories',
        reason: 'Perfect with your jewelry',
        confidence: 0.9
      })
    }
  })

  return opportunities
}

function getRetentionStrategies(order: any, profile: any): string[] {
  const strategies: string[] = []

  if (profile?.loyalty?.tier === 'bronze') {
    strategies.push('Upgrade to Silver tier for better benefits')
  }

  if (order.totals.total < 1000) {
    strategies.push('Next purchase over ₹1000 gets free shipping')
  }

  if (profile?.ai_insights?.primary_segment === 'new_customer') {
    strategies.push('Complete your profile for personalized recommendations')
  }

  return strategies
}

function getDeliveryOptimization(order: any): any {
  return {
    current_method: order.shipping.method,
    recommended_method: order.totals.total > 2000 ? 'express' : 'standard',
    estimated_savings: order.totals.total > 2000 ? 50 : 0,
    delivery_optimization: 'Route optimization for faster delivery'
  }
}

function calculateInventoryImpact(order: any): any {
  const impact = {
    items_affected: order.items.length,
    stock_reduction: order.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
    reorder_alerts: order.items.filter((item: any) => item.stock < 5).length,
    supplier_notifications: 0
  }

  return impact
}

function getSupplierRecommendations(order: any): any[] {
  const recommendations: any[] = []

  // Check for low stock items
  order.items.forEach((item: any) => {
    if (item.stock < 10) {
      recommendations.push({
        supplier: item.supplier || 'Unknown',
        action: 'Restock required',
        urgency: 'high',
        estimated_lead_time: 14
      })
    }
  })

  return recommendations
}

async function sendStatusNotification(order: any, status: string) {
  // Send email/SMS notification based on status
  const notifications = {
    confirmed: {
      type: 'email',
      template: 'order_confirmed',
      subject: 'Your NATI order has been confirmed!'
    },
    shipped: {
      type: 'sms',
      template: 'order_shipped',
      message: `Your order ${order.id} has been shipped! Track it here: ${order.shipping.tracking_number}`
    },
    delivered: {
      type: 'email',
      template: 'order_delivered',
      subject: 'Your NATI order has been delivered!'
    }
  }

  const notification = notifications[status as keyof typeof notifications]
  if (notification) {
    // In production, integrate with email/SMS service
    console.log(`Sending ${notification.type} notification for order ${order.id}`)
  }
} 