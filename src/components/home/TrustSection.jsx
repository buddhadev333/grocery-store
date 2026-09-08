import React from 'react';
import { 
  ShieldCheck, Award, Tag, ShoppingBag, 
  Truck, HeartHandshake, Sparkles, UserCheck, MapPin, Phone, Mail 
} from 'lucide-react';

export const TrustSection = () => {
  const trustPillars = [
    {
      icon: UserCheck,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      title: 'Buddhadev Bera & Lakshmi Kanta Bera',
      desc: 'Personally supervised and operated store by Buddhadev Bera (Owner) and Lakshmi Kanta Bera (Co-Owner), guaranteeing genuine groceries and neighborhood trust.'
    },
    {
      icon: Award,
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      title: 'Quality Products',
      desc: '100% verified genuine brands and daily farm-fresh fruits and vegetables sourced directly from trusted regional mandis.'
    },
    {
      icon: Tag,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      title: 'Affordable Prices',
      desc: 'Realistic Indian market rates matching or beating offline supermarkets. No artificial markups, transparent savings on every pack.'
    },
    {
      icon: ShoppingBag,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      title: 'Easy Shopping',
      desc: 'Effortless multi-category browsing, real-time instant search, customer ratings, and one-click cart access across mobile and desktop.'
    },
    {
      icon: Truck,
      color: 'bg-teal-100 text-teal-800 border-teal-200',
      title: 'Convenient Ordering',
      desc: 'Flexible doorstep delivery slots, free delivery on orders above ₹499, and transparent 5-stage order status tracking.'
    },
    {
      icon: HeartHandshake,
      color: 'bg-rose-100 text-rose-800 border-rose-200',
      title: 'Customer-Friendly Service',
      desc: 'Hassle-free doorstep returns, responsive phone/email support, and caring local store warmth.'
    }
  ];

  return (
    <section className="mb-14 py-8 px-6 sm:px-10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl shadow-xl relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Store Promise & Leadership</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Why Shop at FRESH NEST?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Founded and managed by <strong className="text-amber-400 font-bold">Buddhadev Bera (Owner)</strong> & <strong className="text-amber-300 font-bold">Lakshmi Kanta Bera (Co-Owner)</strong>. Located at Rankinipur, Borachira, Near Huli Mondir, West Bengal.
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

        {/* Store Location & Direct Contact Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>West Bengal, Rankinipur, Borachira, Near Huli Mondir</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a href="tel:6297622545" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors font-bold text-white">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+91 6297622545</span>
            </a>
            <a href="mailto:buddhadevbera615@gmail.com" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors font-bold text-white">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>buddhadevbera615@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
