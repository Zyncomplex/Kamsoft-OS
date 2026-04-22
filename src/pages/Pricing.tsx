import React from 'react';
import { Tag, DollarSign, Calculator, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

const pricingRules = [
  { id: 1, type: 'Embroidered', basePrice: 2.50, brackets: [{ q: 50, p: 2.50 }, { q: 100, p: 2.10 }, { q: 500, p: 1.85 }] },
  { id: 2, type: 'PVC Rubber', basePrice: 3.20, brackets: [{ q: 50, p: 3.20 }, { q: 100, p: 2.80 }, { q: 500, p: 2.45 }] },
  { id: 3, type: 'Chenille', basePrice: 4.10, brackets: [{ q: 50, p: 4.10 }, { q: 100, p: 3.75 }, { q: 500, p: 3.20 }] },
];

export default function Pricing() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Price Calibration</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Global invoice generation logic & bulk brackets</p>
         </div>
         <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-2">
            <Zap size={16} /> Deploy New Rates
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
                     <Calculator size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Automated Quoting Logic</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-md">Kamsoft calculates real-time pricing based on material costs, vendor velocity, and global shipping fees. Changes here affect all new invoices instantly.</p>
               </div>
               <DollarSign size={140} className="absolute -bottom-8 -right-8 text-slate-50 group-hover:text-indigo-50 group-hover:-translate-x-4 transition-all duration-700" />
            </div>

            <div className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100 shadow-sm flex items-center gap-6">
               <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-emerald-100 text-emerald-500 shrink-0">
                  <ShieldCheck size={28} />
               </div>
               <div>
                  <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tight">Margin Protection Active</h4>
                  <p className="text-xs font-bold text-emerald-700/70 mt-1 uppercase tracking-widest">System prevents invoices with less than 35% gross margin by default.</p>
               </div>
            </div>
         </div>

         <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
               <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Active Bulk Brackets</h4>
               <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Edit Multipliers</button>
            </div>
            <div className="p-8 space-y-8 flex-1">
               {pricingRules.map(rule => (
                  <div key={rule.id} className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{rule.type} Patches</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base: ${rule.basePrice.toFixed(2)}</span>
                     </div>
                     <div className="flex gap-3">
                        {rule.brackets.map((b, i) => (
                           <div key={i} className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 group hover:border-indigo-200 hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">{b.q}+ PCS</p>
                              <p className="text-lg font-black text-slate-800 tracking-tight">${b.p.toFixed(2)}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
            <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Last sync: 2 hours ago</span>
               <button className="text-[10px] font-black text-slate-800 flex items-center gap-2 uppercase tracking-[0.2em]">View History <ArrowRight size={14} /></button>
            </div>
         </div>
      </div>
    </div>
  );
}
