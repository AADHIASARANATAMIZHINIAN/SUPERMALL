const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'SHOP_CREATED',
      'SHOP_UPDATED',
      'SHOP_DELETED',
      'SHOP_APPROVED',
      'SHOP_SUSPENDED',
      'PRODUCT_CREATED',
      'PRODUCT_UPDATED',
      'PRODUCT_DELETED',
      'USER_CREATED',
      'USER_UPDATED',
      'USER_DELETED',
      'GLOBAL_SETTINGS_UPDATED',
      'CATEGORY_CREATED',
      'CATEGORY_UPDATED',
      'FLOOR_UPDATED',
      'FLASH_SALE_CREATED',
      'FLASH_SALE_UPDATED',
      'SYSTEM_CONFIG_UPDATED',
      'LOGIN',
      'LOGOUT',
      'PASSWORD_CHANGED',
      'PERMISSION_CHANGED'
    ]
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    enum: ['User', 'Shop', 'Product', 'Category', 'System'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  changes: {
    type: mongoose.Schema.Types.Mixed
  },
  metadata: {
    ip: String,
    userAgent: String,
    location: String
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success'
  },
  errorMessage: String
}, {
  timestamps: true
});

// Indexes
auditLogSchema.index({ performedBy: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });
auditLogSchema.index({ severity: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
