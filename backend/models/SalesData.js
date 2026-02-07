const mongoose = require('mongoose');

const salesDataSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  categoryId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  revenue: {
    type: Number,
    required: true,
    min: 0
  },
  orderCount: {
    type: Number,
    default: 1,
    min: 0
  },
  averageOrderValue: {
    type: Number,
    default: 0
  },
  metadata: {
    season: String,
    weatherCondition: String,
    specialEvent: String,
    dayOfWeek: String,
    isHoliday: Boolean
  }
}, {
  timestamps: true
});

// Indexes for analytics queries
salesDataSchema.index({ productId: 1, date: -1 });
salesDataSchema.index({ shopId: 1, date: -1 });
salesDataSchema.index({ categoryId: 1, date: -1 });
salesDataSchema.index({ date: -1 });

// Calculate average order value before saving
salesDataSchema.pre('save', function(next) {
  if (this.orderCount > 0) {
    this.averageOrderValue = this.revenue / this.orderCount;
  }
  next();
});

module.exports = mongoose.model('SalesData', salesDataSchema);
