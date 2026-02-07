const regression = require('ml-regression');
const { mean, standardDeviation, median } = require('simple-statistics');
const SalesData = require('../models/SalesData');
const Product = require('../models/Product');
const Prediction = require('../models/Prediction');
const { logger } = require('../utils/logger');
const { subMonths, addDays, format, parseISO } = require('date-fns');

/**
 * Predictive Inventory System
 * Uses historical sales data to forecast future demand
 */

class PredictiveAnalytics {
  constructor() {
    this.minDataPoints = parseInt(process.env.MIN_DATA_POINTS) || 30;
    this.lookbackMonths = parseInt(process.env.PREDICTION_LOOKBACK_MONTHS) || 6;
    this.forecastDays = parseInt(process.env.PREDICTION_FORECAST_DAYS) || 30;
  }

  /**
   * Get historical sales data for a product or category
   */
  async getHistoricalData(filters = {}) {
    try {
      const startDate = subMonths(new Date(), this.lookbackMonths);
      
      const query = {
        date: { $gte: startDate },
        ...filters
      };

      const salesData = await SalesData.find(query)
        .sort({ date: 1 })
        .lean();

      return salesData;
    } catch (error) {
      logger.error('Error fetching historical data:', error);
      throw error;
    }
  }

  /**
   * Prepare time series data for regression
   */
  prepareTimeSeriesData(salesData) {
    if (!salesData || salesData.length === 0) {
      return { x: [], y: [] };
    }

    // Group by date and sum quantities
    const dataByDate = {};
    
    salesData.forEach(sale => {
      const dateKey = format(new Date(sale.date), 'yyyy-MM-dd');
      if (!dataByDate[dateKey]) {
        dataByDate[dateKey] = 0;
      }
      dataByDate[dateKey] += sale.quantity;
    });

    // Convert to arrays
    const dates = Object.keys(dataByDate).sort();
    const x = dates.map((_, index) => index);
    const y = dates.map(date => dataByDate[date]);

    return { x, y, dates };
  }

  /**
   * Calculate trend using linear regression
   */
  calculateTrend(x, y) {
    if (x.length < 2) {
      return { trend: 'STABLE', slope: 0 };
    }

    try {
      const slr = new regression.SLR(x, y);
      const slope = slr.slope;

      let trend = 'STABLE';
      if (slope > 0.1) trend = 'INCREASING';
      else if (slope < -0.1) trend = 'DECREASING';

      return { trend, slope, intercept: slr.intercept, r2: slr.score(x, y).r2 };
    } catch (error) {
      logger.error('Error calculating trend:', error);
      return { trend: 'STABLE', slope: 0 };
    }
  }

  /**
   * Apply exponential smoothing for better forecasts
   */
  exponentialSmoothing(data, alpha = 0.3) {
    if (data.length === 0) return [];
    
    const smoothed = [data[0]];
    
    for (let i = 1; i < data.length; i++) {
      smoothed.push(alpha * data[i] + (1 - alpha) * smoothed[i - 1]);
    }
    
    return smoothed;
  }

  /**
   * Detect seasonality patterns
   */
  detectSeasonality(salesData) {
    try {
      // Group by day of week
      const dayOfWeekSales = {};
      
      salesData.forEach(sale => {
        const dayOfWeek = new Date(sale.date).getDay();
        if (!dayOfWeekSales[dayOfWeek]) {
          dayOfWeekSales[dayOfWeek] = [];
        }
        dayOfWeekSales[dayOfWeek].push(sale.quantity);
      });

      // Calculate average for each day
      const seasonalityFactors = {};
      Object.keys(dayOfWeekSales).forEach(day => {
        seasonalityFactors[day] = mean(dayOfWeekSales[day]);
      });

      return seasonalityFactors;
    } catch (error) {
      logger.error('Error detecting seasonality:', error);
      return {};
    }
  }

