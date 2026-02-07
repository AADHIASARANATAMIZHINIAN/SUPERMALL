import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="bg-primary-50 shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-secondary-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div>📦 Free shipping on orders over $50</div>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-secondary-300">Contact</Link>
            <Link to="/faq" className="hover:text-secondary-300">FAQ</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-800 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SM</span>
            </div>
            <span className="hidden sm:inline text-xl font-bold text-secondary-900">SuperMall</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, shops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link to={isAuthenticated ? "/wishlist" : "/login"} className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <Heart size={20} className="text-gray-700" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
            </Link>

            {/* Cart */}
            <Link to={isAuthenticated ? "/cart" : "/login"} className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <ShoppingCart size={20} className="text-gray-700" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
            </Link>

            {/* Profile/Auth */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
              >
                {isAuthenticated ? (
                  <>
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:inline text-sm text-gray-700">{user?.name}</span>
                  </>
                ) : (
                  <User size={20} className="text-gray-700" />
                )}
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {isAuthenticated ? (
                    <>
                      <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-50 border-b text-gray-700">
                        Dashboard
                      </Link>
                      {user?.role === 'merchant' && (
                        <Link to="/merchant/dashboard" className="block px-4 py-2 hover:bg-gray-50 border-b text-gray-700">
                          Merchant Portal
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-50 border-b text-gray-700">
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-danger-600 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2 hover:bg-gray-50 border-b text-gray-700">
                        Login
                      </Link>
                      <Link to="/register" className="block px-4 py-2 hover:bg-gray-50 text-gray-700">
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isMenuOpen && (
          <form onSubmit={handleSearch} className="md:hidden mt-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Navigation Bar */}
      <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block bg-gray-50 border-t border-gray-200`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row gap-6">
            <Link to="/shops" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Shops
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Products
            </Link>
            <Link to="/floor-map" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Floor Map
            </Link>
            <Link to="/compare" className="text-gray-700 hover:text-primary-600 font-medium transition">
              Compare
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
