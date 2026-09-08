import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/categories';
import { 
  Package, DollarSign, Percent, TrendingUp, AlertTriangle, 
  Search, Filter, Plus, Edit2, Trash2, Check, X, RefreshCw, 
  ArrowUpDown, Save, CheckCircle2, ShieldCheck, ShieldAlert, 
  Lock, LogOut, AlertCircle, Sparkles, Tag, Eye, ArrowRight 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { 
    products, 
    updateProductPrice, 
    updateProduct, 
    updateStock, 
    addProduct, 
    deleteProduct, 
    bulkUpdatePrices, 
    resetToDemo 
  } = useProducts();

  const { user, isOwner, isStaff, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('all');

  // Success / Error Alerts
  const [successToast, setSuccessToast] = useState(null);
  const [errorToast, setErrorToast] = useState(null);

  // Price Editing Modal state
  const [priceModalProduct, setPriceModalProduct] = useState(null);
  const [priceForm, setPriceForm] = useState({ mrp: '', sellingPrice: '', badge: '' });
  const [confirmPriceModal, setConfirmPriceModal] = useState(false);
  const [priceSaving, setPriceSaving] = useState(false);

  // Full Product Edit Modal state
  const [editProductModal, setEditProductModal] = useState(null);
  const [editProductForm, setEditProductForm] = useState({});

  // Add Product Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: CATEGORIES[0]?.name || 'Atta, Flours & Grains',
    categorySlug: CATEGORIES[0]?.slug || 'atta-flours-grains',
    subcategory: '',
    sizeWeight: '',
    mrp: '',
    sellingPrice: '',
    stock: 50,
    badge: 'Best Price',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    description: ''
  });

  // Bulk Price Update state
  const [bulkCategory, setBulkCategory] = useState('all');
  const [bulkAction, setBulkAction] = useState('percent_off_mrp');
  const [bulkValue, setBulkValue] = useState('10');
  const [confirmBulkModal, setConfirmBulkModal] = useState(false);

  // If unauthenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            The Owner & Admin Dashboard is protected. Please log in with authorized credentials to view or manage the catalog.
          </p>
          <Link
            to="/admin/login"
            className="inline-flex items-center justify-center gap-2 w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl transition shadow-sm"
          >
            <span>Proceed to Owner Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Helper trigger toast
  const triggerSuccess = (title, details) => {
    setSuccessToast({ title, details });
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const triggerError = (msg) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 5000);
  };

  // KPI Metrics
  const stats = useMemo(() => {
    const total = products.length;
    const lowStock = products.filter(p => p.stock < 15).length;
    const avgDiscount = total > 0 
      ? Math.round(products.reduce((acc, p) => acc + (p.discount || 0), 0) / total) 
      : 0;
    const totalInventoryValue = products.reduce((acc, p) => acc + (p.sellingPrice * p.stock), 0);

    return { total, lowStock, avgDiscount, totalInventoryValue };
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory || p.categorySlug === selectedCategory;

      const matchStock = 
        stockFilter === 'all' ? true :
        stockFilter === 'low' ? p.stock < 15 :
        stockFilter === 'out' ? p.stock <= 0 : true;

      return matchSearch && matchCat && matchStock;
    });
  }, [products, searchTerm, selectedCategory, stockFilter]);

  // Open Price Edit Modal
  const handleOpenPriceModal = (product) => {
    if (!isOwner) {
      triggerError("Security Alert: Only store owners (Buddhadev Bera & Lakshmi Kanta Bera) have permission to edit product prices.");
      return;
    }
    setPriceModalProduct(product);
    setPriceForm({
      mrp: String(product.mrp),
      sellingPrice: String(product.sellingPrice),
      badge: product.badge || 'Best Price'
    });
  };

  // Submit Price change with two-step confirmation
  const handleConfirmPriceUpdate = async () => {
    if (!priceModalProduct) return;
    setPriceSaving(true);

    const res = await updateProductPrice(
      priceModalProduct.id,
      priceForm.mrp,
      priceForm.sellingPrice,
      priceForm.badge
    );

    setPriceSaving(false);
    setConfirmPriceModal(false);

    if (res.success) {
      setPriceModalProduct(null);
      triggerSuccess(
        `Price updated for "${priceModalProduct.name}"`,
        `New Price: ₹${priceForm.sellingPrice} (MRP: ₹${priceForm.mrp}) • Authorized by ${res.auditReceipt?.authorizedBy || user?.displayName || 'Store Owner'}`
      );
    } else {
      triggerError(res.error || 'Server rejected price modification.');
    }
  };

  // Open Full Product Edit Modal
  const handleOpenEditModal = (product) => {
    if (!isOwner) {
      triggerError("Security Alert: Only store owners (Buddhadev Bera & Lakshmi Kanta Bera) have permission to edit product information.");
      return;
    }
    setEditProductModal(product);
    setEditProductForm({ ...product });
  };

  const handleSaveProductEdit = async (e) => {
    e.preventDefault();
    const res = await updateProduct(editProductModal.id, editProductForm);
    if (res.success) {
      setEditProductModal(null);
      triggerSuccess("Product Updated", `Changes saved for "${editProductForm.name}".`);
    } else {
      triggerError(res.error || "Update failed authorization.");
    }
  };

  // Handle Add Product
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.mrp || !newProduct.sellingPrice) return;

    const matchedCat = CATEGORIES.find(c => c.name === newProduct.category);
    const categorySlug = matchedCat ? matchedCat.slug : newProduct.category.toLowerCase().replace(/\s+/g, '-');

    const res = await addProduct({
      ...newProduct,
      categorySlug,
      subcategory: newProduct.subcategory || (matchedCat?.subcategories?.[0] || 'General')
    });

    if (res.success) {
      setShowAddModal(false);
      triggerSuccess("Product Added", `"${newProduct.name}" is now live in the store catalog.`);
      setNewProduct({
        name: '',
        brand: '',
        category: CATEGORIES[0]?.name || 'Atta, Flours & Grains',
        categorySlug: CATEGORIES[0]?.slug || 'atta-flours-grains',
        subcategory: '',
        sizeWeight: '',
        mrp: '',
        sellingPrice: '',
        stock: 50,
        badge: 'Best Price',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
        description: ''
      });
    } else {
      triggerError(res.error || "Adding product failed authorization.");
    }
  };

  // Handle Delete Product
  const handleDelete = async (product) => {
    if (!isOwner) {
      triggerError("Security Alert: Only store owners (Buddhadev Bera & Lakshmi Kanta Bera) have permission to delete products.");
      return;
    }

    if (window.confirm(`Are you sure you want to permanently remove "${product.name}" from FRESH NEST?`)) {
      const res = await deleteProduct(product.id);
      if (res.success) {
        triggerSuccess("Product Removed", `"${product.name}" was removed from the catalog.`);
      } else {
        triggerError(res.error || "Delete failed authorization.");
      }
    }
  };

  // Handle Bulk Price update
  const handleBulkUpdate = async () => {
    setConfirmBulkModal(false);
    const res = await bulkUpdatePrices({
      category: bulkCategory,
      action: bulkAction,
      value: bulkValue
    });

    if (res.success) {
      triggerSuccess("Bulk Price Update Completed", res.message);
    } else {
      triggerError(res.error || "Bulk update failed authorization.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notifications */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-emerald-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-700 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-white">{successToast.title}</p>
              <p className="text-xs text-emerald-200 mt-0.5">{successToast.details}</p>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-white ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {errorToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-rose-900 text-white p-4 rounded-2xl shadow-2xl border border-rose-700 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-sm text-white">Action Denied</p>
              <p className="text-xs text-rose-200 mt-0.5">{errorToast}</p>
            </div>
            <button onClick={() => setErrorToast(null)} className="text-rose-400 hover:text-white ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header Card with Owner Identity */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-slate-950" />
                <span>OFFICIAL STORE</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 font-semibold text-xs px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                🔒 Cryptographic API Authorization Active
              </span>
            </div>

            {/* Clear Owner Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Buddhadev Bera (Owner) &amp; Lakshmi Kanta Bera (Co-Owner)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              FRESH NEST Store Portal • West Bengal, Rankinipur, Borachira, Near Huli Mondir • 📞 +91 6297622545 • ✉️ buddhadevbera615@gmail.com
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* User Session Pill */}
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Signed In As</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {user?.displayName} ({user?.role?.toUpperCase()})
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* If Staff Account Warning Banner */}
        {isStaff && (
          <div className="mt-5 p-4 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-300 shrink-0" />
            <div>
              <strong className="text-white block">Staff Limited Access Mode</strong>
              <span>
                You are authenticated as Store Staff. You can update stock availability. Price changes, product deletions, and catalog additions are strictly restricted to Store Owners <strong>Buddhadev Bera &amp; Lakshmi Kanta Bera</strong>.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar (Add Product, Reset Demo, Storefront link) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-emerald-200"
          >
            <Eye className="w-4 h-4" /> View Customer Storefront
          </Link>
          <span className="text-xs text-slate-400 font-semibold">•</span>
          <span className="text-xs font-semibold text-slate-600">
            {products.length} active grocery items
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isOwner && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          )}

          {isOwner && (
            <button
              onClick={() => {
                if (window.confirm("Reset all 378 products to initial demo state?")) {
                  resetToDemo();
                  triggerSuccess("Catalog Reset", "Restored 378 demo grocery products.");
                }
              }}
              className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
              title="Reset to original 378 products"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> Reset Demo
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Total Products</span>
            <span className="text-2xl font-black text-slate-900">{stats.total}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Avg. Discount</span>
            <span className="text-2xl font-black text-slate-900">{stats.avgDiscount}%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Low Stock (&lt;15)</span>
            <span className="text-2xl font-black text-amber-600">{stats.lowStock}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Store Valuation</span>
            <span className="text-2xl font-black text-slate-900">₹{stats.totalInventoryValue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Bulk Pricing Control Panel (Owner Exclusive) */}
      {isOwner && (
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg sm:text-xl font-extrabold text-white">Owner Bulk Pricing Manager</h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mb-6 max-w-2xl">
            Update competitive discount margins across an entire grocery department with automatic server authorization.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Department</label>
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Departments ({products.length} items)</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Pricing Action</label>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="percent_off_mrp">Set % Discount off MRP</option>
                <option value="percent_change_selling">Adjust Selling Price (+/- %)</option>
                <option value="flat_discount_off_mrp">Set Flat ₹ Discount off MRP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Value ({bulkAction === 'flat_discount_off_mrp' ? '₹' : '%'})
              </label>
              <input
                type="number"
                step="any"
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                placeholder="e.g. 10"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => setConfirmBulkModal(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl transition text-xs sm:text-sm shadow-md"
              >
                Review & Apply Bulk Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Search & Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, brand, or SKU ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Stock filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Inventory</option>
            <option value="low">Low Stock (&lt;15)</option>
            <option value="out">Out of Stock</option>
          </select>

          <span className="text-xs text-slate-400 font-semibold px-2">
            {filteredProducts.length} items
          </span>
        </div>
      </div>

      {/* Main Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Product & Brand</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">MRP</th>
                <th className="px-4 py-3.5">Selling Price</th>
                <th className="px-4 py-3.5">Discount</th>
                <th className="px-4 py-3.5">Stock Status</th>
                <th className="px-4 py-3.5">Badge</th>
                <th className="px-4 py-3.5 text-right">Management Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.slice(0, 100).map(product => {
                return (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition">
                    {/* Product Name & Brand */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100 p-0.5 shrink-0"
                        />
                        <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block">{product.brand}</span>
                          <span className="font-bold text-slate-900 truncate block">{product.name}</span>
                          <span className="text-[11px] text-slate-400">{product.sizeWeight}</span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {product.category}
                      <span className="block text-[10px] text-slate-400">{product.subcategory}</span>
                    </td>

                    {/* MRP */}
                    <td className="px-4 py-3 font-semibold text-slate-500">
                      ₹{product.mrp}
                    </td>

                    {/* Selling Price */}
                    <td className="px-4 py-3">
                      <span className="font-black text-slate-900 text-sm">₹{product.sellingPrice}</span>
                      {product.savingsAmount > 0 && (
                        <span className="block text-[10px] text-emerald-700 font-semibold">
                          Save ₹{product.savingsAmount}
                        </span>
                      )}
                    </td>

                    {/* Discount */}
                    <td className="px-4 py-3">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                        {product.discount}% OFF
                      </span>
                    </td>

                    {/* Stock Status (Authorized for Owner & Staff) */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                        <span className={`font-semibold text-xs ${product.stock < 15 ? 'text-amber-600 font-bold' : 'text-slate-700'}`}>
                          {product.stock} units
                        </span>
                      </div>
                    </td>

                    {/* Badge */}
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {product.badge || '-'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Price (Owner Only) */}
                        <button
                          onClick={() => handleOpenPriceModal(product)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            isOwner 
                              ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200' 
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                          title={isOwner ? "Edit Price (Owner Only)" : "Price editing restricted to Store Owners"}
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Edit Price</span>
                        </button>

                        {/* Edit Details (Owner Only) */}
                        {isOwner && (
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
                            title="Edit Product Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete (Owner Only) */}
                        {isOwner && (
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Remove Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length > 100 && (
          <div className="p-3 bg-slate-50 text-center text-xs text-slate-500 border-t border-slate-200">
            Showing first 100 results of {filteredProducts.length}. Use search to narrow down products.
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. PRICE EDIT MODAL WITH CONFIRMATION (OWNER EXCLUSIVE)                   */}
      {/* ========================================================================= */}
      {priceModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Edit Product Price</h3>
                  <p className="text-[11px] text-emerald-700 font-semibold">Authorized for: {user?.displayName || 'Store Owner'} ({user?.role?.toUpperCase() || 'OWNER'})</p>
                </div>
              </div>
              <button onClick={() => setPriceModalProduct(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
              <img src={priceModalProduct.imageUrl} alt="" className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
              <div className="min-w-0">
                <p className="font-bold text-xs text-slate-900 truncate">{priceModalProduct.name}</p>
                <p className="text-[11px] text-slate-500">Current Selling: <strong>₹{priceModalProduct.sellingPrice}</strong> (MRP: ₹{priceModalProduct.mrp})</p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setConfirmPriceModal(true); }} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={priceForm.mrp}
                    onChange={(e) => setPriceForm(prev => ({ ...prev, mrp: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={priceForm.sellingPrice}
                    onChange={(e) => setPriceForm(prev => ({ ...prev, sellingPrice: e.target.value }))}
                    className="w-full bg-slate-50 border border-emerald-500 rounded-xl px-3 py-2 font-black text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Preview Calculation */}
              {parseFloat(priceForm.mrp) > 0 && parseFloat(priceForm.sellingPrice) > 0 && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-emerald-900">
                    <span>Computed Discount:</span>
                    <span>{Math.round(((priceForm.mrp - priceForm.sellingPrice) / priceForm.mrp) * 100)}% OFF</span>
                  </div>
                  <div className="flex justify-between font-semibold text-emerald-900">
                    <span>Customer Savings:</span>
                    <span>₹{(priceForm.mrp - priceForm.sellingPrice).toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Promotional Badge</label>
                <select
                  value={priceForm.badge}
                  onChange={(e) => setPriceForm(prev => ({ ...prev, badge: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Best Price">Best Price</option>
                  <option value="Today's Deal">Today's Deal</option>
                  <option value="Great Value">Great Value</option>
                  <option value="Special Offer">Special Offer</option>
                  <option value="Fresh">Fresh</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPriceModalProduct(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition shadow-sm"
                >
                  Review & Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL BEFORE SAVING NEW PRICE */}
      {confirmPriceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="font-extrabold text-slate-900 text-lg mb-1">Confirm Price Change</h3>
            <p className="text-xs text-slate-500 mb-4">
              Are you sure you want to update the price for:
              <strong className="block text-slate-800 mt-1">{priceModalProduct?.name}</strong>
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs mb-5 text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Previous Price:</span>
                <span className="font-bold line-through text-slate-400">₹{priceModalProduct?.sellingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 font-bold">New Selling Price:</span>
                <span className="font-black text-emerald-700 text-sm">₹{priceForm.sellingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">New MRP:</span>
                <span className="font-semibold text-slate-700">₹{priceForm.mrp}</span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                Security: Changes will be signed & authorized by {user?.displayName || 'Store Owner'}.
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmPriceModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
              >
                Go Back
              </button>
              <button
                type="button"
                disabled={priceSaving}
                onClick={handleConfirmPriceUpdate}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm disabled:opacity-50"
              >
                {priceSaving ? "Saving..." : "Confirm & Save Price"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR BULK UPDATE */}
      {confirmBulkModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <h3 className="font-extrabold text-slate-900 text-lg mb-2">Confirm Bulk Update</h3>
            <p className="text-xs text-slate-500 mb-4">
              Apply bulk update ({bulkAction}) with value <strong>{bulkValue}</strong> to <strong>{bulkCategory}</strong>?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmBulkModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkUpdate}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Yes, Apply Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FULL PRODUCT DETAILS EDIT MODAL (OWNER EXCLUSIVE)                     */}
      {/* ========================================================================= */}
      {editProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <h3 className="font-extrabold text-slate-900 text-base">Edit Product Details</h3>
              <button onClick={() => setEditProductModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editProductForm.name || ''}
                  onChange={(e) => setEditProductForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editProductForm.brand || ''}
                    onChange={(e) => setEditProductForm(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Size / Weight</label>
                  <input
                    type="text"
                    value={editProductForm.sizeWeight || ''}
                    onChange={(e) => setEditProductForm(prev => ({ ...prev, sizeWeight: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editProductForm.category || ''}
                    onChange={(e) => setEditProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Level</label>
                  <input
                    type="number"
                    value={editProductForm.stock || 0}
                    onChange={(e) => setEditProductForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editProductForm.imageUrl || ''}
                  onChange={(e) => setEditProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editProductForm.description || ''}
                  onChange={(e) => setEditProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditProductModal(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ADD NEW PRODUCT MODAL (OWNER EXCLUSIVE)                               */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Product</h3>
                <p className="text-xs text-slate-500">Authorized by {user?.displayName || 'Store Owner'}</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aashirvaad Shudh Chakki Atta 5kg"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aashirvaad"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Size / Weight *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 kg"
                    value={newProduct.sizeWeight}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, sizeWeight: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subcategory</label>
                  <input
                    type="text"
                    placeholder="e.g. Whole Wheat"
                    value={newProduct.subcategory}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, subcategory: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="250"
                    value={newProduct.mrp}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, mrp: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="229"
                    value={newProduct.sellingPrice}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, sellingPrice: e.target.value }))}
                    className="w-full bg-slate-50 border border-emerald-500 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition shadow-sm"
                >
                  Add to Store Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
