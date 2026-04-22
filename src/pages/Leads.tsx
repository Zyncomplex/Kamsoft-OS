import React from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  ArrowUpDown,
  Phone,
  Mail,
  MoreHorizontal,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const leadsData = [
  { id: 'LD-8821', customer: 'Acme Corp', source: 'Web Form', brand: 'The American Patch', sdr: 'Hammad', status: 'New', time: '12m ago', sla: 'critical' },
  { id: 'LD-8822', customer: 'Global Tech', source: 'RingCentral', brand: 'Patch Makers CA', sdr: 'Faiq', status: 'Contacted', time: '1h ago', sla: 'normal' },
  { id: 'LD-8823', customer: 'Stark Ind.', source: 'Gmail', brand: 'Eagle Patch UK', sdr: 'Sufyan', status: 'Invoice Sent', time: '3h ago', sla: 'warning' },
  { id: 'LD-8824', customer: 'Wayne Ent.', source: 'Meta Ads', brand: 'The Eagle Patch', sdr: 'Unassigned', status: 'New', time: '5m ago', sla: 'critical' },
  { id: 'LD-8825', customer: 'Pied Piper', source: 'Web Form', brand: 'Embroidered Patch NZ', sdr: 'Wahid', status: 'Won', time: '1d ago', sla: 'done' },
  { id: 'LD-8826', customer: 'Evil Corp', source: 'Tawk.to', brand: 'Embroidered Patch', sdr: 'Hammad', status: 'Lost', time: '2d ago', sla: 'done' },
];

