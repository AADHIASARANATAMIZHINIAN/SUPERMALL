# SuperMall Professional E-Commerce UI Documentation

## 🎨 Design System

### Color Palette
- **Primary**: Sky Blue (#0ea5e9) - Main actions and navigation
- **Secondary**: Purple (#8b5cf6) - Accents and highlights  
- **Accent**: Amber (#facc15) - Ratings, alerts, emphasis
- **Success**: Green (#22c55e) - Confirmation, in-stock, positive actions
- **Danger**: Red (#ef4444) - Warnings, discounts, destructive actions
- **Grayscale**: Full range from gray-50 (nearly white) to gray-900 (dark)

### Typography
- **Sans-serif**: Inter (primary font for UI)
- **Monospace**: Fira Code (for technical elements)
- **Font weights**: 300 (light) to 800 (extra bold)

### Spacing & Layout
- Container max-width: 7xl (80rem)
- Grid: 12 columns responsive
- Gap standard: 6 units (1.5rem)
- Padding standard: 4 units (1rem)

---

## 📱 Pages & Components

### Public Pages

#### 1. HomePage (`/`)
**Features:**
- Hero section with gradient background and call-to-action buttons
- Statistics section (10,000+ products, 50,000+ customers, etc.)
- Featured products grid (8 products)
- Featured shops section (6 shops)
- Category showcase (6 categories with emoji icons)
- CTA section with call-to-action

**API Calls:**
- `GET /products?limit=8` - Featured products
- `GET /shops?limit=6` - Featured shops

---

#### 2. ProductsPage (`/products`)
**Features:**
- Sidebar filters with:
  - Search bar
  - Category checkboxes
  - Price range slider (min/max)
  - Rating filter (1-5 stars)
  - Clear filters button
- Main content area with:
  - Sort dropdown (newest, popular, price-low, price-high, rating)
  - Product count display
  - Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
  - Product cards with images, discounts, ratings, prices
  - Add to Cart buttons
- No products found state with clear filters option

**API Calls:**
- `GET /products?search=...&category=...&minPrice=...&maxPrice=...&sort=...&limit=20`

---

#### 3. ProductDetailPage (`/products/:id`)
**Features:**
- Breadcrumb navigation
- Image gallery with thumbnails
- Product information:
  - Category badge
  - Product title
  - Star rating with review count
  - In-stock indicator
  - Price display with original price strikethrough
  - Discount savings calculation
  - Product description
- Quantity selector
- Add to Cart button
- Add to Wishlist button
- Share product button
- Trust badges (free shipping, easy returns, secure payment, fast delivery)
- Specifications section
- Customer reviews section with rating and date
- Write review button

**API Calls:**
- `GET /products/:id` - Product details
- `GET /products/:id/reviews` - Customer reviews

---

#### 4. ShopsPage (`/shops`)
**Features:**
- Hero section with search bar
- Shop cards displaying:
  - Shop banner image
  - Shop name
  - Location (map pin icon)
  - Star rating (4.8/5)
  - Description preview
  - Product count
  - Follower count
  - Visit Shop button
- Sort options (top rated, newest, most popular, most products)
- Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- No shops found state

**API Calls:**
- `GET /shops?search=...&sort=...&limit=12`

---

#### 5. CartPage (`/cart`)
**Features:**
- Continue Shopping link
- Cart items list with:
  - Product image (100x100)
  - Product name and category
  - Price per item
  - Quantity selector (+/- buttons)
  - Subtotal per item
  - Remove button
- Order summary sidebar (sticky):
  - Subtotal
  - Shipping (free over $50, else $9.99)
  - Tax (10%)
  - Total amount
  - Proceed to Checkout button
  - Continue Shopping button
  - Info box with free shipping and returns info
- Empty cart state with link to continue shopping

---

#### 6. WishlistPage (`/wishlist`)
**Features:**
- Wishlist items grid (same as products page)
- Product cards with:
  - Image
  - Category
  - Product name
  - Star rating
  - Price and original price
  - Discount percentage
  - Add to Cart button
  - Remove from Wishlist button
- Empty wishlist state

---

### Components

#### Header Component (`<Header />`)
**Sections:**
1. **Top Bar** (gray-900 background)
   - Free shipping message
   - Contact and FAQ links

2. **Main Header**
   - Logo and brand name (clickable to home)
   - Search bar (hidden on mobile)
   - Wishlist icon with counter
   - Cart icon with counter
   - User profile dropdown
   - Mobile menu toggle

3. **Navigation Bar** (gray-50 background)
   - Links: Shops, Products, Floor Map, Compare
   - Responsive menu on mobile

**Dropdown Features:**
- Profile section with user avatar and name
- Dashboard link
- Merchant portal link (if merchant)
- Admin panel link (if admin)
- Logout button
- Login/Register links (if not authenticated)

---

#### Footer Component (`<Footer />`)
**Sections:**
1. **Company Info**
   - Logo and brand
   - Description
   - Social media links (Facebook, Twitter, Instagram, LinkedIn)

2. **Quick Links**
   - Home, Shops, Products, Floor Map, Compare

3. **Customer Service**
   - Contact Us, FAQ, Shipping Info, Returns, Track Order

4. **Contact Info**
   - Address with map icon
   - Phone number
   - Email address

5. **Bottom Footer**
   - Copyright notice
   - Links to Privacy, Terms, Cookie Policy

---

## 🎯 Features & Interactions

### Product Cards
- Hover effect: Scale image, increase shadow
- Discount badge (top-right corner)
- 5-star rating display with review count
- Price comparison (sale price vs original)
- Add to Cart button
- Responsive sizing

### Shop Cards
- Banner image with overlay
- Product count badge (top-right)
- Shop name and location
- Rating and reviews count
- Follower count
- Visit Shop button
- Hover effects

### Filters
- Real-time updates on selection
- Category multi-select
- Price range with min/max inputs
- Rating filter (single select)
- Clear all button

### Responsive Design
- **Mobile**: 1 column grid, hamburger menu, collapsed sidebar
- **Tablet**: 2 column grid, sidebar visible, touch-friendly buttons
- **Desktop**: 3+ column grid, full sidebar, optimized spacing

---

## 🔗 API Integration Points

### Authentication
- Login endpoint: `POST /auth/login`
- Register endpoint: `POST /auth/register`
- Refresh token: `POST /auth/refresh`

### Products
- List products: `GET /products`
- Get product: `GET /products/:id`
- Search products: `GET /products?search=...`
- Filter products: `GET /products?category=...&minPrice=...&maxPrice=...`
- Add to cart: `POST /cart` (backend handles)

### Shops
- List shops: `GET /shops`
- Get shop: `GET /shops/:id`
- Search shops: `GET /shops?search=...`

### User
- Get profile: `GET /user/profile`
- Update profile: `PUT /user/profile`
- Wishlist operations: `GET/POST/DELETE /user/wishlist`
- Cart operations: `GET/POST/PUT/DELETE /user/cart`

---

## 🎨 Tailwind Classes Used

### Common Utility Classes
```
Colors: bg-primary-600, text-secondary-700, border-accent-400
Spacing: p-4, m-8, gap-6, py-12
Sizing: w-full, h-96, max-w-7xl
Display: flex, grid, grid-cols-3, gap-6
Effects: shadow-md, hover:shadow-lg, transition, rounded-lg
Typography: font-bold, text-2xl, line-clamp-2
```

---

## 📊 Component Tree Structure

```
App
├── Header
│   ├── TopBar
│   ├── MainNav
│   ├── SearchBar
│   └── ProfileDropdown
├── Routes
│   ├── MainLayout
│   │   ├── HomePage
│   │   ├── ProductsPage
│   │   ├── ProductDetailPage
│   │   ├── ShopsPage
│   │   ├── CartPage
│   │   └── WishlistPage
│   ├── AdminLayout
│   └── MerchantLayout
└── Footer
    ├── CompanyInfo
    ├── QuickLinks
    ├── CustomerService
    ├── ContactInfo
    └── BottomFooter
```

---

## 🚀 Performance Optimizations

- Image lazy loading (via placeholder URLs)
- Responsive images with srcset
- CSS animations for smooth transitions
- Skeleton loading states (animated gray placeholders)
- Sticky elements (header, sidebar, order summary)
- Mobile-first responsive design
- CSS Grid for efficient layouts

---

## ✅ Quality Assurance

All components have been tested for:
- ✓ Responsive design (mobile, tablet, desktop)
- ✓ Color contrast (WCAG AA compliance)
- ✓ Hover and active states
- ✓ Touch-friendly button sizes
- ✓ Keyboard navigation
- ✓ Loading states
- ✓ Empty states
- ✓ Error handling

---

## 🎯 Next Steps for Backend Integration

1. **Product Images**: Replace placeholder URLs with actual product images from API
2. **Real Data**: Connect to backend API for live product/shop data
3. **Cart State Management**: Implement Zustand store for persistent cart
4. **Authentication**: Integrate auth flows with token management
5. **Wishlist**: Connect to backend wishlist endpoints
6. **Notifications**: Add toast notifications for user actions
7. **Pagination**: Implement pagination for product/shop lists
8. **Sorting**: Add backend sort parameters

---

## 📱 Mobile Optimization

- Hamburger menu for navigation
- Full-width cards and buttons
- Touch-friendly spacing (minimum 44x44px)
- Collapsed filters on mobile
- Readable font sizes (16px minimum)
- Single-column layouts on small screens

---

## 🎨 Future Enhancements

- Dark mode toggle
- Advanced filters (multi-select categories)
- Infinite scroll pagination
- Real-time stock indicators
- Live chat support
- Payment gateway integration
- Order tracking
- Seller rating badges
- Product recommendations
- Smart search suggestions
