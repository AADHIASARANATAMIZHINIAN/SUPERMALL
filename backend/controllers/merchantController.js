const Shop = require('../models/Shop');
const Product = require('../models/Product');

exports.getDashboard = async (req, res, next) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });
    const shopIds = shops.map(s => s._id);
    const totalProducts = await Product.countDocuments({ shop: { $in: shopIds } });
    
    res.json({
      shops,
      totalProducts,
      totalRevenue: 0,
      recentOrders: []
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyShops = async (req, res, next) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });
    res.json(shops);
  } catch (error) {
    next(error);
  }
};

exports.createShop = async (req, res, next) => {
  try {
    const shop = await Shop.create({ ...req.body, owner: req.user._id });
    res.status(201).json(shop);
  } catch (error) {
    next(error);
  }
};

exports.updateShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found or unauthorized' });
    }
    
    res.json(shop);
  } catch (error) {
    next(error);
  }
};

exports.deleteShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found or unauthorized' });
    }
    
    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getShopProducts = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, owner: req.user._id });
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found or unauthorized' });
    }
    
    const products = await Product.find({ shop: shop._id });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getShopAnalytics = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, owner: req.user._id });
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found or unauthorized' });
    }
    
    const productCount = await Product.countDocuments({ shop: shop._id });
    
    res.json({
      shop,
      productCount,
      totalViews: 0,
      totalSales: 0
    });
  } catch (error) {
    next(error);
  }
};

exports.getShopById = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, owner: req.user._id });
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found or unauthorized' });
    }
    
    res.json(shop);
  } catch (error) {
    next(error);
  }
};

// Product Management
exports.getMyProducts = async (req, res, next) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });
    const shopIds = shops.map(s => s._id);
    
    const { page = 1, limit = 20, search } = req.query;
    const query = { shop: { $in: shopIds } };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query)
      .populate('shop', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });
    const shopIds = shops.map(s => s._id);
    
    const product = await Product.findOne({
      _id: req.params.id,
      shop: { $in: shopIds }
    }).populate('shop', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }
    
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ _id: req.body.shop, owner: req.user._id });
    
    if (!shop) {
      return res.status(403).json({ message: 'Unauthorized to add products to this shop' });
    }
    
    // Process uploaded images
    const productData = { ...req.body };
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        alt: `${req.body.name} - Image ${index + 1}`,
        isPrimary: index === 0
      }));
    }
    
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });
    const shopIds = shops.map(s => s._id);
    
    const updateData = { ...req.body };
    
    // If new images were uploaded, add them to the update
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        alt: `${req.body.name || 'Product'} - Image ${index + 1}`,
        isPrimary: index === 0
      }));
    }
    
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, shop: { $in: shopIds } },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }
    
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });
    const shopIds = shops.map(s => s._id);
    
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      shop: { $in: shopIds }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.toggleProductStatus = async (req, res, next) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });
    const shopIds = shops.map(s => s._id);
    
    const product = await Product.findOne({
      _id: req.params.id,
      shop: { $in: shopIds }
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }
    
    product.status = product.status === 'active' ? 'inactive' : 'active';
    await product.save();
    
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateStock = async (req, res, next) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });
    const shopIds = shops.map(s => s._id);
    
    const { stock } = req.body;
    
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, shop: { $in: shopIds } },
      { stock },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }
    
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Flash Sales
exports.getFlashSales = async (req, res, next) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });
    const shopIds = shops.map(s => s._id);
    
    res.json([]);
  } catch (error) {
    next(error);
  }
};

exports.createFlashSale = async (req, res, next) => {
  try {
    res.status(201).json({ message: 'Flash sale created', ...req.body });
  } catch (error) {
    next(error);
  }
};

exports.updateFlashSale = async (req, res, next) => {
  try {
    res.json({ message: 'Flash sale updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteFlashSale = async (req, res, next) => {
  try {
    res.json({ message: 'Flash sale deleted' });
  } catch (error) {
    next(error);
  }
};

// Analytics
exports.getAnalyticsOverview = async (req, res, next) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });
    const shopIds = shops.map(s => s._id);
    
    const totalProducts = await Product.countDocuments({ shop: { $in: shopIds } });
    
    res.json({
      totalShops: shops.length,
      totalProducts,
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductAnalytics = async (req, res, next) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });
    const shopIds = shops.map(s => s._id);
    
    const topProducts = await Product.find({ shop: { $in: shopIds } })
      .sort({ views: -1 })
      .limit(10)
      .select('name views stock sales');
    
    res.json({ topProducts, totalProducts: topProducts.length });
  } catch (error) {
    next(error);
  }
};

exports.getSalesAnalytics = async (req, res, next) => {
  try {
    res.json({
      totalSales: 0,
      salesByPeriod: [],
      topSellingProducts: []
    });
  } catch (error) {
    next(error);
  }
};

// Offers & Campaigns
exports.getMyOffers = async (req, res, next) => {
  try {
    res.json([]);
  } catch (error) {
    next(error);
  }
};

exports.createOffer = async (req, res, next) => {
  try {
    res.status(201).json({ message: 'Offer created', ...req.body });
  } catch (error) {
    next(error);
  }
};

exports.updateOffer = async (req, res, next) => {
  try {
    res.json({ message: 'Offer updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteOffer = async (req, res, next) => {
  try {
    res.json({ message: 'Offer deleted' });
  } catch (error) {
    next(error);
  }
};
