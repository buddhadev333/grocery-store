import React from 'react';

export const Badge = ({ text, className = '' }) => {
  if (!text) return null;

  const t = text.toLowerCase();
  let colorClass = "bg-emerald-100 text-emerald-800 border-emerald-200";

  if (t.includes("best")) {
    colorClass = "bg-sky-500 text-white border-sky-600";
  } else if (t.includes("deal") || t.includes("today")) {
    colorClass = "bg-rose-600 text-white border-rose-700 animate-pulse";
  } else if (t.includes("special")) {
    colorClass = "bg-purple-600 text-white border-purple-700";
  } else if (t.includes("value")) {
    colorClass = "bg-emerald-700 text-white border-emerald-800";
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider shadow-sm border ${colorClass} ${className}`}>
      {text}
    </span>
  );
};

export default Badge;
