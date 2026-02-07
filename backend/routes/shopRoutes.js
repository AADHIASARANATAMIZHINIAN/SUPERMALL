const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

// Public routes
router.get('/', shopController.getAllShops);
router.get('/:id', shopController.getShopById);
router.get('/floor/:floorId', shopController.getShopsByFloor);
router.get('/category/:categoryId', shopController.getShopsByCategory);

module.exports = router;
