const Shop = require('../models/Shop');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

// Shop Management
exports.getAllShops = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const shops = await Shop.find(query)
      .populate('owner', 'name email')
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
    const shop = await Shop.findById(req.params.id).populate('owner', 'name email phone');
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json(shop);
  } catch (error) {
    next(error);
  }
};

exports.createShop = async (req, res, next) => {
  try {
    const shop = await Shop.create(req.body);
    await AuditLog.create({
      action: 'shop_created',
      user: req.user._id,
      resourceType: 'Shop',
      resourceId: shop._id,
      details: `Shop ${shop.name} created by admin`
    });
    res.status(201).json(shop);
  } catch (error) {
    next(error);
  }
};

exports.updateShop = async (req, res, next) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    await AuditLog.create({
      action: 'shop_updated',
      user: req.user._id,
      resourceType: 'Shop',
      resourceId: shop._id,
      details: `Shop ${shop.name} updated`
    });
    res.json(shop);
  } catch (error) {
    next(error);
  }
};

exports.deleteShop = async (req, res, next) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    await AuditLog.create({
      action: 'shop_deleted',
      user: req.user._id,
      resourceType: 'Shop',
      resourceId: shop._id,
      details: `Shop ${shop.name} deleted`
    });
    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.approveShop = async (req, res, next) => {
  try {
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { status: 'active', approvedAt: Date.now() },
      { new: true }
    );
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    await AuditLog.create({
      action: 'shop_approved',
      user: req.user._id,
      resourceType: 'Shop',
      resourceId: shop._id
    });
    res.json(shop);
  } catch (error) {
    next(error);
  }
};

exports.suspendShop = async (req, res, next) => {
  try {
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { status: 'suspended', suspendedAt: Date.now(), suspensionReason: req.body.reason },
      { new: true }
    );
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    await AuditLog.create({
      action: 'shop_suspended',
      user: req.user._id,
      resourceType: 'Shop',
      resourceId: shop._id,
      details: req.body.reason
    });
    res.json(shop);
  } catch (error) {
    next(error);
  }
};

// User Management
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, status, page = 1, limit = 20, search } = req.query;
    const query = {};
    
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await AuditLog.create({
      action: 'user_updated',
      user: req.user._id,
      resourceType: 'User',
      resourceId: user._id
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await AuditLog.create({
      action: 'user_deleted',
      user: req.user._id,
      resourceType: 'User',
      resourceId: user._id
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.status = user.status === 'active' ? 'suspended' : 'active';
    await user.save();
    await AuditLog.create({
      action: 'user_status_toggled',
      user: req.user._id,
      resourceType: 'User',
      resourceId: user._id,
      details: `Status changed to ${user.status}`
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Categories & Floors (placeholder)
exports.getCategories = async (req, res, next) => {
  try {
    res.json([
      { id: 1, name: 'Electronics', icon: 'Laptop' },
      { id: 2, name: 'Clothing', icon: 'Shirt' },
      { id: 3, name: 'Food & Beverages', icon: 'Coffee' },
      { id: 4, name: 'Home & Garden', icon: 'Home' },
      { id: 5, name: 'Sports', icon: 'Dumbbell' }
    ]);
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    res.status(201).json({ message: 'Category created', ...req.body });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    res.json({ message: 'Category updated', id: req.params.id, ...req.body });
  } catch (error) {
    next(error);
  }
};

exports.getFloors = async (req, res, next) => {
  try {
    res.json([{ floor: 1, shops: [] }, { floor: 2, shops: [] }]);
  } catch (error) {
    next(error);
  }
};

exports.updateFloorConfig = async (req, res, next) => {
  try {
    res.json({ message: 'Floor configuration updated' });
  } catch (error) {
    next(error);
  }
};

// Audit Logs
exports.getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, action, userId } = req.query;
    const query = {};
    
    if (action) query.action = action;
    if (userId) query.user = userId;

    const logs = await AuditLog.find(query)
      .populate('user', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await AuditLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    next(error);
  }
};

exports.getAuditLogById = async (req, res, next) => {
  try {
    const log = await AuditLog.findById(req.params.id).populate('user', 'name email');
    if (!log) {
      return res.status(404).json({ message: 'Audit log not found' });
    }
    res.json(log);
  } catch (error) {
    next(error);
  }
};

// System Settings (placeholder)
exports.getSystemSettings = async (req, res, next) => {
  try {
    res.json({
      siteName: 'SuperMall',
      maintenanceMode: false,
      registrationEnabled: true,
      featuredShopsLimit: 10
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSystemSettings = async (req, res, next) => {
  try {
    await AuditLog.create({
      action: 'settings_updated',
      user: req.user._id,
      resourceType: 'SystemSettings',
      details: JSON.stringify(req.body)
    });
    res.json({ message: 'Settings updated', ...req.body });
  } catch (error) {
    next(error);
  }
};

exports.updateGlobalReachSettings = async (req, res, next) => {
  try {
    res.json({ message: 'Global reach settings updated' });
  } catch (error) {
    next(error);
  }
};

// Analytics
exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    const totalShops = await Shop.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments({ status: 'active' });
    const pendingShops = await Shop.countDocuments({ status: 'pending' });
    
    res.json({
      totalShops,
      totalUsers,
      pendingShops,
      totalRevenue: 0,
      recentActivity: []
    });
  } catch (error) {
    next(error);
  }
};

exports.getSalesAnalytics = async (req, res, next) => {
  try {
    res.json({ sales: [], totalSales: 0 });
  } catch (error) {
    next(error);
  }
};

exports.getProductAnalytics = async (req, res, next) => {
  try {
    res.json({ products: [], topProducts: [] });
  } catch (error) {
    next(error);
  }
};

exports.getMerchantAnalytics = async (req, res, next) => {
  try {
    res.json({ merchants: [], topMerchants: [] });
  } catch (error) {
    next(error);
  }
};
