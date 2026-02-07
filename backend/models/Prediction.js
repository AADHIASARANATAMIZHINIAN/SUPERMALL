const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['INVENTORY', 'TRENDING', 'DEMAND'],
    required: true
  },
  categoryId: {
    type: String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  predictionDate: {
    type: Date,
    required: true
  },
  forecastedValue: {
    type: Number,
    required: true
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  historicalData: {
    dataPoints: Number,
    startDate: Date,
    endDate: Date,
    averageValue: Number,
    trend: {
      type: String,
      enum: ['INCREASING', 'DECREASING', 'STABLE']
    }
  },
  factors: {
    seasonality: Number,
    trend: Number,
    externalFactors: Map
  },
  modelMetrics: {
    algorithm: {
      type: String,
      enum: ['LINEAR_REGRESSION', 'EXPONENTIAL_SMOOTHING', 'ARIMA', 'ML_ENSEMBLE']
    },
    accuracy: Number,
    rmse: Number,
    mae: Number
  },
  recommendations: [String],
  status: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'ARCHIVED'],
    default: 'ACTIVE'
  },
  validUntil: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Indexes
predictionSchema.index({ categoryId: 1, predictionDate: 1 });
predictionSchema.index({ productId: 1, predictionDate: 1 });
predictionSchema.index({ type: 1, status: 1 });
predictionSchema.index({ validUntil: 1 });

// Auto-archive expired predictions
predictionSchema.pre('save', function(next) {
  if (new Date() > this.validUntil && this.status === 'ACTIVE') {
    this.status = 'ARCHIVED';
  }
  next();
});

module.exports = mongoose.model('Prediction', predictionSchema);
