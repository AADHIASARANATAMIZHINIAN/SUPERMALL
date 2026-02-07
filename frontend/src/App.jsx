import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'

// Layouts
import MainLayout from '@components/layouts/MainLayout'
import AdminLayout from '@components/layouts/AdminLayout'
import MerchantLayout from '@components/layouts/MerchantLayout'

// Public Pages
import HomePage from '@pages/public/HomePage'
import LoginPage from '@pages/auth/LoginPage'
import RegisterPage from '@pages/auth/RegisterPage'
import ShopsPage from '@pages/public/ShopsPage'
import ProductsPage from '@pages/public/ProductsPage'
import ProductDetailPage from '@pages/public/ProductDetailPage'
import FloorMapPage from '@pages/public/FloorMapPage'
import ComparePage from '@pages/public/ComparePage'

// Admin Pages
import AdminDashboard from '@pages/admin/AdminDashboard'
import ShopManagement from '@pages/admin/ShopManagement'
import UserManagement from '@pages/admin/UserManagement'
import AuditLogs from '@pages/admin/AuditLogs'
import SystemSettings from '@pages/admin/SystemSettings'
import AdminAnalytics from '@pages/admin/AdminAnalytics'

// Merchant Pages
import MerchantDashboard from '@pages/merchant/MerchantDashboard'
import MyShops from '@pages/merchant/MyShops'
import ProductManagement from '@pages/merchant/ProductManagement'
import FlashSales from '@pages/merchant/FlashSales'
import MerchantAnalytics from '@pages/merchant/MerchantAnalytics'

// User Pages
import UserDashboard from '@pages/user/UserDashboard'
import WishlistPage from '@pages/user/WishlistPage'
import CartPage from '@pages/user/CartPage'

function App() {
  const { user, isAuthenticated } = useAuthStore()

  // Protected Route Component
  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }

    if (requiredRole && user?.role !== requiredRole) {
      return <Navigate to="/" replace />
    }

    return children
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="shops" element={<ShopsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="floor-map" element={<FloorMapPage />} />
          <Route path="compare" element={<ComparePage />} />
        </Route>

        {/* User Routes */}
        <Route path="/user" element={
          <ProtectedRoute requiredRole="user">
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<UserDashboard />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>

        {/* Merchant Routes */}
        <Route path="/merchant" element={
          <ProtectedRoute requiredRole="merchant">
            <MerchantLayout />
          </ProtectedRoute>
        }>
          <Route index element={<MerchantDashboard />} />
          <Route path="shops" element={<MyShops />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="flash-sales" element={<FlashSales />} />
          <Route path="analytics" element={<MerchantAnalytics />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="shops" element={<ShopManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gradient-primary">404</h1>
              <p className="mt-4 text-obsidian-300">Page not found</p>
            </div>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
