const cron = require('node-cron');
const { logger } = require('../utils/logger');
const predictiveAnalytics = require('../services/predictiveAnalytics');
const Product = require('../models/Product');
const Prediction = require('../models/Prediction');

const CATEGORIES = [
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
];

/**
 * Generate daily predictions for all categories
 * Runs every day at 2:00 AM
 */
const generateDailyPredictions = cron.schedule('0 2 * * *', async () => {
  try {
    logger.info('Starting daily prediction generation...');
    
    for (const categoryId of CATEGORIES) {
      try {
        const forecast = await predictiveAnalytics.generateForecast({ categoryId });
        
        if (forecast.success) {
          await predictiveAnalytics.savePrediction({
            type: 'TRENDING',
            categoryId,
            predictionDate: new Date(),
            forecastedValue: forecast.historicalAverage,
            confidenceScore: forecast.confidenceScore,
            historicalData: {
              dataPoints: forecast.modelMetrics.dataPoints,
              averageValue: forecast.historicalAverage,
              trend: forecast.trend
            },
            modelMetrics: forecast.modelMetrics,
            recommendations: forecast.recommendations,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
          
          logger.info(`Prediction generated for category: ${categoryId}`);
        }
      } catch (error) {
        logger.error(`Error generating prediction for ${categoryId}:`, error);
      }
    }
    
    logger.info('Daily prediction generation completed');
  } catch (error) {
    logger.error('Daily prediction job error:', error);
  }
}, {
  scheduled: false
});

/**
 * Check and update flash sale status
 * Runs every minute
 */
const checkFlashSales = cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    
    // End expired flash sales
    await Product.updateMany(
      {
        'flashSale.isActive': true,
        'flashSale.endTime': { $lte: now }
      },
      {
        $set: {
          'flashSale.isActive': false
        }
      }
    );
    
    // Start scheduled flash sales
    const startedSales = await Product.updateMany(
      {
        'flashSale.isActive': false,
        'flashSale.startTime': { $lte: now },
        'flashSale.endTime': { $gt: now }
      },
      {
        $set: {
          'flashSale.isActive': true
        }
      }
    );
    
    if (startedSales.modifiedCount > 0) {
      logger.info(`Started ${startedSales.modifiedCount} flash sales`);
      // Emit socket event for flash sale notifications
      // This would be called from the main server with io instance
    }
  } catch (error) {
    logger.error('Flash sale check error:', error);
  }
});

/**
 * Clean up old logs and archived data
 * Runs every day at 3:00 AM
 */
const cleanupOldData = cron.schedule('0 3 * * *', async () => {
  try {
    logger.info('Starting data cleanup...');
    
    // Archive old predictions
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    await Prediction.updateMany(
      {
        validUntil: { $lt: thirtyDaysAgo },
        status: 'ACTIVE'
      },
      {
        $set: { status: 'ARCHIVED' }
      }
    );
    
    logger.info('Data cleanup completed');
  } catch (error) {
    logger.error('Cleanup job error:', error);
  }
});

/**
 * Update product analytics
 * Runs every hour
 */
const updateProductAnalytics = cron.schedule('0 * * * *', async () => {
  try {
    logger.info('Updating product analytics...');
    
    // Update trending products based on recent views and purchases
    // This is a simplified version - expand based on requirements
    
    const products = await Product.find({ isActive: true }).lean();
    
    for (const product of products.slice(0, 100)) { // Process in batches
      // Calculate trending score based on recent activity
      const trendingScore = 
        product.analytics.views * 0.1 +
        product.analytics.clicks * 0.2 +
        product.analytics.addToCart * 0.3 +
        product.analytics.purchases * 0.4;
      
      await Product.findByIdAndUpdate(product._id, {
        'analytics.trendingScore': trendingScore
      });
    }
    
    logger.info('Product analytics updated');
  } catch (error) {
    logger.error('Analytics update job error:', error);
  }
});

/**
 * Send low stock alerts
 * Runs every 6 hours
 */
const checkLowStock = cron.schedule('0 */6 * * *', async () => {
  try {
    logger.info('Checking low stock products...');
    
    const lowStockProducts = await Product.find({
      isActive: true,
      $expr: { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] }
    }).populate('shopId');
    
    if (lowStockProducts.length > 0) {
      logger.warn(`Found ${lowStockProducts.length} low stock products`);
      // Send notifications to merchants
      // This would integrate with socket.io or email service
    }
  } catch (error) {
    logger.error('Low stock check error:', error);
  }
});

/**
 * Initialize all scheduled jobs
 */
const initScheduledJobs = () => {
  logger.info('Initializing scheduled jobs...');
  
  generateDailyPredictions.start();
  checkFlashSales.start();
  cleanupOldData.start();
  updateProductAnalytics.start();
  checkLowStock.start();
  
  logger.info('All scheduled jobs initialized');
};

/**
 * Stop all scheduled jobs
 */
const stopScheduledJobs = () => {
  logger.info('Stopping scheduled jobs...');
  
  generateDailyPredictions.stop();
  checkFlashSales.stop();
  cleanupOldData.stop();
  updateProductAnalytics.stop();
  checkLowStock.stop();
  
  logger.info('All scheduled jobs stopped');
};

module.exports = {
  initScheduledJobs,
  stopScheduledJobs
};
