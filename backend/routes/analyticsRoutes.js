const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

// Admin analytics
router.get('/admin/dashboard', authenticate, authorize('admin'), analyticsController.getAdminDashboard);
router.get('/admin/sales', authenticate, authorize('admin'), analyticsController.getAdminSalesAnalytics);
router.get('/admin/trends', authenticate, authorize('admin'), analyticsController.getTrendAnalytics);

// Merchant analytics
router.get('/merchant/dashboard', authenticate, authorize('merchant'), analyticsController.getMerchantDashboard);
router.get('/merchant/performance', authenticate, authorize('merchant'), analyticsController.getMerchantPerformance);

// Public analytics
router.get('/popular-products', analyticsController.getPopularProducts);
router.get('/trending-categories', analyticsController.getTrendingCategories);

module.exports = router;