  /**
   * Generate forecast for next N days
   */
  async generateForecast(filters = {}, forecastDays = this.forecastDays) {
    try {
      // Get historical data
      const salesData = await this.getHistoricalData(filters);

      if (salesData.length < this.minDataPoints) {
        logger.warn(`Insufficient data for prediction: ${salesData.length} data points`);
        return {
          success: false,
          message: 'Insufficient historical data',
          dataPoints: salesData.length,
          required: this.minDataPoints
        };
      }

      // Prepare time series
      const { x, y } = this.prepareTimeSeriesData(salesData);

      // Calculate trend
      const trendAnalysis = this.calculateTrend(x, y);

      // Apply smoothing
      const smoothedY = this.exponentialSmoothing(y);

      // Detect seasonality
      const seasonalityFactors = this.detectSeasonality(salesData);

      // Generate predictions
      const predictions = [];
      const lastIndex = x[x.length - 1];
      const slr = new regression.SLR(x, smoothedY);

      for (let i = 1; i <= forecastDays; i++) {
        const forecastIndex = lastIndex + i;
        let forecastValue = slr.predict(forecastIndex);

        // Apply seasonality adjustment
        const forecastDate = addDays(new Date(), i);
        const dayOfWeek = forecastDate.getDay();
        if (seasonalityFactors[dayOfWeek]) {
          const avgSales = mean(y);
          const seasonalityFactor = seasonalityFactors[dayOfWeek] / avgSales;
          forecastValue *= seasonalityFactor;
        }

        // Ensure non-negative
        forecastValue = Math.max(0, Math.round(forecastValue));

        predictions.push({
          date: format(forecastDate, 'yyyy-MM-dd'),
          forecastedQuantity: forecastValue,
          dayOfWeek: format(forecastDate, 'EEEE')
        });
      }

      // Calculate confidence score
      const confidenceScore = Math.min(0.95, trendAnalysis.r2 || 0.5);

      // Generate recommendations
      const recommendations = this.generateRecommendations(
        predictions,
        trendAnalysis,
        mean(y)
      );

      return {
        success: true,
        trend: trendAnalysis.trend,
        confidenceScore,
        historicalAverage: mean(y),
        historicalMedian: median(y),
        standardDeviation: standardDeviation(y),
        predictions,
        recommendations,
        modelMetrics: {
          algorithm: 'LINEAR_REGRESSION',
          r2: trendAnalysis.r2,
          dataPoints: salesData.length
        }
      };
    } catch (error) {
      logger.error('Error generating forecast:', error);
      throw error;
    }
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations(predictions, trendAnalysis, historicalAverage) {
    const recommendations = [];
    const avgForecast = mean(predictions.map(p => p.forecastedQuantity));

    if (trendAnalysis.trend === 'INCREASING') {
      recommendations.push('📈 Demand is trending upward. Consider increasing stock levels.');
      if (avgForecast > historicalAverage * 1.5) {
        recommendations.push('⚠️ Significant demand spike expected. Prepare additional inventory.');
      }
    } else if (trendAnalysis.trend === 'DECREASING') {
      recommendations.push('📉 Demand is trending downward. Optimize inventory to avoid overstocking.');
      recommendations.push('💡 Consider promotional offers to boost sales.');
    } else {
      recommendations.push('📊 Demand is stable. Maintain current inventory levels.');
    }

    // Peak day recommendations
    const peakDay = predictions.reduce((max, p) => 
      p.forecastedQuantity > max.forecastedQuantity ? p : max
    );
    recommendations.push(`📅 Peak demand expected on ${peakDay.dayOfWeek} (${peakDay.date})`);

    return recommendations;
  }

  /**
   * Identify trending products by category
   */
  async getTrendingProductsByCategory(categoryId, limit = 10) {
    try {
      const startDate = subMonths(new Date(), 1);

      const trendingProducts = await SalesData.aggregate([
        {
          $match: {
            categoryId,
            date: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$productId',
            totalQuantity: { $sum: '$quantity' },
            totalRevenue: { $sum: '$revenue' },
            avgOrderValue: { $avg: '$averageOrderValue' },
            orderCount: { $sum: '$orderCount' }
          }
        },
        {
          $sort: { totalQuantity: -1 }
        },
        {
          $limit: limit
        }
      ]);

      // Populate product details
      const productsWithDetails = await Promise.all(
        trendingProducts.map(async (item) => {
          const product = await Product.findById(item._id).lean();
          return {
            ...item,
            product
          };
        })
      );

      return productsWithDetails;
    } catch (error) {
      logger.error('Error getting trending products:', error);
      throw error;
    }
  }

  /**
   * Save prediction to database
   */
  async savePrediction(predictionData) {
    try {
      const prediction = await Prediction.create(predictionData);
      logger.info(`Prediction saved: ${prediction._id}`);
      return prediction;
    } catch (error) {
      logger.error('Error saving prediction:', error);
      throw error;
    }
  }
}

module.exports = new PredictiveAnalytics();
