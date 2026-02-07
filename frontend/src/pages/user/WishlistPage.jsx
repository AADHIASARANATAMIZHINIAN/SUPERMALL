import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, ShoppingCart, Star } from 'lucide-react'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 129.99,
      originalPrice: 199.99,
      image: 'https://via.placeholder.com/300x300?text=Headphones',
      category: 'Electronics',
      rating: 5,
      reviews: 120
    },
    {
      id: 2,
      name: 'Elegant Wrist Watch',
      price: 89.99,
      originalPrice: 149.99,
      image: 'https://via.placeholder.com/300x300?text=Watch',
      category: 'Fashion',
      rating: 5,
      reviews: 85
    }
  ])

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id))
  }

  return (
    <>
      <Header />
      
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Wishlist</h1>

          {wishlist.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-xl text-gray-600 mb-4">Your wishlist is empty</p>
              <Link to="/products" className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group">
                  {/* Product Image */}
                  <div className="relative h-56 bg-gray-200 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-danger-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Save {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-accent-400">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({item.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-primary-600">${item.price}</span>
                      <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2">
                        <ShoppingCart size={18} /> Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:border-danger-500 hover:text-danger-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
