const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true,
    maxlength: [100, 'Shop name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  floorId: {
    type: String,
    required: [true, 'Floor ID is required'],
    enum: ['F1', 'F2', 'F3', 'F4', 'F5']
  },
  categoryId: {
    type: String,
    required: [true, 'Category ID is required'],
    enum: [
      'ELECTRONICS',
      'CLOTHING',
      'GROCERIES',
      'AGRICULTURE',
      'HANDICRAFTS',
      'PHARMACY',
      'BOOKS',
      'SPORTS',
      'HOME_DECOR',
      'JEWELRY'
    ]
  },
  location: {
    floor: {
      type: String,
      required: true
    },
    section: String,
    shopNumber: String,
    coordinates: {
      x: { type: Number, required: true },
      y: { type: Number, required: true }
    },
    dimensions: {
      width: { type: Number, default: 100 },
      height: { type: Number, default: 100 }
    }
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: String,
    whatsapp: String
  },
  timings: {
    openTime: {
      type: String,
      default: '09:00'
    },
    closeTime: {
      type: String,
      default: '21:00'
    },
    weeklyOff: {
      type: [String],
      default: []
    }
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
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
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'suspended'],
    default: 'pending'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  globalReach: {
    enabled: {
      type: Boolean,
      default: false
    },
    shippingZones: [String],
    estimatedDeliveryDays: {
      type: Number,
      default: 7
    }
  },
  analytics: {
    totalViews: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
shopSchema.index({ merchantId: 1 });
shopSchema.index({ floorId: 1, categoryId: 1 });
shopSchema.index({ status: 1 });
shopSchema.index({ 'rating.average': -1 });

// Virtual for products
shopSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'shopId'
});

module.exports = mongoose.model('Shop', shopSchema);
