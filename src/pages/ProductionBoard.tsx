import React from 'react';
import { 
  MoreHorizontal, 
  Clock, 
  User, 
  Package, 
  AlertCircle, 
  ExternalLink 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const columns = [
  { id: 'ready', label: 'Ready for Prod' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'production', label: 'In Production' },
  { id: 'qa', label: 'Shipped to QA' },
  { id: 'rework', label: 'Rework' },
  { id: 'complete', label: 'Complete' },
];

const jobs = [
  { id: 'PJ-1001', type: 'Embroidered', qty: 250, vendor: 'Vendor X', due: 'Apr 25', status: 'ready', priority: 'high' },
  { id: 'PJ-1002', type: 'PVC Rubber', qty: 100, vendor: 'Vendor Y', due: 'Apr 26', status: 'assigned', priority: 'normal' },
  { id: 'PJ-1003', type: 'Chenille', qty: 500, vendor: 'Vendor Z', due: 'Apr 24', status: 'production', priority: 'urgent' },
  { id: 'PJ-1004', type: 'Woven', qty: 1000, vendor: 'Vendor X', due: 'Apr 28', status: 'qa', priority: 'normal' },
  { id: 'PJ-1005', type: 'Leather', qty: 50, vendor: 'Vendor Y', due: 'Apr 25', status: 'rework', priority: 'high' },
];

export default function ProductionBoard() {
  return (
    <div className="h-screen flex flex-col overflow-hidden -m-8">
       {/* Filters Header */}
       <div className="bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10 shrink-0 shadow-sm relative">
          <div className="flex items-center gap-8">
             <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-2xl border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                    <img src={`https://picsum.photos/seed/vendor${i}/100/100`} alt="Vendor" referrerPolicy="no-referrer" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-2xl border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm">+12</div>
             </div>
             <div className="h-8 w-[1px] bg-slate-100" />
             <div className="flex gap-2.5">
                <span className="text-[10px] font-black bg-indigo-600 shadow-lg shadow-indigo-100 text-white px-4 py-2 rounded-full uppercase tracking-[0.2em]">Live: All Units</span>
                <span className="text-[10px] font-black bg-white border border-slate-200 text-slate-400 px-4 py-2 rounded-full uppercase tracking-[0.2em] hover:bg-slate-50 transition-colors cursor-pointer">High Velocity</span>
                <span className="text-[10px] font-black bg-white border border-slate-200 text-rose-400 px-4 py-2 rounded-full uppercase tracking-[0.2em] hover:bg-rose-50 transition-colors cursor-pointer">Escalated</span>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Fleet Capacity</p>
                <p className="text-sm font-black text-slate-800 tracking-tight">148 Active Assets</p>
             </div>
             <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
                New Production Job
             </button>
          </div>
       </div>

       {/* Kanban Board */}
       <div className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-50 p-8 flex gap-8">
          {columns.map(col => (
             <div key={col.id} className="w-[340px] flex flex-col shrink-0 group/col relative">
                <div className="flex items-center justify-between mb-6 px-4">
                   <div className="flex items-center gap-3">
                      <h4 className="font-black text-slate-800 text-[11px] uppercase tracking-[0.25em]">{col.label}</h4>
                      <span className="bg-white border border-slate-200 text-slate-400 px-3 py-1 rounded-full text-[9px] font-black shadow-sm group-hover/col:border-indigo-200 group-hover/col:text-indigo-600 transition-all">
                         {jobs.filter(j => j.status === col.id).length}
                      </span>
                   </div>
                   <button className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-300 hover:text-slate-900 transition-all"><MoreHorizontal size={16} /></button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pb-12 scrollbar-hide">
                   {jobs.filter(j => j.status === col.id).map(job => (
                      <motion.div 
                        layoutId={job.id}
                        key={job.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-100 transition-all group flex flex-col cursor-grab active:cursor-grabbing"
                      >
                         <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-mono font-black text-slate-300 uppercase tracking-widest">{job.id}</span>
                            <span className={cn(
                               "text-[9px] font-black uppercase py-1.5 px-3 rounded-full border shadow-sm",
                               job.priority === 'urgent' && "bg-rose-50 text-rose-500 border-rose-100",
                               job.priority === 'high' && "bg-amber-50 text-amber-500 border-amber-100",
                               job.priority === 'normal' && "bg-indigo-50 text-indigo-500 border-indigo-100",
                            )}>
                               {job.priority}
                            </span>
                         </div>
                         <h5 className="font-black text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors uppercase text-xs tracking-tight leading-tight">{job.type} Micro-Plex Patches</h5>
                         
                         <div className="flex items-center gap-6 mb-6">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-widest">
                               <Package size={14} className="text-indigo-500" />
                               {job.qty} units
                            </div>
                            <div className={cn(
                               "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                               job.due === 'Apr 24' ? "text-rose-500" : "text-slate-400 group-hover:text-slate-600 transition-colors"
                            )}>
                               <Clock size={14} />
                               {job.due}
                            </div>
                         </div>

                         <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-xl bg-slate-100 overflow-hidden ring-4 ring-white shadow-sm transition-transform group-hover:scale-110">
                                  <img src={`https://picsum.photos/seed/${job.vendor}/80/80`} alt="Vendor" referrerPolicy="no-referrer" />
                               </div>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{job.vendor}</span>
                            </div>
                            <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                               <ExternalLink size={14} />
                            </button>
                         </div>
                      </motion.div>
                   ))}
                   <button className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center text-slate-300 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white hover:shadow-lg transition-all group/add">
                      <div className="w-10 h-10 rounded-full border border-slate-100 bg-white flex items-center justify-center mb-2 group-hover/add:scale-110 transition-transform">
                        <span className="text-xl font-bold">+</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Initialize Job</span>
                   </button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
}
