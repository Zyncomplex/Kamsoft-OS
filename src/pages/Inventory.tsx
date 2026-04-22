import React from 'react';
import { Package, Search, Filter, Plus, ArrowUpRight, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const inventoryItems = [
  { id: 'MAT-001', name: 'Black Embroidery Thread', category: 'Thread', stock: 142, unit: 'Spools', status: 'In Stock' },
  { id: 'MAT-002', name: 'White Twill Backing', category: 'Backing', stock: 12, unit: 'Rolls', status: 'Low Stock' },
  { id: 'MAT-003', name: 'Standard Hook Velcro', category: 'Backing', stock: 45, unit: 'Meters', status: 'In Stock' },
  { id: 'MAT-004', name: 'Neon Green Thread', category: 'Thread', stock: 0, unit: 'Spools', status: 'Out of Stock' },
  { id: 'MAT-005', name: 'Eco-Leather Sheets', category: 'Material', stock: 85, unit: 'Sheets', status: 'In Stock' },
];

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Material Inventory</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Global supplies & raw materials tracking</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={14} />
               <input 
                 type="text" 
                 placeholder="Search materials..." 
                 className="bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-6 text-[11px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none w-[280px] transition-all focus:border-indigo-300"
               />
            </div>
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95 flex items-center gap-2">
               <Plus size={16} /> Add Supply
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Total SKU Volume</p>
            <p className="text-3xl font-black text-slate-800 tracking-tight">412 Items</p>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Critical Restock</p>
            <p className="text-3xl font-black text-rose-500 tracking-tight">8 Alerts</p>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Monthly Burn Rate</p>
            <p className="text-3xl font-black text-slate-800 tracking-tight">$4,250</p>
         </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Material Intel</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Stock</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {inventoryItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 group transition-all duration-300">
                     <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="font-black text-slate-800 text-sm tracking-tight">{item.name}</span>
                           <span className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-widest mt-0.5">{item.id}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                           {item.category}
                        </span>
                     </td>
                     <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-black text-slate-800">{item.stock}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.unit}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <span className={cn(
                           "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border",
                           item.status === 'In Stock' && "bg-emerald-50 text-emerald-600 border-emerald-100",
                           item.status === 'Low Stock' && "bg-amber-50 text-amber-600 border-amber-100",
                           item.status === 'Out of Stock' && "bg-rose-50 text-rose-600 border-rose-100",
                        )}>
                           {item.status}
                        </span>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <button className="p-2.5 bg-slate-50 text-slate-300 hover:text-indigo-600 hover:bg-white hover:shadow-xl rounded-xl transition-all border border-transparent hover:border-slate-100">
                           <ArrowUpRight size={16} />
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
