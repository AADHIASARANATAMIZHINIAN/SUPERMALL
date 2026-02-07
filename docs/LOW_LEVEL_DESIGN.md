# 🏗️ Low-Level Design (LLD) Documentation

## Neural Nexus: AI-Enhanced Super Mall

### Table of Contents
1. [System Overview](#system-overview)
2. [Module Architecture](#module-architecture)
3. [Component Design](#component-design)
4. [Data Flow](#data-flow)
5. [API Design](#api-design)
6. [Database Design](#database-design)
7. [Security Architecture](#security-architecture)
8. [Performance Optimization](#performance-optimization)
9. [Scalability Considerations](#scalability-considerations)

---

## 1. System Overview

### 1.1 Architecture Pattern
**Pattern**: MVC (Model-View-Controller) + Service Layer
- **Model**: MongoDB schemas and Firebase data structures
- **View**: React components with Tailwind CSS
- **Controller**: Express.js route controllers
- **Service**: Business logic and data processing

### 1.2 Communication Patterns
```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Client    │◄───────►│   REST API   │◄───────►│   MongoDB   │
│   (React)   │         │  (Express)   │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
       │                        │
       │                        │
       ▼                        ▼
┌─────────────┐         ┌──────────────┐
│  Socket.io  │◄───────►│   Firebase   │
│   Client    │         │   Realtime   │
└─────────────┘         └──────────────┘
```

---

## 2. Module Architecture

### 2.1 Backend Modules

#### 2.1.1 Authentication Module
**Purpose**: User authentication and authorization

**Components**:
- `middleware/auth.js`: JWT verification and role-based access
- `controllers/authController.js`: Login, register, token refresh
- `models/User.js`: User schema with bcrypt password hashing

**Flow**:
```
User Login Request
    ↓
Validate credentials
    ↓
Generate JWT + Refresh Token
    ↓
Store refresh token in MongoDB
    ↓
Return tokens to client
```

**Security Features**:
- Password hashing with bcrypt (12 salt rounds)
- JWT with 7-day expiry
- Refresh tokens with 30-day expiry
- Role-based access control (RBAC)

#### 2.1.2 Predictive Analytics Module
**Purpose**: ML-based demand forecasting

**Components**:
- `services/predictiveAnalytics.js`: Core analytics engine
- `controllers/predictiveController.js`: API endpoints
- `models/Prediction.js`: Prediction storage
- `models/SalesData.js`: Historical sales tracking

**Algorithm**:
```javascript
1. Data Collection (6 months historical)
   ↓
2. Time Series Preparation
   - Group by date
   - Aggregate quantities
   ↓
3. Trend Analysis
   - Linear regression (ml-regression)
   - Calculate slope and R² score
   ↓
4. Smoothing
   - Exponential smoothing (α = 0.3)
   ↓
5. Seasonality Detection
   - Day-of-week pattern analysis
   ↓
6. Forecast Generation
   - Project 30 days forward
   - Apply seasonality factors
   ↓
7. Confidence Scoring
   - Based on R² and data quality
   ↓
8. Recommendation Generation
```

**Key Functions**:
```javascript
// Generate forecast
async generateForecast(filters, forecastDays)

// Calculate trend using linear regression
calculateTrend(x, y)

// Apply exponential smoothing
exponentialSmoothing(data, alpha = 0.3)

// Detect seasonality patterns
detectSeasonality(salesData)

// Generate recommendations
generateRecommendations(predictions, trendAnalysis, historicalAverage)
```

#### 2.1.3 Real-Time Communication Module
**Purpose**: Socket.io-based live updates

**Components**:
- `socket/socketHandler.js`: Main socket handler
- Room-based messaging system
- Event broadcasting mechanism

**Event Types**:
```javascript
// User Events
'watch:product'      - Watch product for updates
'unwatch:product'    - Stop watching product
'chat:send'          - Send chat message

// Merchant Events
'join:shop'          - Join shop room
'product:update'     - Broadcast product update
'stock:update'       - Broadcast stock update

// Admin Events
'admin:announcement' - System announcement
'shop:approved'      - Shop approval notification

// System Events
'flash-sale:started' - Flash sale notification
'stock:alert'        - Low stock alert
'price:updated'      - Price change notification
```

**Room Structure**:
```
user:<userId>           - User-specific room
role:<roleName>         - Role-specific room (admin/merchant/user)
shop:<shopId>          - Shop-specific room
product:<productId>    - Product watchers room
```

### 2.2 Frontend Modules

#### 2.2.1 State Management (Zustand)
**Purpose**: Global state management

**Stores**:
```javascript
// authStore.js
{
  user: Object,
  token: String,
  isAuthenticated: Boolean,
  login: Function,
  logout: Function,
  updateProfile: Function
}

// cartStore.js (if implemented)
{
  items: Array,
  total: Number,
  addItem: Function,
  removeItem: Function,
  updateQuantity: Function
}
```

**Persistence**:
- Zustand persist middleware
- LocalStorage for auth state
- Automatic rehydration on app load

#### 2.2.2 2D Floor Map Component
**Technology**: Konva.js (React-Konva wrapper)

**Why Konva.js?**
- ✅ High-performance canvas rendering
- ✅ React integration via react-konva
- ✅ Built-in event handling (click, hover, drag)
- ✅ Layer-based architecture
- ✅ Zoom and pan support
- ✅ Mobile-friendly touch events

**Component Structure**:
```jsx
<Stage>
  <Layer>
    {/* Background grid */}
    <Rect fill="#1a1a24" />
    
    {/* Floor label */}
    <Text text="FLOOR F1" />
    
    {/* Shops */}
    {shopLayout.map(shop => (
      <Group key={shop._id}>
        <Rect /> {/* Shop rectangle */}
        <Text /> {/* Shop name */}
      </Group>
    ))}
  </Layer>
</Stage>
```

**Features**:
- Multi-floor navigation
- Category-based color coding
- Hover tooltips
- Click navigation
- Search highlighting
- Zoom/pan controls

**Shop Rendering Logic**:
```javascript
const generateShopLayout = (shops) => {
  const cols = 10
  const rows = 6
  
  return shops.map((shop, index) => ({
    ...shop,
    x: (index % cols) * (SHOP_SIZE + 20) + 50,
    y: Math.floor(index / cols) * (SHOP_SIZE + 20) + 50,
    width: SHOP_SIZE,
    height: SHOP_SIZE
  }))
}
```

#### 2.2.3 Product Comparison Component
**Purpose**: Side-by-side product comparison

**Features**:
- Compare 2-4 products
- Dynamic specification matrix
- Price comparison with best value highlighting
- Feature availability check
- Rating comparison

**Data Structure**:
```javascript
{
  products: [
    {
      _id: String,
      name: String,
      pricing: { basePrice, finalPrice, discountPercentage },
      specifications: Map<String, String>,
      features: [String],
      rating: { average, count }
    },
    ...
  ]
}
```

**Comparison Logic**:
```javascript
// Find best value
const lowestPrice = Math.min(...products.map(p => p.pricing.finalPrice))

// Find highest rated
const highestRating = Math.max(...products.map(p => p.rating.average))

// Extract all unique specifications
const allSpecs = {}
products.forEach(product => {
  Object.entries(product.specifications).forEach(([key, value]) => {
    if (!allSpecs[key]) allSpecs[key] = []
    allSpecs[key].push(value)
  })
})
```

---

## 3. Component Design

### 3.1 Backend Controllers

#### Pattern: Async/Await with Try-Catch
```javascript
exports.controllerName = async (req, res, next) => {
  try {
    // 1. Validate input
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }
    
    // 2. Extract data
    const { param1, param2 } = req.body
    
    // 3. Business logic (call service if complex)
    const result = await ServiceClass.processData(param1, param2)
    
    // 4. Log database operation
    logDatabaseOperation('CREATE', 'CollectionName', result, req.user?._id)
    
    // 5. Return response
    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    // 6. Error handling
    logger.error('Controller error:', error)
    next(error)
  }
}
```

### 3.2 Frontend Components

#### Pattern: Functional Components with Hooks
```jsx
const ComponentName = ({ prop1, prop2, onAction }) => {
  // 1. State management
  const [state, setState] = useState(initialValue)
  const { user } = useAuthStore()
  
  // 2. Side effects
  useEffect(() => {
    // Component did mount logic
    fetchData()
    
    return () => {
      // Cleanup
    }
  }, [dependencies])
  
  // 3. Event handlers
  const handleAction = async () => {
    try {
      const result = await api.post('/endpoint', data)
      toast.success('Action successful')
    } catch (error) {
      toast.error('Action failed')
    }
  }
  
  // 4. Render
  return (
    <div className="container-custom">
      {/* JSX */}
    </div>
  )
}
```

---

## 4. Data Flow

### 4.1 Authentication Flow
```
┌─────────────┐
│   Client    │
│  (React)    │
└─────┬───────┘
      │ 1. POST /api/auth/login { email, password }
      ▼
┌─────────────┐
│   Server    │
│  (Express)  │
└─────┬───────┘
      │ 2. Validate credentials
      ▼
┌─────────────┐
│   MongoDB   │
│   (Users)   │
└─────┬───────┘
      │ 3. User found, password match
      ▼
┌─────────────┐
│   Server    │
│Generate JWT │
└─────┬───────┘
      │ 4. Return { user, accessToken, refreshToken }
      ▼
┌─────────────┐
│   Client    │
│ Store tokens│
│  in Zustand │
└─────────────┘
```

### 4.2 Product Search Flow
```
User types in search box
    ↓
Debounced API call (300ms)
    ↓
GET /api/products?search=query&category=X&minPrice=Y
    ↓
Server: Build MongoDB query
    ↓
MongoDB: Text index search + filters
    ↓
Server: Format results + pagination
    ↓
Client: Update product list
    ↓
UI: Render product cards
```

### 4.3 Flash Sale Notification Flow
```
Admin creates flash sale
    ↓
Product.flashSale.isActive = true saved to MongoDB
    ↓
Scheduled job (node-cron) detects new flash sale
    ↓
Socket.io: Broadcast 'flash-sale:started' event
    ↓
All connected users receive notification
    ↓
React: Display toast notification
    ↓
Optional: Navigate to flash sale product
```

### 4.4 Predictive Analytics Flow
```
Scheduled job (daily at 2 AM)
    ↓
For each category:
    ↓
    Fetch 6 months of sales data from MongoDB
    ↓
    Run time series analysis
    ↓
    Calculate trend (linear regression)
    ↓
    Apply exponential smoothing
    ↓
    Detect seasonality patterns
    ↓
    Generate 30-day forecast
    ↓
    Calculate confidence score
    ↓
    Generate recommendations
    ↓
    Save Prediction to MongoDB
    ↓
    Log completion
```

---

## 5. API Design

### 5.1 RESTful Conventions

**Standard Response Format**:
```javascript
// Success
{
  "success": true,
  "message": "Optional success message",
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Validation errors if applicable
}
```

**HTTP Status Codes**:
- `200 OK`: Successful GET, PUT
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### 5.2 Pagination
```javascript
// Query parameters
?page=1&limit=20

// Response
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 5.3 Filtering & Sorting
```javascript
// Query parameters
?category=ELECTRONICS&minPrice=1000&maxPrice=5000&sortBy=price&order=asc

// Server-side implementation
const query = {}
if (category) query.categoryId = category
if (minPrice) query['pricing.finalPrice'] = { $gte: minPrice }
if (maxPrice) query['pricing.finalPrice'].$lte = maxPrice

const sort = {}
if (sortBy) sort[sortBy] = order === 'desc' ? -1 : 1
```

---

## 6. Database Design

### 6.1 MongoDB Schema Relationships

```
Users (1) ──┬──> (N) Shops
            │
            └──> (N) AuditLogs

Shops (1) ──> (N) Products

Products (1) ──> (N) SalesData
             └──> (N) Predictions
```

### 6.2 Indexing Strategy

**Users Collection**:
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
```

**Shops Collection**:
```javascript
db.shops.createIndex({ merchantId: 1 })
db.shops.createIndex({ floorId: 1, categoryId: 1 })
db.shops.createIndex({ status: 1 })
db.shops.createIndex({ 'rating.average': -1 })
```

**Products Collection**:
```javascript
db.products.createIndex({ shopId: 1 })
db.products.createIndex({ categoryId: 1 })
db.products.createIndex({ 'pricing.finalPrice': 1 })
db.products.createIndex({ sku: 1 }, { unique: true, sparse: true })
db.products.createIndex({ name: 'text', description: 'text', tags: 'text' })
```

### 6.3 Firebase Realtime Database Structure
```
/
├── sessions/
│   └── <userId>/
│       ├── socketId: String
│       ├── connectedAt: Timestamp
│       └── lastActivity: Timestamp
│
├── notifications/
│   └── <userId>/
│       └── <notificationId>/
│           ├── type: String
│           ├── message: String
│           ├── read: Boolean
│           └── createdAt: Timestamp
│
├── chats/
│   └── <roomId>/
│       └── messages/
│           └── <messageId>/
│               ├── from: userId
│               ├── to: userId
│               ├── message: String
│               └── timestamp: Timestamp
│
└── liveUpdates/
    └── <entityType>/
        └── <entityId>/
            ├── type: String
            ├── data: Object
            └── updatedAt: Timestamp
```

---

## 7. Security Architecture

### 7.1 Authentication & Authorization

**JWT Structure**:
```javascript
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "id": "user-id",
    "role": "merchant",
    "iat": 1706745600,
    "exp": 1707350400
  },
  "signature": "..."
}
```

**Authorization Middleware**:
```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' })
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' })
    }
    
    next()
  }
}
```

### 7.2 Rate Limiting

**Configuration**:
```javascript
// General API: 100 requests per 15 minutes
windowMs: 15 * 60 * 1000
max: 100

// Auth endpoints: 5 requests per 15 minutes
windowMs: 15 * 60 * 1000
max: 5
```

### 7.3 Input Validation

**Using express-validator**:
```javascript
[
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().notEmpty(),
  body('role').optional().isIn(['merchant', 'user'])
]
```

### 7.4 Security Headers (Helmet.js)
```javascript
helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: true,
  xssFilter: true
})
```

---

## 8. Performance Optimization

### 8.1 Backend Optimizations

**1. Database Query Optimization**
```javascript
// Bad: Multiple queries
const shops = await Shop.find()
for (const shop of shops) {
  shop.products = await Product.find({ shopId: shop._id })
}

// Good: Single aggregation
const shops = await Shop.aggregate([
  {
    $lookup: {
      from: 'products',
      localField: '_id',
      foreignField: 'shopId',
      as: 'products'
    }
  }
])
```

**2. Caching Strategy** (if implemented)
```javascript
// Redis cache for frequently accessed data
const getCachedShops = async (floorId) => {
  const cacheKey = `shops:floor:${floorId}`
  
  // Try cache first
  let shops = await redis.get(cacheKey)
  
  if (!shops) {
    // Cache miss: fetch from DB
    shops = await Shop.find({ floorId }).lean()
    await redis.setex(cacheKey, 3600, JSON.stringify(shops)) // 1 hour TTL
  } else {
    shops = JSON.parse(shops)
  }
  
  return shops
}
```

**3. Response Compression**
```javascript
app.use(compression())
```

### 8.2 Frontend Optimizations

**1. Code Splitting**
```javascript
// Lazy load routes
const AdminDashboard = lazy(() => import('@pages/admin/AdminDashboard'))

<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>
```

**2. Debounced Search**
```javascript
const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 300)

useEffect(() => {
  if (debouncedSearch) {
    performSearch(debouncedSearch)
  }
}, [debouncedSearch])
```

**3. Virtual Scrolling** (for large lists)
```javascript
// Use react-window or react-virtualized
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={products.length}
  itemSize={120}
>
  {Row}
</FixedSizeList>
```

**4. Image Optimization**
- Lazy loading: `loading="lazy"`
- WebP format where supported
- Responsive images with srcset

---

## 9. Scalability Considerations

### 9.1 Horizontal Scaling

**Load Balancer Configuration**:
```
┌─────────────┐
│   Nginx     │
│ Load Balance│
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌──▼──┐
│ App │ │ App │
│ #1  │ │ #2  │
└─────┘ └─────┘
```

**Socket.io Clustering**:
```javascript
// Use Redis adapter for multi-server Socket.io
const RedisAdapter = require('socket.io-redis')

io.adapter(RedisAdapter({
  host: 'localhost',
  port: 6379
}))
```

### 9.2 Database Sharding

**Shop Data Sharding by Floor**:
```javascript
// Shard key: floorId
{
  shardKey: { floorId: 1 },
  shards: [
    { name: 'shard1', floors: ['F1', 'F2'] },
    { name: 'shard2', floors: ['F3', 'F4'] },
    { name: 'shard3', floors: ['F5'] }
  ]
}
```

### 9.3 Microservices Architecture (Future)

**Service Decomposition**:
```
┌─────────────────┐
│   API Gateway   │
└────────┬────────┘
         │
    ┌────┴────┬────────┬─────────┬──────────┐
    │         │        │         │          │
┌───▼───┐ ┌──▼───┐ ┌──▼────┐ ┌──▼─────┐ ┌─▼──────┐
│ Auth  │ │ Shop │ │Product│ │Predict │ │Payment │
│Service│ │Svc   │ │  Svc  │ │  Svc   │ │  Svc   │
└───────┘ └──────┘ └───────┘ └────────┘ └────────┘
```

### 9.4 CDN Integration

**Static Asset Delivery**:
- Product images → CDN
- Frontend build → CDN
- Reduce server load
- Improve global latency

---

## Conclusion

This Low-Level Design document provides the technical foundation for the Neural Nexus platform. It covers:

✅ Complete module architecture  
✅ Component design patterns  
✅ Data flow diagrams  
✅ API design conventions  
✅ Database schema and indexing  
✅ Security implementation  
✅ Performance optimization strategies  
✅ Scalability considerations

For implementation details, refer to the actual code in the repository. For high-level architecture, see the main README.md.

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Maintainer**: Neural Nexus Team
