const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  },
  categoryId: {
    type: String
  },
  subCategory: String,
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  pricing: {
    basePrice: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    finalPrice: {
      type: Number
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  inventory: {
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    isInStock: {
      type: Boolean,
      default: true
    }
  },
  specifications: {
    type: Map,
    of: String
  },
  features: [String],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  tags: [String],
  brand: String,
  manufacturer: String,
  origin: {
    type: String,
    default: 'India'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  flashSale: {
    isActive: {
      type: Boolean,
      default: false
    },
    startTime: Date,
    endTime: Date,
    flashPrice: Number,
    quantityLimit: Number
  },
  analytics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    addToCart: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    lastViewed: Date
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate final price before saving
productSchema.pre('save', function(next) {
  if (this.isModified('pricing.basePrice') || this.isModified('pricing.discountPercentage')) {
    const discount = this.pricing.basePrice * (this.pricing.discountPercentage / 100);
    this.pricing.finalPrice = this.pricing.basePrice - discount;
  }
  
  // Update stock status
  this.inventory.isInStock = this.inventory.quantity > 0;
  
  next();
});

// Indexes for performance
productSchema.index({ shopId: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ 'pricing.finalPrice': 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ tags: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ sku: 1 }, { unique: true, sparse: true });

// Text index for search
productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});

// Virtual for discount amount
productSchema.virtual('discountAmount').get(function() {
  return this.pricing.basePrice - this.pricing.finalPrice;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.inventory.quantity === 0) return 'OUT_OF_STOCK';
  if (this.inventory.quantity <= this.inventory.lowStockThreshold) return 'LOW_STOCK';
  return 'IN_STOCK';
});

module.exports = mongoose.model('Product', productSchema);
