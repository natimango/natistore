'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface CustomerProfile {
  id: string
  email?: string
  name?: string
  loyalty: {
    tier: 'bronze' | 'silver' | 'gold' | 'platinum'
    points_balance: number
    points_earned_total: number
    points_redeemed_total: number
  }
  ai_insights: {
    primary_segment: string
    recommended_products: string[]
    recommended_categories: string[]
    recommended_offers: string[]
    next_purchase_probability: number
    next_purchase_category: string
  }
}

interface Order {
  id: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: Array<{
    product_id: string
    product_name: string
    price: number
    quantity: number
  }>
}

interface Recommendation {
  id: string
  name: string
  price: number
  image: string
  category: string
  reason: string
}

export default function CustomerDashboard() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [aiAssistant, setAiAssistant] = useState('')
  const [aiResponse, setAiResponse] = useState('')

  useEffect(() => {
    loadCustomerData()
  }, [])

  const loadCustomerData = async () => {
    try {
      setLoading(true)
      
      // Load customer profile
      const customerId = localStorage.getItem('nati_customer_id') || 'demo-customer-123'
      const profileResponse = await fetch(`/api/cdp?action=profile&customer_id=${customerId}`)
      const profileData = await profileResponse.json()
      setProfile(profileData.profile)

      // Load AI insights
      const insightsResponse = await fetch(`/api/cdp?action=insights&customer_id=${customerId}`)
      const insightsData = await insightsResponse.json()
      
      // Load mock orders (replace with real API)
      setOrders([
        {
          id: 'ORD-001',
          date: '2024-01-15',
          status: 'delivered',
          total: 1299.99,
          items: [
            { product_id: '1', product_name: 'Handcrafted Silver Necklace', price: 899.99, quantity: 1 },
            { product_id: '2', product_name: 'Traditional Rajasthani Earrings', price: 400.00, quantity: 1 }
          ]
        },
        {
          id: 'ORD-002',
          date: '2024-01-10',
          status: 'shipped',
          total: 599.99,
          items: [
            { product_id: '3', product_name: 'Artisan Copper Bracelet', price: 599.99, quantity: 1 }
          ]
        }
      ])

      // Load AI recommendations
      setRecommendations([
        {
          id: 'rec-1',
          name: 'Royal Gold Anklet',
          price: 799.99,
          image: '/api/placeholder/200/200',
          category: 'jewelry',
          reason: 'Based on your love for traditional jewelry'
        },
        {
          id: 'rec-2',
          name: 'Handwoven Silk Scarf',
          price: 299.99,
          image: '/api/placeholder/200/200',
          category: 'accessories',
          reason: 'Perfect match for your style preferences'
        },
        {
          id: 'rec-3',
          name: 'Artisan Pottery Vase',
          price: 449.99,
          image: '/api/placeholder/200/200',
          category: 'home',
          reason: 'New from artists in Rajasthan'
        },
        {
          id: 'rec-4',
          name: 'Traditional Silver Ring',
          price: 349.99,
          image: '/api/placeholder/200/200',
          category: 'jewelry',
          reason: 'Similar to items you\'ve viewed'
        }
      ])

    } catch (error) {
      console.error('Error loading customer data:', error)
    } finally {
      setLoading(false)
    }
  }

  const askAI = async () => {
    if (!aiAssistant.trim()) return
    
    setAiResponse('🤖 AI is thinking...')
    
    try {
      const response = await fetch('/api/ai/customer-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: aiAssistant,
          customer_id: profile?.id
        })
      })
      
      const data = await response.json()
      setAiResponse(data.response)
    } catch (error) {
      setAiResponse('Sorry, I\'m having trouble connecting right now. Please try again.')
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-gradient-to-r from-purple-500 to-pink-500'
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-orange-500'
      case 'silver': return 'bg-gradient-to-r from-gray-400 to-gray-600'
      default: return 'bg-gradient-to-r from-amber-600 to-orange-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'shipped': return 'text-blue-600 bg-blue-100'
      case 'processing': return 'text-yellow-600 bg-yellow-100'
      case 'pending': return 'text-gray-600 bg-gray-100'
      default: return 'text-red-600 bg-red-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {profile?.name || 'Valued Customer'}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Your personalized NATI experience, powered by AI
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-white font-semibold ${getTierColor(profile?.loyalty.tier || 'bronze')}`}>
              {profile?.loyalty.tier?.toUpperCase()} Member
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AI Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  🤖 Just for you, {profile?.name || 'Valued Customer'}
                </h2>
                <Link href="/customer/recommendations" className="text-indigo-600 hover:text-indigo-800">
                  View all →
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="group cursor-pointer">
                    <div className="bg-gray-200 rounded-lg aspect-square mb-2 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">Image</span>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm group-hover:text-indigo-600">
                      {rec.name}
                    </h3>
                    <p className="text-indigo-600 font-semibold text-sm">₹{rec.price}</p>
                    <p className="text-xs text-gray-500 mt-1">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">📦 Recent Orders</h2>
                <Link href="/customer/orders" className="text-indigo-600 hover:text-indigo-800">
                  View all →
                </Link>
              </div>
              
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">Order {order.id}</h3>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{order.total}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🤖 AI Assistant</h2>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={aiAssistant}
                    onChange={(e) => setAiAssistant(e.target.value)}
                    placeholder="Ask me anything about your orders, points, or recommendations..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyPress={(e) => e.key === 'Enter' && askAI()}
                  />
                  <button
                    onClick={askAI}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Ask
                  </button>
                </div>
                {aiResponse && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800">{aiResponse}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Loyalty Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">⭐ Loyalty Status</h2>
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`inline-block px-4 py-2 rounded-full text-white font-semibold mb-2 ${getTierColor(profile?.loyalty.tier || 'bronze')}`}>
                    {profile?.loyalty.tier?.toUpperCase()}
                  </div>
                  <p className="text-sm text-gray-600">Current Tier</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">
                    {profile?.loyalty.points_balance || 0}
                  </div>
                  <p className="text-sm text-gray-600">Available Points</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Earned</span>
                    <span className="font-medium">{profile?.loyalty.points_earned_total || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Redeemed</span>
                    <span className="font-medium">{profile?.loyalty.points_redeemed_total || 0}</span>
                  </div>
                </div>
                
                <Link 
                  href="/customer/loyalty"
                  className="block w-full bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-700"
                >
                  Manage Points
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">⚡ Quick Actions</h2>
              <div className="space-y-3">
                <Link 
                  href="/products"
                  className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700"
                >
                  🛍️ Shop Now
                </Link>
                <Link 
                  href="/customer/orders"
                  className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
                >
                  📦 Track Orders
                </Link>
                <Link 
                  href="/customer/settings"
                  className="block w-full bg-gray-600 text-white text-center py-2 rounded-lg hover:bg-gray-700"
                >
                  ⚙️ Settings
                </Link>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🧠 AI Insights</h2>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-600">Segment</p>
                  <p className="font-medium">{profile?.ai_insights.primary_segment || 'New Customer'}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Next Purchase Probability</p>
                  <p className="font-medium">{profile?.ai_insights.next_purchase_probability || 0}%</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Recommended Category</p>
                  <p className="font-medium">{profile?.ai_insights.next_purchase_category || 'Jewelry'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 