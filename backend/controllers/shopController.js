const Shop = require('../models/Shop');
const Product = require('../models/Product');
// Public routes
exports.getAllShops = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = { status: 'active' };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const shops = await Shop.find(query)
      .select('-owner')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Shop.countDocuments(query);

    res.json({
      shops,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

exports.getShopById = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id).select('-owner');
    if (!shop || shop.status !== 'active') {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json(shop);
  } catch (error) {
    next(error);
  }
};

exports.getShopsByFloor = async (req, res, next) => {
  try {
    const { floorId } = req.params;
    
    const shops = await Shop.find({ 
      floor: floorId,
      status: 'active' 
    }).select('-owner');

    res.json(shops);
  } catch (error) {
    next(error);
  }
};

exports.getShopsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const shops = await Shop.find({ 
      category: categoryId,
      status: 'active' 
    })
      .select('-owner')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Shop.countDocuments({ 
      category: categoryId,
      status: 'active' 
    });

    res.json({
      shops,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

// Merchant routes
exports.getMerchantShops = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = { status: 'active' };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const shops = await Shop.find(query)
      .select('-owner')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Shop.countDocuments(query);

    res.json({
      shops,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

exports.getShopById = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id).select('-owner');
    if (!shop || shop.status !== 'active') {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json(shop);
  } catch (error) {
    next(error);
  }
};

exports.getShopProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const products = await Product.find({ shop: req.params.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments({ shop: req.params.id });

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

exports.getFloorMap = async (req, res, next) => {
  try {
    const shops = await Shop.find({ status: 'active' }).select('name location floor category');
    res.json(shops);
  } catch (error) {
    next(error);
  }
};
