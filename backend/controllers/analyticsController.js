const SalesData = require('../models/SalesData');
const Product = require('../models/Product');
const Shop = require('../models/Shop');

// Admin Analytics
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const totalShops = await Shop.countDocuments({ status: 'active' });
    const totalProducts = await Product.countDocuments();
    const pendingShops = await Shop.countDocuments({ status: 'pending' });
    
    res.json({
      totalShops,
      totalProducts,
      pendingShops,
      totalRevenue: 0,
      totalUsers: 0
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminSalesAnalytics = async (req, res, next) => {
  try {
    res.json({
      totalSales: 0,
      salesByDay: [],
      topProducts: [],
      topShops: []
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrendAnalytics = async (req, res, next) => {
  try {
    res.json({
      trendingProducts: [],
      trendingCategories: [],
      trendingShops: []
    });
  } catch (error) {
    next(error);
  }
};

// Merchant Analytics
exports.getMerchantDashboard = async (req, res, next) => {
  try {
    res.json({
      totalProducts: 0,
      totalViews: 0,
      totalSales: 0,
      revenue: 0
    });
  } catch (error) {
    next(error);
  }
};

exports.getMerchantPerformance = async (req, res, next) => {
  try {
    res.json({
      productPerformance: [],
      salesTrend: [],
      customerEngagement: []
    });
  } catch (error) {
    next(error);
  }
};

// Public Analytics
exports.getPopularProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const products = await Product.find()
      .populate('shop', 'name')
      .sort({ views: -1 })
      .limit(limit * 1);

    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getTrendingCategories = async (req, res, next) => {
  try {
    res.json([
      { name: 'Electronics', views: 1500 },
      { name: 'Clothing', views: 1200 },
      { name: 'Food & Beverages', views: 900 },
      { name: 'Home & Garden', views: 800 },
      { name: 'Sports', views: 600 }
    ]);
  } catch (error) {
    next(error);
  }
};

exports.getShopAnalytics = async (req, res, next) => {
  try {
    const { shopId, startDate, endDate } = req.query;
    
    const analytics = await SalesData.aggregate([
      {
        $match: {
          shop: shopId,
          date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalSales' },
          totalOrders: { $sum: '$orderCount' },
          avgOrderValue: { $avg: '$averageOrderValue' }
        }
      }
    ]);

    res.json(analytics[0] || { totalSales: 0, totalOrders: 0, avgOrderValue: 0 });
  } catch (error) {
    next(error);
  }
};

exports.getProductPerformance = async (req, res, next) => {
  try {
    const { shopId } = req.query;
    
    const products = await Product.find({ shop: shopId })
      .select('name price stock views sales')
      .sort({ sales: -1 })
      .limit(10);

    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getOverallAnalytics = async (req, res, next) => {
  try {
    const totalShops = await Shop.countDocuments({ status: 'active' });
    const totalProducts = await Product.countDocuments();
    
    res.json({
      totalShops,
      totalProducts,
      totalRevenue: 0,
      activeUsers: 0
    });
  } catch (error) {
    next(error);
  }
};
