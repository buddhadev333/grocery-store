import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { CheckCircle2, Clock, MapPin, Truck, ArrowRight, ShoppingBag } from 'lucide-react';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const { getOrder } = useOrders();

  const order = getOrder(orderId);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Not Found</h2>
        <p className="text-slate-500 mb-6">Could not find details for order ID: {orderId}</p>
        <Link to="/" className="bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-emerald-800 transition">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Success / Pending Verification Badge */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 text-center shadow-sm mb-8">
        {order.paymentVerified ? (
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-600 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
        ) : (
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5 text-amber-600">
            <Clock className="w-10 h-10 animate-pulse" />
          </div>
        )}

        <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full inline-block mb-3 border ${
          order.paymentVerified 
            ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
            : 'text-amber-800 bg-amber-50 border-amber-200'
        }`}>
          {order.paymentVerified ? 'Payment Verified & Confirmed' : 'Payment Verification Pending'}
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          {order.paymentVerified ? 'Thank you! Your order is confirmed.' : 'Payment Proof Submitted — Verifying Receipt'}
        </h1>
        
        <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto mb-4 leading-relaxed">
          {order.paymentVerified ? (
            <>Your order <strong className="text-slate-900 font-mono">#{order.id}</strong> has been verified by Store Owner Buddhadev Bera and is being prepared.</>
          ) : (
            <>
              Your order <strong className="text-slate-900 font-mono">#{order.id}</strong> has been recorded with UPI UTR <strong className="text-slate-900 font-mono bg-slate-100 px-1.5 py-0.5 rounded">#{order.upiRef}</strong>. Store Owner <strong>Buddhadev Bera</strong> is verifying the transfer in Punjab National Bank before packaging and delivery.
            </>
          )}
        </p>

        <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold mb-6">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>Estimated Delivery: {order.estimatedDelivery}</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to={`/track-order/${order.id}`}
            className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-xl transition shadow-sm"
          >
            <Truck className="w-4 h-4" />
            Track Live Verification Status
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
          Order Summary & Delivery Address
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Delivering To</span>
            <p className="font-bold text-slate-800">{order.customer?.name}</p>
            <p className="text-slate-600 text-xs mt-1 leading-relaxed">{order.customer?.address}</p>
            <p className="text-slate-500 text-xs mt-1">Phone: {order.customer?.phone}</p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Payment Details</span>
            <p className="font-bold text-slate-800">
              Status: <span className={order.paymentVerified ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                {order.paymentStatus || (order.paymentVerified ? 'Verified & Paid' : 'Pending Owner Verification')}
              </span>
            </p>
            {order.upiRef && (
              <p className="text-xs font-mono text-slate-700 font-bold mt-1">
                Submitted 12-Digit UTR: <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">{order.upiRef}</span>
              </p>
            )}
            <p className="text-slate-600 text-xs mt-1">Slot: {order.customer?.slot}</p>
            <p className="text-slate-600 text-xs mt-1">
              Total Payable: <strong className="text-slate-900 text-sm">₹{order.total}</strong>
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-semibold">
              <span>Beneficiary: Buddhadev Bera (Punjab National Bank - 9276)</span>
            </div>
          </div>
        </div>

        {/* Ordered items list */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 block mb-3">Items in this order ({order.items?.length})</span>
          <div className="space-y-3">
            {order.items?.map(item => (
              <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-slate-400 text-xs">{item.sizeWeight} × {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 shrink-0">₹{item.sellingPrice * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
