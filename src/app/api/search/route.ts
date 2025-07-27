import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const customerId = searchParams.get('customer_id')
    const category = searchParams.get('category')
    const priceMin = parseFloat(searchParams.get('price_min') || '0')
    const priceMax = parseFloat(searchParams.get('price_max') || '999999')
    const sortBy = searchParams.get('sort_by') || 'relevance'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!q.trim()) {
      return NextResponse.json({
        success: true,
        results: [],
        suggestions: [],
        pagination: { total: 0, limit, offset, has_more: false }
      })
    }

    // Track search event
    if (customerId) {
      await trackSearchEvent(customerId, q, {
        category,
        price_min: priceMin,
        price_max: priceMax,
        results_count: 0 // Will be updated after search
      })
    }

    // Get products from products API
    const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products?action=browse&customer_id=${customerId || ''}&limit=100`)
    const productsData = await productsResponse.json()

    if (!productsData.success) {
      throw new Error('Failed to fetch products')
    }

    // Perform search
    const searchResults = performSearch(productsData.products, q, {
      category,
      priceMin,
      priceMax,
      customerId
    })

    // Apply sorting
    const sortedResults = applySorting(searchResults, sortBy, customerId)

    // Apply pagination
    const paginatedResults = sortedResults.slice(offset, offset + limit)

    // Generate search insights
    const searchInsights = await generateSearchInsights(q, paginatedResults, customerId)

    // Update search event with results count
    if (customerId) {
      await updateSearchEvent(customerId, q, searchResults.length)
    }

    return NextResponse.json({
      success: true,
      query: q,
      results: paginatedResults,
      suggestions: await generateSearchSuggestions(q, customerId),
      insights: searchInsights,
      pagination: {
        total: searchResults.length,
        limit,
        offset,
        has_more: offset + limit < searchResults.length
      }
    })

  } catch (error) {
    console.error('Search API Error:', error)
    return NextResponse.json({ 
      error: 'Search failed' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'autocomplete':
        return await handleAutocomplete(data)
      
      case 'search_analytics':
        return await handleSearchAnalytics(data)
      
      case 'popular_searches':
        return await getPopularSearches(data)
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Search API Error:', error)
    return NextResponse.json({ 
      error: 'Search operation failed' 
    }, { status: 500 })
  }
}

function performSearch(products: any[], query: string, filters: any): any[] {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
  
  return products.filter(product => {
    // Text search
    const searchableText = [
      product.name,
      product.description,
      product.category,
      product.subcategory,
      ...product.tags,
      product.attributes?.material,
      product.attributes?.origin,
      product.attributes?.artisan
    ].join(' ').toLowerCase()

    const textMatch = searchTerms.some(term => searchableText.includes(term))

    // Filter by category
    const categoryMatch = !filters.category || product.category === filters.category

    // Filter by price
    const priceMatch = product.price >= filters.priceMin && product.price <= filters.priceMax

    return textMatch && categoryMatch && priceMatch
  }).map(product => ({
    ...product,
    search_score: calculateSearchScore(product, searchTerms, filters.customerId)
  }))
}

function calculateSearchScore(product: any, searchTerms: string[], customerId?: string): number {
  let score = 0

  // Exact match bonus
  const productName = product.name.toLowerCase()
  if (searchTerms.some(term => productName.includes(term))) {
    score += 10
  }

  // Tag match bonus
  const tagMatches = product.tags.filter((tag: string) => 
    searchTerms.some(term => tag.toLowerCase().includes(term))
  ).length
  score += tagMatches * 5

  // Category match bonus
  if (searchTerms.some(term => product.category.toLowerCase().includes(term))) {
    score += 3
  }

  // Popularity bonus
  score += (product.ratings.average - 3) * 2

  // Conversion rate bonus
  score += product.ai_insights.conversion_rate * 20

  // Customer preference bonus (if customer ID provided)
  if (customerId) {
    // This would be enhanced with actual customer preference data
    score += Math.random() * 5 // Placeholder
  }

  return score
}

function applySorting(results: any[], sortBy: string, customerId?: string): any[] {
  const sortedResults = [...results]

  switch (sortBy) {
    case 'relevance':
      // Already sorted by search score
      break

    case 'price_low':
      sortedResults.sort((a, b) => a.price - b.price)
      break

    case 'price_high':
      sortedResults.sort((a, b) => b.price - a.price)
      break

    case 'rating':
      sortedResults.sort((a, b) => b.ratings.average - a.ratings.average)
      break

    case 'popularity':
      sortedResults.sort((a, b) => b.ratings.count - a.ratings.count)
      break

    case 'newest':
      sortedResults.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      break

    case 'personalized':
      // Sort by customer preferences (enhanced with actual data)
      sortedResults.sort((a, b) => b.search_score - a.search_score)
      break

    default:
      // Default to relevance
      sortedResults.sort((a, b) => b.search_score - a.search_score)
  }

  return sortedResults
}

async function generateSearchInsights(query: string, results: any[], customerId?: string): Promise<any> {
  const insights = {
    query_analysis: {
      intent_detected: detectSearchIntent(query),
      category_preference: detectCategoryPreference(query),
      price_sensitivity: detectPriceSensitivity(query),
      search_complexity: calculateSearchComplexity(query)
    },
    results_analysis: {
      total_results: results.length,
      category_distribution: getCategoryDistribution(results),
      price_range: getPriceRange(results),
      average_rating: getAverageRating(results)
    },
    optimization_suggestions: await getOptimizationSuggestions(query, results, customerId)
  }

  return insights
}

function detectSearchIntent(query: string): string {
  const query_lower = query.toLowerCase()
  
  if (query_lower.includes('gift') || query_lower.includes('present')) {
    return 'gift_shopping'
  }
  
  if (query_lower.includes('wedding') || query_lower.includes('marriage')) {
    return 'wedding_shopping'
  }
  
  if (query_lower.includes('cheap') || query_lower.includes('budget')) {
    return 'budget_shopping'
  }
  
  if (query_lower.includes('premium') || query_lower.includes('luxury')) {
    return 'luxury_shopping'
  }
  
  return 'general_shopping'
}

function detectCategoryPreference(query: string): string[] {
  const query_lower = query.toLowerCase()
  const preferences: string[] = []
  
  if (query_lower.includes('necklace') || query_lower.includes('earring') || query_lower.includes('ring')) {
    preferences.push('jewelry')
  }
  
  if (query_lower.includes('scarf') || query_lower.includes('shawl')) {
    preferences.push('accessories')
  }
  
  if (query_lower.includes('silk') || query_lower.includes('cotton')) {
    preferences.push('fabric')
  }
  
  return preferences
}

function detectPriceSensitivity(query: string): string {
  const query_lower = query.toLowerCase()
  
  if (query_lower.includes('cheap') || query_lower.includes('budget') || query_lower.includes('affordable')) {
    return 'high'
  }
  
  if (query_lower.includes('premium') || query_lower.includes('luxury') || query_lower.includes('expensive')) {
    return 'low'
  }
  
  return 'medium'
}

function calculateSearchComplexity(query: string): string {
  const wordCount = query.split(' ').length
  
  if (wordCount <= 2) return 'simple'
  if (wordCount <= 4) return 'moderate'
  return 'complex'
}

function getCategoryDistribution(results: any[]): Record<string, number> {
  const distribution: Record<string, number> = {}
  
  results.forEach(product => {
    distribution[product.category] = (distribution[product.category] || 0) + 1
  })
  
  return distribution
}

function getPriceRange(results: any[]): { min: number; max: number; average: number } {
  if (results.length === 0) return { min: 0, max: 0, average: 0 }
  
  const prices = results.map(p => p.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    average: prices.reduce((sum, price) => sum + price, 0) / prices.length
  }
}

function getAverageRating(results: any[]): number {
  if (results.length === 0) return 0
  
  const ratings = results.map(p => p.ratings.average)
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
}

async function getOptimizationSuggestions(query: string, results: any[], customerId?: string): Promise<any[]> {
  const suggestions: any[] = []

  // Low results suggestion
  if (results.length < 5) {
    suggestions.push({
      type: 'broaden_search',
      message: 'Try broader search terms for more results',
      confidence: 0.9
    })
  }

  // High price range suggestion
  const priceRange = getPriceRange(results)
  if (priceRange.max - priceRange.min > 1000) {
    suggestions.push({
      type: 'price_filter',
      message: 'Use price filters to narrow down results',
      confidence: 0.8
    })
  }

  // Category suggestion
  const categoryDistribution = getCategoryDistribution(results)
  const dominantCategory = Object.keys(categoryDistribution).sort((a, b) => 
    categoryDistribution[b] - categoryDistribution[a]
  )[0]

  if (dominantCategory) {
    suggestions.push({
      type: 'category_filter',
      message: `Most results are in ${dominantCategory} category`,
      confidence: 0.7
    })
  }

  return suggestions
}

async function generateSearchSuggestions(query: string, customerId?: string): Promise<string[]> {
  const suggestions: string[] = []

  // Add category-based suggestions
  const categorySuggestions = {
    'jewelry': ['silver necklace', 'gold earrings', 'traditional jewelry'],
    'accessories': ['silk scarf', 'handwoven shawl', 'traditional accessories'],
    'clothing': ['ethnic wear', 'traditional dress', 'handcrafted clothing']
  }

  // Detect category from query
  const query_lower = query.toLowerCase()
  for (const [category, categorySugs] of Object.entries(categorySuggestions)) {
    if (query_lower.includes(category)) {
      suggestions.push(...categorySugs)
      break
    }
  }

  // Add popular searches
  suggestions.push('handcrafted jewelry', 'traditional accessories', 'artisan products')

  // Remove duplicates and limit
  return [...new Set(suggestions)].slice(0, 5)
}

async function handleAutocomplete(data: any) {
  const { query, customer_id } = data

  if (!query || query.length < 2) {
    return NextResponse.json({
      success: true,
      suggestions: []
    })
  }

  // Get products for autocomplete
  const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products?limit=50`)
  const productsData = await productsResponse.json()

  if (!productsData.success) {
    throw new Error('Failed to fetch products for autocomplete')
  }

  // Generate autocomplete suggestions
  const suggestions = generateAutocompleteSuggestions(query, productsData.products)

  // Track autocomplete usage
  if (customer_id) {
    await trackAutocompleteEvent(customer_id, query, suggestions.length)
  }

  return NextResponse.json({
    success: true,
    query,
    suggestions
  })
}

