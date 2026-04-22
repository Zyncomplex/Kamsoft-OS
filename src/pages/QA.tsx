import React from 'react';
import { cn } from '../lib/utils';
import { 
  ShieldCheck, 
  XCircle, 
  CheckCircle2, 
  Camera, 
  Info, 
  ArrowLeft,
  ChevronDown,
  Upload
} from 'lucide-react';

const checklistItems = [
  { id: 1, label: 'Dimensions match specs (±0.1")', type: 'measurement' },
  { id: 2, label: 'Thread colors match brand guide', type: 'visual' },
  { id: 3, label: 'Border stitching tight & uniform', type: 'visual' },
  { id: 4, label: 'Backing adhesion test passed', type: 'visual' },
  { id: 5, label: 'Quantity verified & packed', type: 'logistics' },
];

export default function QAChecklist() {
  const [activeJob, setActiveJob] = React.useState('PJ-991');
  const [results, setResults] = React.useState<Record<number, boolean>>({});

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between">
         <div className="flex items-center gap-6">
            <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-all text-slate-400 hover:text-slate-950 shadow-sm">
               <ArrowLeft size={18} />
            </button>
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-black text-slate-800 tracking-tighter">Inspection Protocol: <span className="text-indigo-600">{activeJob}</span></h3>
                  <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-sm">Validation Pending</span>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Vendor: <span className="text-slate-600">Karachi Specialized Patches</span> • Batch Value: <span className="text-emerald-500">$12,200.00</span></p>
            </div>
         </div>
         <div className="text-right border-l border-slate-50 pl-10 hidden md:block">
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em] mb-2 leading-none">Internal Deadline</p>
            <p className="font-black text-slate-800 text-sm">Today, 17:00 GMT</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Checklist */}
         <div className="md:col-span-2 space-y-4">
            {checklistItems.map((item) => (
               <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all hover:translate-x-1 duration-300">
                  <div className="flex items-center gap-5">
                     <div className={cn(
                       "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner border-2 border-transparent",
                       results[item.id] === true ? "bg-emerald-50 text-emerald-500 border-emerald-100" : 
                       results[item.id] === false ? "bg-rose-50 text-rose-500 border-rose-100" :
                       "bg-slate-50 text-slate-300 group-hover:bg-white group-hover:shadow-sm"
                     )}>
                        {results[item.id] === true ? <CheckCircle2 size={28} strokeWidth={2.5} /> : 
                         results[item.id] === false ? <XCircle size={28} strokeWidth={2.5} /> :
                         <ShieldCheck size={28} strokeWidth={2} />}
                     </div>
                     <div>
                        <p className="font-black text-slate-800 text-sm tracking-tight">{item.label}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] mt-1 text-xs">{item.type} check REQUIRED</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button 
                       onClick={() => setResults({ ...results, [item.id]: false })}
                       className={cn(
                         "w-14 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                         results[item.id] === false ? "bg-rose-500 text-white shadow-xl shadow-rose-200 scale-105" : "bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                       )}
                     >Fail</button>
                     <button 
                       onClick={() => setResults({ ...results, [item.id]: true })}
                       className={cn(
                         "w-14 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                         results[item.id] === true ? "bg-emerald-500 text-white shadow-xl shadow-emerald-200 scale-105" : "bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500"
                       )}
                     >Pass</button>
                  </div>
               </div>
            ))}
         </div>

         {/* Evidence Upload */}
         <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
               <h4 className="font-black text-slate-800 text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <Camera size={14} className="text-indigo-600" />
                  Stitch Intelligence
               </h4>
               <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-300 hover:border-indigo-200 hover:bg-white hover:text-indigo-600 transition-all cursor-pointer mb-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-slate-50 mb-4 group-hover:scale-110 transition-transform">
                     <Upload size={24} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">Capture Evidence</p>
               </div>
               <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-relaxed">System mandates at least 2 high-res macros for approval release.</p>
               </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[32px] shadow-2xl shadow-slate-200 text-white relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6 text-white/40">
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em]">Critical Action Required</span>
                  </div>
                  <h4 className="font-black text-lg mb-8 leading-tight tracking-tight">Final Verdict: Release to Global Shipping Logistics?</h4>
                  <div className="space-y-3">
                     <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-indigo-900/40 active:scale-95">
                        Confirm & Release
                     </button>
                     <button className="w-full py-4 bg-white/5 text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all">
                        Reject Protocol
                     </button>
                  </div>
               </div>
               <ShieldCheck size={160} className="absolute -bottom-12 -right-12 text-white/5 group-hover:text-white/10 transition-all duration-700 rotate-12" />
            </div>
         </div>
      </div>
    </div>
  );
}
