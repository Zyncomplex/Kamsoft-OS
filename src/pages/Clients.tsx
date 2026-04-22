import React from 'react';
import { 
  Users,
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  MoreHorizontal,
  Clock,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const clientsData = [
  { id: 'C-8821', name: 'John Smith', company: 'Acme Corp', email: 'john@acmecorp.com', phone: '+1 (555) 123-4567', brand: 'The American Patch', totalOrders: 4, spent: '$3,250', lastOrder: '2w ago', status: 'Active' },
  { id: 'C-8822', name: 'Sarah Lee', company: 'Global Tech', email: 'sarah@globaltech.com', phone: '+1 (555) 987-6543', brand: 'Patch Makers CA', totalOrders: 1, spent: '$450', lastOrder: '1mo ago', status: 'Active' },
  { id: 'C-8823', name: 'Mike Chen', company: 'Wayne Ent.', email: 'm.chen@wayne.com', phone: '+1 (555) 222-3333', brand: 'Eagle Patch UK', totalOrders: 12, spent: '$14,200', lastOrder: '3d ago', status: 'VIP' },
  { id: 'C-8824', name: 'Emma Davis', company: 'Stark Ind.', email: 'emma@stark.com', phone: '+1 (555) 444-5555', brand: 'The American Patch', totalOrders: 0, spent: '$0', lastOrder: 'Never', status: 'Lead' },
  { id: 'C-8825', name: 'James Wilson', company: 'Pied Piper', email: 'j.wilson@piper.com', phone: '+1 (555) 777-8888', brand: 'Embroidered Patch', totalOrders: 2, spent: '$1,100', lastOrder: '6mo ago', status: 'Dormant' },
];

export default function Clients() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Client Directory</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">1,248 total clients across all brands</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={14} />
               <input 
                 type="text" 
                 placeholder="Search by name, email, company..." 
                 className="bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-6 text-[11px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none w-[320px] transition-all focus:border-indigo-300"
               />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 shadow-sm transition-all">
               <Filter size={18} />
            </button>
            <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 leading-none h-[42px]">
               Add Client
            </button>
         </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Client Profile</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Intel</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Brand/Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Lifetime Value</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Recency</th>
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {clientsData.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 group cursor-pointer transition-all duration-300">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shadow-sm border border-slate-200">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-sm tracking-tight group-hover:text-indigo-600 transition-colors">{client.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold mt-0.5">{client.company}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Mail size={12} className="text-slate-400" />
                        <span className="text-xs font-medium">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Phone size={12} className="text-slate-400" />
                        <span className="text-xs font-medium">{client.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-2">
                       <span className="text-[10px] font-bold text-slate-700 tracking-tight flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                         {client.brand}
                       </span>
                       <span className={cn(
                         "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest",
                         client.status === 'VIP' && "bg-amber-100 text-amber-700",
                         client.status === 'Active' && "bg-emerald-50 text-emerald-600",
                         client.status === 'Lead' && "bg-blue-50 text-blue-600",
                         client.status === 'Dormant' && "bg-slate-100 text-slate-500"
                       )}>
                         {client.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-black text-slate-800 text-sm">{client.spent}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-0.5">{client.totalOrders} Orders</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5 text-slate-500">
                      <Clock size={12} className="text-slate-400" />
                      <span className="text-xs font-bold">{client.lastOrder}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2.5 hover:bg-white hover:shadow-xl rounded-2xl text-slate-300 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100">
                       <MoreHorizontal size={16} />
                    </button>
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
