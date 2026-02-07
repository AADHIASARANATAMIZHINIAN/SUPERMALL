const predictiveAnalytics = require('../services/predictiveAnalytics');
const Prediction = require('../models/Prediction');
const { logger } = require('../utils/logger');
const { addDays } = require('date-fns');

// @desc    Get inventory forecast
exports.getInventoryForecast = async (req, res, next) => {
  try {
    const { categoryId, productId, days } = req.query;
    
    const filters = {};
    if (categoryId) filters.categoryId = categoryId;
    if (productId) filters.productId = productId;
    
    const forecastDays = parseInt(days) || 30;
    
    const forecast = await predictiveAnalytics.generateForecast(filters, forecastDays);
    
    res.status(200).json({
      success: true,
      data: forecast
    });
  } catch (error) {
    logger.error('Get inventory forecast error:', error);
    next(error);
  }
};

// @desc    Get trending products
exports.getTrendingProducts = async (req, res, next) => {
  try {
    const { categoryId, limit } = req.query;
    
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }
    
    const trending = await predictiveAnalytics.getTrendingProductsByCategory(
      categoryId,
      parseInt(limit) || 10
    );
    
    res.status(200).json({
      success: true,
      data: trending
    });
  } catch (error) {
    logger.error('Get trending products error:', error);
    next(error);
  }
};

// @desc    Get demand prediction
exports.getDemandPrediction = async (req, res, next) => {
  try {
    const { productId } = req.query;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    const forecast = await predictiveAnalytics.generateForecast({ productId });
    
    res.status(200).json({
      success: true,
      data: forecast
    });
  } catch (error) {
    logger.error('Get demand prediction error:', error);
    next(error);
  }
};

// @desc    Get category trends
exports.getCategoryTrends = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    
    const forecast = await predictiveAnalytics.generateForecast({ categoryId });
    
    res.status(200).json({
      success: true,
      data: forecast
    });
  } catch (error) {
    logger.error('Get category trends error:', error);
    next(error);
  }
};

// @desc    Generate predictions (Admin only)
exports.generatePredictions = async (req, res, next) => {
  try {
    const { categoryIds } = req.body;
    
    if (!categoryIds || !Array.isArray(categoryIds)) {
      return res.status(400).json({
        success: false,
        message: 'Category IDs array is required'
      });
    }
    
    const results = [];
    
    for (const categoryId of categoryIds) {
      try {
        const forecast = await predictiveAnalytics.generateForecast({ categoryId });
        
        if (forecast.success) {
          // Save prediction to database
          const prediction = await predictiveAnalytics.savePrediction({
            type: 'INVENTORY',
            categoryId,
            predictionDate: new Date(),
            forecastedValue: forecast.historicalAverage,
            confidenceScore: forecast.confidenceScore,
            historicalData: {
              dataPoints: forecast.modelMetrics.dataPoints,
              averageValue: forecast.historicalAverage,
              trend: forecast.trend
            },
            modelMetrics: {
              algorithm: 'LINEAR_REGRESSION',
              accuracy: forecast.confidenceScore,
              r2: forecast.modelMetrics.r2
            },
            recommendations: forecast.recommendations,
            validUntil: addDays(new Date(), 30)
          });
          
          results.push({
            categoryId,
            status: 'success',
            predictionId: prediction._id
          });
        } else {
          results.push({
            categoryId,
            status: 'failed',
            reason: forecast.message
          });
        }
      } catch (error) {
        logger.error(`Error generating prediction for category ${categoryId}:`, error);
        results.push({
          categoryId,
          status: 'error',
          error: error.message
        });
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Prediction generation completed',
      data: results
    });
  } catch (error) {
    logger.error('Generate predictions error:', error);
    next(error);
  }
};

// @desc    Get prediction accuracy
exports.getPredictionAccuracy = async (req, res, next) => {
  try {
    // Compare predictions with actual sales
    const predictions = await Prediction.find({
      status: 'ARCHIVED',
      validUntil: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).lean();
    
    // Calculate accuracy metrics
    // This is a simplified version - in production, compare with actual sales data
    
    const accuracyMetrics = {
      totalPredictions: predictions.length,
      averageConfidence: predictions.length > 0 
        ? predictions.reduce((sum, p) => sum + p.confidenceScore, 0) / predictions.length 
        : 0,
      byCategory: {}
    };
    
    res.status(200).json({
      success: true,
      data: accuracyMetrics
    });
  } catch (error) {
    logger.error('Get prediction accuracy error:', error);
    next(error);
  }
};
