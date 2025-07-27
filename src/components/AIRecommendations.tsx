'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface Recommendation {
  id: string
  name: string
  price: number
  image: string
  category: string
  reason: string
  confidence: number
}

interface AIRecommendationsProps {
  customerId?: string
  currentProductId?: string
  maxItems?: number
}

export default function AIRecommendations({ 
  customerId, 
  currentProductId, 
  maxItems = 4 
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [customerName, setCustomerName] = useState('')
  const [aiInsights, setAiInsights] = useState<any>(null)

  useEffect(() => {
    loadRecommendations()
  }, [customerId, currentProductId])

  const loadRecommendations = async () => {
    try {
      setLoading(true)
      
      // Get customer ID from localStorage if not provided
      const cid = customerId || localStorage.getItem('nati_customer_id') || 'demo-customer-123'
      
      // Get AI insights for personalization
      const insightsResponse = await fetch(`/api/cdp?action=insights&customer_id=${cid}`)
      const insightsData = await insightsResponse.json()
      setAiInsights(insightsData.insights)
      
      // Get customer profile for name
      const profileResponse = await fetch(`/api/cdp?action=profile&customer_id=${cid}`)
      const profileData = await profileResponse.json()
      setCustomerName(profileData.profile?.name || 'Valued Customer')

      // Generate AI recommendations
      const recommendations = await generateAIRecommendations(cid, currentProductId, insightsData.insights)
      setRecommendations(recommendations.slice(0, maxItems))

    } catch (error) {
      console.error('Error loading recommendations:', error)
      // Fallback to default recommendations
      setRecommendations(getDefaultRecommendations())
    } finally {
      setLoading(false)
    }
  }

  const generateAIRecommendations = async (cid: string, currentProductId?: string, insights?: any): Promise<Recommendation[]> => {
    try {
      // This would integrate with Gemini API for real recommendations
      // For now, return smart mock recommendations based on insights
      
      const baseRecommendations = [
        {
          id: 'rec-1',
          name: 'Royal Gold Anklet',
          price: 799.99,
          image: '/api/placeholder/200/200',
          category: 'jewelry',
          reason: insights?.recommendations?.categories?.includes('jewelry') 
            ? 'Based on your love for traditional jewelry' 
            : 'Popular among our customers',
          confidence: 0.85
        },
        {
          id: 'rec-2',
          name: 'Handwoven Silk Scarf',
          price: 299.99,
          image: '/api/placeholder/200/200',
          category: 'accessories',
          reason: insights?.recommendations?.categories?.includes('accessories')
            ? 'Perfect match for your style preferences'
            : 'Complements your recent purchases',
          confidence: 0.78
        },
        {
          id: 'rec-3',
          name: 'Artisan Pottery Vase',
          price: 449.99,
          image: '/api/placeholder/200/200',
          category: 'home',
          reason: 'New from artists in Rajasthan',
          confidence: 0.72
        },
        {
          id: 'rec-4',
          name: 'Traditional Silver Ring',
          price: 349.99,
          image: '/api/placeholder/200/200',
          category: 'jewelry',
          reason: insights?.recommendations?.products?.length > 0
            ? 'Similar to items you\'ve viewed'
            : 'Trending in your region',
          confidence: 0.68
        },
        {
          id: 'rec-5',
          name: 'Handcrafted Leather Bag',
          price: 899.99,
          image: '/api/placeholder/200/200',
          category: 'accessories',
          reason: insights?.recommendations?.offers?.length > 0
            ? 'Eligible for your tier discount'
            : 'Premium artisan craftsmanship',
          confidence: 0.65
        },
        {
          id: 'rec-6',
          name: 'Traditional Cotton Kurta',
          price: 599.99,
          image: '/api/placeholder/200/200',
          category: 'clothing',
          reason: 'Perfect for upcoming festivals',
          confidence: 0.62
        }
      ]

      // Filter out current product if viewing a specific product
      const filtered = currentProductId 
        ? baseRecommendations.filter(rec => rec.id !== currentProductId)
        : baseRecommendations

      // Sort by confidence and AI insights
      return filtered.sort((a, b) => {
        // Prioritize recommendations based on customer preferences
        const aScore = a.confidence + (insights?.recommendations?.categories?.includes(a.category) ? 0.2 : 0)
        const bScore = b.confidence + (insights?.recommendations?.categories?.includes(b.category) ? 0.2 : 0)
        return bScore - aScore
      })

    } catch (error) {
      console.error('Error generating AI recommendations:', error)
      return getDefaultRecommendations()
    }
  }

  const getDefaultRecommendations = (): Recommendation[] => {
    return [
      {
        id: 'default-1',
        name: 'Handcrafted Silver Necklace',
        price: 899.99,
        image: '/api/placeholder/200/200',
        category: 'jewelry',
        reason: 'Our most popular item',
        confidence: 0.8
      },
      {
        id: 'default-2',
        name: 'Traditional Rajasthani Earrings',
        price: 400.00,
        image: '/api/placeholder/200/200',
        category: 'jewelry',
        reason: 'Perfect for special occasions',
        confidence: 0.75
      },
      {
        id: 'default-3',
        name: 'Artisan Copper Bracelet',
        price: 599.99,
        image: '/api/placeholder/200/200',
        category: 'jewelry',
        reason: 'Handcrafted by local artisans',
        confidence: 0.7
      },
      {
        id: 'default-4',
        name: 'Handwoven Silk Scarf',
        price: 299.99,
        image: '/api/placeholder/200/200',
        category: 'accessories',
        reason: 'Elegant and versatile',
        confidence: 0.65
      }
    ]
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Highly Recommended'
    if (confidence >= 0.6) return 'Recommended'
    return 'You might like'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            🤖 Just for you, {customerName}
          </h2>
          <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg aspect-square mb-2"></div>
              <div className="bg-gray-200 h-4 rounded mb-1"></div>
              <div className="bg-gray-200 h-3 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            🤖 Just for you, {customerName}
          </h2>
          {aiInsights && (
            <p className="text-sm text-gray-600 mt-1">
              Based on your preferences and {aiInsights.segments?.[0] || 'shopping behavior'}
            </p>
          )}
        </div>
        <Link href="/customer/recommendations" className="text-indigo-600 hover:text-indigo-800 text-sm">
          View all →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="group cursor-pointer">
            <div className="relative">
              <div className="bg-gray-200 rounded-lg aspect-square mb-2 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">Image</span>
                </div>
              </div>
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-white shadow-sm ${getConfidenceColor(rec.confidence)}`}>
                {getConfidenceText(rec.confidence)}
              </div>
            </div>
            <h3 className="font-medium text-gray-900 text-sm group-hover:text-indigo-600 line-clamp-2">
              {rec.name}
            </h3>
            <p className="text-indigo-600 font-semibold text-sm">₹{rec.price}</p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{rec.reason}</p>
          </div>
        ))}
      </div>

      {aiInsights && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-indigo-600">🧠</span>
            <span className="text-sm font-medium text-indigo-900">AI Insight</span>
          </div>
          <p className="text-sm text-indigo-800">
            {aiInsights.next_actions?.campaign_type === 'new_product' 
              ? 'We\'ve found some new products that match your style!'
              : `You're ${aiInsights.next_actions?.discount_percentage || 10}% away from unlocking exclusive offers.`
            }
          </p>
        </div>
      )}
    </div>
  )
} 