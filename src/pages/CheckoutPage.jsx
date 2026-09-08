import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { 
  Truck, ShieldCheck, MapPin, CreditCard, Banknote, 
  Smartphone, Building2, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, subtotal, totalSavings, deliveryFee, finalTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    locality: '',
    landmark: '',
    city: 'Bengaluru',
    pincode: '560001',
    deliverySlot: 'Standard (Today within 2 hrs)',
    paymentMethod: 'COD'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-6">Add some groceries before proceeding to checkout.</p>
        <Link to="/products" className="bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-800 transition">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Full name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      err.phone = 'Enter a valid 10-digit mobile number';
    }
    if (!form.address.trim()) err.address = 'Flat / House No. & Building is required';
    if (!form.locality.trim()) err.locality = 'Area / Locality is required';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode.trim())) {
      err.pincode = 'Enter a valid 6-digit PIN code';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      const order = createOrder({
        customer: {
          name: form.name,
          phone: form.phone,
          email: form.email || 'customer@freshnest.in',
          address: `${form.address}, ${form.locality}, ${form.landmark ? 'Near ' + form.landmark + ', ' : ''}${form.city} - ${form.pincode}`,
          slot: form.deliverySlot
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          sizeWeight: item.sizeWeight,
          sellingPrice: item.sellingPrice,
          mrp: item.mrp,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        subtotal,
        discount: totalSavings,
        deliveryFee,
        total: finalTotal,
        paymentMethod: form.paymentMethod
      });

      clearCart();
      setSubmitting(false);
      navigate(`/order-success/${order.id}`);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-emerald-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/cart" className="hover:text-emerald-700">Cart</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-medium">Checkout</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">Delivery & Payment</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Form (Address & Payment) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg mb-6 pb-3 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-emerald-700" />
                <h2>1. Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.name ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`}
                  />
                  {errors.name && <p className="text-rose-600 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">10-Digit Mobile Number *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-500 text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`w-full bg-slate-50 border rounded-r-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.phone ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`}
                    />
                  </div>
                  {errors.phone && <p className="text-rose-600 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (for invoice updates)</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="ramesh@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Flat, House No., Building, Apartment *</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="e.g. Flat 304, Green Heights Apartment"
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.address ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`}
                  />
                  {errors.address && <p className="text-rose-600 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Area, Street, Sector, Village *</label>
                  <input
                    type="text"
                    name="locality"
                    value={form.locality}
                    onChange={handleChange}
                    placeholder="e.g. Koramangala 4th Block"
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.locality ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`}
                  />
                  {errors.locality && <p className="text-rose-600 text-xs mt-1">{errors.locality}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={form.landmark}
                    onChange={handleChange}
                    placeholder="e.g. Near Water Tank"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">6-Digit PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.pincode ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`}
                  />
                  {errors.pincode && <p className="text-rose-600 text-xs mt-1">{errors.pincode}</p>}
                </div>
              </div>

              {/* Delivery Slot Selection */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Preferred Delivery Slot</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Express Delivery', time: 'Today within 60 mins' },
                    { label: 'Standard Delivery', time: 'Today within 2 hrs' },
                    { label: 'Morning Slot', time: 'Tomorrow 7:00 AM - 9:00 AM' },
                    { label: 'Evening Slot', time: 'Tomorrow 6:00 PM - 8:00 PM' }
                  ].map(slot => (
                    <label
                      key={slot.label}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        form.deliverySlot === `${slot.label} (${slot.time})`
                          ? 'border-emerald-600 bg-emerald-50/60'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliverySlot"
                        value={`${slot.label} (${slot.time})`}
                        checked={form.deliverySlot === `${slot.label} (${slot.time})`}
                        onChange={handleChange}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">{slot.label}</div>
                        <div className="text-[11px] text-slate-500">{slot.time}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg mb-6 pb-3 border-b border-slate-100">
                <CreditCard className="w-5 h-5 text-emerald-700" />
                <h2>2. Payment Method</h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                  form.paymentMethod === 'COD' ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={form.paymentMethod === 'COD'}
                      onChange={handleChange}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex items-center gap-2.5">
                      <Banknote className="w-5 h-5 text-emerald-700" />
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">Cash on Delivery (COD) / Pay on Delivery</span>
                        <span className="text-xs text-slate-500">Pay cash or scan QR at your doorstep upon arrival</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Recommended</span>
                </label>

                {/* UPI */}
                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                  form.paymentMethod === 'UPI' ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={form.paymentMethod === 'UPI'}
                      onChange={handleChange}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-5 h-5 text-indigo-600" />
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                        <span className="text-xs text-slate-500">Fast and instant zero-fee digital payment</span>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Cards */}
                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                  form.paymentMethod === 'CARD' ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={form.paymentMethod === 'CARD'}
                      onChange={handleChange}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">Credit / Debit Card</span>
                        <span className="text-xs text-slate-500">Visa, MasterCard, RuPay cards accepted</span>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Net Banking */}
                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                  form.paymentMethod === 'NETBANKING' ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="NETBANKING"
                      checked={form.paymentMethod === 'NETBANKING'}
                      onChange={handleChange}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-5 h-5 text-teal-600" />
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">Net Banking</span>
                        <span className="text-xs text-slate-500">All major Indian banks supported (SBI, HDFC, ICICI, etc.)</span>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 mb-4 pb-3 border-b border-slate-100">
                Order Summary ({cartItems.length} items)
              </h3>

              {/* Items scroll */}
              <div className="max-h-60 overflow-y-auto space-y-3 mb-4 pr-1">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 shrink-0 border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-slate-400">{item.sizeWeight} × {item.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">₹{item.sellingPrice * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Total Savings</span>
                  <span>- ₹{totalSavings}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : <span>₹{deliveryFee}</span>}
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                  <span className="font-extrabold text-base text-slate-900">Total Payable</span>
                  <span className="font-black text-2xl text-slate-900">₹{finalTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {submitting ? 'Placing Order...' : `Place Order (₹${finalTotal})`}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted 256-Bit SSL Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
