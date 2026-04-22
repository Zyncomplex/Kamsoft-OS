import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { 
  ShieldCheck, 
  XCircle, 
  CheckCircle2, 
  Camera, 
  Info, 
  ArrowLeft,
  Upload,
  Clock,
  AlertTriangle,
  PlayCircle
} from 'lucide-react';

const checklistItems = [
  { id: 1, label: 'Dimensions match specs (±0.1")', type: 'measurement' },
  { id: 2, label: 'Thread colors match brand guide', type: 'visual' },
  { id: 3, label: 'Border stitching tight & uniform', type: 'visual' },
  { id: 4, label: 'Backing adhesion test passed', type: 'visual' },
  { id: 5, label: 'Quantity verified & packed', type: 'logistics' },
];

const queuedInspections = [
  { id: 'PJ-991', client: 'Alpha Tech', product: 'Woven Patches', qty: 500, priority: 'High', status: 'Pending', time: '10 mins ago', vendor: 'Karachi Specialized Patches', value: '$12,200.00' },
  { id: 'PJ-995', client: 'Apex Fitness', product: 'PVC Patches', qty: 1000, priority: 'Urgent', status: 'Pending', time: 'Just now', vendor: 'Guangzhou Plastics Co', value: '$25,000.00' },
  { id: 'PJ-982', client: 'Omega Corp', product: 'Embroidered Hats', qty: 150, priority: 'Normal', status: 'In Progress', time: '1 hr ago', vendor: 'Dhaka Threads', value: '$4,150.00' },
  { id: 'PJ-970', client: 'Red Team', product: 'Leather Patches', qty: 250, priority: 'Normal', status: 'Pending', time: '3 hrs ago', vendor: 'Vietnam Leather Works', value: '$8,900.00' }
];

export default function QAChecklist() {
  const [activeJob, setActiveJob] = useState<string | null>(null);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleStartInspection = (jobId: string) => {
    setActiveJob(jobId);
    setResults({});
  };

  if (activeJob) {
    const jobDetail = queuedInspections.find(j => j.id === activeJob) || queuedInspections[0];

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Info */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setActiveJob(null)}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-all text-slate-400 hover:text-slate-950 shadow-sm"
              >
                 <ArrowLeft size={18} />
              </button>
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-black text-slate-800 tracking-tighter">Inspection Protocol: <span className="text-indigo-600">{jobDetail.id}</span></h3>
                    <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-sm">Validation Pending</span>
                 </div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Vendor: <span className="text-slate-600">{jobDetail.vendor}</span> • Batch Value: <span className="text-emerald-500">{jobDetail.value}</span></p>
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
                       <button 
                         onClick={() => setActiveJob(null)}
                         className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-indigo-900/40 active:scale-95"
                       >
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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Quality Assurance Queue</h1>
          <p className="text-slate-500 font-medium">Inspections pending validation before shipping.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl flex items-center gap-3">
            <ShieldCheck size={18} />
            <span className="text-xs font-black uppercase tracking-widest">System Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {queuedInspections.map((job) => (
          <div key={job.id} className="bg-white rounded-[24px] border border-slate-200 p-6 flex flex-col hover:border-slate-300 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between mb-6">
              <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <ShieldCheck size={24} />
              </div>
              <div className={cn(
                "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest",
                job.priority === 'Urgent' ? "bg-rose-50 text-rose-600" :
                job.priority === 'High' ? "bg-amber-50 text-amber-600" :
                "bg-slate-100 text-slate-500"
              )}>
                {job.priority}
              </div>
            </div>
            
            <div className="mb-6 flex-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{job.client}</div>
              <div className="text-lg font-black text-slate-800 tracking-tight leading-tight mb-2">{job.id}</div>
              <div className="text-sm font-medium text-slate-600 line-clamp-1">{job.qty}x {job.product}</div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock size={12} />
                <span className="text-[10px] font-bold uppercase">{job.time}</span>
              </div>
              <div className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                job.status === 'In Progress' ? "text-indigo-500" : "text-amber-500"
              )}>
                {job.status}
              </div>
            </div>

            <button 
              onClick={() => handleStartInspection(job.id)}
              className="w-full bg-slate-900 text-white rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md group-hover:shadow-xl active:scale-95"
            >
              <PlayCircle size={16} />
              Start Inspection
            </button>
          </div>
        ))}

        {/* Empty State / All Clear Placeholder */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] p-6 flex flex-col items-center justify-center text-center text-slate-400 aspect-[4/5] min-h-[320px]">
           <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-4">
              <ShieldCheck size={32} />
           </div>
           <p className="font-black text-sm uppercase tracking-widest mb-2">No more items</p>
           <p className="text-xs font-medium max-w-[150px] leading-relaxed">Queue is clear for the active batch.</p>
        </div>
      </div>
    </div>
  );
}
