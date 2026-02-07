import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 129.99,
      image: 'https://via.placeholder.com/100x100?text=Headphones',
      quantity: 1
    },
    {
      id: 2,
      name: 'USB-C Cable',
      price: 19.99,
      image: 'https://via.placeholder.com/100x100?text=Cable',
      quantity: 2
    }
  ])

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id)
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? {...item, quantity: newQuantity} : item
      ))
    }
  }

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  return (
    <>
      <Header />
      
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <Link to="/products" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8">
            <ArrowLeft size={20} /> Continue Shopping
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
              <Link to="/products" className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Header */}
                  <div className="border-b border-gray-200 p-6 bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">{cartItems.length} Items in Cart</h2>
                  </div>

                  {/* Items */}
                  {cartItems.map((item) => (
                    <div key={item.id} className="border-b border-gray-200 p-6 flex gap-6">
                      {/* Product Image */}
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-2xl font-bold text-primary-600">${item.price.toFixed(2)}</p>

                        {/* Quantity Control */}
                        <div className="flex items-center gap-3 mt-4">
                          <span className="text-gray-600">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 transition"
                            >
                              <Minus size={18} />
                            </button>
                            <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 transition"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="text-right">
                        <p className="text-gray-600 text-sm mb-4">Subtotal</p>
                        <p className="text-2xl font-bold text-gray-900 mb-6">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-danger-600 hover:text-danger-700 transition flex items-center gap-1"
                        >
                          <Trash2 size={18} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

                  {/* Breakdown */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-success-600 font-semibold' : ''}>
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold text-gray-900">Total:</span>
                    <span className="text-3xl font-bold text-primary-600">${total.toFixed(2)}</span>
                  </div>

                  {/* Checkout Button */}
                  <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition mb-3">
                    Proceed to Checkout
                  </button>

                  {/* Continue Shopping */}
                  <button className="w-full border-2 border-primary-600 text-primary-600 py-3 rounded-lg font-semibold hover:bg-primary-50 transition">
                    Continue Shopping
                  </button>

                  {/* Info Box */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      ✓ Free shipping on orders over $50
                    </p>
                    <p className="text-sm text-blue-700 mt-2">
                      ✓ 30-day return policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
