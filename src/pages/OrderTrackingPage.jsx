import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders, ORDER_STAGES } from '../context/OrderContext';
import { 
  CheckCircle2, Clock, Truck, Package, ShoppingBag, 
  MapPin, ChevronRight, ArrowRight, RefreshCw, AlertCircle 
} from 'lucide-react';

export default function OrderTrackingPage() {
  const { orderId: paramOrderId } = useParams();
  const { orders, getOrder, updateOrderStatus } = useOrders();
  const [searchId, setSearchId] = useState(paramOrderId || '');

  // Active selected order
  const activeOrder = getOrder(paramOrderId || searchId) || orders[0];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      window.history.replaceState(null, '', `/track-order/${searchId.trim()}`);
    }
  };

  // Find index of current stage
  const currentStageIndex = activeOrder 
    ? ORDER_STAGES.findIndex(s => s.key.toLowerCase() === activeOrder.status.toLowerCase())
    : 0;

  const handleAdvanceStage = () => {
    if (!activeOrder) return;
    const nextIndex = currentStageIndex + 1;
    if (nextIndex < ORDER_STAGES.length) {
      updateOrderStatus(activeOrder.id, ORDER_STAGES[nextIndex].key);
    }
  };

  const handleResetStage = () => {
    if (!activeOrder) return;
    updateOrderStatus(activeOrder.id, ORDER_STAGES[0].key);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-emerald-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-medium">Order Tracker</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Track Your Delivery</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Live status update on your FRESH NEST grocery delivery</p>
        </div>

        {/* Search Order Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. FN...)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition"
          >
            Track
          </button>
        </form>
      </div>

      {!activeOrder ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Orders Found</h3>
          <p className="text-sm text-slate-500 mb-6">Place an order to see live visual tracking in action.</p>
          <Link
            to="/products"
            className="bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-800 transition"
          >
            Browse Store
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Status Timeline Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Order ID: #{activeOrder.id}
                </span>
                <p className="text-xs text-slate-500 mt-2">
                  Placed on {new Date(activeOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-xs text-slate-400 block mb-0.5">Current Status</span>
                <span className="text-base sm:text-lg font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                  ● {activeOrder.status}
                </span>
              </div>
            </div>

            {/* Visual Stepper */}
            <div className="py-8">
              <div className="relative">
                {/* Horizontal Progress bar for Desktop */}
                <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1.5 bg-slate-200 -translate-y-1/2 z-0 rounded-full">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${(currentStageIndex / (ORDER_STAGES.length - 1)) * 100}%`
                    }}
                  />
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                  {ORDER_STAGES.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div key={stage.id} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm shrink-0 ${
                            isCurrent
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110'
                              : isCompleted
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>

                        <div>
                          <p className={`text-xs sm:text-sm font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                            {stage.label}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Simulation Demo Controls for Testing */}
            <div className="mt-4 pt-6 border-t border-slate-100 bg-slate-50/80 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 rounded-b-3xl flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-800">Demo Interactive Tracker:</span> Advance or reset delivery steps to verify full order cycle.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdvanceStage}
                  disabled={currentStageIndex >= ORDER_STAGES.length - 1}
                  className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm"
                >
                  Advance to Next Stage &rarr;
                </button>
                <button
                  onClick={handleResetStage}
                  className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>
          </div>

          {/* Details & Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Destination */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Destination & Delivery Contact</span>
              </div>
              <div className="text-xs sm:text-sm space-y-1.5 text-slate-600">
                <p><strong className="text-slate-900">{activeOrder.customer?.name}</strong></p>
                <p>{activeOrder.customer?.address}</p>
                <p>Phone: <span className="font-mono">{activeOrder.customer?.phone}</span></p>
                <p>Slot: <span className="text-emerald-700 font-semibold">{activeOrder.customer?.slot}</span></p>
                <p>Payment: <span className="font-semibold">{activeOrder.paymentMethod}</span></p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>Items in Package ({activeOrder.items?.length})</span>
                </div>
                <span className="text-emerald-800 text-xs font-bold">Total: ₹{activeOrder.total}</span>
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {activeOrder.items?.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-8 h-8 object-contain rounded-md bg-slate-50 border border-slate-100 p-0.5 shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 block truncate">{item.name}</span>
                        <span className="text-[11px] text-slate-400">{item.sizeWeight} × {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">₹{item.sellingPrice * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
