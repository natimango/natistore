import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { question, customer_id } = await request.json()

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    // Get customer data for context
    const customerData = await getCustomerContext(customer_id)

    // Create AI prompt with customer context
    const prompt = createCustomerAssistantPrompt(question, customerData)

    // Generate AI response
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(prompt)
    const response = await result.response.text()

    return NextResponse.json({ 
      success: true, 
      response: response.trim(),
      customer_context: customerData
    })

  } catch (error) {
    console.error('AI Customer Assistant Error:', error)
    return NextResponse.json({ 
      error: 'Sorry, I\'m having trouble connecting right now. Please try again.' 
    }, { status: 500 })
  }
}

async function getCustomerContext(customerId: string) {
  try {
    // Get customer profile
    const profileResponse = await fetch(`http://localhost:3000/api/cdp?action=profile&customer_id=${customerId}`)
    const profileData = await profileResponse.json()

    // Get customer events
    const eventsResponse = await fetch(`http://localhost:3000/api/cdp?action=events&customer_id=${customerId}&limit=10`)
    const eventsData = await eventsResponse.json()

    // Get loyalty data
    const loyaltyResponse = await fetch(`http://localhost:3000/api/loyalty-points?action=profile&customer_id=${customerId}`)
    const loyaltyData = await loyaltyResponse.json()

    return {
      profile: profileData.profile,
      recent_events: eventsData.events,
      loyalty: loyaltyData.profile
    }
  } catch (error) {
    console.error('Error getting customer context:', error)
    return {}
  }
}

function createCustomerAssistantPrompt(question: string, customerData: any) {
  const profile = customerData.profile
  const loyalty = customerData.loyalty
  const events = customerData.recent_events

  return `You are NATI's AI Customer Assistant, helping customers with their orders, loyalty points, and shopping experience. 

CUSTOMER CONTEXT:
- Customer ID: ${profile?.id || 'Unknown'}
- Name: ${profile?.name || 'Valued Customer'}
- Email: ${profile?.email || 'Not provided'}
- Loyalty Tier: ${loyalty?.tier || profile?.loyalty?.tier || 'Bronze'}
- Points Balance: ${loyalty?.points_balance || profile?.loyalty?.points_balance || 0}
- Total Points Earned: ${loyalty?.points_earned_total || profile?.loyalty?.points_earned_total || 0}
- AI Segment: ${profile?.ai_insights?.primary_segment || 'New Customer'}
- Preferred Categories: ${profile?.behavior?.preferred_categories?.join(', ') || 'None yet'}

RECENT ACTIVITY:
${events?.map((event: any) => `- ${event.event_type}: ${JSON.stringify(event.data)}`).join('\n') || 'No recent activity'}

CUSTOMER QUESTION: "${question}"

INSTRUCTIONS:
1. Answer in a friendly, helpful tone
2. Use the customer's name when appropriate
3. Provide specific information about their loyalty points, orders, or recommendations
4. If asking about points, explain how they can earn more or redeem them
5. If asking about recommendations, suggest products based on their preferences
6. Keep responses concise but informative
7. If you don't have enough information, ask for clarification
8. Always be encouraging and positive about their NATI experience

Please provide a helpful response to the customer's question:`
}

// Example usage and testing
export async function GET() {
  return NextResponse.json({
    message: 'NATI AI Customer Assistant API',
    usage: 'POST with { question: string, customer_id: string }',
    example: {
      question: 'How many points do I have?',
      customer_id: 'customer_123'
    }
  })
} 