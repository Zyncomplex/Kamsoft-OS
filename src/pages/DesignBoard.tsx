import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { MessageSquare, Upload, CheckCircle2, History, Layers } from 'lucide-react';

const artworks = [
  { id: 'DS-221', name: 'Eagle_Logo_V2.png', status: 'In Review', version: 'v3', time: '2h ago', preview: 'https://picsum.photos/seed/patch1/800/600' },
  { id: 'DS-220', name: 'Cyber_Knight_Final.pdf', status: 'Approved', version: 'v1', time: '1d ago', preview: 'https://picsum.photos/seed/patch2/800/600' },
  { id: 'DS-219', name: 'Moto_Club_Gold.png', status: 'Revision Needed', version: 'v5', time: '3d ago', preview: 'https://picsum.photos/seed/patch3/800/600' },
];

export default function DesignBoard() {
  const [activeArt, setActiveArt] = React.useState(artworks[0]);

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
       {/* Left: Queue */}
       <div className="w-80 border-r border-slate-100 flex flex-col shrink-0 bg-white">
          <div className="p-8 border-b border-slate-50">
             <h3 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-400">Design Queue</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
             {artworks.map(art => (
                <button 
                  key={art.id}
                  onClick={() => setActiveArt(art)}
                  className={cn(
                    "w-full p-5 rounded-3xl border text-left transition-all group",
                    activeArt.id === art.id 
                      ? "bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-200 scale-[1.02]" 
                      : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50"
                  )}
                >
                   <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-mono font-black opacity-40 uppercase tracking-widest">{art.id}</span>
                      <span className={cn(
                        "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm",
                        art.status === 'Approved' && "bg-emerald-50 text-emerald-600",
                        art.status === 'In Review' && "bg-indigo-50 text-indigo-600",
                        art.status === 'Revision Needed' && "bg-rose-50 text-rose-600",
                        activeArt.id === art.id && "bg-white/10 text-white border border-white/20"
                      )}>
                        {art.status}
                      </span>
                   </div>
                   <h4 className="font-black text-sm truncate mb-1 tracking-tight">{art.name}</h4>
                   <p className="text-[10px] opacity-40 uppercase font-black tracking-[0.2em]">{art.version} • {art.time}</p>
                </button>
             ))}
          </div>
       </div>

       {/* Center: Canvas */}
       <div className="flex-1 bg-slate-50/50 flex flex-col items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute top-8 left-8 flex gap-3 z-10">
             <div className="bg-white/80 backdrop-blur-xl p-3 rounded-2xl border border-white/50 shadow-2xl shadow-slate-200/50 flex items-center gap-6 px-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                      <Layers size={16} />
                   </div>
                   <div className="flex flex-col leading-none">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Current Version</span>
                      <span className="text-xs font-black text-slate-800">{activeArt.version} Artwork</span>
                   </div>
                </div>
                <div className="w-[1px] h-6 bg-slate-100" />
                <button className="text-[10px] uppercase font-black tracking-widest text-indigo-600 hover:text-slate-900 transition-colors">Compare Previous</button>
             </div>
          </div>

          <motion.div 
            key={activeArt.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-[56px] shadow-2xl shadow-slate-200/50 border border-slate-100 max-w-2xl w-full aspect-square overflow-hidden flex items-center justify-center relative group"
          >
             <img src={activeArt.preview} alt="Proof" className="w-full h-full object-contain rounded-[40px]" referrerPolicy="no-referrer" />
             <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                <button className="px-10 py-4 bg-white text-slate-900 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-3 hover:scale-110 transition-all shadow-2xl">
                   <Upload size={20} strokeWidth={3} /> Upload New Proof
                </button>
             </div>
          </motion.div>

          <div className="mt-12 flex gap-6 z-10">
             <button className="px-10 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                Request Changes
             </button>
             <button className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95 leading-none">
                <CheckCircle2 size={18} strokeWidth={3} /> Approve Artwork
             </button>
          </div>
          
          <History className="absolute -bottom-12 -right-12 text-slate-50 size-60 rotate-12 opacity-50" />
       </div>

       {/* Right: Comments */}
       <div className="w-80 border-l border-slate-100 flex flex-col shrink-0 bg-white">
          <div className="p-8 border-b border-slate-50 bg-slate-50/20">
              <h3 className="font-black flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-slate-400">
                  <MessageSquare size={14} className="text-indigo-600" />
                  Design Notes
              </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
             <div className="space-y-6">
                <div className="flex items-start gap-4 group/msg">
                   <div className="w-10 h-10 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden shrink-0 group-hover/msg:scale-110 transition-transform">
                      <img src="https://picsum.photos/seed/mike/100/100" alt="Mike" referrerPolicy="no-referrer" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1.5">
                         <p className="text-[10px] font-black text-slate-800 tracking-tight">Designer</p>
                         <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">2 hours ago</span>
                      </div>
                      <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-3xl rounded-tl-none leading-relaxed border border-slate-100 shadow-sm">Updated the gold thread color to match brand guidelines.</p>
                   </div>
                </div>
                <div className="flex items-start gap-4 group/msg">
                   <div className="w-10 h-10 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden shrink-0 group-hover/msg:scale-110 transition-transform">
                      <img src="https://picsum.photos/seed/hammad/100/100" alt="Hammad" referrerPolicy="no-referrer" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1.5">
                         <p className="text-[10px] font-black text-slate-800 tracking-tight">Sales Rep</p>
                         <span className="font-black text-indigo-400 uppercase text-[8px] tracking-widest">Just now</span>
                      </div>
                      <p className="text-xs text-indigo-700 bg-indigo-50/50 p-4 rounded-3xl rounded-tl-none border border-indigo-100/50 leading-relaxed shadow-sm">Looks perfect, I'll send this to the customer now!</p>
                   </div>
                </div>
             </div>
          </div>
          <div className="p-6 border-t border-slate-50 bg-slate-50/20">
             <div className="bg-white border border-slate-200 rounded-[20px] p-2 flex items-center gap-2 shadow-sm focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all focus-within:border-indigo-300">
                <input type="text" placeholder="Add a note......" className="flex-1 bg-transparent border-none text-[11px] font-bold text-slate-700 px-4 outline-none" />
                <button className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                   <History size={16} strokeWidth={3} />
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}
