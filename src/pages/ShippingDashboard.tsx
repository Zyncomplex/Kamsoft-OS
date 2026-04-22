import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  Package, 
  Truck, 
  MapPin, 
  ExternalLink, 
  Printer, 
  Tag, 
  CheckCircle2, 
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';

const shippingJobs = [
  { id: 'TAP-1025', carrier: 'FedEx', method: 'Priority', destination: 'Chicago, US', status: 'Processing Label' },
  { id: 'EUK-991', carrier: 'DHL', method: 'Expedited', destination: 'London, UK', status: 'Ready to Dispatch' },
  { id: 'TAP-1020', carrier: 'UPS', method: 'Standard', destination: 'Berlin, DE', status: 'Picked Up' },
  { id: 'PM-870', carrier: 'FedEx', method: 'Standard', destination: 'Sydney, AU', status: 'Delivered' },
];

export default function ShippingDashboard() {
  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl shadow-slate-200 relative overflow-hidden group">
            <div className="relative z-10">
               <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Ready to Ship</p>
               <h3 className="text-5xl font-black tracking-tighter">24</h3>
               <button className="mt-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] bg-white text-slate-900 px-6 py-3 rounded-2xl hover:bg-indigo-50 transition-all active:scale-95 shadow-xl shadow-black/20">
                  Bulk Label Sync <ArrowRight size={14} />
               </button>
            </div>
            <Truck size={140} className="absolute -bottom-8 -right-16 text-white/5 group-hover:text-white/10 group-hover:-translate-x-4 transition-all duration-700" />
         </div>

         <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">In Transit</p>
               <h3 className="text-4xl font-black tracking-tight text-slate-800">142</h3>
            </div>
            <div className="mt-10 space-y-3">
               <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SDR Confidence</span>
                  <span className="text-xs font-black text-indigo-600">65% ETA met</span>
               </div>
               <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full" 
                  />
               </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Carrier Defects</p>
               <h3 className="text-4xl font-black tracking-tight text-rose-500">0.8%</h3>
            </div>
            <div className="relative z-10 mt-6 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={16} />
               </div>
               <p className="text-[9px] text-emerald-700 font-black uppercase tracking-widest leading-tight">
                  Logistics Performance<br/>Exceeding Global SLA
               </p>
            </div>
            <MapPin size={100} className="absolute -top-6 -right-6 text-slate-50 opacity-50" />
         </div>
      </div>

      {/* Shipping Queue Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Active Shipping Queue</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live from global carrier APIs</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative">
                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                     type="text" 
                     placeholder="Search tracking ID..." 
                     className="bg-white border border-slate-200 rounded-full py-2 pl-9 pr-4 text-[11px] font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none w-60 shadow-sm transition-all focus:border-indigo-200" 
                   />
                </div>
                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all shadow-sm">
                   <Filter size={16} />
                </button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50">
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Shipment ID</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Logistics Provider</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Destination</th>
                     <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                     <th className="px-8 py-4"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {shippingJobs.map(job => (
                     <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6 whitespace-nowrap font-mono font-black text-slate-300 group-hover:text-indigo-600 transition-colors text-[11px]">{job.id}</td>
                        <td className="px-8 py-6 whitespace-nowrap">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-200 group-hover:bg-white group-hover:shadow-sm transition-all">
                                 {job.carrier[0]}
                              </div>
                              <div>
                                 <p className="text-xs font-black text-slate-800">{job.carrier}</p>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{job.method}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                           <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-indigo-50 rounded-lg">
                                 <MapPin size={12} className="text-indigo-600" />
                              </div>
                              <span className="text-xs font-black text-slate-700 tracking-tight">{job.destination}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-center">
                           <span className={cn(
                               "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm",
                               job.status === 'Processing Label' && "bg-slate-800 text-white",
                               job.status === 'Ready to Dispatch' && "bg-indigo-600 text-white",
                               job.status === 'Picked Up' && "bg-sky-500 text-white",
                               job.status === 'Delivered' && "bg-emerald-500 text-white",
                           )}>
                               {job.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-right">
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                              <button className="p-2.5 bg-white hover:shadow-xl hover:scale-110 rounded-xl transition-all text-slate-300 hover:text-indigo-600 border border-transparent hover:border-slate-100">
                                 <Tag size={16} />
                              </button>
                              <button className="p-2.5 bg-white hover:shadow-xl hover:scale-110 rounded-xl transition-all text-slate-300 hover:text-slate-900 border border-transparent hover:border-slate-100">
                                 <Printer size={16} />
                              </button>
                              <button className="p-2.5 bg-white hover:shadow-xl hover:scale-110 rounded-xl transition-all text-slate-300 hover:text-sky-500 border border-transparent hover:border-slate-100">
                                 <ExternalLink size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
