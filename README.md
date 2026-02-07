# 🛍️ SUPERMALL - E-Commerce Platform

A modern, full-stack e-commerce platform built with **Node.js**, **React**, **MongoDB**, and **Firebase**. Features a responsive UI with sandal white and black theme, real-time updates, and comprehensive admin/merchant dashboards.

## ✨ Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Product Management**: Browse, search, filter, and compare products
- **Shopping Cart & Wishlist**: Save favorites and manage cart
- **Admin Dashboard**: System management, user analytics, shop management
- **Merchant Dashboard**: Manage shops, products, and flash sales
- **Real-time Updates**: Socket.io integration for live notifications
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Product Analytics**: View tracking, clicks, purchases metrics
- **Flash Sales**: Time-limited promotional offers
- **Floor Map**: Interactive shopping mall floor visualization

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js v25.4.0
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Real-time DB**: Firebase Realtime Database
- **Authentication**: Firebase Authentication + JWT
- **Real-time Communication**: Socket.io
- **Rate Limiting**: Express Rate Limiter
- **File Uploads**: Multer

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite v5.4.21
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Lucide React

### DevOps
- **Containerization**: Docker & Docker Compose
- **Development Server**: Nodemon
- **Code Monitoring**: Nodemon with custom config

## 📋 Prerequisites

- Node.js v14+ (tested on v25.4.0)
- npm or yarn
- MongoDB (local or Atlas)
- Firebase project (for real-time database)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/AADHIASARANATAMIZHINIAN/SUPERMALL.git
cd SUPERMALL
```

### 2. Install Backend Dependencies
```bash
npm install
cd backend && npm install
```

### 3. Install Frontend Dependencies
```bash
cd frontend && npm install
```

### 4. Environment Configuration

Create `.env` file in the root directory:
```env
# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/supermall
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d
CLIENT_URL=http://localhost:3001

# Firebase
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_DATABASE_URL=your_firebase_database_url
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Uploads
UPLOAD_DIR=./backend/uploads
MAX_FILE_SIZE=5242880
```

### 5. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update connection string in .env)
```

### 6. Seed Database (Optional)
```bash
node backend/seedData.js
```

This will populate the database with 8 sample products across different categories.

## 📦 Running the Application

### Option 1: Development Mode (Separate Terminals)

**Terminal 1 - Backend:**
```bash
npm run server
```
Runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```
Runs on `http://localhost:3000`

### Option 2: Docker Compose
```bash
docker-compose up
```

### Option 3: Production Build
```bash
# Build frontend
cd frontend && npm run build

# Start backend (with production environment)
NODE_ENV=production npm run server
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (merchant only)
- `PUT /api/products/:id` - Update product (merchant only)
- `DELETE /api/products/:id` - Delete product (merchant only)

### Shops
- `GET /api/shops` - Get all shops
- `GET /api/shops/:id` - Get shop details
- `POST /api/shops` - Create shop (merchant only)

### Analytics
- `GET /api/analytics/sales` - Sales analytics
- `GET /api/analytics/products` - Product analytics
- `GET /api/analytics/users` - User analytics

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/audit-logs` - Get audit logs
- `POST /api/admin/system-settings` - Update system settings

## 📁 Project Structure

```
SUPERMALL/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── socket/          # Socket.io handlers
│   ├── jobs/            # Scheduled jobs
│   ├── utils/           # Utility functions
│   ├── seedData.js      # Database seeding script
│   └── server.js        # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client services
│   │   ├── store/        # Zustand state management
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── docs/                 # Documentation
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## 🎨 UI Theme

The application uses a modern sandal white and black color scheme:
- **Primary Color**: Sandal White (#f5f1eb)
- **Secondary Color**: Black (#1a1a1a)
- **Accent Colors**: Warm oranges for CTAs

All components are styled with Tailwind CSS and responsive across all devices.

## 👤 Test Credentials

After seeding the database, you can use:
- **Email**: test123@example.com
- **Password**: Password123

Or register a new account with any email and password.

## 📊 Sample Products

The seed script populates 8 products:
1. Wireless Headphones - Electronics ($5,999)
2. Casual T-Shirt - Fashion ($499)
3. Coffee Maker - Home & Garden ($2,499)
4. Sports Shoes - Sports ($3,499)
5. JavaScript Guide - Books ($599)
6. Toy Robot - Toys ($1,999)
7. Face Cream - Beauty ($799)
8. Organic Coffee Beans - Groceries ($449)

## 🔄 Current Status

✅ **Completed**
- User registration and authentication
- Product browsing and filtering
- Admin and merchant dashboards
- Database seeding with sample products
- Theme implementation (sandal white & black)
- API endpoints for core functionality
- Real-time socket.io integration
- Responsive UI design

🚀 **In Progress**
- Image upload and management
- Shopping cart persistence
- Payment gateway integration
- Order management system
- Email notifications
- Advanced analytics

📋 **Planned**
- Mobile app (React Native)
- Advanced search and recommendations
- Multi-language support
- Performance optimization
- API documentation (Swagger)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify database exists in MongoDB

### Firebase Configuration Issues
- Verify Firebase credentials in `.env`
- Check Firebase project is active
- Ensure Realtime Database is enabled

### Nodemon Infinite Restart Loop
- The project includes `nodemon.json` to watch only backend changes
- Check nodemon.json is in the root directory

## 📚 Documentation

- [Architecture & Wireframes](docs/ARCHITECTURE_WIREFRAMES.md)
- [Low Level Design](docs/LOW_LEVEL_DESIGN.md)
- [UI Documentation](docs/UI_DOCUMENTATION.md)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/AmazingFeature`
2. Commit changes: `git commit -m 'Add AmazingFeature'`
3. Push to branch: `git push origin feature/AmazingFeature`
4. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Aadhia Sarana**
- GitHub: [@AADHIASARANATAMIZHINIAN](https://github.com/AADHIASARANATAMIZHINIAN)

## 📞 Support

For issues, questions, or suggestions, please:
1. Check the [Issues](https://github.com/AADHIASARANATAMIZHINIAN/SUPERMALL/issues) section
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- Built with Node.js, React, and MongoDB
- Styled with Tailwind CSS
- Real-time features with Socket.io
- Icons by Lucide React
- Firebase for authentication and real-time database

---

**Happy Shopping! 🛒**

Last Updated: February 7, 2026
