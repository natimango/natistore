'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AIRecommendations from '../../components/AIRecommendations'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  artisan: string
  region: string
}

interface CartItem {
  product: Product
  quantity: number
}

const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Handcrafted Silver Necklace',
    description: 'Beautiful silver necklace crafted by traditional artisans from Rajasthan',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop',
    category: 'Jewelry',
    artisan: 'Rajesh Kumar',
    region: 'Rajasthan'
  },
  {
    id: '2',
    name: 'Cotton Handloom Saree',
    description: 'Traditional handloom cotton saree with intricate designs',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
    category: 'Textiles',
    artisan: 'Lakshmi Devi',
    region: 'Tamil Nadu'
  },
  {
    id: '3',
    name: 'Brass Home Decor Set',
    description: 'Elegant brass home decor items with traditional motifs',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    category: 'Home Decor',
    artisan: 'Amit Patel',
    region: 'Gujarat'
  },
  {
    id: '4',
    name: 'Handmade Pottery Vase',
    description: 'Unique pottery vase with traditional Indian designs',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    category: 'Home Decor',
    artisan: 'Priya Sharma',
    region: 'Uttar Pradesh'
  },
  {
    id: '5',
    name: 'Silk Embroidered Scarf',
    description: 'Luxurious silk scarf with hand embroidery',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop',
    category: 'Textiles',
    artisan: 'Fatima Begum',
    region: 'Kashmir'
  },
  {
    id: '6',
    name: 'Wooden Carved Box',
    description: 'Intricately carved wooden box with traditional patterns',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    category: 'Home Decor',
    artisan: 'Ramesh Verma',
    region: 'Karnataka'
  }
]

export default function ProductsPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [customerId] = useState('demo-customer-123')

  useEffect(() => {
    loadLoyaltyPoints()
  }, [])

  const loadLoyaltyPoints = async () => {
    try {
      const response = await fetch(`/api/loyalty-points?action=profile&customer_id=${customerId}`)
      const data = await response.json()
      setLoyaltyPoints(data.current_balance || 0)
    } catch (error) {
      console.error('Error loading loyalty points:', error)
    }
  }

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = async () => {
    const total = getCartTotal()
    
    // Simulate order completion and award points
    try {
      const response = await fetch('/api/loyalty-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'award_order_points',
          customer_id: customerId,
          order_id: `order-${Date.now()}`,
          order_total: total
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`Order completed! You earned ${result.transaction.points} loyalty points!`)
        setCart([])
        loadLoyaltyPoints() // Refresh points balance
      }
    } catch (error) {
      console.error('Error processing order:', error)
      alert('Order completed! (Loyalty points will be awarded shortly)')
      setCart([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">NATI Artisan Collection</h1>
            <p className="text-gray-600 mt-2">Discover authentic handcrafted treasures from across India</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Loyalty Points</div>
              <div className="text-lg font-semibold text-indigo-600">{loyaltyPoints.toLocaleString()}</div>
            </div>
            <Link 
              href="/loyalty-points"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mb-8">
          <AIRecommendations customerId={customerId} maxItems={4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>By {product.artisan}</span>
                      <span>{product.region}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shopping Cart</h2>
              
              {cart.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                        <p className="text-gray-600 text-sm">₹{item.product.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-sm"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-gray-900">₹{getCartTotal().toLocaleString()}</span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      You'll earn: {Math.floor(getCartTotal() * 10)} loyalty points
                    </div>
                    
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-semibold"
                    >
                      Checkout ({getCartItemCount()} items)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 