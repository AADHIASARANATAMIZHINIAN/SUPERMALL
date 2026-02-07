import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Heart, Share2, TrendingUp, Check, X, ChevronLeft } from 'lucide-react'
import Header from '@components/Header'
import Footer from '@components/Footer'
import api from '@services/api'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/products/${id}`)
      setProduct(res.data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="h-96 bg-gray-200 animate-pulse"></div>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-gray-600">Product not found</p>
        </main>
        <Footer />
      </>
    )
  }

  const images = product.images && product.images.length > 0 
    ? product.images.map(img => img.url) 
    : [product.image, ...Array(3).fill('https://via.placeholder.com/500x500?text=Product')];

  return (
    <>
      <Header />
      
      <main className="bg-primary-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-secondary-600 mb-8">
            <Link to="/products" className="hover:text-secondary-900">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-secondary-900">{product.category}</Link>
            <span>/</span>
            <span className="text-secondary-900 font-semibold">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              {/* Main Image */}
              <div className="relative h-96 md:h-[500px] bg-white rounded-lg overflow-hidden mb-4 border-2 border-secondary-200">
                <img 
                  src={images[activeImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x500?text=Product+Image';
                  }}
                />
                {product.discount && (
                  <div className="absolute top-4 right-4 bg-danger-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
                    -{product.discount}%
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-20 rounded-lg overflow-hidden border-2 transition ${
                      activeImage === idx ? 'border-secondary-900' : 'border-secondary-200'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Product ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=Image';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Category and Shop */}
              <p className="text-secondary-700 font-semibold text-sm mb-2">{product.category}</p>

              {/* Title */}
              <h1 className="text-4xl font-bold text-secondary-900 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex text-accent-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-gray-600">(250 reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-success-600">
                  <Check size={20} /> In Stock
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl font-bold text-primary-600">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-2xl text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                </div>
                <p className="text-sm text-success-600">Save ${(product.originalPrice - product.price).toFixed(2)}</p>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-8 leading-relaxed">
                {product.description || 'This is a high-quality product with premium features and excellent durability. Perfect for your everyday needs with modern design and reliability.'}
              </p>

              {/* Quantity and Actions */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-700 font-semibold">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 font-semibold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Buttons */}
                <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-primary-700 transition mb-3">
                  Add to Cart
                </button>
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-full border-2 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                    isFavorite 
                      ? 'border-danger-500 text-danger-500 bg-danger-50' 
                      : 'border-gray-300 text-gray-700 hover:border-danger-500'
                  }`}
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                  {isFavorite ? 'Added to Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Share */}
              <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold">
                <Share2 size={20} /> Share Product
              </button>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Check size={24} className="text-success-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Free Shipping</p>
                      <p className="text-sm text-gray-600">On orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={24} className="text-success-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Easy Returns</p>
                      <p className="text-sm text-gray-600">30-day return policy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={24} className="text-success-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Secure Payment</p>
                      <p className="text-sm text-gray-600">SSL encrypted</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={24} className="text-success-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Fast Delivery</p>
                      <p className="text-sm text-gray-600">2-3 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 font-semibold mb-2">Brand</p>
                <p className="text-gray-900">SuperMall Brand</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold mb-2">Category</p>
                <p className="text-gray-900">{product.category}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold mb-2">Warranty</p>
                <p className="text-gray-900">1 Year Manufacturer Warranty</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold mb-2">SKU</p>
                <p className="text-gray-900">PRD-{product._id?.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {[1, 2, 3].map((review) => (
                <div key={review} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600">
                      J
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500">2 weeks ago</p>
                    </div>
                  </div>
                  <div className="flex text-accent-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-700">Excellent product! Great quality and fast delivery. Highly recommended!</p>
                </div>
              ))}
            </div>
            <button className="mt-6 border-2 border-primary-600 text-primary-600 px-8 py-2 rounded-lg font-semibold hover:bg-primary-50 transition">
              Write a Review
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
