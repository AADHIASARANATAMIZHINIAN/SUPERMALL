import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Star, TrendingUp, ShoppingBag, Users, Package } from 'lucide-react'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Mock data for development
      const mockProducts = Array(8).fill(null).map((_, i) => ({
        _id: i + 1,
        name: `Premium Product ${i + 1}`,
        price: Math.floor(Math.random() * 300) + 50,
        originalPrice: Math.floor(Math.random() * 400) + 150,
        category: ['Electronics', 'Fashion', 'Home', 'Sports'][i % 4],
        image: `https://via.placeholder.com/300x250?text=Product+${i + 1}`,
        discount: Math.floor(Math.random() * 40) + 10,
        rating: 5,
        reviews: Math.floor(Math.random() * 200) + 50
      }))

      const mockShops = Array(6).fill(null).map((_, i) => ({
        _id: i + 1,
        name: `Premium Shop ${i + 1}`,
        location: `Floor ${Math.floor(i / 2) + 1}, Section ${String.fromCharCode(65 + (i % 3))}`,
        banner: `https://via.placeholder.com/400x200?text=Shop+${i + 1}`,
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 200) + 100,
        productCount: Math.floor(Math.random() * 500) + 50,
        followers: Math.floor(Math.random() * 5000) + 1000
      }))

      setProducts(mockProducts)
      setShops(mockShops)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] bg-gradient-to-r from-primary-600 via-secondary-700 to-secondary-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Welcome to <span className="text-primary-300">SuperMall</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl">
            Discover premium products from the finest merchants. Shop with confidence, style, and convenience.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link to="/products" className="bg-primary-100 text-secondary-900 px-8 py-3 rounded-lg font-semibold hover:bg-primary-200 transition flex items-center gap-2">
              Shop Now <ChevronRight size={20} />
            </Link>
            <Link to="/shops" className="bg-secondary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-800 transition border-2 border-primary-200">
              Explore Shops
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Package className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">10,000+</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Users className="w-8 h-8 text-secondary-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Happy Customers</p>
            <p className="text-2xl font-bold text-gray-900">50,000+</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <ShoppingBag className="w-8 h-8 text-accent-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Active Shops</p>
            <p className="text-2xl font-bold text-gray-900">500+</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <TrendingUp className="w-8 h-8 text-success-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Daily Orders</p>
            <p className="text-2xl font-bold text-gray-900">1,000+</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-2">Curated selection of best-selling items</p>
          </div>
          <Link to="/products" className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-2">
            View All <ChevronRight size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <Link key={product._id} to={`/products/${product._id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group">
                {/* Product Image */}
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  {product.discount && (
                    <div className="absolute top-3 right-3 bg-danger-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 h-14 mb-2">{product.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-accent-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-primary-600">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition">
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Shops */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Shops</h2>
              <p className="text-gray-500 mt-2">Browse stores from our network</p>
            </div>
            <Link to="/shops" className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-2">
              View All <ChevronRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.slice(0, 6).map((shop) => (
                <Link key={shop._id} to={`/shops/${shop._id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group">
                  {/* Shop Banner */}
                  <div className="relative h-40 bg-gradient-to-r from-primary-500 to-secondary-500 overflow-hidden">
                    <img 
                      src={shop.banner}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  </div>

                  {/* Shop Info */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{shop.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">{shop.location}</p>
                    
                    <div className="flex justify-center items-center gap-2 mb-4">
                      <div className="flex text-accent-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">(4.8)</span>
                    </div>

                    <button className="w-full border-2 border-primary-600 text-primary-600 py-2 rounded-lg font-semibold hover:bg-primary-50 transition">
                      Visit Shop
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys'].map((category) => (
            <Link key={category} to={`/products?category=${category}`} className="group">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg p-6 text-center hover:shadow-lg transition h-40 flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">📦</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition">{category}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16 my-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Shopping?</h2>
          <p className="text-gray-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover amazing products at unbeatable prices.
          </p>
          <Link to="/products" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Explore Products Now
          </Link>
        </div>
      </section>
    </main>
  )
}
