const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const merchantController = require('../controllers/merchantController');

// All routes require merchant authentication
router.use(authenticate, authorize('merchant'));

// Shop Management
router.get('/my-shops', merchantController.getMyShops);
router.get('/my-shops/:id', merchantController.getShopById);
router.put('/my-shops/:id', merchantController.updateShop);

// Product Management
router.get('/products', merchantController.getMyProducts);
router.get('/products/:id', merchantController.getProductById);
router.post('/products', upload.array('images', 10), handleUploadError, merchantController.createProduct);
router.put('/products/:id', upload.array('images', 10), handleUploadError, merchantController.updateProduct);
router.delete('/products/:id', merchantController.deleteProduct);
router.patch('/products/:id/toggle-status', merchantController.toggleProductStatus);
router.patch('/products/:id/update-stock', merchantController.updateStock);

// Flash Sales
router.get('/flash-sales', merchantController.getFlashSales);
router.post('/flash-sales', merchantController.createFlashSale);
router.put('/flash-sales/:id', merchantController.updateFlashSale);
router.delete('/flash-sales/:id', merchantController.deleteFlashSale);

// Analytics
router.get('/analytics/overview', merchantController.getAnalyticsOverview);
router.get('/analytics/products', merchantController.getProductAnalytics);
router.get('/analytics/sales', merchantController.getSalesAnalytics);

// Offers & Campaigns
router.get('/offers', merchantController.getMyOffers);
router.post('/offers', merchantController.createOffer);
router.put('/offers/:id', merchantController.updateOffer);
router.delete('/offers/:id', merchantController.deleteOffer);

module.exports = router;
