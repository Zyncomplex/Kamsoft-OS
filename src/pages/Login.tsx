import React from 'react';
import { cn } from '../lib/utils';
import { 
  ArrowRight, 
  Search, 
  Mail, 
  Lock, 
  Github, 
  Chrome, 
  TrendingUp, 
  Globe, 
  ShieldCheck 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen flex selection:bg-indigo-500 selection:text-white bg-white">
      {/* Left Panel: Promo */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 text-white p-24 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-16 h-16 flex items-center justify-center mb-12 bg-transparent">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-full h-full object-contain" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const span = document.createElement('span');
                  span.innerText = 'K';
                  span.className = 'text-white font-black text-2xl flex items-center justify-center w-full h-full bg-indigo-900 rounded-2xl';
                  parent.appendChild(span);
                }
              }}
            />
          </div>
          <div className="flex-1 mt-12">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-[0.2em] uppercase mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              System Online
            </div>
            
            <h1 className="text-[5.5rem] xl:text-[6.5rem] font-black tracking-tighter leading-[0.85] text-white mb-8">
              Mission<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-cyan-400 to-emerald-400">
                Control.
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-md font-medium leading-relaxed border-l-2 border-indigo-500/30 pl-6">
              The central nervous system for our brands — orchestrating premium global fulfillment and yield operations.
            </p>
          </div>
        </div>

        {/* Animated Metrics */}
        <div className="relative z-10 space-y-8">
           <div className="grid grid-cols-2 gap-8">
              <div className="p-8 bg-white/[0.03] border border-white/[0.05] rounded-[32px] backdrop-blur-3xl shadow-2xl">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Network Yield</p>
                 <p className="text-4xl font-black tracking-tight">$4.2M</p>
                 <div className="flex items-center gap-2 text-emerald-400 text-[10px] mt-3 font-black uppercase tracking-widest">
                    <TrendingUp size={12} strokeWidth={3} /> Velocity +12.4%
                 </div>
              </div>
              <div className="p-8 bg-white/[0.03] border border-white/[0.05] rounded-[32px] backdrop-blur-3xl shadow-2xl">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Fleet Nodes</p>
                 <p className="text-4xl font-black tracking-tight">12</p>
                 <div className="flex items-center gap-2 text-indigo-400 text-[10px] mt-3 font-black uppercase tracking-widest">
                    <Globe size={12} strokeWidth={3} /> Global Active
                 </div>
              </div>
           </div>
           <div className="p-8 bg-white/[0.03] border border-white/[0.05] rounded-[32px] backdrop-blur-3xl flex items-center justify-between shadow-2xl">
              <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Security protocol</p>
                 <p className="text-xl font-black tracking-tight text-white/90 uppercase">ISO 27001 Protocol</p>
              </div>
              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <ShieldCheck size={32} className="text-indigo-400" />
              </div>
           </div>
        </div>

        {/* Background Visual Artifact */}
        <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full scale-150 rotate-12" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full scale-125 -rotate-12" />
      </div>

      {/* Right Panel: Login Card */}
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white p-12 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-white relative z-10"
        >
          <div className="text-center mb-12">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-6">
                Operational Beta v24
             </div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">Access Portal</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Secure session authentication required</p>
          </div>

          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center justify-between px-2">
                 Protocol address
                 <Mail size={12} className="text-indigo-400" />
              </label>
              <input 
                type="email" 
                placeholder="ikhlaque@example.com"
                className="w-full bg-slate-50 border border-slate-100 rounded-[20px] p-5 text-sm font-black text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 outline-none transition-all placeholder:text-slate-300"
                defaultValue="ikhlaque@example.com"
              />
            </div>

            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center justify-between px-2">
                  Alpha Sequence
                  <Lock size={12} className="text-indigo-400" />
               </label>
               <input 
                 type="password" 
                 placeholder="••••••••"
                 className="w-full bg-slate-50 border border-slate-100 rounded-[20px] p-5 text-sm font-black text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 outline-none transition-all placeholder:text-slate-300"
                 defaultValue="password"
               />
            </div>

            <div className="flex items-center justify-between py-2 px-2">
               <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-900 uppercase tracking-widest transition-colors">Persistent session</span>
               </label>
               <button type="button" className="text-[10px] font-black text-indigo-600 hover:text-slate-900 uppercase tracking-widest transition-colors">Reset Access?</button>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-slate-950 text-white rounded-[24px] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 active:scale-95 shadow-xl shadow-slate-200"
            >
              Sign In to Platform <ArrowRight size={20} strokeWidth={3} />
            </button>
          </form>

          <div className="my-12 flex items-center gap-6 text-slate-200 uppercase font-black text-[9px] tracking-[0.4em]">
             <div className="flex-1 h-[1px] bg-slate-100" />
             Federated Entry
             <div className="flex-1 h-[1px] bg-slate-100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button className="flex items-center justify-center gap-3 p-5 bg-white border border-slate-100 rounded-[20px] font-black uppercase text-[10px] tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                <Chrome size={18} className="text-indigo-500" /> Google
             </button>
             <button className="flex items-center justify-center gap-3 p-5 bg-white border border-slate-100 rounded-[20px] font-black uppercase text-[10px] tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                <Github size={18} className="text-slate-900" /> GitHub
             </button>
          </div>
        </motion.div>

        <p className="mt-12 text-gray-400 text-xs font-medium uppercase tracking-widest text-center">
           Operations Portal v24.4.21
        </p>
      </div>
    </div>
  );
}
