import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-secondary-200 mt-20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SM</span>
              </div>
              <span className="text-white font-bold text-lg">SuperMall</span>
            </div>
            <p className="text-sm text-secondary-300 mb-4">
              Your one-stop shopping destination for premium products from trusted merchants.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-400 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition">Home</Link></li>
              <li><Link to="/shops" className="hover:text-primary-400 transition">Shops</Link></li>
              <li><Link to="/products" className="hover:text-primary-400 transition">Products</Link></li>
              <li><Link to="/floor-map" className="hover:text-primary-400 transition">Floor Map</Link></li>
              <li><Link to="/compare" className="hover:text-primary-400 transition">Compare</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Returns</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Track Order</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-primary-400" />
                <span>123 Shopping Center, Mall Street, City, Country</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary-400" />
                <span>support@supermall.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-secondary-400">
          <p>&copy; 2026 SuperMall. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-primary-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-primary-400 transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
