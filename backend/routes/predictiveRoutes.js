const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const predictiveController = require('../controllers/predictiveController');

// Admin & Merchant access
router.get('/inventory-forecast', authenticate, authorize('admin', 'merchant'), predictiveController.getInventoryForecast);
router.get('/trending-products', authenticate, authorize('admin', 'merchant'), predictiveController.getTrendingProducts);
router.get('/demand-prediction', authenticate, authorize('admin', 'merchant'), predictiveController.getDemandPrediction);
router.get('/category-trends/:categoryId', authenticate, authorize('admin', 'merchant'), predictiveController.getCategoryTrends);

// Admin only
router.post('/generate-predictions', authenticate, authorize('admin'), predictiveController.generatePredictions);
router.get('/prediction-accuracy', authenticate, authorize('admin'), predictiveController.getPredictionAccuracy);

module.exports = router;
