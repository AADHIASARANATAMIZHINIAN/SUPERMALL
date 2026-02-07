import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Star, Filter, X, ChevronDown } from 'lucide-react'
import api from '@services/api'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: 0,
    maxPrice: 10000,
    rating: 0
  })

  useEffect(() => {
    fetchProducts()
  }, [filters, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        sort: sortBy,
        limit: 20
      })
      
      const res = await api.get(`/products?${params}`)
      setProducts(res.data?.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Food']

  return (
    <main className="bg-primary-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-secondary-900 mb-2">Products</h1>
            <p className="text-secondary-600">Browse our extensive collection</p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <div className={`${filterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-secondary-900">Filters</h2>
                  <button onClick={() => setFilterOpen(false)} className="md:hidden">
                    <X size={20} />
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-secondary-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    placeholder="Search products..."
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-secondary-700 mb-3">Category</label>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.category === cat}
                          onChange={(e) => setFilters({...filters, category: e.target.checked ? cat : ''})}
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <span className="ml-2 text-secondary-700">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: parseInt(e.target.value) || 0})}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value) || 10000})}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    ${filters.minPrice} - ${filters.maxPrice}
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating === rating}
                          onChange={() => setFilters({...filters, rating})}
                          className="w-4 h-4 text-primary-600"
                        />
                        <span className="ml-2 flex items-center gap-1 text-gray-700">
                          <div className="flex text-accent-400">
                            {[...Array(rating)].map((_, i) => (
                              <Star key={i} size={14} fill="currentColor" />
                            ))}
                          </div>
                          {rating}+ Star
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => setFilters({search: '', category: '', minPrice: 0, maxPrice: 10000, rating: 0})}
                  className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-md">
                <div className="text-sm text-secondary-600">
                  {loading ? 'Loading...' : `${products.length} products found`}
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setFilterOpen(!filterOpen)} className="md:hidden flex items-center gap-2 text-secondary-700">
                    <Filter size={20} /> Filters
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Best Rating</option>
                  </select>
                </div>
              </div>

              {/* Products */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="bg-secondary-200 animate-pulse rounded-lg h-96"></div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Link key={product._id} to={`/products/${product._id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group">
                      {/* Product Image */}
                      <div className="relative h-56 bg-secondary-200 overflow-hidden">
                        <img 
                          src={product.image || 'https://via.placeholder.com/400x300?text=Product'} 
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
                          <span className="text-xs text-secondary-500">(120)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-primary-600">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-secondary-500 line-through">${product.originalPrice}</span>
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
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-secondary-600 mb-4">No products found matching your filters</p>
                  <button
                    onClick={() => setFilters({search: '', category: '', minPrice: 0, maxPrice: 10000, rating: 0})}
                    className="text-primary-600 font-semibold hover:text-primary-700"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    )
}
