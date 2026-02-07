import React, { useState } from 'react'
import { X, Plus, Check, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Comparative Analysis Engine Component
 * Side-by-side product comparison with dynamic data tables
 * Features:
 * - Compare 2-4 products simultaneously
 * - Dynamic specification comparison
 * - Price comparison with best value highlighting
 * - Rating and review comparison
 * - Feature availability matrix
 * - Mobile-responsive table design
 */

const ProductComparisonTable = ({ products, onRemove, onAddMore }) => {
  const [comparisonMetric, setComparisonMetric] = useState('all')

  if (!products || products.length === 0) {
    return (
      <div className="card p-12 text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-obsidian-600 mb-4" />
        <h3 className="text-xl font-bold text-obsidian-300 mb-2">
          No Products to Compare
        </h3>
        <p className="text-obsidian-400 mb-4">
          Add products to start comparing
        </p>
        <button onClick={onAddMore} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Products
        </button>
      </div>
    )
  }

  // Extract all unique specifications
  const allSpecs = {}
  products.forEach(product => {
    if (product.specifications) {
      const specs = Object.entries(product.specifications)
      specs.forEach(([key, value]) => {
        if (!allSpecs[key]) {
          allSpecs[key] = []
        }
        allSpecs[key].push(value)
      })
    }
  })

  // Extract all unique features
  const allFeatures = new Set()
  products.forEach(product => {
    product.features?.forEach(feature => allFeatures.add(feature))
  })

  // Find best value (lowest price)
  const lowestPrice = Math.min(...products.map(p => p.pricing?.finalPrice || Infinity))
  
  // Find highest rated
  const highestRating = Math.max(...products.map(p => p.rating?.average || 0))

  const ComparisonRow = ({ label, values, type = 'text' }) => (
    <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
      <div className="font-medium text-obsidian-300 py-3 px-4 bg-surface-elevated rounded-lg">
        {label}
      </div>
      {values.map((value, index) => (
        <div
          key={index}
          className="py-3 px-4 bg-surface rounded-lg border border-obsidian-700 flex items-center justify-center"
        >
          {type === 'price' ? (
            <span className={`font-bold ${value === lowestPrice ? 'text-accent-success' : 'text-obsidian-100'}`}>
              ₹{value?.toLocaleString()}
              {value === lowestPrice && <span className="text-xs ml-2 badge-success">Best Value</span>}
            </span>
          ) : type === 'rating' ? (
            <div className="flex items-center gap-2">
              <span className={`font-bold ${value === highestRating ? 'text-accent-warning' : 'text-obsidian-100'}`}>
                ⭐ {value?.toFixed(1)}
              </span>
              {value === highestRating && <span className="badge-warning text-xs">Highest</span>}
            </div>
          ) : type === 'boolean' ? (
            value ? (
              <Check className="w-5 h-5 text-accent-success" />
            ) : (
              <X className="w-5 h-5 text-obsidian-600" />
            )
          ) : type === 'badge' ? (
            <span className={`badge ${value === 'IN_STOCK' ? 'badge-success' : value === 'LOW_STOCK' ? 'badge-warning' : 'badge-danger'}`}>
              {value}
            </span>
          ) : (
            <span className="text-obsidian-200 text-center">{value || 'N/A'}</span>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header with product cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
        <div className="flex items-end pb-4">
          <h3 className="font-bold text-obsidian-300">Products</h3>
        </div>
        {products.map((product, index) => (
          <div key={product._id || index} className="card-hover p-4 relative">
            <button
              onClick={() => onRemove(product._id)}
              className="absolute top-2 right-2 p-1 rounded-full bg-accent-danger hover:bg-accent-danger/80 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            {product.images?.[0]?.url ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="w-full h-32 bg-surface-elevated rounded-lg mb-3 flex items-center justify-center">
                <span className="text-obsidian-600">No Image</span>
              </div>
            )}
            
            <h4 className="font-bold text-sm mb-1 line-clamp-2">{product.name}</h4>
            <p className="text-xs text-obsidian-400 line-clamp-2">{product.description}</p>
          </div>
        ))}
        {products.length < 4 && (
          <button onClick={onAddMore} className="card border-2 border-dashed border-obsidian-600 hover:border-accent-primary p-4 flex items-center justify-center flex-col gap-2 transition-colors">
            <Plus className="w-8 h-8 text-obsidian-600" />
            <span className="text-sm text-obsidian-400">Add Product</span>
          </button>
        )}
      </div>

      {/* Metric filter */}
      <div className="flex gap-2">
        {['all', 'pricing', 'specs', 'features'].map(metric => (
          <button
            key={metric}
            onClick={() => setComparisonMetric(metric)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              comparisonMetric === metric
                ? 'bg-accent-primary text-white'
                : 'bg-surface text-obsidian-300 hover:bg-surface-hover'
            }`}
          >
            {metric.charAt(0).toUpperCase() + metric.slice(1)}
          </button>
        ))}
      </div>

      {/* Comparison table */}
      <div className="space-y-3">
        {/* Pricing comparison */}
        {(comparisonMetric === 'all' || comparisonMetric === 'pricing') && (
          <div className="space-y-3">
            <h4 className="font-bold text-accent-primary flex items-center gap-2 page-header">
              💰 Pricing & Value
            </h4>
            <ComparisonRow
              label="Base Price"
              values={products.map(p => p.pricing?.basePrice)}
              type="price"
            />
            <ComparisonRow
              label="Discount"
              values={products.map(p => `${p.pricing?.discountPercentage || 0}%`)}
            />
            <ComparisonRow
              label="Final Price"
              values={products.map(p => p.pricing?.finalPrice)}
              type="price"
            />
            <ComparisonRow
              label="Stock Status"
              values={products.map(p => p.inventory?.isInStock ? 'IN_STOCK' : 'OUT_OF_STOCK')}
              type="badge"
            />
          </div>
        )}

        {/* Rating comparison */}
        {(comparisonMetric === 'all' || comparisonMetric === 'specs') && (
          <div className="space-y-3">
            <h4 className="font-bold text-accent-primary flex items-center gap-2 page-header">
              ⭐ Ratings & Reviews
            </h4>
            <ComparisonRow
              label="Average Rating"
              values={products.map(p => p.rating?.average || 0)}
              type="rating"
            />
            <ComparisonRow
              label="Total Reviews"
              values={products.map(p => p.rating?.count || 0)}
            />
          </div>
        )}

        {/* Specifications comparison */}
        {(comparisonMetric === 'all' || comparisonMetric === 'specs') && Object.keys(allSpecs).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-bold text-accent-primary flex items-center gap-2 page-header">
              🔧 Technical Specifications
            </h4>
            {Object.entries(allSpecs).slice(0, 10).map(([key, _]) => (
              <ComparisonRow
                key={key}
                label={key}
                values={products.map(p => p.specifications?.[key] || 'N/A')}
              />
            ))}
          </div>
        )}

        {/* Features comparison */}
        {(comparisonMetric === 'all' || comparisonMetric === 'features') && allFeatures.size > 0 && (
          <div className="space-y-3">
            <h4 className="font-bold text-accent-primary flex items-center gap-2 page-header">
              ✨ Features
            </h4>
            {Array.from(allFeatures).slice(0, 10).map(feature => (
              <ComparisonRow
                key={feature}
                label={feature}
                values={products.map(p => p.features?.includes(feature))}
                type="boolean"
              />
            ))}
          </div>
        )}

        {/* Additional info */}
        {comparisonMetric === 'all' && (
          <div className="space-y-3">
            <h4 className="font-bold text-accent-primary flex items-center gap-2 page-header">
              📦 Additional Information
            </h4>
            <ComparisonRow
              label="Brand"
              values={products.map(p => p.brand || 'N/A')}
            />
            <ComparisonRow
              label="Origin"
              values={products.map(p => p.origin || 'N/A')}
            />
            <ComparisonRow
              label="SKU"
              values={products.map(p => p.sku || 'N/A')}
            />
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="card-hover p-6">
        <h4 className="font-bold text-accent-primary mb-4">🎯 Comparison Summary</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-obsidian-400 mb-1">Best Value</p>
            <p className="font-bold text-accent-success">
              {products.find(p => p.pricing?.finalPrice === lowestPrice)?.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-obsidian-400 mb-1">Highest Rated</p>
            <p className="font-bold text-accent-warning">
              {products.find(p => p.rating?.average === highestRating)?.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductComparisonTable
