import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ClipboardCheck, 
  Timer, 
  PackageCheck, 
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  X,
  CreditCard,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const orderTabs = ['All', 'Awaiting Payment', 'Design', 'Production', 'QA', 'Shipping', 'Delivered'];

const orders = [
  { id: 'TAP-1025', customer: 'Phoenix Suns', brand: 'TAP', status: 'Production', value: '$2,450', date: '2h ago', priority: 'high' },
  { id: 'PM-882', customer: 'Acme Corp', brand: 'Patchmakers', status: 'Design', value: '$890', date: '5h ago', priority: 'normal' },
  { id: 'EUK-991', customer: 'British Lion', brand: 'Eagle UK', status: 'QA', value: '$12,200', date: '1d ago', priority: 'urgent' },
  { id: 'TAP-1024', customer: 'Red Cross', brand: 'TAP', status: 'Delivered', value: '$450', date: '2d ago', priority: 'normal' },
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
         <div className="flex bg-white p-1.5 rounded-full border border-slate-200 shadow-sm shrink-0 overflow-x-auto scrollbar-hide">
            {orderTabs.map(tab => (
               <button 
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={cn(
                   "px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap",
                   activeTab === tab ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                 )}
               >
                 {tab}
               </button>
            ))}
         </div>
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={14} />
               <input 
                 type="text" 
                 placeholder="Search global orders..." 
                 className="bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-6 text-[11px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none w-[280px] transition-all focus:border-indigo-300"
               />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 shadow-sm transition-all focus:ring-2 focus:ring-indigo-500/20">
               <Filter size={18} />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard label="Total Orders" value="1,248" icon={PackageCheck} color="indigo" />
         <StatCard label="Avg Cycle Time" value="4.2 days" icon={Timer} color="slate" />
         <StatCard label="On-Time Rate" value="98.2%" icon={CheckCircle2} color="emerald" />
         <StatCard label="Defect Rate" value="1.2%" icon={ShieldAlert} color="rose" />
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order ID</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Client / Brand</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Total Value</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Last Update</th>
                     <th className="px-8 py-5"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {orders.map(order => (
                     <tr 
                       key={order.id} 
                       onClick={() => setSelectedOrder(order.id)}
                       className="hover:bg-slate-50/50 group cursor-pointer transition-all duration-300"
                     >
                        <td className="px-8 py-6 whitespace-nowrap">
                           <span className="text-[10px] font-mono font-black border border-slate-100 bg-slate-50 px-3 py-1.5 rounded-lg text-slate-400 group-hover:text-indigo-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                              {order.id}
                           </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                           <div className="flex flex-col">
                              <span className="font-black text-slate-800 text-sm tracking-tight">{order.customer}</span>
                              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{order.brand} Core</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 shadow-sm border",
                                order.status === 'Production' && "bg-indigo-50 text-indigo-700 border-indigo-100",
                                order.status === 'Design' && "bg-sky-50 text-sky-700 border-sky-100",
                                order.status === 'QA' && "bg-rose-50 text-rose-700 border-rose-100",
                                order.status === 'Delivered' && "bg-emerald-50 text-emerald-700 border-emerald-100",
                              )}>
                                 <div className={cn(
                                   "w-1.5 h-1.5 rounded-full animate-pulse",
                                   order.status === 'Production' && "bg-indigo-600",
                                   order.status === 'Design' && "bg-sky-600",
                                   order.status === 'QA' && "bg-rose-600",
                                   order.status === 'Delivered' && "bg-emerald-600",
                                 )} />
                                 {order.status}
                              </span>
                              <div className="flex -space-x-2">
                                 <div className="p-1.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm ring-1 ring-emerald-100"><ClipboardCheck size={10} className="text-white" /></div>
                                 <div className="p-1.5 bg-slate-100 rounded-full border-2 border-white shadow-sm"><PackageCheck size={10} className="text-slate-400" /></div>
                                 <div className="p-1.5 bg-slate-100 rounded-full border-2 border-white shadow-sm"><Truck size={10} className="text-slate-400" /></div>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-right font-black text-slate-800 text-sm">{order.value}</td>
                        <td className="px-8 py-6 whitespace-nowrap text-right">
                           <div className="flex flex-col items-end">
                              <span className="text-xs font-black text-slate-800 tracking-tight">{order.date}</span>
                              <span className="text-[9px] text-slate-300 uppercase font-black tracking-[0.2em] mt-0.5">Automated Event</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="p-2.5 hover:bg-white hover:shadow-xl rounded-2xl text-slate-300 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100">
                              <ExternalLink size={16} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-4 top-4 bottom-4 w-full max-w-2xl bg-white shadow-2xl z-[110] flex flex-col rounded-[32px] overflow-hidden border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                   <h2 className="text-2xl font-black font-mono tracking-tight text-slate-800">{selectedOrder}</h2>
                   <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                   <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-widest border border-indigo-100">Production</span>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Order Detail Tabs */}
              <div className="flex border-b border-slate-100 shrink-0 px-6">
                  {['Overview', 'Timeline', 'Files', 'Notes', 'Comms'].map((tab, i) => (
                     <button 
                       key={tab}
                       className={cn(
                          "px-4 py-4 text-sm font-bold transition-all border-b-2",
                          i === 0 ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-800"
                       )}
                     >
                       {tab}
                     </button>
                  ))}
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 space-y-8 scrollbar-hide">
                 {/* Order specs block */}
                 <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Production Specifications</h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                       <div><span className="text-slate-500 font-medium">Patch Type:</span> <span className="font-bold text-slate-800 ml-1">PVC Rubber</span></div>
                       <div><span className="text-slate-500 font-medium">Size:</span> <span className="font-bold text-slate-800 ml-1">3.5" x 2.0"</span></div>
                       <div><span className="text-slate-500 font-medium">Shape:</span> <span className="font-bold text-slate-800 ml-1">Custom Shape</span></div>
                       <div><span className="text-slate-500 font-medium">Border:</span> <span className="font-bold text-slate-800 ml-1">Laser Cut</span></div>
                       <div><span className="text-slate-500 font-medium">Backing:</span> <span className="font-bold text-slate-800 ml-1">Velcro (Hook)</span></div>
                       <div><span className="text-slate-500 font-medium">Quantity:</span> <span className="font-bold text-slate-800 ml-1">250 pcs</span></div>
                    </div>
                 </div>

                 {/* Payment block */}
                 <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6 flex flex-col items-center justify-center text-center">
                    <CreditCard size={24} className="text-emerald-500 mb-2" />
                    <p className="text-sm font-black text-emerald-700 tracking-tight">Payment Received ✓ via Stripe</p>
                    <p className="text-xs font-bold text-emerald-600/70 mt-1">Paid in full ($2,450.00)</p>
                 </div>

                 {/* Actions block */}
                 <div className="space-y-3">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Stage Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                       <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
                         <ExternalLink size={16} /> View Production Job
                       </button>
                       <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 rounded-xl py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition">
                         Clone Order
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
   return (
      <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-5 group hover:border-indigo-100 transition-all">
         <div className={cn(
            "p-3.5 rounded-2xl shadow-sm transition-transform group-hover:scale-110",
            color === 'indigo' && "bg-indigo-50 text-indigo-600",
            color === 'slate' && "bg-slate-50 text-slate-600",
            color === 'emerald' && "bg-emerald-50 text-emerald-600",
            color === 'rose' && "bg-rose-50 text-rose-600",
         )}>
            <Icon size={24} strokeWidth={2.5} />
         </div>
         <div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-xl font-black text-slate-800 tracking-tight">{value}</p>
         </div>
      </div>
   );
}
