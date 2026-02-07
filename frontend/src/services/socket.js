import io from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id)
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event, callback) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }

    this.socket.on(event, callback)
    
    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    if (!this.socket) return

    this.socket.off(event, callback)

    // Remove from listeners map
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }

    this.socket.emit(event, data)
  }

  // Specific event handlers
  watchProduct(productId) {
    this.emit('watch:product', productId)
  }

  unwatchProduct(productId) {
    this.emit('unwatch:product', productId)
  }

  joinShop(shopId) {
    this.emit('join:shop', shopId)
  }

  sendMessage(data) {
    this.emit('chat:send', data)
  }

  onFlashSale(callback) {
    this.on('flash-sale:started', callback)
  }

  onStockAlert(callback) {
    this.on('stock:alert', callback)
  }

  onPriceUpdate(callback) {
    this.on('price:updated', callback)
  }

  onChatMessage(callback) {
    this.on('chat:message', callback)
  }

  // Cleanup all listeners
  removeAllListeners() {
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.off(event, callback)
      })
    })
    this.listeners.clear()
  }
}

export default new SocketService()
