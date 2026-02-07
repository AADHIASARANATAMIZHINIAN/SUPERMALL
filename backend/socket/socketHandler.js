const { logger } = require('../utils/logger');
const jwt = require('jsonwebtoken');

const connectedUsers = new Map();

const socketHandler = (io) => {
  // Middleware for socket authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}, User: ${socket.userId}`);
    
    // Store connected user
    connectedUsers.set(socket.userId, {
      socketId: socket.id,
      role: socket.userRole,
      connectedAt: new Date()
    });

    // Join user-specific room
    socket.join(`user:${socket.userId}`);
    
    // Join role-specific room
    socket.join(`role:${socket.userRole}`);

    // Notify user of connection
    socket.emit('connected', {
      message: 'Connected to Neural Nexus Socket Server',
      userId: socket.userId,
      role: socket.userRole
    });

    // Handle merchant-specific events
    if (socket.userRole === 'merchant') {
      handleMerchantEvents(socket, io);
    }

    // Handle user-specific events
    if (socket.userRole === 'user') {
      handleUserEvents(socket, io);
    }

    // Handle admin-specific events
    if (socket.userRole === 'admin') {
      handleAdminEvents(socket, io);
    }

    // Common events
    handleCommonEvents(socket, io);

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}, User: ${socket.userId}`);
      connectedUsers.delete(socket.userId);
    });
  });
};

// Merchant-specific event handlers
const handleMerchantEvents = (socket, io) => {
  // Join merchant's shop rooms
  socket.on('join:shop', (shopId) => {
    socket.join(`shop:${shopId}`);
    logger.info(`Merchant ${socket.userId} joined shop room: ${shopId}`);
  });

  // Handle product updates
  socket.on('product:update', (data) => {
    io.to(`shop:${data.shopId}`).emit('product:updated', data);
  });

  // Handle stock updates
  socket.on('stock:update', (data) => {
    io.to(`shop:${data.shopId}`).emit('stock:updated', data);
    // Notify users watching this product
    io.to(`product:${data.productId}`).emit('stock:changed', data);
  });
};

// User-specific event handlers
const handleUserEvents = (socket, io) => {
  // Watch specific products
  socket.on('watch:product', (productId) => {
    socket.join(`product:${productId}`);
    logger.info(`User ${socket.userId} watching product: ${productId}`);
  });

  // Unwatch product
  socket.on('unwatch:product', (productId) => {
    socket.leave(`product:${productId}`);
  });

  // Handle chat messages (user to merchant)
  socket.on('chat:send', async (data) => {
    const { merchantId, message, shopId } = data;
    
    // Emit to merchant if online
    io.to(`user:${merchantId}`).emit('chat:message', {
      from: socket.userId,
      message,
      shopId,
      timestamp: new Date()
    });

    // Emit back to sender (confirmation)
    socket.emit('chat:sent', {
      to: merchantId,
      message,
      timestamp: new Date()
    });
  });
};

// Admin-specific event handlers
const handleAdminEvents = (socket, io) => {
  // Broadcast system announcements
  socket.on('admin:announcement', (data) => {
    io.emit('system:announcement', {
      message: data.message,
      type: data.type || 'info',
      timestamp: new Date()
    });
  });

  // Notify about shop approvals
  socket.on('shop:approved', (data) => {
    io.to(`user:${data.merchantId}`).emit('shop:status', {
      shopId: data.shopId,
      status: 'approved',
      message: 'Your shop has been approved!'
    });
  });
};

// Common event handlers
const handleCommonEvents = (socket, io) => {
  // Ping/pong for connection health
  socket.on('ping', () => {
    socket.emit('pong');
  });

  // Handle typing indicators
  socket.on('typing:start', (data) => {
    io.to(`user:${data.to}`).emit('typing:indicator', {
      from: socket.userId,
      isTyping: true
    });
  });

  socket.on('typing:stop', (data) => {
    io.to(`user:${data.to}`).emit('typing:indicator', {
      from: socket.userId,
      isTyping: false
    });
  });
};

// Helper functions to emit events from controllers
const emitFlashSaleNotification = (io, data) => {
  io.emit('flash-sale:started', {
    productId: data.productId,
    productName: data.productName,
    shopId: data.shopId,
    flashPrice: data.flashPrice,
    startTime: data.startTime,
    endTime: data.endTime,
    message: `Flash Sale Alert! ${data.productName} now at ₹${data.flashPrice}!`
  });
  logger.info(`Flash sale notification sent for product: ${data.productId}`);
};

const emitStockAlert = (io, data) => {
  io.to(`product:${data.productId}`).emit('stock:alert', {
    productId: data.productId,
    status: data.status,
    quantity: data.quantity,
    message: data.message
  });
};

const emitPriceUpdate = (io, data) => {
  io.to(`product:${data.productId}`).emit('price:updated', {
    productId: data.productId,
    oldPrice: data.oldPrice,
    newPrice: data.newPrice,
    timestamp: new Date()
  });
};

const getConnectedUsers = () => {
  return Array.from(connectedUsers.entries()).map(([userId, data]) => ({
    userId,
    ...data
  }));
};

const isUserOnline = (userId) => {
  return connectedUsers.has(userId);
};

module.exports = socketHandler;
module.exports.emitFlashSaleNotification = emitFlashSaleNotification;
module.exports.emitStockAlert = emitStockAlert;
module.exports.emitPriceUpdate = emitPriceUpdate;
module.exports.getConnectedUsers = getConnectedUsers;
module.exports.isUserOnline = isUserOnline;
