import React from 'react';

export default function Settings() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h2>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Configure global platform behavior</p>
      </div>

      <div className="space-y-6">
         {/* SLA Section */}
         <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
               <h3 className="text-lg font-black text-slate-800 tracking-tight">SLA & Routing Engine</h3>
               <p className="text-xs text-slate-500 mt-1">Configure lead distribution and response time SLAs.</p>
            </div>
            <div className="p-6 space-y-6 bg-slate-50/30">
               <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Lead SLA Timer (minutes)</label>
                  <input type="number" defaultValue="5" className="w-full max-w-[200px] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10" />
               </div>
               
               <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Routing Protocol</label>
                  <select className="w-full max-w-md border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 bg-white">
                     <option>Round-Robin Allocation</option>
                     <option>Performance Based (Conversion %)</option>
                     <option>Manual (Manager Assignment)</option>
                  </select>
               </div>

               <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm font-bold text-slate-700">Auto-escalate to manager upon SLA breach</span>
               </label>
            </div>
         </div>

         {/* Integrations */}
         <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
               <h3 className="text-lg font-black text-slate-800 tracking-tight">Ecosystem Integrations</h3>
               <p className="text-xs text-slate-500 mt-1">Connect third-party APIs for automation.</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/30">
               <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                     <p className="font-black text-slate-800">Stripe Payments</p>
                     <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase font-bold tracking-widest mt-1 inline-block">Connected</span>
                  </div>
                  <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest">Configure</button>
               </div>
               <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                     <p className="font-black text-slate-800">RingCentral API</p>
                     <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase font-bold tracking-widest mt-1 inline-block">Connected</span>
                  </div>
                  <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest">Configure</button>
               </div>
               <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                     <p className="font-black text-slate-800">FedEx Tracking</p>
                     <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold tracking-widest mt-1 inline-block">Inactive</span>
                  </div>
                  <button className="text-[11px] font-black bg-slate-900 text-white px-4 py-1.5 rounded-lg hover:bg-slate-800 uppercase tracking-wider">Connect</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