function generateAutocompleteSuggestions(query: string, products: any[]): string[] {
  const query_lower = query.toLowerCase()
  const suggestions: string[] = []

  // Product name matches
  products.forEach(product => {
    if (product.name.toLowerCase().includes(query_lower)) {
      suggestions.push(product.name)
    }
  })

  // Category matches
  const categories = [...new Set(products.map(p => p.category))]
  categories.forEach(category => {
    if (category.toLowerCase().includes(query_lower)) {
      suggestions.push(category)
    }
  })

  // Tag matches
  const allTags = products.flatMap(p => p.tags)
  const uniqueTags = [...new Set(allTags)]
  uniqueTags.forEach(tag => {
    if (tag.toLowerCase().includes(query_lower)) {
      suggestions.push(tag)
    }
  })

  // Remove duplicates and limit
  return [...new Set(suggestions)].slice(0, 8)
}

async function handleSearchAnalytics(data: any) {
  const { customer_id, query, results_count, filters } = data

  // Track search analytics
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'capture_event',
      data: {
        customer_id,
        event_type: 'search_analytics',
        event_category: 'analytics',
        context: {
          timestamp: new Date().toISOString()
        },
        data: {
          query,
          results_count,
          filters,
          search_performance: {
            query_length: query.length,
            has_filters: Object.keys(filters || {}).length > 0,
            results_found: results_count > 0
          }
        }
      }
    })
  })

  return NextResponse.json({ success: true })
}

