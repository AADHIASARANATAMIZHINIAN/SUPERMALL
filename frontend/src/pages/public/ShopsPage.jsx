import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, MapPin, Package, Filter } from 'lucide-react'
import Header from '@components/Header'
import Footer from '@components/Footer'
import api from '@services/api'

export default function ShopsPage() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('rating')

  useEffect(() => {
    fetchShops()
  }, [searchQuery, sortBy])

  const fetchShops = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...(searchQuery && { search: searchQuery }),
        sort: sortBy,
        limit: 12
      })
      const res = await api.get(`/shops?${params}`)
      setShops(res.data || [])
    } catch (error) {
      console.error('Error fetching shops:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Featured Shops</h1>
            <p className="text-gray-100 mb-8">Discover exclusive stores and premium brands</p>
            
            <div className="max-w-2xl mx-auto flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shops..."
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
              <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-gray-600">
              {loading ? 'Loading shops...' : `Showing ${shops.length} shops`}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="products">Most Products</option>
            </select>
          </div>

          {/* Shops Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
              ))}
            </div>
          ) : shops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <Link key={shop._id} to={`/shops/${shop._id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
                  {/* Shop Banner */}
                  <div className="relative h-48 bg-gradient-to-r from-primary-500 to-secondary-500 overflow-hidden">
                    <img 
                      src={shop.banner || 'https://via.placeholder.com/400x200'} 
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary-600 shadow-md">
                      {shop.productCount || 0} Products
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="p-6">
                    {/* Shop Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{shop.name}</h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                      <MapPin size={16} />
                      <span>{shop.location || 'Floor 3, Section A'}</span>
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex text-accent-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">(4.8 out of 250 reviews)</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shop.description || 'Premium shopping destination with quality products'}</p>

                    {/* Stats */}
                    <div className="flex gap-4 mb-4 py-3 border-t border-b border-gray-200">
                      <div className="text-center flex-1">
                        <p className="text-2xl font-bold text-primary-600">4.8★</p>
                        <p className="text-xs text-gray-500">Rating</p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="text-2xl font-bold text-secondary-600">2.5K</p>
                        <p className="text-xs text-gray-500">Followers</p>
                      </div>
                    </div>

                    {/* Visit Button */}
                    <button className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition">
                      Visit Shop
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600 mb-4">No shops found</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary-600 font-semibold hover:text-primary-700"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
