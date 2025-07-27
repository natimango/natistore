'use client'

import React, { useState, useEffect } from 'react'

interface AIRecommendation {
  type: string
  description: string
  reasoning: string
}

interface AILoyaltyInsightsProps {
  customerId: string
}

const AILoyaltyInsights: React.FC<AILoyaltyInsightsProps> = ({ customerId }) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState(false)

  useEffect(() => {
    loadAIRecommendations()
  }, [customerId])

  const loadAIRecommendations = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/ai-loyalty-integration?action=recommendations&customer_id=${customerId}`)
      const data = await response.json()
      
      if (data.success) {
        setRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error('Error loading AI recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const executeAIActions = async () => {
    try {
      setExecuting(true)
      const response = await fetch('/api/ai-loyalty-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'execute_ai_actions',
          customer_id: customerId
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`AI executed ${result.actions_executed} actions! Check your loyalty dashboard for updates.`)
        // Refresh recommendations
        await loadAIRecommendations()
      }
    } catch (error) {
      console.error('Error executing AI actions:', error)
      alert('Failed to execute AI actions')
    } finally {
      setExecuting(false)
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'bonus_points': return '🎁'
      case 'tier_upgrade': return '⭐'
      case 'personalized_offer': return '💡'
      case 'reengagement': return '📧'
      default: return '🤖'
    }
  }

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'bonus_points': return 'bg-green-100 text-green-800'
      case 'tier_upgrade': return 'bg-purple-100 text-purple-800'
      case 'personalized_offer': return 'bg-blue-100 text-blue-800'
      case 'reengagement': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">AI-Powered Insights</h2>
          <p className="text-gray-600 text-sm">Personalized recommendations for your loyalty journey</p>
        </div>
        <button
          onClick={executeAIActions}
          disabled={executing || recommendations.length === 0}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {executing ? 'Executing...' : 'Apply AI Actions'}
        </button>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🤖</div>
          <p className="text-gray-600">No AI recommendations available at the moment</p>
          <p className="text-gray-500 text-sm mt-2">Complete more purchases to unlock personalized insights</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getRecommendationIcon(recommendation.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationColor(recommendation.type)}`}>
                      {recommendation.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{recommendation.description}</h3>
                  <p className="text-sm text-gray-600">{recommendation.reasoning}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">How AI Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>Behavior Analysis:</strong> AI analyzes your purchase patterns, activity frequency, and loyalty engagement
          </div>
          <div>
            <strong>Predictive Actions:</strong> Based on your behavior, AI suggests personalized rewards and offers
          </div>
          <div>
            <strong>Real-time Optimization:</strong> Recommendations update automatically as your behavior changes
          </div>
          <div>
            <strong>Value Maximization:</strong> AI ensures you get the most value from your loyalty membership
          </div>
        </div>
      </div>
    </div>
  )
}

export default AILoyaltyInsights 