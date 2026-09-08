import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { 
  Truck, ShieldCheck, MapPin, Smartphone, 
  CheckCircle2, ChevronRight, Copy, Check, Download, 
  ExternalLink, X, QrCode, AlertCircle, Sparkles, CheckCheck
} from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, subtotal, totalSavings, deliveryFee, finalTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showFullQr, setShowFullQr] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    locality: '',
    landmark: '',
    city: 'West Bengal',
    pincode: '721430',
    deliverySlot: 'Standard (Today within 2 hrs)',
    paymentMethod: 'UPI',
    upiTransactionId: '',
    upiConfirmed: false
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

    // MANDATORY UPI UTR VALIDATION (Prevents placing unverified orders)
    const utr = form.upiTransactionId.trim();
    if (!utr) {
      err.upiTransactionId = 'Payment Required: Please enter the 12-digit UPI UTR / Transaction ID from your payment receipt.';
    } else if (!/^\d{12}$/.test(utr)) {
      err.upiTransactionId = `Invalid UTR (${utr.length} digits). A valid Indian UPI UTR is exactly 12 numbers (e.g. 423589123456).`;
    }

    if (!form.upiConfirmed) {
      err.upiConfirmed = 'Please confirm that you have scanned the QR or transferred ₹' + finalTotal + ' to Buddhadev Bera.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('6297622545@naviaxis');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      const paymentSummary = form.upiTransactionId.trim()
        ? `UPI (Buddhadev Bera • UTR: ${form.upiTransactionId.trim()})`
        : 'UPI QR (Buddhadev Bera • 6297622545@naviaxis)';

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
        paymentMethod: paymentSummary,
        upiRef: form.upiTransactionId.trim() || null
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

            {/* Payment Method Selection (Exclusive UPI & QR Code) */}
            <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-sm relative overflow-hidden">
              {/* Top Accent Band */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-400" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-sm">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                        2. Payment Method — Official Store UPI &amp; QR
                      </h2>
                      <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-300">
                        <CheckCheck className="w-3 h-3" /> Only Accepted Method
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct settlement to Owner Buddhadev Bera • Zero gateway fees • 100% Secure
                    </p>
                  </div>
                </div>
              </div>

              {/* Security & Exclusivity Banner */}
              <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start sm:items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
                <div className="leading-relaxed">
                  <strong className="font-bold">Exclusive Store Payment:</strong> All other payment methods (Cards, Net Banking &amp; COD) have been removed. Pay directly to <strong>Buddhadev Bera</strong> via UPI QR code or UPI ID for immediate order packing and doorstep dispatch.
                </div>
              </div>

              {/* Main UPI & QR Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Left side: High-Res Scannable QR Pass */}
                <div className="md:col-span-5 flex flex-col items-center bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700 mb-3 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Scan with Any UPI App</span>
                  </div>

                  {/* QR Image Frame */}
                  <div 
                    onClick={() => setShowFullQr(true)}
                    className="group relative bg-white p-2.5 rounded-2xl border-2 border-emerald-500/40 shadow-md cursor-pointer hover:shadow-lg transition max-w-[220px]"
                    title="Click to view full screen pass"
                  >
                    <img 
                      src="/upi-qr-code.png" 
                      alt="Buddhadev Bera Official Navi UPI QR Code" 
                      className="w-full h-auto rounded-xl object-contain"
                    />
                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 rounded-xl transition flex items-center justify-center opacity-0 group-hover:opacity-100 text-white font-bold text-xs">
                      <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg">Click to Enlarge</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2">
                    Official QR linked to Punjab National Bank
                  </p>

                  {/* Action Buttons under QR */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3 w-full">
                    <a
                      href="/upi-qr-code.png"
                      download="Buddhadev-Bera-FRESH-NEST-UPI-QR.png"
                      className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Download QR</span>
                    </a>

                    <a
                      href={`upi://pay?pa=6297622545@naviaxis&pn=Buddhadev%20Bera&am=${finalTotal}&cu=INR&tn=FRESHNEST%20Grocery`}
                      className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Pay via App</span>
                    </a>
                  </div>
                </div>

                {/* Right side: Bank Details, UPI ID Copy, UTR Input */}
                <div className="md:col-span-7 space-y-4">
                  {/* Amount to Pay Pill */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Amount to Pay</span>
                      <span className="text-2xl font-black text-amber-400">₹{finalTotal}</span>
                    </div>
                    <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-full">
                      Zero Extra Fees
                    </span>
                  </div>

                  {/* UPI ID Copy Box */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Store UPI ID (Tap to Copy)
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-black text-slate-900 text-base sm:text-lg select-all">
                        6297622545@naviaxis
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs ${
                          copiedUpi 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                        }`}
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-slate-500" />
                            <span>Copy UPI ID</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Account Leadership & Bank Meta */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Account Holder</span>
                      <span className="font-bold text-slate-900 block mt-0.5">Buddhadev Bera</span>
                      <span className="text-[10px] text-slate-500">+91 62976 22545</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Bank Account</span>
                      <span className="font-bold text-slate-900 block mt-0.5">Punjab National Bank</span>
                      <span className="text-[10px] text-emerald-700 font-bold">Primary — A/C 9276</span>
                    </div>
                  </div>

                  {/* Accepted UPI Apps Icons / Pills */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Pay using any UPI App
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Navi UPI', 'Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay', 'Cred'].map((appName) => (
                        <span 
                          key={appName}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px] shadow-2xs"
                        >
                          {appName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* UTR Input Field */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-800">
                        UPI Transaction ID / 12-Digit UTR No. <span className="text-rose-600 font-black">*</span>
                      </label>
                      <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 font-bold px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    </div>
                    <input
                      type="text"
                      name="upiTransactionId"
                      value={form.upiTransactionId}
                      maxLength={12}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                        setForm(prev => ({ ...prev, upiTransactionId: val }));
                        if (errors.upiTransactionId) {
                          setErrors(prev => ({ ...prev, upiTransactionId: '' }));
                        }
                      }}
                      placeholder="Enter 12-digit UTR from your UPI payment receipt"
                      className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.upiTransactionId ? 'border-rose-400 bg-rose-50/60' : 'border-slate-300'
                      }`}
                    />
                    {errors.upiTransactionId ? (
                      <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.upiTransactionId}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-500 mt-1">
                        Found in your GPay / PhonePe / Paytm / Navi payment details receipt after transferring ₹{finalTotal}.
                      </p>
                    )}
                  </div>

                  {/* Confirmation Checkbox */}
                  <div className="space-y-1">
                    <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                      errors.upiConfirmed ? 'bg-rose-50 border-rose-300' : 'bg-emerald-50/80 border-emerald-200/80'
                    }`}>
                      <input
                        type="checkbox"
                        name="upiConfirmed"
                        checked={form.upiConfirmed}
                        onChange={(e) => {
                          setForm(prev => ({ ...prev, upiConfirmed: e.target.checked }));
                          if (errors.upiConfirmed) {
                            setErrors(prev => ({ ...prev, upiConfirmed: '' }));
                          }
                        }}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500 rounded"
                      />
                      <span className="text-xs text-emerald-950 font-medium leading-relaxed">
                        I confirm that I have sent <strong>₹{finalTotal}</strong> to <strong>Buddhadev Bera</strong> (UPI ID: <span className="font-mono font-bold">6297622545@naviaxis</span> • Punjab National Bank).
                      </span>
                    </label>
                    {errors.upiConfirmed && (
                      <p className="text-rose-600 text-xs mt-1 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.upiConfirmed}</span>
                      </p>
                    )}
                  </div>
                </div>
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
                {submitting ? 'Submitting Payment Proof...' : `Submit Payment & Place Order (₹${finalTotal})`}
              </button>

              <p className="text-[11px] text-slate-500 mt-2 text-center">
                🔒 Store Owner Buddhadev Bera verifies this 12-digit UTR in Punjab National Bank before order confirmation.
              </p>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Direct Official UPI • 256-Bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Full QR Pass Modal */}
      {showFullQr && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative text-center">
            <button
              type="button"
              onClick={() => setShowFullQr(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-black text-slate-900 text-base mb-1">Official UPI QR Pass</h3>
            <p className="text-xs text-slate-500 mb-3">Buddhadev Bera • Punjab National Bank - 9276</p>
            <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-200 mb-4 max-h-[70vh] overflow-y-auto">
              <img 
                src="/upi-qr-code.png" 
                alt="Buddhadev Bera UPI QR Code" 
                className="w-full h-auto rounded-xl object-contain mx-auto"
              />
            </div>
            <a
              href="/upi-qr-code.png"
              download="Buddhadev-Bera-FRESH-NEST-UPI-QR.png"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" /> Download Official QR Pass
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
