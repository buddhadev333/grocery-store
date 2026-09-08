import React from 'react';
import { 
  ShieldCheck, Award, Tag, ShoppingBag, 
  Truck, HeartHandshake, Sparkles, UserCheck 
} from 'lucide-react';

export const TrustSection = () => {
  const trustPillars = [
    {
      icon: UserCheck,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      title: 'Buddhadev Bera — Owner',
      desc: 'Personally managed and supervised store guaranteeing authentic products, fair pricing, and neighborhood trust.'
    },
    {
      icon: Award,
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      title: 'Quality Products',
      desc: '100% verified genuine brands and daily farm-fresh fruits and vegetables sourced directly from regional mandis.'
    },
    {
      icon: Tag,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      title: 'Affordable Prices',
      desc: 'Realistic Indian market rates matching or beating offline supermarkets. No artificial markups or hidden fees.'
    },
    {
      icon: ShoppingBag,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      title: 'Easy Shopping',
      desc: 'Effortless multi-category browsing, real-time search, customer ratings, and instant cart access across all devices.'
    },
    {
      icon: Truck,
      color: 'bg-teal-100 text-teal-800 border-teal-200',
      title: 'Convenient Ordering',
      desc: 'Flexible doorstep delivery slots, free delivery on orders above ₹499, and transparent 5-stage order tracking.'
    },
    {
      icon: HeartHandshake,
      color: 'bg-rose-100 text-rose-800 border-rose-200',
      title: 'Customer-Friendly Service',
      desc: 'Hassle-free doorstep returns, responsive customer assistance, and friendly local kirana warmth.'
    }
  ];

  return (
    <section className="mb-14 py-8 px-6 sm:px-10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl shadow-xl relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Promise & Integrity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Why Shop at FRESH NEST?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Founded and actively managed by <strong className="text-amber-400 font-bold">Buddhadev Bera</strong>, committed to providing every Indian household with everyday grocery savings and dependable service.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trustPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 transition-all duration-300 flex items-start gap-4 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Owner Signature Line */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Store • Verified Owner Management: <strong className="text-white">Buddhadev Bera</strong></span>
          </div>
          <div className="text-emerald-400 font-semibold">
            100% Quality Assurance Guarantee
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
