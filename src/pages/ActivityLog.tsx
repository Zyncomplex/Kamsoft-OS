import React from 'react';
import { Clock, User, FileText, CheckCircle2, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const activities = [
  { id: 1, user: 'Hammad', role: 'SDR', action: 'Sent Invoice #INV821', time: '12 min ago', type: 'invoice', details: '$2,450 to Acme Corp' },
  { id: 2, user: 'Faiq', role: 'Design', action: 'Approved Artwork v4', time: '45 min ago', type: 'design', details: 'Client: British Lion' },
  { id: 3, user: 'Ikhlaque A.', role: 'Admin', action: 'Released Batch PJ-991', time: '2 hours ago', type: 'prod', details: 'Released to DHL Logistics' },
  { id: 4, user: 'System Relay', role: 'Automation', action: 'SLA Breach Warning', time: '3 hours ago', type: 'alert', details: 'Lead LD-8824 unassigned' },
  { id: 5, user: 'Sufyan', role: 'SDR', action: 'Client Replied', time: 'Yesterday', type: 'comm', details: 'Via Email: "Looks great!"' },
  { id: 6, user: 'Wahid', role: 'Account Mgr', action: 'New Order Created', time: 'Yesterday', type: 'invoice', details: 'TAP-1025 ($450)' },
];

const typeStyles: Record<string, any> = {
  invoice: { icon: FileText, color: 'indigo' },
  design: { icon: ShieldCheck, color: 'emerald' },
  prod: { icon: CheckCircle2, color: 'sky' },
  alert: { icon: AlertTriangle, color: 'rose' },
  comm: { icon: MessageSquare, color: 'amber' },
};

export default function ActivityLog() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Security Audit Trail</h2>
            <p className="text-sm font-black text-slate-300 uppercase tracking-widest mt-3 flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Live Synchronized Stream
            </p>
         </div>
      </div>

      <div className="space-y-4 relative before:absolute before:left-[31px] before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-100">
         {activities.map((activity, i) => {
            const Style = typeStyles[activity.type] || { icon: Clock, color: 'indigo' };
            const Icon = Style.icon;
            return (
               <motion.div 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.05 }}
                 key={activity.id} 
                 className="relative pl-16 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
               >
                  <div className={cn(
                     "absolute left-4 w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-slate-50 transition-all duration-500 z-10",
                     activity.type === 'alert' ? "bg-rose-500 text-white shadow-xl shadow-rose-100" : "bg-white text-slate-400 group-hover:text-indigo-600 shadow-sm border-slate-50 group-hover:border-white group-hover:shadow-indigo-100"
                  )}>
                     <Icon size={16} strokeWidth={3} />
                  </div>

                  <div className="flex-1 bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group-hover:-translate-y-1">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                           <div className="flex items-center gap-3">
                              <span className="text-xs font-black text-slate-800">{activity.user}</span>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md leading-none">{activity.role}</span>
                           </div>
                           <p className="font-black text-slate-800 tracking-tight">{activity.action}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.details}</p>
                        </div>
                        <div className="text-right">
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{activity.time}</span>
                        </div>
                     </div>
                  </div>
               </motion.div>
            );
         })}
      </div>

      <button className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[32px] text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] hover:text-indigo-600 hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all">
         Load Previous Archive
      </button>
    </div>
  );
}
