import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo purposes
// In production, this would be a database
const loyaltyPointsDB = new Map<string, any>()
const transactionsDB = new Map<string, any>()

export interface LoyaltyPointsConfig {
  pointsPerDollar: number
  pointsExpiryDays: number
  minimumPointsRedemption: number
  pointsToCurrencyRatio: number
}

export interface LoyaltyPointsTransaction {
  id: string
  customer_id: string
  points: number
  type: 'earned' | 'redeemed' | 'expired' | 'bonus'
  order_id?: string
  description: string
  created_at: Date
  expires_at?: Date
}

export interface CustomerLoyaltyProfile {
  customer_id: string
  total_points_earned: number
  total_points_redeemed: number
  current_balance: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  tier_multiplier: number
  last_activity: Date
}

const config: LoyaltyPointsConfig = {
  pointsPerDollar: 10,
  pointsExpiryDays: 365,
  minimumPointsRedemption: 100,
  pointsToCurrencyRatio: 0.01, // 1 point = $0.01
}

// Helper functions
function getCustomerLoyaltyProfile(customerId: string): CustomerLoyaltyProfile {
  const existing = loyaltyPointsDB.get(customerId)
  if (existing) {
    return existing
  }

  const defaultProfile: CustomerLoyaltyProfile = {
    customer_id: customerId,
    total_points_earned: 0,
    total_points_redeemed: 0,
    current_balance: 0,
    tier: 'bronze',
    tier_multiplier: 1.0,
    last_activity: new Date()
  }

  loyaltyPointsDB.set(customerId, defaultProfile)
  return defaultProfile
}

function updateCustomerLoyaltyProfile(customerId: string, profile: CustomerLoyaltyProfile) {
  loyaltyPointsDB.set(customerId, profile)
}

function createTransaction(data: Omit<LoyaltyPointsTransaction, 'id' | 'created_at'>): LoyaltyPointsTransaction {
  const transaction: LoyaltyPointsTransaction = {
    id: Math.random().toString(36).substr(2, 9),
    ...data,
    created_at: new Date()
  }

  transactionsDB.set(transaction.id, transaction)
  return transaction
}

function calculateTierMultiplier(totalPoints: number): { tier: string; multiplier: number } {
  if (totalPoints >= 10000) {
    return { tier: 'platinum', multiplier: 2.0 }
  } else if (totalPoints >= 5000) {
    return { tier: 'gold', multiplier: 1.5 }
  } else if (totalPoints >= 1000) {
    return { tier: 'silver', multiplier: 1.2 }
  }
  return { tier: 'bronze', multiplier: 1.0 }
}

// API Routes
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customer_id')
  const action = searchParams.get('action')

  if (!customerId) {
    return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
  }

  switch (action) {
    case 'profile':
      const profile = getCustomerLoyaltyProfile(customerId)
      return NextResponse.json(profile)

    case 'transactions':
      const transactions = Array.from(transactionsDB.values())
        .filter((t: LoyaltyPointsTransaction) => t.customer_id === customerId)
        .sort((a: LoyaltyPointsTransaction, b: LoyaltyPointsTransaction) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      return NextResponse.json(transactions)

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, customer_id, ...data } = body

    if (!customer_id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }

    switch (action) {
      case 'award_order_points':
        const { order_id, order_total } = data
        const profile = getCustomerLoyaltyProfile(customer_id)
        
        // Calculate points based on order total and tier
        const basePoints = Math.floor(order_total * config.pointsPerDollar)
        const tierPoints = Math.floor(basePoints * profile.tier_multiplier)
        
        // Create transaction
        const transaction = createTransaction({
          customer_id,
          points: tierPoints,
          type: 'earned',
          order_id,
          description: `Points earned from order #${order_id}`,
          expires_at: new Date(Date.now() + config.pointsExpiryDays * 24 * 60 * 60 * 1000)
        })

        // Update customer profile
        const updatedProfile: CustomerLoyaltyProfile = {
          ...profile,
          total_points_earned: profile.total_points_earned + tierPoints,
          current_balance: profile.current_balance + tierPoints,
          last_activity: new Date()
        }

        // Check for tier upgrade
        const { tier, multiplier } = calculateTierMultiplier(updatedProfile.total_points_earned)
        updatedProfile.tier = tier as 'bronze' | 'silver' | 'gold' | 'platinum'
        updatedProfile.tier_multiplier = multiplier

        updateCustomerLoyaltyProfile(customer_id, updatedProfile)

        // Emit event for AI marketing agent (in production, this would be a real event)
        console.log('LOYALTY_POINTS_EARNED:', {
          customer_id,
          points: tierPoints,
          order_id,
          transaction_id: transaction.id,
          tier_upgrade: tier !== profile.tier
        })

        return NextResponse.json({
          success: true,
          transaction,
          profile: updatedProfile,
          tier_upgrade: tier !== profile.tier
        })

      case 'redeem_points':
        const { points, description } = data
        const customerProfile = getCustomerLoyaltyProfile(customer_id)
        
        if (points < config.minimumPointsRedemption) {
          return NextResponse.json({ 
            error: `Minimum redemption is ${config.minimumPointsRedemption} points` 
          }, { status: 400 })
        }
        
        if (points > customerProfile.current_balance) {
          return NextResponse.json({ error: 'Insufficient points balance' }, { status: 400 })
        }

        // Create redemption transaction
        const redemptionTransaction = createTransaction({
          customer_id,
          points: -points,
          type: 'redeemed',
          description: description || 'Points redeemed'
        })

        // Update customer profile
        const updatedCustomerProfile: CustomerLoyaltyProfile = {
          ...customerProfile,
          total_points_redeemed: customerProfile.total_points_redeemed + points,
          current_balance: customerProfile.current_balance - points,
          last_activity: new Date()
        }

        updateCustomerLoyaltyProfile(customer_id, updatedCustomerProfile)

        // Emit event for AI marketing agent
        console.log('LOYALTY_POINTS_REDEEMED:', {
          customer_id,
          points,
          transaction_id: redemptionTransaction.id,
          discount_amount: points * config.pointsToCurrencyRatio
        })

        return NextResponse.json({
          success: true,
          transaction: redemptionTransaction,
          profile: updatedCustomerProfile,
          discount_amount: points * config.pointsToCurrencyRatio
        })

      case 'award_bonus':
        const { bonus_points, bonus_description } = data
        const bonusProfile = getCustomerLoyaltyProfile(customer_id)
        
        // Create bonus transaction
        const bonusTransaction = createTransaction({
          customer_id,
          points: bonus_points,
          type: 'bonus',
          description: bonus_description || 'Bonus points awarded',
          expires_at: new Date(Date.now() + config.pointsExpiryDays * 24 * 60 * 60 * 1000)
        })

        // Update customer profile
        const updatedBonusProfile: CustomerLoyaltyProfile = {
          ...bonusProfile,
          total_points_earned: bonusProfile.total_points_earned + bonus_points,
          current_balance: bonusProfile.current_balance + bonus_points,
          last_activity: new Date()
        }

        updateCustomerLoyaltyProfile(customer_id, updatedBonusProfile)

        // Emit event for AI marketing agent
        console.log('LOYALTY_POINTS_BONUS:', {
          customer_id,
          points: bonus_points,
          description: bonus_description,
          transaction_id: bonusTransaction.id
        })

        return NextResponse.json({
          success: true,
          transaction: bonusTransaction,
          profile: updatedBonusProfile
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Loyalty points API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 