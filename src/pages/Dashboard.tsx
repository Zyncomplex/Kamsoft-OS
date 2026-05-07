import React, { useEffect, useState } from 'react';
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
  ResponsiveContainer
} from 'recharts';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useReports } from '../hooks/useReports';
import { useLeads } from '../hooks/useLeads';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { useRealtime } from '../hooks/useRealtime';
import { useBrand } from '../contexts/BrandContext';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { activeBrand } = useBrand();
  const { getSalesMetrics, getOverview, loading: reportsLoading } = useReports();
  const { data: activityLogs, fetchAll: refreshActivity } = useActivityLogs();
  const { data: overdueLeads, fetchAll: refreshLeads } = useLeads();
  
  const [salesData, setSalesData] = useState<any>(null);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [period, setPeriod] = useState('7d');

  // Load metrics
  useEffect(() => {
    if (!activeBrand) return;
    
    Promise.all([
      getSalesMetrics(period),
      getOverview(period)
    ]).then(([sales, overview]) => {
      setSalesData(sales);
      setOverviewData(overview);
    });
  }, [activeBrand, period, getSalesMetrics, getOverview]);

  // Realtime updates
  useRealtime('leads', refreshLeads);
  useRealtime('activity_logs', refreshActivity);

  const kpis = [
    { label: 'Total Revenue', value: overviewData ? `$${(overviewData.totalRevenue / 1000).toFixed(1)}k` : '$0', change: '↑ 4.2%', trend: 'up', color: 'slate' },
    { label: 'New Leads', value: salesData ? salesData.totalLeads : '0', change: '↑ 12%', trend: 'up', color: 'indigo' },
    { label: 'Customers', value: overviewData ? overviewData.customersCount : '0', change: 'Live count', trend: 'neutral', color: 'slate' },
    { label: 'Won Leads', value: salesData ? salesData.wonLeads : '0', change: 'Targeting 20', trend: 'up', color: 'slate' },
    { label: 'Conv. %', value: salesData ? `${salesData.conversionRate.toFixed(1)}%` : '0%', change: '+0.8%', trend: 'up', color: 'slate' },
    { label: 'Total Orders', value: overviewData ? overviewData.totalOrders : '0', change: 'Active orders', trend: 'up', color: 'slate' },
  ];

  if (reportsLoading && !salesData) {
    return <div className="flex items-center justify-center h-full">Loading dashboard metrics...</div>;
  }

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
        <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[320px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800">Sales Trend</h3>
            <div className="flex gap-2 text-[10px]">
               <button 
                onClick={() => setPeriod('7d')}
                className={cn("px-2 py-1 rounded font-bold uppercase tracking-widest transition-colors", period === '7d' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600")}
               >7 Days</button>
               <button 
                onClick={() => setPeriod('30d')}
                className={cn("px-2 py-1 rounded font-bold uppercase tracking-widest transition-colors", period === '30d' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600")}
               >30 Days</button>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData?.trends || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }}
                  dy={10}
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
               <Link to="/leads" className="text-[10px] font-black text-slate-900 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors">View All</Link>
            </div>
            <div className="divide-y divide-slate-50">
               {overdueLeads.slice(0, 4).map((lead: any) => (
                  <div key={lead.id} className="p-6 flex items-center justify-between hover:bg-rose-50/20 transition-all group">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm group-hover:scale-110 transition-transform">
                           <Clock size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1.5">
                              Lead #{lead.display_id} • {lead.customer?.name}
                           </p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Source: {lead.source} • Status: {lead.status}
                           </p>
                        </div>
                     </div>
                     <span className="text-[10px] font-black font-mono border border-rose-200 bg-rose-500 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-rose-200">
                        OVERDUE
                     </span>
                  </div>
               ))}
               {overdueLeads.length === 0 && (
                  <div className="p-12 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">
                    No urgent leads at the moment
                  </div>
               )}
            </div>
         </div>

         {/* Live Feed */}
         <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50">
               <h3 className="font-black text-slate-800 uppercase text-[11px] tracking-[0.2em]">Recent Team Activity</h3>
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Live updates from the team</p>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 max-h-[350px] scrollbar-hide">
               {activityLogs.map((log: any, i: number) => (
                  <div key={i} className="flex gap-5 group items-start">
                     <div className="w-3 h-3 rounded-full mt-1.5 shrink-0 shadow-lg relative bg-indigo-500 shadow-indigo-200">
                        <div className="absolute inset-[-4px] rounded-full border border-current opacity-20 animate-ping" />
                     </div>
                     <div>
                        <p className="text-sm font-black text-slate-800 tracking-tight leading-relaxed">
                           <span className="text-indigo-600">User</span> {log.action} on {log.entity_type} #{log.entity_id || 'N/A'}
                        </p>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">
                           {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                        </p>
                     </div>
                  </div>
               ))}
               {activityLogs.length === 0 && (
                  <div className="text-center py-12 text-slate-300 font-bold uppercase text-[10px] tracking-widest">
                    No recent activity found
                  </div>
               )}
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
