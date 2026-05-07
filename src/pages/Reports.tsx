import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Download, 
  Filter, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { useReports } from '../hooks/useReports';
import { motion } from 'motion/react';

export default function Reports() {
  const { metrics, loading } = useReports();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-slate-300 font-black uppercase text-[10px] tracking-widest">
        Running operations protocol...
      </div>
    );
  }

  // Transform data for charts
  const monthlyRev = metrics.revenue_trend?.map((item: any) => ({
    month: item.month,
    rev: item.revenue,
    target: item.revenue * 0.8 // Mock target for UI
  })) || [];

  const sourceData = metrics.leads_by_source?.map((item: any) => ({
    name: item.source,
    value: item.count
  })) || [];

  const sdrPerformance = metrics.sdr_performance || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Operations Protocol</h2>
            <p className="text-sm font-black text-slate-300 uppercase tracking-widest mt-1">Real-time analytical layer • All Assets</p>
         </div>
         <div className="flex items-center gap-3">
            <button className="flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm hover:bg-slate-50 transition-all text-slate-500 hover:text-slate-900">
               <Calendar size={18} className="text-indigo-600" />
               Current Phase: Q2
            </button>
            <button className="flex items-center gap-3 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95 leading-none">
               <Download size={18} />
               Export Intel
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Revenue Growth */}
         <div className="lg:col-span-2 bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="font-black text-slate-800 text-lg tracking-tight uppercase">Revenue Trajectory</h3>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-1">Performance vs Projected Growth</p>
               </div>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 bg-indigo-600 rounded-full shadow-lg shadow-indigo-100" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actual Vol</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-3 h-3 bg-slate-100 rounded-full" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</span>
                  </div>
               </div>
            </div>
            <div className="h-[320px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRev}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 900 }} dy={15} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 900 }} />
                     <Tooltip 
                        cursor={{ fill: 'rgba(79, 70, 229, 0.03)' }} 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', padding: '20px' }} 
                     />
                     <Bar dataKey="target" fill="#F1F5F9" radius={[12, 12, 0, 0]} barSize={40} />
                     <Bar dataKey="rev" fill="#4F46E5" radius={[12, 12, 0, 0]} barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* SDR Leaderboard */}
         <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm flex flex-col">
            <h3 className="font-black text-slate-800 text-lg tracking-tight uppercase mb-8">Asset Rankings</h3>
            <div className="space-y-8 flex-1">
               {sdrPerformance.map((sdr: any, i: number) => (
                  <div key={i} className="flex items-center gap-5 group cursor-pointer">
                     <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-110 transition-transform font-bold text-slate-400 uppercase">
                        {sdr.name.substring(0, 2)}
                     </div>
                     <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-end mb-2">
                           <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{sdr.name}</span>
                           <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">${(sdr.revenue/1000).toFixed(0)}k</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (sdr.closed_leads / 50) * 100)}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className="h-full bg-indigo-600 rounded-full shadow-lg shadow-indigo-100" 
                           />
                        </div>
                     </div>
                  </div>
               ))}
               {sdrPerformance.length === 0 && (
                 <div className="flex-1 flex items-center justify-center text-[9px] font-black text-slate-300 uppercase tracking-widest">No active assets</div>
               )}
            </div>
            <button className="mt-10 p-4 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest">
               Detailed Expansion <ArrowUpRight size={14} />
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Leads by Source */}
         <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-800 text-lg tracking-tight uppercase mb-10">Acquisition Source</h3>
            <div className="flex items-center gap-12 h-[280px]">
               <div className="flex-1 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={sourceData}
                           innerRadius={70}
                           outerRadius={100}
                           paddingAngle={8}
                           dataKey="value"
                        >
                           {sourceData.map((_entry: any, index: number) => (
                              <Cell 
                                 key={`cell-${index}`} 
                                 fill={['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6'][index % 5]} 
                                 strokeWidth={0}
                              />
                           ))}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="space-y-4 shrink-0 bg-slate-50/50 p-6 rounded-3xl border border-slate-50 min-w-[160px]">
                  {sourceData.map((item: any, i: number) => (
                     <div key={i} className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded-lg shadow-sm" style={{ backgroundColor: ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6'][i % 5] }} />
                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{item.name}</span>
                        <span className="text-[11px] font-black text-slate-800 ml-auto bg-white px-2 py-0.5 rounded-lg border border-slate-100">{item.value}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Refund Trends */}
         <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="font-black text-slate-800 text-lg tracking-tight uppercase">Deflection Analysis</h3>
                  <p className="text-[10px] text-rose-500 font-black flex items-center gap-2 mt-1 uppercase tracking-widest">
                     <ArrowDownRight size={14} strokeWidth={3} /> Decreasing: -2.4% Phase Delta
                  </p>
               </div>
               <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-xl rounded-2xl transition-all border border-transparent hover:border-slate-100">
                  <Filter size={20} />
               </button>
            </div>
            <div className="h-[220px]">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRev}>
                     <Line 
                        type="monotone" 
                        dataKey="rev" 
                        stroke="#F43F5E" 
                        strokeWidth={4} 
                        dot={{ fill: '#F43F5E', strokeWidth: 4, r: 6, stroke: '#FFFFFF' }} 
                        activeDot={{ r: 8, strokeWidth: 0 }}
                     />
                     <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', padding: '20px' }} 
                     />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
}
