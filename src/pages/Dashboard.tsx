import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  AlertCircle, 
  Clock, 
  DollarSign 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const kpis = [
  { label: 'New Leads', value: '42', change: '↑ 12% vs yest', trend: 'up', color: 'indigo' },
  { label: 'Revenue', value: '$12.4k', change: '↑ 4.2%', trend: 'up', color: 'slate' },
  { label: 'Pending', value: '18', change: '4 urgent', trend: 'neutral', color: 'slate' },
  { label: 'Delays', value: '3', change: 'SLA Breach', trend: 'down', color: 'rose' },
  { label: 'Response', value: '14m', change: '-2m avg', trend: 'up', color: 'slate' },
  { label: 'Conv. %', value: '18.4%', change: '+0.8%', trend: 'up', color: 'slate' },
];

const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const brandData = [
  { name: 'The American Patch', value: 45000 },
  { name: 'Eagle Patch UK', value: 32000 },
  { name: 'Patch Makers CA', value: 28000 },
];

const activity = [
  { user: 'Hammad', action: 'Lead Won: Modern Edge Studio ($2,450)', time: '2m ago', type: 'conversion' },
  { user: 'Client Approval', action: 'Design Approved: Coastal Brand Mockups', time: '14m ago', type: 'approval' },
  { user: 'System Automated', action: 'New Vendor Note: Fabric supply delay #9021', time: '1h ago', type: 'alert' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 pb-12">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-indigo-100">
            <p className="text-[10px] uppercase text-slate-400 font-bold mb-1 tracking-wider">{kpi.label}</p>
            <h3 className={cn(
               "text-2xl font-black mb-1",
               kpi.color === 'indigo' && "text-indigo-600",
               kpi.color === 'rose' && "text-rose-500",
               kpi.color === 'slate' && "text-slate-800"
            )}>
               {kpi.value}
            </h3>
            <p className={cn(
               "text-[10px] font-bold",
               kpi.trend === 'up' ? "text-emerald-500" : i === 2 ? "text-slate-400" : "text-rose-400"
            )}>
               {kpi.change}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[320px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800">Revenue Trends</h3>
            <div className="flex gap-2 text-[10px]">
               <button className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-bold uppercase tracking-widest transition-colors">7 Days</button>
               <button className="px-2 py-1 text-slate-400 font-bold uppercase tracking-widest hover:text-slate-600 transition-colors">30 Days</button>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }}
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[320px] flex flex-col">
           <h3 className="text-sm font-bold text-slate-800 mb-6 tracking-tight">Brand Performance</h3>
           <div className="space-y-5 flex-1">
              {brandData.map((item, i) => (
                <div key={i} className="space-y-1">
                   <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-600">{item.name}</span>
                      <span className="font-black text-slate-800">${(item.value/1000).toFixed(1)}k</span>
                   </div>
                   <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / 45000) * 100}%` }}
                        className={cn(
                           "h-full rounded-full",
                           i === 0 && "bg-indigo-500",
                           i === 1 && "bg-sky-500",
                           i === 2 && "bg-emerald-500",
                           i === 3 && "bg-amber-500"
                        )}
                      />
                   </div>
                </div>
              ))}
           </div>
           <button className="mt-4 text-[10px] font-bold text-indigo-600 uppercase tracking-widest text-center hover:bg-slate-50 py-2 rounded-lg transition-colors">
              View Detailed Metrics
           </button>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* SLA Alerts */}
         <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
               <div>
                  <h3 className="font-black flex items-center gap-3 text-rose-500 uppercase text-[11px] tracking-[0.2em]">
                     <AlertCircle size={18} strokeWidth={3} />
                     Needs Attention
                  </h3>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Leads waiting too long</p>
               </div>
               <button className="text-[10px] font-black text-slate-900 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors">View All</button>
            </div>
            <div className="divide-y divide-slate-50">
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-rose-50/20 transition-all group">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm group-hover:scale-110 transition-transform">
                           <Clock size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1.5">New Lead Phase #5929 ({i === 1 ? 'CRITICAL' : 'Stalled'})</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unresponsive for {i * 15}m • Assigned: Node-{i+100}</p>
                        </div>
                     </div>
                     <span className="text-[10px] font-black font-mono border border-rose-200 bg-rose-500 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-rose-200">-{i * 12}m</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Live Feed */}
         <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50">
               <h3 className="font-black text-slate-800 uppercase text-[11px] tracking-[0.2em]">Recent Team Activity</h3>
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Live updates from the team</p>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 max-h-[350px] scrollbar-hide">
               {activity.map((item, i) => (
                  <div key={i} className="flex gap-5 group items-start">
                     <div className={cn(
                        "w-3 h-3 rounded-full mt-1.5 shrink-0 shadow-lg relative",
                        item.type === 'conversion' && "bg-emerald-500 shadow-emerald-200",
                        item.type === 'vendor' && "bg-indigo-500 shadow-indigo-200",
                        item.type === 'alert' && "bg-rose-500 shadow-rose-200",
                        item.type === 'approval' && "bg-sky-500 shadow-sky-200"
                     )}>
                        <div className="absolute inset-[-4px] rounded-full border border-current opacity-20 animate-ping" />
                     </div>
                     <div>
                        <p className="text-sm font-black text-slate-800 tracking-tight leading-relaxed">
                           <span className="text-indigo-600">{item.user}</span> {item.action}
                        </p>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{item.time}</p>
                     </div>
                  </div>
               ))}
            </div>
            <div className="p-6 text-center border-t border-slate-50 bg-slate-50/30">
               <Link to="/activity" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-indigo-600 transition-all flex items-center justify-center gap-2 w-full">
                  View full history
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
