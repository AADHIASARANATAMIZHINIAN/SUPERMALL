const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Public routes
router.get('/shops', userController.getShops);
router.get('/shops/:id', userController.getShopById);
router.get('/products', userController.getProducts);
router.get('/products/:id', userController.getProductById);
router.get('/products/search', userController.searchProducts);
router.get('/categories', userController.getCategories);
router.get('/floors', userController.getFloors);

// Protected routes
router.use(authenticate);

// Wishlist
router.get('/wishlist', userController.getWishlist);
router.post('/wishlist', userController.addToWishlist);
router.delete('/wishlist/:productId', userController.removeFromWishlist);

// Cart
router.get('/cart', userController.getCart);
router.post('/cart', userController.addToCart);
router.put('/cart/:itemId', userController.updateCartItem);
router.delete('/cart/:itemId', userController.removeFromCart);

// Product Comparison
router.post('/compare', userController.compareProducts);

// Reviews & Ratings
router.post('/products/:id/review', userController.addReview);
router.get('/products/:id/reviews', userController.getProductReviews);

module.exports = router;
