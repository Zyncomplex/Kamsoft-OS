import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { 
  Search, 
  Filter, 
  ClipboardCheck, 
  Timer, 
  PackageCheck, 
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  X,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOrders } from '../hooks/useOrders';
import { useRealtime } from '../hooks/useRealtime';
import { useBrand } from '../contexts/BrandContext';
import { formatDistanceToNow } from 'date-fns';
import { Order } from '../types';
import { api } from '../lib/api';

const orderTabs = ['All', 'Awaiting Payment', 'Design', 'Production', 'QA', 'Shipping', 'Delivered'];

export default function Orders() {
  const { activeBrand } = useBrand();
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: orders, loading, fetchAll } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Live updates
  useRealtime('orders', fetchAll);

  // Fetch full details when selected
  useEffect(() => {
    if (selectedOrderId) {
      setDetailsLoading(true);
      api.get<Order>(`/orders/${selectedOrderId}`)
        .then(res => {
          setSelectedOrder(res);
          setDetailsLoading(false);
        })
        .catch(() => setDetailsLoading(false));
    } else {
      setSelectedOrder(null);
    }
  }, [selectedOrderId]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.display_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

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
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-6 text-[11px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none w-[280px] transition-all focus:border-indigo-300"
               />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 shadow-sm transition-all focus:ring-2 focus:ring-indigo-500/20">
               <Filter size={18} />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard label="Total Orders" value={orders.length.toString()} icon={PackageCheck} color="indigo" />
         <StatCard label="Active Production" value={orders.filter(o => o.status === 'Production').length.toString()} icon={Timer} color="slate" />
         <StatCard label="In QA" value={orders.filter(o => o.status === 'QA').length.toString()} icon={CheckCircle2} color="emerald" />
         <StatCard label="Pending Payment" value={orders.filter(o => o.status === 'Awaiting Payment').length.toString()} icon={ShieldAlert} color="rose" />
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order ID</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Client</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Total Value</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Last Update</th>
                     <th className="px-8 py-5"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filteredOrders.map(order => (
                     <tr 
                       key={order.id} 
                       onClick={() => setSelectedOrderId(order.id)}
                       className="hover:bg-slate-50/50 group cursor-pointer transition-all duration-300"
                     >
                        <td className="px-8 py-6 whitespace-nowrap">
                           <span className="text-[10px] font-mono font-black border border-slate-100 bg-slate-50 px-3 py-1.5 rounded-lg text-slate-400 group-hover:text-indigo-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                              #{order.display_id}
                           </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                           <div className="flex flex-col">
                              <span className="font-black text-slate-800 text-sm tracking-tight">{order.customer?.name}</span>
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
                           </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-right font-black text-slate-800 text-sm">
                           ${order.total_amount?.toLocaleString()}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-right">
                           <div className="flex flex-col items-end">
                              <span className="text-xs font-black text-slate-800 tracking-tight">
                                 {formatDistanceToNow(new Date(order.updated_at || order.created_at), { addSuffix: true })}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="p-2.5 hover:bg-white hover:shadow-xl rounded-2xl text-slate-300 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100">
                              <ExternalLink size={16} />
                           </button>
                        </td>
                     </tr>
                  ))}
                  {filteredOrders.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">
                        No orders found
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <AnimatePresence>
        {selectedOrderId && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderId(null)}
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
                   <h2 className="text-2xl font-black font-mono tracking-tight text-slate-800">#{selectedOrder?.display_id}</h2>
                   <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                   <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-widest border border-indigo-100">
                      {selectedOrder?.status}
                   </span>
                </div>
                <button 
                  onClick={() => setSelectedOrderId(null)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex border-b border-slate-100 shrink-0 px-6">
                  {['Overview', 'Timeline', 'Files', 'Notes'].map((tab, i) => (
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

              {detailsLoading ? (
                <div className="flex-1 flex items-center justify-center font-bold uppercase text-[10px] tracking-widest text-slate-400">Loading details...</div>
              ) : selectedOrder && (
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 space-y-8 scrollbar-hide">
                   <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Client Information</h3>
                      <p className="text-sm font-bold text-slate-800">{selectedOrder.customer?.name}</p>
                      <p className="text-xs text-slate-500">{selectedOrder.customer?.email}</p>
                   </div>

                   <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Financials</h3>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Total Amount</p>
                            <p className="text-lg font-black text-slate-800">${selectedOrder.total_amount?.toLocaleString()}</p>
                         </div>
                         <div>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Status</p>
                            <p className="text-lg font-black text-slate-800">{selectedOrder.status}</p>
                         </div>
                      </div>
                   </div>

                   {/* Payment block */}
                   <div className={cn(
                      "rounded-2xl border p-6 flex flex-col items-center justify-center text-center",
                      selectedOrder.status !== 'Awaiting Payment' ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
                   )}>
                      <CreditCard size={24} className={selectedOrder.status !== 'Awaiting Payment' ? "text-emerald-500" : "text-amber-500"} />
                      <p className={cn(
                         "text-sm font-black tracking-tight mt-2",
                         selectedOrder.status !== 'Awaiting Payment' ? "text-emerald-700" : "text-amber-700"
                      )}>
                         {selectedOrder.status !== 'Awaiting Payment' ? "Payment Confirmed" : "Awaiting Payment"}
                      </p>
                   </div>
                </div>
              )}
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