async function getPopularSearches(data: any) {
  const { limit = 10, category } = data

  // Mock popular searches (replace with actual analytics data)
  const popularSearches = [
    { query: 'silver necklace', count: 156, category: 'jewelry' },
    { query: 'silk scarf', count: 134, category: 'accessories' },
    { query: 'traditional jewelry', count: 98, category: 'jewelry' },
    { query: 'handcrafted', count: 87, category: 'general' },
    { query: 'gold earrings', count: 76, category: 'jewelry' },
    { query: 'artisan products', count: 65, category: 'general' },
    { query: 'ethnic wear', count: 54, category: 'clothing' },
    { query: 'wedding jewelry', count: 43, category: 'jewelry' },
    { query: 'traditional accessories', count: 38, category: 'accessories' },
    { query: 'premium jewelry', count: 32, category: 'jewelry' }
  ]

  let filteredSearches = popularSearches

  if (category) {
    filteredSearches = popularSearches.filter(search => 
      search.category === category || search.category === 'general'
    )
  }

  return NextResponse.json({
    success: true,
    popular_searches: filteredSearches.slice(0, limit)
  })
}

async function trackSearchEvent(customerId: string, query: string, filters: any) {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'capture_event',
      data: {
        customer_id: customerId,
        event_type: 'search',
        event_category: 'commerce',
        context: {
          timestamp: new Date().toISOString()
        },
        data: {
          query,
          filters,
          search_intent: detectSearchIntent(query),
          search_complexity: calculateSearchComplexity(query)
        }
      }
    })
  })
}

async function updateSearchEvent(customerId: string, query: string, resultsCount: number) {
  // In a real implementation, you would update the existing search event
  // For now, we'll create a new event with results
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'capture_event',
      data: {
        customer_id: customerId,
        event_type: 'search_results',
        event_category: 'commerce',
        context: {
          timestamp: new Date().toISOString()
        },
        data: {
          query,
          results_count: resultsCount,
          search_success: resultsCount > 0
        }
      }
    })
  })
}

async function trackAutocompleteEvent(customerId: string, query: string, suggestionsCount: number) {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cdp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'capture_event',
      data: {
        customer_id: customerId,
        event_type: 'autocomplete_used',
        event_category: 'commerce',
        context: {
          timestamp: new Date().toISOString()
        },
        data: {
          query,
          suggestions_count: suggestionsCount
        }
      }
    })
  })
} 