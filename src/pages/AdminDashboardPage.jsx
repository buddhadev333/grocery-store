import React, { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../data/categories';
import { 
  Package, DollarSign, Percent, TrendingUp, AlertTriangle, 
  Search, Filter, Plus, Edit2, Trash2, Check, X, RefreshCw, 
  ArrowUpDown, Save, CheckCircle2 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { products, updateProductPrice, updateProduct, addProduct, deleteProduct, bulkUpdatePrices, resetToDemo } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('all');

  // Bulk Price Update state
  const [bulkCategory, setBulkCategory] = useState('all');
  const [bulkAction, setBulkAction] = useState('percent_off_mrp');
  const [bulkValue, setBulkValue] = useState('10');
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState('');

  // Inline editing state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

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
    badge: 'Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    description: ''
  });

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

  // Handle start editing
  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      mrp: product.mrp,
      sellingPrice: product.sellingPrice,
      stock: product.stock,
      badge: product.badge || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = (productId) => {
    updateProduct(productId, {
      mrp: parseFloat(editForm.mrp),
      sellingPrice: parseFloat(editForm.sellingPrice),
      stock: parseInt(editForm.stock),
      badge: editForm.badge
    });
    setEditingId(null);
  };

  // Handle Bulk Price update
  const handleBulkUpdate = (e) => {
    e.preventDefault();
    const count = bulkUpdatePrices({
      category: bulkCategory,
      action: bulkAction,
      value: bulkValue
    });
    setBulkSuccessMsg(`Updated pricing for ${count} product(s) successfully!`);
    setTimeout(() => setBulkSuccessMsg(''), 4000);
  };

  // Handle Add Product Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.mrp || !newProduct.sellingPrice) return;

    const matchedCat = CATEGORIES.find(c => c.name === newProduct.category);
    const categorySlug = matchedCat ? matchedCat.slug : newProduct.category.toLowerCase().replace(/\s+/g, '-');

    addProduct({
      ...newProduct,
      categorySlug,
      subcategory: newProduct.subcategory || (matchedCat?.subcategories?.[0] || 'General')
    });

    setShowAddModal(false);
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
      badge: 'Fresh',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
      description: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700 text-white text-xs font-extrabold uppercase px-2.5 py-1 rounded">Admin</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Store Management & Pricing Control</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time catalog control, competitive Indian grocery pricing, inventory & bulk margin manager
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
          <button
            onClick={() => {
              if (window.confirm("Reset all 378 products to initial catalog? Any custom prices will be reset to default.")) {
                resetToDemo();
              }
            }}
            className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
            title="Reload realistic 378 demo grocery products"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Demo
          </button>
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
            <span className="text-xs font-bold text-slate-400 block uppercase">Total Valuation</span>
            <span className="text-2xl font-black text-slate-900">₹{stats.totalInventoryValue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Bulk Pricing Control Panel */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg sm:text-xl font-extrabold text-white">Bulk Pricing & Margin Manager</h2>
        </div>
        <p className="text-slate-300 text-xs sm:text-sm mb-6 max-w-2xl">
          Instantly revise competitive prices across entire grocery departments without manually editing products one by one.
        </p>

        <form onSubmit={handleBulkUpdate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Target Department</label>
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
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Pricing Strategy</label>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="percent_off_mrp">Set % Discount off MRP</option>
              <option value="percent_change_selling">Adjust Selling Price by % (+/-)</option>
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
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl transition text-xs sm:text-sm shadow-md"
            >
              Apply Bulk Price Update
            </button>
          </div>
        </form>

        {bulkSuccessMsg && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{bulkSuccessMsg}</span>
          </div>
        )}
      </div>

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

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Product</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">MRP</th>
                <th className="px-4 py-3.5">Selling Price</th>
                <th className="px-4 py-3.5">Discount</th>
                <th className="px-4 py-3.5">Stock</th>
                <th className="px-4 py-3.5">Badge</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.slice(0, 100).map(product => {
                const isEditing = editingId === product.id;
                return (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition">
                    {/* Name and Image */}
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

                    {/* Category */}
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {product.category}
                      <span className="block text-[10px] text-slate-400">{product.subcategory}</span>
                    </td>

                    {/* MRP */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.mrp}
                          onChange={(e) => setEditForm(prev => ({ ...prev, mrp: e.target.value }))}
                          className="w-20 px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-xs"
                        />
                      ) : (
                        <span className="font-semibold text-slate-500">₹{product.mrp}</span>
                      )}
                    </td>

                    {/* Selling Price */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.sellingPrice}
                          onChange={(e) => setEditForm(prev => ({ ...prev, sellingPrice: e.target.value }))}
                          className="w-20 px-2 py-1 bg-white border border-emerald-500 rounded font-bold text-xs text-emerald-800"
                        />
                      ) : (
                        <span className="font-black text-slate-900 text-sm">₹{product.sellingPrice}</span>
                      )}
                    </td>

                    {/* Discount */}
                    <td className="px-4 py-3">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                        {product.discount}% OFF
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.stock}
                          onChange={(e) => setEditForm(prev => ({ ...prev, stock: e.target.value }))}
                          className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                        />
                      ) : (
                        <span className={`font-semibold text-xs ${product.stock < 15 ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                          {product.stock}
                        </span>
                      )}
                    </td>

                    {/* Badge */}
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.badge}
                          onChange={(e) => setEditForm(prev => ({ ...prev, badge: e.target.value }))}
                          placeholder="e.g. Best Price"
                          className="w-24 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                        />
                      ) : (
                        <span className="text-[11px] font-medium text-slate-500">
                          {product.badge || '-'}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => saveEdit(product.id)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-md"
                            title="Save Changes"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(product)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition"
                            title="Edit Price & Stock"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${product.name}?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-900">Add New Grocery Product</h3>
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
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
                  Add to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
