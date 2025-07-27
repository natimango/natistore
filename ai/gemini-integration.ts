/**
 * GEMINI AI INTEGRATION
 * Handles all AI interactions using Google's Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  success: boolean;
  content: string;
  error?: string;
  usage?: {
    promptTokens: number;
    responseTokens: number;
    totalTokens: number;
  };
}

export class GeminiIntegration {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = {
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      maxTokens: 2048,
      ...config
    };

    this.genAI = new GoogleGenerativeAI(this.config.apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: this.config.model!,
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens,
      },
    });
  }

  /**
   * Generate customer insights and recommendations
   */
  async generateCustomerInsights(customerData: any): Promise<AIResponse> {
    const prompt = `
      Analyze this customer data and provide insights:
      
      Customer Profile:
      - Name: ${customerData.name || 'Unknown'}
      - Email: ${customerData.email || 'Unknown'}
      - Total Orders: ${customerData.totalOrders || 0}
      - Total Spent: ₹${customerData.totalSpent || 0}
      - Last Purchase: ${customerData.lastPurchase || 'Never'}
      - Preferred Categories: ${customerData.preferredCategories?.join(', ') || 'None'}
      - Average Order Value: ₹${customerData.averageOrderValue || 0}
      
      Business Context:
      - Business: NATI (Handcrafted Indian products)
      - Categories: Jewelry, Home Decor, Textiles, Collectibles
      - Target Market: Indian consumers seeking authentic handcrafted products
      
      Please provide:
      1. Customer segment analysis
      2. Purchase behavior insights
      3. Personalized product recommendations
      4. Marketing message suggestions
      5. Churn risk assessment
      
      Format your response as JSON with these keys:
      {
        "segment": "string",
        "insights": ["array of insights"],
        "recommendations": ["array of product recommendations"],
        "marketingMessage": "personalized message",
        "churnRisk": "low/medium/high",
        "nextBestAction": "specific action to take"
      }
    `;

    return this.generateResponse(prompt);
  }

  /**
   * Generate personalized marketing messages
   */
  async generateMarketingMessage(context: any): Promise<AIResponse> {
    const prompt = `
      Create a personalized marketing message for this context:
      
      Context:
      - Customer Name: ${context.customerName || 'Valued Customer'}
      - Campaign Type: ${context.campaignType || 'General'}
      - Product Category: ${context.productCategory || 'Handcrafted Products'}
      - Previous Purchase: ${context.previousPurchase || 'None'}
      - Cultural Event: ${context.culturalEvent || 'None'}
      - Message Channel: ${context.channel || 'Email'}
      
      Business Context:
      - NATI: Authentic handcrafted Indian products
      - Supporting local artisans and traditional crafts
      - Cultural significance and heritage preservation
      
      Requirements:
      1. Personalized and warm tone
      2. Cultural sensitivity (Indian context)
      3. Authentic voice reflecting artisan values
      4. Clear call-to-action
      5. Appropriate for ${context.channel || 'Email'} channel
      
      Create a compelling message that feels personal and authentic.
    `;

    return this.generateResponse(prompt);
  }

  /**
   * Generate product recommendations
   */
  async generateProductRecommendations(customerProfile: any, availableProducts: any[]): Promise<AIResponse> {
    const prompt = `
      Generate personalized product recommendations:
      
      Customer Profile:
      - Previous Purchases: ${customerProfile.previousPurchases?.join(', ') || 'None'}
      - Preferred Categories: ${customerProfile.preferredCategories?.join(', ') || 'None'}
      - Budget Range: ₹${customerProfile.budgetRange || '1000-5000'}
      - Style Preferences: ${customerProfile.stylePreferences?.join(', ') || 'Traditional'}
      
      Available Products (${availableProducts.length} items):
      ${availableProducts.map(p => `- ${p.name} (${p.category}) - ₹${p.price}`).join('\n')}
      
      Business Context:
      - NATI: Handcrafted Indian products
      - Categories: Jewelry, Home Decor, Textiles, Collectibles
      - Cultural significance and artisan stories
      
      Please recommend 3-5 products that would be perfect for this customer.
      Consider:
      1. Previous purchase patterns
      2. Cultural preferences
      3. Budget constraints
      4. Seasonal relevance
      5. Personalization opportunities
      
      Format as JSON:
      {
        "recommendations": [
          {
            "productId": "string",
            "reason": "why this product is perfect",
            "personalizedMessage": "custom message for this product"
          }
        ],
        "totalRecommendations": "number"
      }
    `;

    return this.generateResponse(prompt);
  }

  /**
   * Generate dynamic pricing suggestions
   */
  async generatePricingStrategy(productData: any, marketData: any): Promise<AIResponse> {
    const prompt = `
      Analyze pricing strategy for this product:
      
      Product Details:
      - Name: ${productData.name}
      - Current Price: ₹${productData.currentPrice}
      - Cost: ₹${productData.cost}
      - Category: ${productData.category}
      - Inventory: ${productData.inventory}
      - Demand Level: ${productData.demandLevel || 'Medium'}
      
      Market Context:
      - Competitor Prices: ${marketData.competitorPrices?.join(', ') || 'Unknown'}
      - Market Demand: ${marketData.marketDemand || 'Medium'}
      - Seasonal Factor: ${marketData.seasonalFactor || 'None'}
      - Cultural Events: ${marketData.culturalEvents?.join(', ') || 'None'}
      
      Business Goals:
      - Maximize revenue while maintaining competitiveness
      - Support artisan fair compensation
      - Maintain product accessibility
      
      Provide pricing recommendations considering:
      1. Cost structure and margins
      2. Market competition
      3. Demand elasticity
      4. Seasonal factors
      5. Cultural relevance
      
      Format as JSON:
      {
        "recommendedPrice": "number",
        "priceRange": {"min": "number", "max": "number"},
        "reasoning": "explanation",
        "confidence": "high/medium/low",
        "factors": ["list of key factors"]
      }
    `;

    return this.generateResponse(prompt);
  }

  /**
   * Generate inventory forecasting
   */
  async generateInventoryForecast(productData: any, historicalData: any): Promise<AIResponse> {
    const prompt = `
      Forecast inventory needs for this product:
      
      Product: ${productData.name}
      Current Inventory: ${productData.currentInventory}
      Category: ${productData.category}
      
      Historical Data (last 6 months):
      - Average Monthly Sales: ${historicalData.averageMonthlySales || 0}
      - Peak Month Sales: ${historicalData.peakMonthSales || 0}
      - Seasonal Patterns: ${historicalData.seasonalPatterns?.join(', ') || 'None'}
      
      Market Factors:
      - Upcoming Events: ${historicalData.upcomingEvents?.join(', ') || 'None'}
      - Market Trends: ${historicalData.marketTrends || 'Stable'}
      - Competitor Activity: ${historicalData.competitorActivity || 'Normal'}
      
      Business Context:
      - NATI: Handcrafted products with artisan production
      - Lead time for restocking: 2-4 weeks
      - Minimum viable inventory: 10 units
      
      Provide inventory recommendations:
      1. Recommended stock level for next 3 months
      2. Reorder timing and quantities
      3. Risk factors to consider
      4. Seasonal adjustments needed
      
      Format as JSON:
      {
        "recommendedStock": "number",
        "reorderQuantity": "number",
        "reorderTiming": "when to reorder",
        "riskFactors": ["list of risks"],
        "seasonalAdjustments": ["adjustments needed"]
      }
    `;

    return this.generateResponse(prompt);
  }

  /**
   * Generate campaign optimization suggestions
   */
  async generateCampaignOptimization(campaignData: any, performanceData: any): Promise<AIResponse> {
    const prompt = `
      Optimize this marketing campaign:
      
      Campaign Details:
      - Type: ${campaignData.type}
      - Target Audience: ${campaignData.targetAudience}
      - Current Performance: ${campaignData.currentPerformance}
      - Budget: ₹${campaignData.budget}
      
      Performance Data:
      - Open Rate: ${performanceData.openRate || '0%'}
      - Click Rate: ${performanceData.clickRate || '0%'}
      - Conversion Rate: ${performanceData.conversionRate || '0%'}
      - Revenue Generated: ₹${performanceData.revenue || 0}
      - Customer Feedback: ${performanceData.feedback?.join(', ') || 'None'}
      
      Business Context:
      - NATI: Handcrafted Indian products
      - Cultural sensitivity important
      - Supporting artisan communities
      
      Provide optimization recommendations:
      1. Message improvements
      2. Timing adjustments
      3. Audience targeting refinements
      4. Budget allocation suggestions
      5. A/B testing ideas
      
      Format as JSON:
      {
        "messageOptimizations": ["suggestions"],
        "timingRecommendations": ["timing advice"],
        "audienceRefinements": ["targeting improvements"],
        "budgetSuggestions": ["budget optimization"],
        "abTestingIdeas": ["testing suggestions"],
        "expectedImprovement": "percentage improvement expected"
      }
    `;

    return this.generateResponse(prompt);
  }

  /**
   * Generate churn prevention strategies
   */
  async generateChurnPrevention(customerData: any, riskFactors: any): Promise<AIResponse> {
    const prompt = `
      Develop churn prevention strategy for this customer:
      
      Customer Profile:
      - Name: ${customerData.name}
      - Total Orders: ${customerData.totalOrders}
      - Last Purchase: ${customerData.lastPurchase}
      - Average Order Value: ₹${customerData.averageOrderValue}
      - Preferred Categories: ${customerData.preferredCategories?.join(', ') || 'None'}
      
      Risk Factors:
      - Days Since Last Purchase: ${riskFactors.daysSinceLastPurchase}
      - Engagement Level: ${riskFactors.engagementLevel}
      - Complaint History: ${riskFactors.complaints || 'None'}
      - Competitor Activity: ${riskFactors.competitorActivity || 'None'}
      
      Business Context:
      - NATI: Handcrafted Indian products
      - Cultural connection important
      - Artisan stories and heritage
      
      Create a personalized retention strategy:
      1. Immediate actions to take
      2. Personalized re-engagement message
      3. Special offers or incentives
      4. Follow-up sequence
      5. Long-term relationship building
      
      Format as JSON:
      {
        "riskLevel": "low/medium/high",
        "immediateActions": ["actions to take now"],
        "personalizedMessage": "re-engagement message",
        "specialOffers": ["offer suggestions"],
        "followUpSequence": ["follow-up steps"],
        "longTermStrategy": ["relationship building"]
      }
    `;

    return this.generateResponse(prompt);
  }

  /**
   * Core response generation method
   */
  private async generateResponse(prompt: string): Promise<AIResponse> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        content: text,
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          responseTokens: response.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata?.totalTokenCount || 0,
        }
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Test the Gemini connection
   */
  async testConnection(): Promise<AIResponse> {
    const testPrompt = `
      You are an AI assistant for NATI, a handcrafted Indian products business.
      Please respond with a simple test message confirming you're working.
      Keep it brief and friendly.
    `;

    return this.generateResponse(testPrompt);
  }
}

// Export a factory function for easy instantiation
export function createGeminiIntegration(apiKey: string, options?: Partial<GeminiConfig>): GeminiIntegration {
  return new GeminiIntegration({
    apiKey,
    ...options
  });
} 