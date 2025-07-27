import { NextRequest, NextResponse } from 'next/server'

// In-memory product database (replace with PostgreSQL in production)
const products = [
  {
    id: 'necklace-001',
    name: 'Silver Necklace',
    description: 'Handcrafted silver necklace with traditional motifs',
    price: 299.99,
    original_price: 399.99,
    category: 'jewelry',
    subcategory: 'necklaces',
    tags: ['silver', 'handcrafted', 'traditional', 'artisan'],
    images: ['/images/necklace-1.jpg', '/images/necklace-2.jpg'],
    variants: [
      { id: 'necklace-001-s', size: 'Small', price: 299.99, stock: 15 },
      { id: 'necklace-001-m', size: 'Medium', price: 299.99, stock: 8 },
      { id: 'necklace-001-l', size: 'Large', price: 299.99, stock: 3 }
    ],
    attributes: {
      material: 'Sterling Silver',
      weight: '25g',
      length: '18 inches',
      origin: 'Rajasthan',
      artisan: 'Rajesh Kumar'
    },
    ratings: {
      average: 4.5,
      count: 127,
      distribution: { 1: 2, 2: 3, 3: 8, 4: 45, 5: 69 }
    },
    ai_insights: {
      conversion_rate: 0.12,
      view_to_cart_rate: 0.08,
      cart_to_purchase_rate: 0.65,
      customer_satisfaction: 0.92,
      return_rate: 0.03,
      recommended_for: ['jewelry_lovers', 'traditional_style', 'gift_givers'],
      optimal_price_range: { min: 250, max: 350 },
      seasonal_demand: { 'wedding_season': 1.8, 'festival_season': 1.5, 'regular': 1.0 }
    },
    inventory: {
      total_stock: 26,
      low_stock_threshold: 5,
      reorder_point: 10,
      supplier_lead_time: 14,
      last_restocked: '2025-01-15'
    },
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-27T06:00:00Z'
  },
  {
    id: 'earrings-001',
    name: 'Gold Plated Earrings',
    description: 'Elegant gold plated earrings with pearl accents',
    price: 199.99,
    original_price: 249.99,
    category: 'jewelry',
    subcategory: 'earrings',
    tags: ['gold', 'pearl', 'elegant', 'formal'],
    images: ['/images/earrings-1.jpg', '/images/earrings-2.jpg'],
    variants: [
      { id: 'earrings-001-s', size: 'Small', price: 199.99, stock: 22 },
      { id: 'earrings-001-m', size: 'Medium', price: 199.99, stock: 12 }
    ],
    attributes: {
      material: 'Gold Plated Brass',
      weight: '8g',
      closure: 'Hook',
      origin: 'Kerala',
      artisan: 'Lakshmi Devi'
    },
    ratings: {
      average: 4.3,
      count: 89,
      distribution: { 1: 1, 2: 2, 3: 6, 4: 35, 5: 45 }
    },
    ai_insights: {
      conversion_rate: 0.15,
      view_to_cart_rate: 0.10,
      cart_to_purchase_rate: 0.72,
      customer_satisfaction: 0.89,
      return_rate: 0.02,
      recommended_for: ['formal_occasions', 'pearl_lovers', 'gift_givers'],
      optimal_price_range: { min: 180, max: 220 },
      seasonal_demand: { 'wedding_season': 1.6, 'festival_season': 1.3, 'regular': 1.0 }
    },
    inventory: {
      total_stock: 34,
      low_stock_threshold: 5,
      reorder_point: 10,
      supplier_lead_time: 10,
      last_restocked: '2025-01-20'
    },
    created_at: '2025-01-05T00:00:00Z',
    updated_at: '2025-01-27T06:00:00Z'
  },
  {
    id: 'scarf-001',
    name: 'Handwoven Silk Scarf',
    description: 'Luxurious handwoven silk scarf with traditional patterns',
    price: 149.99,
    original_price: 199.99,
    category: 'accessories',
    subcategory: 'scarves',
    tags: ['silk', 'handwoven', 'traditional', 'luxury'],
    images: ['/images/scarf-1.jpg', '/images/scarf-2.jpg'],
    variants: [
      { id: 'scarf-001-r', color: 'Red', price: 149.99, stock: 18 },
      { id: 'scarf-001-b', color: 'Blue', price: 149.99, stock: 12 },
      { id: 'scarf-001-g', color: 'Green', price: 149.99, stock: 8 }
    ],
    attributes: {
      material: 'Pure Silk',
      dimensions: '180cm x 30cm',
      weight: '45g',
      origin: 'Varanasi',
      artisan: 'Meera Patel'
    },
    ratings: {
      average: 4.7,
      count: 156,
      distribution: { 1: 1, 2: 2, 3: 5, 4: 38, 5: 110 }
    },
    ai_insights: {
      conversion_rate: 0.18,
      view_to_cart_rate: 0.12,
      cart_to_purchase_rate: 0.78,
      customer_satisfaction: 0.95,
      return_rate: 0.01,
      recommended_for: ['luxury_buyers', 'traditional_style', 'gift_givers'],
      optimal_price_range: { min: 130, max: 170 },
      seasonal_demand: { 'winter': 2.1, 'festival_season': 1.4, 'regular': 1.0 }
    },
    inventory: {
      total_stock: 38,
      low_stock_threshold: 5,
      reorder_point: 10,
      supplier_lead_time: 21,
      last_restocked: '2025-01-10'
    },
    created_at: '2025-01-08T00:00:00Z',
    updated_at: '2025-01-27T06:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const customerId = searchParams.get('customer_id')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'
    const priceMin = parseFloat(searchParams.get('price_min') || '0')
    const priceMax = parseFloat(searchParams.get('price_max') || '999999')
    const tags = searchParams.get('tags')?.split(',') || []

    // Track product browse event
    if (customerId && action === 'browse') {
      await fetch(`${request.nextUrl.origin}/api/cdp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'capture_event',
          data: {
            customer_id: customerId,
            event_type: 'product_browse',
            event_category: 'commerce',
            context: {
              page_url: request.url,
              user_agent: request.headers.get('user-agent') || '',
              timestamp: new Date().toISOString()
            },
            data: {
              category,
              filters: { price_min: priceMin, price_max: priceMax, tags },
              results_count: products.length
            }
          }
        })
      })
    }

    let filteredProducts = [...products]

    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category)
    }

    if (tags.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        tags.some(tag => p.tags.includes(tag))
      )
    }

    filteredProducts = filteredProducts.filter(p => 
      p.price >= priceMin && p.price <= priceMax
    )

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aVal = a[sortBy as keyof typeof a]
      let bVal = b[sortBy as keyof typeof b]
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      }
      
      return 0
    })

    // Apply pagination
    const paginatedProducts = filteredProducts.slice(offset, offset + limit)

    // Add AI-powered personalization if customer ID provided
    if (customerId && action === 'recommendations') {
      // Get customer profile for personalization
      const profileResponse = await fetch(`${request.nextUrl.origin}/api/cdp?action=profile&customer_id=${customerId}`)
      const profileData = await profileResponse.json()
      
      if (profileData.profile) {
        // Sort by customer preferences
        paginatedProducts.sort((a, b) => {
          const aScore = calculatePersonalizationScore(a, profileData.profile)
          const bScore = calculatePersonalizationScore(b, profileData.profile)
          return bScore - aScore
        })
      }
    }

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        total: filteredProducts.length,
        limit,
        offset,
        has_more: offset + limit < filteredProducts.length
      },
      filters: {
        category,
        tags,
        price_range: { min: priceMin, max: priceMax }
      }
    })

  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch products' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'view':
        // Track product view
        await fetch(`${request.nextUrl.origin}/api/cdp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'capture_event',
            data: {
              customer_id: data.customer_id,
              event_type: 'product_view',
              event_category: 'commerce',
              context: {
                page_url: request.url,
                user_agent: request.headers.get('user-agent') || '',
                timestamp: new Date().toISOString()
              },
              data: {
                product_id: data.product_id,
                product_name: data.product_name,
                price: data.price,
                category: data.category,
                variant_id: data.variant_id
              }
            }
          })
        })
        return NextResponse.json({ success: true })

      case 'search':
        // Track search event
        await fetch(`${request.nextUrl.origin}/api/cdp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'capture_event',
            data: {
              customer_id: data.customer_id,
              event_type: 'search',
              event_category: 'commerce',
              context: {
                page_url: request.url,
                user_agent: request.headers.get('user-agent') || '',
                timestamp: new Date().toISOString()
              },
              data: {
                query: data.query,
                results_count: data.results_count,
                filters: data.filters
              }
            }
          })
        })
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to process request' 
    }, { status: 500 })
  }
}

function calculatePersonalizationScore(product: any, customerProfile: any): number {
  let score = 0

  // Category preference
  if (customerProfile.behavior?.preferred_categories?.includes(product.category)) {
    score += 10
  }

  // Price sensitivity
  const priceRange = customerProfile.behavior?.preferred_price_range
  if (priceRange && product.price >= priceRange.min && product.price <= priceRange.max) {
    score += 8
  }

  // AI insights match
  const aiInsights = customerProfile.ai_insights
  if (aiInsights?.recommended_categories?.includes(product.category)) {
    score += 6
  }

  // Popularity boost
  score += (product.ratings.average - 3) * 2

  // Conversion rate boost
  score += product.ai_insights.conversion_rate * 50

  return score
} 