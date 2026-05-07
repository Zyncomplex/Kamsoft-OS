import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { 
  Building2, 
  MapPin, 
  Star, 
  Package,
  ArrowUpRight,
  Search
} from 'lucide-react';
import { useVendors } from '../hooks/useVendors';
import { useRealtime } from '../hooks/useRealtime';

export default function Vendors() {
  const { data: vendors, loading, fetchAll } = useVendors();
  const [searchTerm, setSearchTerm] = useState('');

  useRealtime('vendors', fetchAll);

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Vendor Ecosystem</h2>
            <p className="text-sm font-black text-slate-300 uppercase tracking-widest mt-1">Global fulfillment node management</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={14} />
               <input 
                 type="text" 
                 placeholder="Search global network..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-6 text-[11px] font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none w-[280px] transition-all focus:border-indigo-300"
               />
            </div>
            <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95 leading-none">
               Onboard Vendor
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {loading && <div className="col-span-full py-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Scanning network...</div>}
         
         {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-[32px] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group overflow-hidden flex flex-col">
               <div className="p-8">
                  <div className="flex items-start justify-between mb-8">
                     <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shadow-sm">
                        <Building2 size={32} />
                     </div>
                     <span className={cn(
                        "text-[9px] font-black uppercase py-1.5 px-3 rounded-full border shadow-sm",
                        vendor.status === 'Top Tier' && "bg-indigo-50 text-indigo-600 border-indigo-100",
                        vendor.status === 'Verified' && "bg-emerald-50 text-emerald-600 border-emerald-100",
                        vendor.status === 'Certified' && "bg-sky-50 text-sky-600 border-sky-100",
                        !['Top Tier', 'Verified', 'Certified'].includes(vendor.status) && "bg-slate-50 text-slate-600 border-slate-100"
                     )}>
                        {vendor.status || 'Active'}
                     </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight group-hover:text-indigo-600 transition-colors">{vendor.name}</h3>
                  <div className="flex items-center gap-2 text-slate-300 mb-6">
                     <MapPin size={12} />
                     <span className="text-[10px] font-black uppercase tracking-widest">{vendor.location || 'Unknown Location'}</span>
                  </div>

                  <div className="space-y-4 mb-8">
                     <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialty</span>
                        <span className="text-xs font-black text-slate-800">{vendor.specialty || 'General'}</span>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Jobs</span>
                        <div className="flex items-center gap-1.5">
                           <Package size={14} className="text-indigo-500" />
                           <span className="text-xs font-black text-slate-800">{vendor.active_jobs_count || 0} Jobs</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                     <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(star => (
                           <Star key={star} size={12} className={cn(star <= Math.floor(vendor.rating || 5) ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                        ))}
                        <span className="ml-2 text-[10px] font-black text-slate-400">{vendor.rating || '5.0'}</span>
                     </div>
                     <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-xl rounded-2xl transition-all border border-transparent hover:border-slate-100">
                        <ArrowUpRight size={18} />
                     </button>
                  </div>
               </div>
            </div>
         ))}

         {!loading && (
           <button className="rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-slate-300 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white hover:shadow-2xl transition-all group">
              <div className="w-16 h-16 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <span className="text-3xl font-bold">+</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Integrate Node</span>
           </button>
         )}
      </div>
    </div>
  );
}
