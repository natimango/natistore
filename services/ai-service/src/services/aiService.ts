import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger, logAIOperation } from '../utils/logger';
import { db } from '../config/database';

export interface AIResponse {
  success: boolean;
  content: string;
  error?: string;
  usage?: {
    promptTokens: number;
    responseTokens: number;
    totalTokens: number;
  };
  confidence?: number;
}

export interface CustomerInsight {
  customerId: string;
  segment: string;
  insights: string[];
  recommendations: string[];
  marketingMessage: string;
  churnRisk: 'low' | 'medium' | 'high';
  nextBestAction: string;
  confidence: number;
}

export interface ProductRecommendation {
  productId: string;
  reason: string;
  personalizedMessage: string;
  score: number;
  category: string;
  price: number;
}

export interface PricingStrategy {
  productId: string;
  currentPrice: number;
  recommendedPrice: number;
  reasoning: string;
  confidence: number;
  factors: string[];
}

export interface InventoryForecast {
  productId: string;
  currentStock: number;
  recommendedStock: number;
  reorderQuantity: number;
  reorderTiming: string;
  riskFactors: string[];
  seasonalAdjustments: string[];
}

export interface CampaignOptimization {
  campaignId: string;
  messageOptimizations: string[];
  timingRecommendations: string[];
  audienceRefinements: string[];
  budgetSuggestions: string[];
  abTestingIdeas: string[];
  expectedImprovement: string;
}

export interface ChurnPrevention {
  customerId: string;
  riskLevel: 'low' | 'medium' | 'high';
  immediateActions: string[];
  personalizedMessage: string;
  specialOffers: string[];
  followUpSequence: string[];
  longTermStrategy: string[];
}

class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private isInitialized: boolean = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });
  }

  public async initialize(): Promise<void> {
    try {
      // Test the connection
      const testResult = await this.testConnection();
      if (testResult.success) {
        this.isInitialized = true;
        logger.info('AI Service initialized successfully');
      } else {
        throw new Error(`AI Service initialization failed: ${testResult.error}`);
      }
    } catch (error) {
      logger.error('AI Service initialization error:', error);
      throw error;
    }
  }

  public async generateCustomerInsights(customerData: any): Promise<CustomerInsight> {
    const startTime = Date.now();
    
    try {
      const prompt = `
        Analyze this customer data and provide comprehensive insights:
        
        Customer Profile:
        - ID: ${customerData.customerId}
        - Name: ${customerData.name || 'Unknown'}
        - Email: ${customerData.email || 'Unknown'}
        - Total Orders: ${customerData.totalOrders || 0}
        - Total Spent: ₹${customerData.totalSpent || 0}
        - Last Purchase: ${customerData.lastPurchase || 'Never'}
        - Preferred Categories: ${customerData.preferredCategories?.join(', ') || 'None'}
        - Average Order Value: ₹${customerData.averageOrderValue || 0}
        - Engagement Score: ${customerData.engagementScore || 0}
        
        Business Context:
        - Business: NATI (Handcrafted Indian products)
        - Categories: Jewelry, Home Decor, Textiles, Collectibles
        - Target Market: Indian consumers seeking authentic handcrafted products
        
        Please provide a comprehensive analysis in JSON format:
        {
          "segment": "customer segment (e.g., high-value, regular, new)",
          "insights": ["array of 3-5 key insights about this customer"],
          "recommendations": ["array of 3-5 product recommendations"],
          "marketingMessage": "personalized marketing message (2-3 sentences)",
          "churnRisk": "low/medium/high",
          "nextBestAction": "specific action to take",
          "confidence": "confidence score 0-1"
        }
      `;

      const response = await this.generateResponse(prompt);
      const executionTime = Date.now() - startTime;

      if (response.success) {
        const insight = JSON.parse(response.content);
        logAIOperation('generateCustomerInsights', customerData, insight, executionTime);
        
        // Store insight in database
        await this.storeCustomerInsight(customerData.customerId, insight);
        
        return {
          customerId: customerData.customerId,
          ...insight
        };
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      logger.error('Error generating customer insights:', error);
      throw error;
    }
  }

  public async generateProductRecommendations(customerProfile: any, availableProducts: any[]): Promise<ProductRecommendation[]> {
    const startTime = Date.now();
    
    try {
      const prompt = `
        Generate personalized product recommendations:
        
        Customer Profile:
        - Previous Purchases: ${customerProfile.previousPurchases?.join(', ') || 'None'}
        - Preferred Categories: ${customerProfile.preferredCategories?.join(', ') || 'None'}
        - Budget Range: ₹${customerProfile.budgetRange || '1000-5000'}
        - Style Preferences: ${customerProfile.stylePreferences?.join(', ') || 'Traditional'}
        
        Available Products (${availableProducts.length} items):
        ${availableProducts.map(p => `- ${p.name} (${p.category}) - ₹${p.price} - ID: ${p.id}`).join('\n')}
        
        Business Context:
        - NATI: Handcrafted Indian products
        - Categories: Jewelry, Home Decor, Textiles, Collectibles
        - Cultural significance and artisan stories
        
        Please recommend 3-5 products in JSON format:
        {
          "recommendations": [
            {
              "productId": "product ID",
              "reason": "why this product is perfect for this customer",
              "personalizedMessage": "custom message for this product",
              "score": "recommendation score 0-1",
              "category": "product category",
              "price": "product price"
            }
          ]
        }
      `;

      const response = await this.generateResponse(prompt);
      const executionTime = Date.now() - startTime;

      if (response.success) {
        const result = JSON.parse(response.content);
        logAIOperation('generateProductRecommendations', { customerProfile, productCount: availableProducts.length }, result, executionTime);
        
        // Store recommendations in database
        await this.storeProductRecommendations(customerProfile.customerId, result.recommendations);
        
        return result.recommendations;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      logger.error('Error generating product recommendations:', error);
      throw error;
    }
  }

  public async generatePricingStrategy(productData: any, marketData: any): Promise<PricingStrategy> {
    const startTime = Date.now();
    
    try {
      const prompt = `
        Analyze pricing strategy for this product:
        
        Product Details:
        - ID: ${productData.id}
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
        
        Provide pricing recommendations in JSON format:
        {
          "productId": "${productData.id}",
          "currentPrice": ${productData.currentPrice},
          "recommendedPrice": "recommended price",
          "reasoning": "detailed explanation",
          "confidence": "confidence score 0-1",
          "factors": ["list of key factors considered"]
        }
      `;

      const response = await this.generateResponse(prompt);
      const executionTime = Date.now() - startTime;

      if (response.success) {
        const strategy = JSON.parse(response.content);
        logAIOperation('generatePricingStrategy', { productData, marketData }, strategy, executionTime);
        
        // Store pricing strategy in database
        await this.storePricingStrategy(strategy);
        
        return strategy;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      logger.error('Error generating pricing strategy:', error);
      throw error;
    }
  }

  public async generateInventoryForecast(productData: any, historicalData: any): Promise<InventoryForecast> {
    const startTime = Date.now();
    
    try {
      const prompt = `
        Forecast inventory needs for this product:
        
        Product: ${productData.name} (ID: ${productData.id})
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
        
        Provide inventory recommendations in JSON format:
        {
          "productId": "${productData.id}",
          "currentStock": ${productData.currentInventory},
          "recommendedStock": "recommended stock level for next 3 months",
          "reorderQuantity": "recommended reorder quantity",
          "reorderTiming": "when to reorder",
          "riskFactors": ["list of risks to consider"],
          "seasonalAdjustments": ["seasonal adjustments needed"]
        }
      `;

      const response = await this.generateResponse(prompt);
      const executionTime = Date.now() - startTime;

      if (response.success) {
        const forecast = JSON.parse(response.content);
        logAIOperation('generateInventoryForecast', { productData, historicalData }, forecast, executionTime);
        
        // Store forecast in database
        await this.storeInventoryForecast(forecast);
        
        return forecast;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      logger.error('Error generating inventory forecast:', error);
      throw error;
    }
  }

  public async generateCampaignOptimization(campaignData: any, performanceData: any): Promise<CampaignOptimization> {
    const startTime = Date.now();
    
    try {
      const prompt = `
        Optimize this marketing campaign:
        
        Campaign Details:
        - ID: ${campaignData.id}
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
        
        Provide optimization recommendations in JSON format:
        {
          "campaignId": "${campaignData.id}",
          "messageOptimizations": ["suggestions for message improvements"],
          "timingRecommendations": ["timing advice"],
          "audienceRefinements": ["targeting improvements"],
          "budgetSuggestions": ["budget optimization"],
          "abTestingIdeas": ["testing suggestions"],
          "expectedImprovement": "percentage improvement expected"
        }
      `;

      const response = await this.generateResponse(prompt);
      const executionTime = Date.now() - startTime;

      if (response.success) {
        const optimization = JSON.parse(response.content);
        logAIOperation('generateCampaignOptimization', { campaignData, performanceData }, optimization, executionTime);
        
        return optimization;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      logger.error('Error generating campaign optimization:', error);
      throw error;
    }
  }

  public async generateChurnPrevention(customerData: any, riskFactors: any): Promise<ChurnPrevention> {
    const startTime = Date.now();
    
    try {
      const prompt = `
        Develop churn prevention strategy for this customer:
        
        Customer Profile:
        - ID: ${customerData.customerId}
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
        
        Create a personalized retention strategy in JSON format:
        {
          "customerId": "${customerData.customerId}",
          "riskLevel": "low/medium/high",
          "immediateActions": ["actions to take now"],
          "personalizedMessage": "re-engagement message",
          "specialOffers": ["offer suggestions"],
          "followUpSequence": ["follow-up steps"],
          "longTermStrategy": ["relationship building"]
        }
      `;

      const response = await this.generateResponse(prompt);
      const executionTime = Date.now() - startTime;

      if (response.success) {
        const prevention = JSON.parse(response.content);
        logAIOperation('generateChurnPrevention', { customerData, riskFactors }, prevention, executionTime);
        
        return prevention;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      logger.error('Error generating churn prevention:', error);
      throw error;
    }
  }

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
      logger.error('Gemini API Error:', error);
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  public async testConnection(): Promise<AIResponse> {
    const testPrompt = `
      You are an AI assistant for NATI, a handcrafted Indian products business.
      Please respond with a simple test message confirming you're working.
      Keep it brief and friendly.
    `;

    return this.generateResponse(testPrompt);
  }

  // Database storage methods
  private async storeCustomerInsight(customerId: string, insight: any): Promise<void> {
    try {
      await db.query(
        `INSERT INTO ai_insights (customer_id, insight_type, insight_data, confidence_score)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (customer_id, insight_type) 
         DO UPDATE SET insight_data = $3, confidence_score = $4, updated_at = CURRENT_TIMESTAMP`,
        [customerId, 'customer_intelligence', JSON.stringify(insight), insight.confidence]
      );
    } catch (error) {
      logger.error('Error storing customer insight:', error);
    }
  }

  private async storeProductRecommendations(customerId: string, recommendations: ProductRecommendation[]): Promise<void> {
    try {
      for (const rec of recommendations) {
        await db.query(
          `INSERT INTO product_recommendations (customer_id, product_id, recommendation_score, reason, category, price)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [customerId, rec.productId, rec.score, rec.reason, rec.category, rec.price]
        );
      }
    } catch (error) {
      logger.error('Error storing product recommendations:', error);
    }
  }

  private async storePricingStrategy(strategy: PricingStrategy): Promise<void> {
    try {
      await db.query(
        `INSERT INTO pricing_intelligence (product_id, current_price, recommended_price, pricing_strategy, confidence_score)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (product_id) 
         DO UPDATE SET recommended_price = $3, pricing_strategy = $4, confidence_score = $5, updated_at = CURRENT_TIMESTAMP`,
        [strategy.productId, strategy.currentPrice, strategy.recommendedPrice, strategy.reasoning, strategy.confidence]
      );
    } catch (error) {
      logger.error('Error storing pricing strategy:', error);
    }
  }

  private async storeInventoryForecast(forecast: InventoryForecast): Promise<void> {
    try {
      await db.query(
        `INSERT INTO inventory_forecasting (product_id, current_stock, predicted_demand, recommended_reorder_quantity, reorder_point, confidence_score)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (product_id) 
         DO UPDATE SET current_stock = $2, predicted_demand = $3, recommended_reorder_quantity = $4, reorder_point = $5, confidence_score = $6, updated_at = CURRENT_TIMESTAMP`,
        [forecast.productId, forecast.currentStock, forecast.recommendedStock, forecast.reorderQuantity, 10, 0.8]
      );
    } catch (error) {
      logger.error('Error storing inventory forecast:', error);
    }
  }
}

export const aiService = new AIService();

export async function initializeAIService(): Promise<void> {
  await aiService.initialize();
} 