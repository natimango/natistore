'use client'

import React, { useState, useEffect } from 'react'
import { CustomerLoyaltyProfile, LoyaltyPointsTransaction } from '../app/api/loyalty-points/route'
import AILoyaltyInsights from './AILoyaltyInsights'

interface LoyaltyPointsDashboardProps {
  customerId: string
}

const LoyaltyPointsDashboard: React.FC<LoyaltyPointsDashboardProps> = ({ customerId }) => {
  const [profile, setProfile] = useState<CustomerLoyaltyProfile | null>(null)
  const [transactions, setTransactions] = useState<LoyaltyPointsTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [redeemPoints, setRedeemPoints] = useState('')
  const [redeemDescription, setRedeemDescription] = useState('')
  const [redeeming, setRedeeming] = useState(false)

  useEffect(() => {
    loadLoyaltyData()
  }, [customerId])

  const loadLoyaltyData = async () => {
    try {
      setLoading(true)
      
      // Load profile
      const profileResponse = await fetch(`/api/loyalty-points?action=profile&customer_id=${customerId}`)
      const profileData = await profileResponse.json()
      setProfile(profileData)

      // Load transactions
      const transactionsResponse = await fetch(`/api/loyalty-points?action=transactions&customer_id=${customerId}`)
      const transactionsData = await transactionsResponse.json()
      setTransactions(transactionsData)
    } catch (error) {
      console.error('Error loading loyalty data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRedeemPoints = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!redeemPoints || !redeemDescription) {
      alert('Please fill in all fields')
      return
    }

    const points = parseInt(redeemPoints)
    if (isNaN(points) || points <= 0) {
      alert('Please enter a valid number of points')
      return
    }

    try {
      setRedeeming(true)
      
      const response = await fetch('/api/loyalty-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'redeem_points',
          customer_id: customerId,
          points,
          description: redeemDescription
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setProfile(result.profile)
        setTransactions(prev => [result.transaction, ...prev])
        setRedeemPoints('')
        setRedeemDescription('')
        alert(`Successfully redeemed ${points} points for $${result.discount_amount.toFixed(2)} discount!`)
      } else {
        alert(result.error || 'Failed to redeem points')
      }
    } catch (error) {
      console.error('Error redeeming points:', error)
      alert('Failed to redeem points')
    } finally {
      setRedeeming(false)
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'text-purple-600 bg-purple-100'
      case 'gold': return 'text-yellow-600 bg-yellow-100'
      case 'silver': return 'text-gray-600 bg-gray-100'
      default: return 'text-orange-600 bg-orange-100'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum': return '💎'
      case 'gold': return '🥇'
      case 'silver': return '🥈'
      default: return '🥉'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Unable to load loyalty points data</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">NATI Loyalty Program</h1>
        <p className="text-gray-600">Earn points with every purchase and unlock exclusive rewards</p>
      </div>

      {/* Points Overview */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{profile.current_balance.toLocaleString()}</div>
            <div className="text-indigo-100">Current Balance</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{profile.total_points_earned.toLocaleString()}</div>
            <div className="text-indigo-100">Total Earned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">${(profile.current_balance * 0.01).toFixed(2)}</div>
            <div className="text-indigo-100">Available Value</div>
          </div>
        </div>
      </div>

      {/* Tier Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Tier Status</h2>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getTierIcon(profile.tier)}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(profile.tier)}`}>
                {profile.tier.charAt(0).toUpperCase() + profile.tier.slice(1)} Tier
              </span>
            </div>
            <p className="text-gray-600 mt-2">
              {profile.tier_multiplier}x points multiplier on all purchases
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{profile.tier_multiplier}x</div>
            <div className="text-gray-600">Multiplier</div>
          </div>
        </div>
      </div>

      {/* Redeem Points */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Redeem Points</h2>
        <form onSubmit={handleRedeemPoints} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Points to Redeem (Min: 100)
            </label>
            <input
              type="number"
              value={redeemPoints}
              onChange={(e) => setRedeemPoints(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter points to redeem"
              min="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={redeemDescription}
              onChange={(e) => setRedeemDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Birthday discount, Referral bonus"
            />
          </div>
          <button
            type="submit"
            disabled={redeeming || !redeemPoints || !redeemDescription}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {redeeming ? 'Redeeming...' : 'Redeem Points'}
          </button>
        </form>
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Conversion Rate:</strong> 1 point = $0.01<br />
            <strong>Minimum Redemption:</strong> 100 points = $1.00
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    transaction.points > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-sm text-gray-600">
                      {formatDate(transaction.created_at.toString())}
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.points > 0 ? '+' : ''}{transaction.points} points
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Insights */}
      <AILoyaltyInsights customerId={customerId} />

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-indigo-600 font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Earn Points</h3>
            <p className="text-gray-600 text-sm">
              Earn 10 points for every $1 spent, with tier multipliers
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-indigo-600 font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Build Tier</h3>
            <p className="text-gray-600 text-sm">
              Reach higher tiers for better multipliers and exclusive benefits
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-indigo-600 font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Redeem Rewards</h3>
            <p className="text-gray-600 text-sm">
              Convert points to discounts on future purchases
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoyaltyPointsDashboard 