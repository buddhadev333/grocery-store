# 🛒 FRESH NEST — Online Grocery & Daily-Needs Store

> **"Everything You Need, Freshly Delivered."**

FRESH NEST is a full-featured, modern, and affordable online grocery and daily-needs store web platform tailored for the Indian grocery market. It features a realistic catalog of **378 products across 26 departments**, an interactive shopping cart with live free-delivery threshold tracking, a comprehensive checkout and visual order tracker, and a real-time admin pricing control dashboard.

---

## 🌟 Key Features

### 🥦 1. Massive Indian Grocery Product Catalog
- **378 Curated Products across 26 Departments**:
  - Atta, Flours & Grains
  - Rice & Rice Products
  - Dals & Pulses
  - Cooking Oils & Ghee
  - Spices & Masalas
  - Dairy, Bread & Eggs
  - Fresh Vegetables & Fresh Fruits
  - Biscuits & Cookies
  - Chips, Crisps & Namkeen
  - Chocolates & Sweets
  - Tea, Coffee & Health Drinks
  - Soft Drinks & Juices
  - Instant Noodles & Ready Meals
  - Breakfast Cereals & Spreads
  - Cleaning & Household Supplies
  - Bath, Body & Skin Care
  - Hair Care & Grooming
  - Oral Care
  - Baby Care Essentials
  - Pet Supplies
  - Stationery & Craft Essentials
  - Kitchen & Dining Essentials
  - Home Needs & Utilities
  - Dry Fruits, Nuts & Seeds
  - Organic & Diet Specialities
  - International & Gourmet Foods

### 💰 2. Honest & Transparent Pricing Architecture
- **Strict Compliance with Indian Market Standards**:
  - **Product Cards**: Clear display of Selling Price (`₹599`), MRP (`₹650`), Discount Tag (`8% OFF`), and Total Savings (`You Save: ₹51`).
  - **Product Details Page**: Full breakdown with `FRESH NEST Price`, `MRP`, `You Save: ₹X (Y% OFF)`, and tax/delivery terms.
  - **No Fake Claims**: Replaces exaggerated claims like *"Cheaper than Amazon"* with verified, neutral badges: `Best Price`, `Today's Deal`, `Great Value`, `Special Offer`.

### 🔍 3. Real-Time Search, Filtering & Sorting
- Instant search across product names, brands, keywords, and departments.
- Multi-faceted filters:
  - Category / department pills
  - Dynamic price range slider
  - Minimum customer rating (e.g. 4★ & above)
  - Minimum discount percentage
  - In-stock availability toggle
- 6 Sorting Options: *Most Popular*, *Price: Low to High*, *Price: High to Low*, *Biggest Discount (%)*, *Maximum Savings (₹)*, and *Top Customer Rated*.

### 🛍️ 4. Shopping Cart & Free Delivery Threshold Meter
- Slide-over basket drawer and dedicated `/cart` page.
- Interactive Free Delivery meter (qualify for FREE delivery on orders above ₹499).
- Promo code engine (e.g., `FRESH50`).
- LocalStorage persistence for continuous shopping across sessions.

### 🚚 5. Checkout & 5-Stage Visual Order Tracking
- Complete customer delivery address form with PIN code and landmark support.
- Preferred delivery slot selection (*Express 60 mins*, *Standard 2 hrs*, *Morning Slot*, *Evening Slot*).
- Multiple payment methods:
  - Cash on Delivery (COD) / Pay on Delivery
  - UPI (Google Pay, PhonePe, Paytm, BHIM)
  - Credit & Debit Cards (Visa, MasterCard, RuPay)
  - Net Banking (All major Indian banks)
- 5-Stage live delivery tracker (`/track-order/:orderId`):
  1. Order Placed
  2. Confirmed
  3. Packed & Dispatched
  4. Out for Delivery
  5. Delivered
- Interactive demo controls to simulate order status advancement in real time.

### ⚙️ 6. Store Owner Admin Dashboard (`/admin`)
- Accessible directly via the navigation bar and footer.
- **Bulk Pricing & Margin Manager**:
  - Set % Discount off MRP across an entire department or all 378 products.
  - Adjust selling prices up or down by percentage (`+/- %`).
  - Set flat ₹ discounts off MRP.
- **Inline Single-Product Price & Stock Editor**: Quickly edit MRP, Selling Price, Stock, and Badges directly in the catalog table.
- **Add Product Modal**: Add new items with brand, category, size/weight, MRP, and selling price.
- **One-Click Demo Reset**: Instantly restore the entire catalog back to default 378 products.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router v6
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: Lucide React
- **State & Persistence**: React Context API + LocalStorage
- **Backend & Pricing Intelligence**: Python Flask (optional headless microservice)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/buddhadev333/grocery-store.git
cd grocery-store
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to:
- **Storefront**: [http://localhost:5173/](http://localhost:5173/)
- **Catalog**: [http://localhost:5173/catalog](http://localhost:5173/catalog)
- **Order Tracker**: [http://localhost:5173/track-order](http://localhost:5173/track-order)
- **Admin Dashboard**: [http://localhost:5173/admin](http://localhost:5173/admin)

### 4. Build for Production
```bash
npm run build
```

---

## 📂 Project Structure

```
grocery-store/
├── public/
│   └── logo.svg                 # Custom FRESH NEST SVG logo & favicon
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx        # Badges (Best Price, Today's Deal, etc.)
│   │   │   ├── CartDrawer.jsx   # Slide-over cart drawer with threshold meter
│   │   │   ├── Footer.jsx       # Footer with value pillars & links
│   │   │   ├── MobileNav.jsx    # Mobile sticky bottom navigation
│   │   │   ├── Navbar.jsx       # Top navigation bar with live search
│   │   │   ├── ProductCard.jsx  # Card with Indian grocery price formatting
│   │   │   └── ProductModal.jsx # Quick view modal
│   │   └── home/
│   │       ├── CategoryGrid.jsx # Visual grid of 26 categories
│   │       ├── FeaturedRows.jsx # Curated product carousels & deal rows
│   │       └── HeroBanner.jsx   # Top promotion banner & value props
│   ├── context/
│   │   ├── CartContext.jsx      # Basket state & delivery calculations
│   │   ├── OrderContext.jsx     # Order placement & 5-stage tracker
│   │   ├── ProductContext.jsx   # Catalog, bulk price updater & LocalStorage
│   │   └── WishlistContext.jsx  # Saved items management
│   ├── data/
│   │   ├── categories.js        # 26 categories with subcategories & icons
│   │   └── products.json        # 378 realistic Indian grocery products
│   ├── pages/
│   │   ├── AdminDashboardPage.jsx # Pricing control & inventory manager
│   │   ├── CartPage.jsx         # Full cart view with promo codes
│   │   ├── CatalogPage.jsx      # Multi-filter search & sort catalog
│   │   ├── CategoryPage.jsx     # Category-specific department view
│   │   ├── CheckoutPage.jsx     # Address form, slots & payments
│   │   ├── HomePage.jsx         # Main storefront
│   │   ├── OrderSuccessPage.jsx # Order confirmation page
│   │   ├── OrderTrackingPage.jsx# Live delivery progress tracker
│   │   ├── ProductDetailPage.jsx# Dedicated product specifications & savings
│   │   └── WishlistPage.jsx     # Saved products page
│   ├── App.jsx                  # Main router setup
│   ├── index.css                # Tailwind base & utilities
│   └── main.jsx                 # React root entry point
├── index.html                   # HTML template
├── package.json                 # Project dependencies & scripts
├── tailwind.config.js           # Tailwind theme configuration
└── vite.config.js               # Vite bundler configuration
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
