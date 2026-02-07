const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All routes require admin authentication
router.use(authenticate, authorize('admin'));

// Shop Management
router.get('/shops', adminController.getAllShops);
router.get('/shops/:id', adminController.getShopById);
router.post('/shops', adminController.createShop);
router.put('/shops/:id', adminController.updateShop);
router.delete('/shops/:id', adminController.deleteShop);
router.patch('/shops/:id/approve', adminController.approveShop);
router.patch('/shops/:id/suspend', adminController.suspendShop);

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/toggle-status', adminController.toggleUserStatus);

// Category & Floor Management
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.get('/floors', adminController.getFloors);
router.put('/floors/:id', adminController.updateFloorConfig);

// Audit Logs
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/audit-logs/:id', adminController.getAuditLogById);

// System Settings
router.get('/settings', adminController.getSystemSettings);
router.put('/settings', adminController.updateSystemSettings);
router.put('/settings/global-reach', adminController.updateGlobalReachSettings);

// Analytics & Reports
router.get('/analytics/dashboard', adminController.getDashboardAnalytics);
router.get('/analytics/sales', adminController.getSalesAnalytics);
router.get('/analytics/products', adminController.getProductAnalytics);
router.get('/analytics/merchants', adminController.getMerchantAnalytics);

module.exports = router;