export default function Leads() {
  const [selectedLead, setSelectedLead] = React.useState<null | string>(null);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4 min-w-[300px]">
          <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
             <input 
               type="text" 
               placeholder="Search leads..." 
               className="w-full bg-slate-100 border-none rounded-full py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
             />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 h-[38px] rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors uppercase tracking-widest">
             <Filter size={14} />
             Filters
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 h-[38px] rounded-full text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest">
             <Download size={14} />
             Export
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white h-[38px] rounded-full text-xs font-black hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 uppercase tracking-widest">
             <Plus size={16} />
             New Lead
          </button>
        </div>
      </div>

       {/* SLA Breach Banner */}
       <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-3 text-rose-700">
               <AlertCircle size={20} className="shrink-0" />
               <span className="text-sm font-bold tracking-tight">⚠ 2 lead(s) unassigned over 5 min — SLA breached</span>
           </div>
           <button className="text-xs font-bold text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-widest">
               Filter Breached
           </button>
       </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source / Brand</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">SDR</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timer</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {leadsData.map((lead) => (
                <tr 
                  key={lead.id} 
                  className={cn(
                    "hover:bg-slate-50 cursor-pointer transition-colors group",
                    selectedLead === lead.id && "bg-indigo-50/50 hover:bg-indigo-50"
                  )}
                  onClick={() => setSelectedLead(lead.id)}
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="text-[10px] font-mono font-black text-slate-300 group-hover:text-indigo-600 transition-colors">{lead.id}</span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {lead.customer.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-sm text-slate-700">{lead.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                       <span className="text-xs font-bold text-slate-800 tracking-tight">{lead.brand}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{lead.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-xs font-medium text-slate-600">
                    {lead.sdr === 'Unassigned' ? (
                       <span className="text-rose-500 flex items-center gap-1 font-bold italic">
                         <AlertCircle size={14} />
                         Unassigned
                       </span>
                    ) : lead.sdr}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm",
                      lead.status === 'New' && "bg-indigo-600 text-white",
                      lead.status === 'Contacted' && "bg-amber-500 text-white",
                      lead.status === 'Invoice Sent' && "bg-sky-500 text-white",
                      lead.status === 'Won' && "bg-emerald-500 text-white",
                      lead.status === 'Lost' && "bg-slate-400 text-white",
                    )}>
                       {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                     <div className={cn(
                       "flex items-center gap-1 text-[10px] font-black uppercase tracking-wider",
                       lead.sla === 'critical' && "text-rose-500",
                       lead.sla === 'warning' && "text-amber-500",
                       lead.sla === 'normal' && "text-slate-400",
                       lead.sla === 'done' && "text-emerald-500",
                     )}>
                        <Clock size={12} />
                        {lead.time}
                     </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <button className="p-2 hover:bg-white hover:shadow-lg rounded-xl text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Slideout */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-4 top-4 bottom-4 w-full max-w-xl bg-white shadow-2xl z-[110] flex flex-col rounded-[32px] overflow-hidden border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                   <h2 className="text-lg font-black tracking-tight text-slate-800 uppercase">Lead Intelligence</h2>
                   <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-widest">{selectedLead}</span>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                 {/* Header Info */}
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-5">
                       <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-100 border-4 border-indigo-50">
                          {leadsData.find(l => l.id === selectedLead)?.customer.substring(0, 2)}
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{leadsData.find(l => l.id === selectedLead)?.customer}</h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Acquired via {leadsData.find(l => l.id === selectedLead)?.source} • {leadsData.find(l => l.id === selectedLead)?.brand}</p>
                       </div>
                    </div>
                 </div>

                 {/* Action Grid */}
                 <div className="grid grid-cols-2 gap-4 mt-8">
                    <button 
                      onClick={() => window.location.href = `/call-assistant/${selectedLead}`}
                      className="flex items-center justify-center gap-2 p-4 bg-indigo-600 rounded-2xl text-xs font-black text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 border-indigo-500 uppercase tracking-widest">
                       <Phone size={16} /> Start Call Assistant
                    </button>
                    <button className="flex items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 hover:bg-slate-100 transition-colors uppercase tracking-widest">
                       <Mail size={16} /> Send Email
                    </button>
                 </div>

                 {/* Tab Navigation */}
                 <div className="mt-8">
                     <div className="flex border-b border-slate-200 hide-scrollbar overflow-x-auto">
                        <button className="px-4 py-3 text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 whitespace-nowrap">Conversation</button>
                        <button className="px-4 py-3 text-sm font-bold text-slate-400 hover:text-slate-800 whitespace-nowrap">Invoice / Order</button>
                        <button className="px-4 py-3 text-sm font-bold text-slate-400 hover:text-slate-800 whitespace-nowrap">Files</button>
                        <button className="px-4 py-3 text-sm font-bold text-slate-400 hover:text-slate-800 whitespace-nowrap">Notes</button>
                        <button className="px-4 py-3 text-sm font-bold text-slate-400 hover:text-slate-800 whitespace-nowrap">History</button>
                     </div>

                     <div className="py-6">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                           <p className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-widest">Compose Email</p>
                           <textarea className="w-full bg-white border border-slate-200 p-3 rounded-lg text-sm shadow-sm outline-none focus:border-indigo-400" placeholder="Type a message..." rows={3}></textarea>
                           <div className="mt-3 flex justify-end">
                              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase shadow-sm">Send</button>
                           </div>
                        </div>

                        <div className="space-y-6 mt-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                           <div className="relative pl-12 flex flex-col">
                              <div className="absolute left-1 top-1 w-8 h-8 rounded-full bg-indigo-100 border-4 border-white flex items-center justify-center text-indigo-600 shadow-[0_0_0_2px_#EEF2FF]">
                                 <Mail size={12} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-end">12:30 PM</span>
                              <p className="text-sm font-bold text-slate-800">Email sent to client</p>
                              <p className="text-xs font-medium text-slate-600 mt-1">Subject: Following up on your custom patch order</p>
                           </div>
                           <div className="relative pl-12 flex flex-col opacity-80">
                              <div className="absolute left-1 top-1 w-8 h-8 rounded-full bg-emerald-100 border-4 border-white flex items-center justify-center text-emerald-600">
                                 <Phone size={12} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-end">Yesterday</span>
                              <p className="text-sm font-bold text-slate-800">Outbound Call — 4m 12s</p>
                              <p className="text-xs font-medium text-slate-500 mt-1">Client confirmed they need 50 pieces of embroidered patches with iron-on backing.</p>
                           </div>
                        </div>
                     </div>
                 </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                  <button className="text-rose-500 font-bold text-[10px] uppercase tracking-widest hover:bg-rose-100 px-4 py-2 rounded-lg transition-colors">Disqualify Lead</button>
                  <button 
                     onClick={() => window.location.href = `/invoices?lead=${selectedLead}`}
                     className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-100"
                  >
                     Create New Invoice
                  </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
