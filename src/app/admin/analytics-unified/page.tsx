'use client'

import React, { useState, useEffect } from 'react'

interface UnifiedEvent {
  id: string
  source: string
  type: string
  customer_id?: string
  meta: any
  timestamp: string
  funnel_stage?: string
  attribution_data?: any
  ai_insights?: any
}

interface FunnelMetrics {
  awareness: number
  consideration: number
  purchase: number
  retention: number
  advocacy: number
  total: number
  conversion_rates: {
    awareness_to_consideration: string
    consideration_to_purchase: string
    purchase_to_retention: string
  }
}

interface CustomerJourney {
  customer_id: string
  total_events: number
  first_interaction: string
  last_interaction: string
  journey: any[]
}

export default function UnifiedAnalyticsPage() {
  const [events, setEvents] = useState<UnifiedEvent[]>([])
  const [funnelMetrics, setFunnelMetrics] = useState<FunnelMetrics | null>(null)
  const [customerJourneys, setCustomerJourneys] = useState<CustomerJourney[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')

  useEffect(() => {
    loadAnalyticsData()
    const interval = setInterval(loadAnalyticsData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [timeRange])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Load all events
      const eventsResponse = await fetch('/api/events')
      const eventsData = await eventsResponse.json()
      setEvents(eventsData.events || [])

      // Calculate funnel metrics
      const funnel = calculateFunnelMetrics(eventsData.events || [])
      setFunnelMetrics(funnel)

      // Load customer journeys
      const uniqueCustomers = [...new Set(eventsData.events?.map((e: UnifiedEvent) => e.customer_id).filter(Boolean) || [])]
      const journeys = await Promise.all(
        uniqueCustomers.map(async (customerId) => {
          const journeyResponse = await fetch(`/api/events?customer_id=${customerId}`)
          const journeyData = await journeyResponse.json()
          return {
            customer_id: customerId,
            total_events: journeyData.events?.length || 0,
            first_interaction: journeyData.events?.[journeyData.events.length - 1]?.timestamp,
            last_interaction: journeyData.events?.[0]?.timestamp,
            journey: journeyData.events || []
          }
        })
      )
      setCustomerJourneys(journeys)

    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateFunnelMetrics = (events: UnifiedEvent[]): FunnelMetrics => {
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
        awareness_to_consideration: funnel.awareness > 0 ? (funnel.consideration / funnel.awareness * 100).toFixed(2) : '0',
        consideration_to_purchase: funnel.consideration > 0 ? (funnel.purchase / funnel.consideration * 100).toFixed(2) : '0',
        purchase_to_retention: funnel.purchase > 0 ? (funnel.retention / funnel.purchase * 100).toFixed(2) : '0'
      }
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'website': return '🌐'
      case 'meta_ads': return '📘'
      case 'google_ads': return '🔍'
      case 'email': return '📧'
      case 'whatsapp': return '💬'
      case 'push': return '📱'
      case 'ai_agent': return '🤖'
      default: return '📊'
    }
  }

  const getFunnelColor = (stage: string) => {
    switch (stage) {
      case 'awareness': return 'bg-blue-100 text-blue-800'
      case 'consideration': return 'bg-yellow-100 text-yellow-800'
      case 'purchase': return 'bg-green-100 text-green-800'
      case 'retention': return 'bg-purple-100 text-purple-800'
      case 'advocacy': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NATI AI Marketing Brain</h1>
              <p className="text-gray-600 mt-2">Real-time unified analytics across all customer touchpoints</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <button
                onClick={loadAnalyticsData}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📊</div>
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👥</div>
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customerJourneys.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🎯</div>
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {funnelMetrics?.conversion_rates.consideration_to_purchase || '0'}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🤖</div>
              <div>
                <p className="text-sm text-gray-600">AI Actions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter(e => e.source === 'ai_agent').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Funnel Visualization */}
        {funnelMetrics && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Funnel</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries({
                awareness: funnelMetrics.awareness,
                consideration: funnelMetrics.consideration,
                purchase: funnelMetrics.purchase,
                retention: funnelMetrics.retention,
                advocacy: funnelMetrics.advocacy
              }).map(([stage, count]) => (
                <div key={stage} className="text-center">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getFunnelColor(stage)}`}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{count}</p>
                  <p className="text-sm text-gray-600">
                    {funnelMetrics.total > 0 ? ((count / funnelMetrics.total) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              ))}
            </div>
            
            {/* Conversion Rates */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Awareness → Consideration</p>
                <p className="text-xl font-bold text-blue-600">
                  {funnelMetrics.conversion_rates.awareness_to_consideration}%
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Consideration → Purchase</p>
                <p className="text-xl font-bold text-green-600">
                  {funnelMetrics.conversion_rates.consideration_to_purchase}%
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Purchase → Retention</p>
                <p className="text-xl font-bold text-purple-600">
                  {funnelMetrics.conversion_rates.purchase_to_retention}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Events Feed */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Real-time Events Feed</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.slice(0, 20).map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className="text-xl">{getSourceIcon(event.source)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{event.type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFunnelColor(event.funnel_stage || '')}`}>
                      {event.funnel_stage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {event.customer_id ? `Customer: ${event.customer_id}` : 'Anonymous'} • {formatDate(event.timestamp)}
                  </p>
                  {event.ai_insights && (
                    <p className="text-xs text-indigo-600 mt-1">
                      🤖 AI: {event.ai_insights.next_best_action} (LTV: ₹{event.ai_insights.predicted_ltv?.toFixed(0)})
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Journeys */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Journeys</h2>
          <div className="space-y-4">
            {customerJourneys.map((journey) => (
              <div key={journey.customer_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Customer {journey.customer_id}</h3>
                  <span className="text-sm text-gray-600">{journey.total_events} events</span>
                </div>
                <div className="flex space-x-2 overflow-x-auto">
                  {journey.journey.map((event: any, index: number) => (
                    <div key={index} className="flex-shrink-0 flex items-center space-x-2">
                      <div className="text-lg">{getSourceIcon(event.source)}</div>
                      <div className="text-center">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getFunnelColor(event.funnel_stage || '')}`}>
                          {event.type}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(event.timestamp)}
                        </div>
                      </div>
                      {index < journey.journey.length - 1 && (
                        <div className="text-gray-300">→</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Marketing Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Top Customer Segments</h3>
              <div className="space-y-2">
                {Array.from(new Set(events.map(e => e.ai_insights?.segment).filter(Boolean))).map((segment) => (
                  <div key={segment} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{segment}</span>
                    <span className="text-sm text-gray-600">
                      {events.filter(e => e.ai_insights?.segment === segment).length} customers
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Recommended Actions</h3>
              <div className="space-y-2">
                {Array.from(new Set(events.map(e => e.ai_insights?.next_best_action).filter(Boolean))).map((action) => (
                  <div key={action} className="flex justify-between items-center p-2 bg-indigo-50 rounded">
                    <span className="text-sm font-medium text-indigo-900">{action}</span>
                    <span className="text-sm text-indigo-600">
                      {events.filter(e => e.ai_insights?.next_best_action === action).length} triggers
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
} 