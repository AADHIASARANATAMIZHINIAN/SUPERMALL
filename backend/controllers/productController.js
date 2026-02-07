const Product = require('../models/Product');
const Shop = require('../models/Shop');

exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, shop, search, minPrice, maxPrice, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const query = {};

    if (category) query.categoryId = category;
    if (shop) query.shopId = shop;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      query['pricing.finalPrice'] = {};
      if (minPrice) query['pricing.finalPrice'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.finalPrice'].$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const count = await Product.countDocuments(query);

    res.json({
      success: true,
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
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Increment views
    product.views = (product.views || 0) + 1;
    await product.save();

    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({ ...req.body, shop: req.user.shopId });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, shop: req.user.shopId },
      req.body,
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
    const product = await Product.findOneAndDelete({ _id: req.params.id, shop: req.user.shopId });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.compareProducts = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const products = await Product.find({ _id: { $in: ids } }).populate('shop', 'name');
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.searchProducts = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.json({ products: [], total: 0 });
    }

    const query = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    };

    const products = await Product.find(query)
      .populate('shop', 'name location')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ views: -1 });

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

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const products = await Product.find({ featured: true })
      .populate('shop', 'name location')
      .limit(limit * 1)
      .sort({ views: -1 });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getFlashSaleProducts = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    
    const products = await Product.find({ 
      onSale: true,
      saleEndDate: { $gt: new Date() }
    })
      .populate('shop', 'name location')
      .limit(limit * 1)
      .sort({ discount: -1 });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { categoryId } = req.params;

    const products = await Product.find({ category: categoryId })
      .populate('shop', 'name location')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments({ category: categoryId });

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
