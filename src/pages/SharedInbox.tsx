import React from 'react';
import { 
  Search, 
  Paperclip, 
  Smile, 
  Send, 
  Phone, 
  MoreVertical, 
  User, 
  ShoppingBag, 
  FileText,
  ChevronRight,
  Mail,
  Instagram,
  Facebook
} from 'lucide-react';
import { cn } from '../lib/utils';

const threads = [
  { id: 1, name: 'Alex Johnson', lastMsg: 'I need an invoice for 500 patches ASAP.', time: '12m', unread: 2, channel: 'email' },
  { id: 2, name: 'Sarah Miller', lastMsg: 'The stitch quality on the sample looks great!', time: '1h', unread: 0, channel: 'instagram' },
  { id: 3, name: 'Mike Ross', lastMsg: 'When will my order be shipped?', time: '3h', unread: 0, channel: 'facebook' },
  { id: 4, name: 'Harvey Specter', lastMsg: 'Call me back regarding the design revisions.', time: '5h', unread: 1, channel: 'email' },
];

const messages = [
  { id: 1, sender: 'Alex Johnson', text: 'Hi, I saw your patches on Instagram. I want something similar for my basketball team.', time: '10:30 AM', isMe: false },
  { id: 2, sender: 'Sarah S. (SDR)', text: 'Hello Alex! We would love to help. Could you share your artwork ideas?', time: '10:45 AM', isMe: true },
  { id: 3, sender: 'Alex Johnson', text: 'I need an invoice for 500 patches ASAP. Attached is our logo.', time: '11:05 AM', isMe: false, attachment: 'logo_2024_vector.svg' },
];

export default function SharedInbox() {
  const [activeThread, setActiveThread] = React.useState(1);

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Left Sidebar: Thread List */}
      <div className="w-80 border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-slate-100 border-none rounded-full py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50 scrollbar-hide">
          {threads.map((thread) => (
            <button 
              key={thread.id}
              onClick={() => setActiveThread(thread.id)}
              className={cn(
                "w-full p-4 flex gap-3 text-left transition-colors hover:bg-slate-50",
                activeThread === thread.id && "bg-indigo-50/50"
              )}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 overflow-hidden border border-slate-200">
                   <img src={`https://picsum.photos/seed/${thread.name}/100/100`} alt={thread.name} referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-slate-100">
                   {thread.channel === 'email' && <Mail size={10} className="text-slate-400" />}
                   {thread.channel === 'instagram' && <Instagram size={10} className="text-rose-500" />}
                   {thread.channel === 'facebook' && <Facebook size={10} className="text-indigo-500" />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={cn("text-xs truncate transition-colors", activeThread === thread.id ? "text-indigo-900 font-black" : "font-bold text-slate-700")}>{thread.name}</h4>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{thread.time}</span>
                </div>
                <p className={cn(
                  "text-[11px] truncate leading-tight",
                  thread.unread > 0 ? "text-slate-900 font-bold" : "text-slate-400 font-medium"
                )}>
                  {thread.lastMsg}
                </p>
              </div>
              {thread.unread > 0 && (
                <div className="mt-1">
                   <div className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm shadow-rose-100">{thread.unread}</div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Center: Conversation Panel */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
           <div className="flex items-center gap-3">
              <h3 className="font-black text-slate-800 tracking-tight text-sm uppercase">{threads.find(t => t.id === activeThread)?.name}</h3>
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Now</span>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-indigo-600">
                 <Phone size={18} />
              </button>
              <button className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                 <MoreVertical size={18} />
              </button>
           </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
           {messages.map((msg) => (
              <div key={msg.id} className={cn(
                "flex flex-col max-w-[75%]",
                msg.isMe ? "ml-auto items-end" : "items-start"
              )}>
                 <div className={cn(
                   "p-4 rounded-2xl text-sm shadow-sm transition-all",
                   msg.isMe 
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-100" 
                    : "bg-white border border-slate-200 rounded-tl-none"
                 )}>
                    <p className="leading-relaxed">{msg.text}</p>
                    {msg.attachment && (
                       <div className={cn(
                         "mt-4 p-3 rounded-xl flex items-center gap-3 border transition-colors",
                         msg.isMe ? "bg-white/10 border-white/20 hover:bg-white/20" : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                       )}>
                          <div className={cn("p-2 rounded-lg", msg.isMe ? "bg-white/20" : "bg-white")}>
                             <FileText size={16} className={msg.isMe ? "text-white" : "text-indigo-600"} />
                          </div>
                          <div className="flex-1 overflow-hidden">
                             <p className="text-[11px] font-bold truncate leading-none mb-1">{msg.attachment}</p>
                             <p className="text-[9px] opacity-60 font-bold uppercase tracking-widest">2.4 MB • SVG</p>
                          </div>
                       </div>
                    )}
                 </div>
                 <span className="text-[9px] text-slate-400 mt-2 uppercase font-black tracking-[0.1em]">{msg.time}</span>
              </div>
           ))}
        </div>

        {/* Composer */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
           <div className="bg-slate-100 rounded-2xl p-1.5 flex items-center gap-1 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all border border-transparent focus-within:border-indigo-100 shadow-inner">
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                 <Paperclip size={18} />
              </button>
              <input 
                type="text" 
                placeholder="Type a message to Alex..." 
                className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-[13px] py-2 px-1 font-medium placeholder:text-slate-400"
              />
              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                 <Smile size={18} />
              </button>
              <button className="bg-indigo-600 text-white p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-100">
                 <Send size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* Right Sidebar: Customer Snapshot */}
      <div className="w-80 border-l border-slate-100 flex flex-col shrink-0 overflow-y-auto hidden xl:flex bg-white">
         <div className="p-8 text-center border-b border-slate-50">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 mx-auto mb-4 overflow-hidden border-4 border-slate-50 shadow-xl shadow-slate-100">
               <img src={`https://picsum.photos/seed/${threads.find(t => t.id === activeThread)?.name}/100/100`} alt="Profile" />
            </div>
            <h4 className="font-black text-slate-800 text-lg tracking-tight">{threads.find(t => t.id === activeThread)?.name}</h4>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">SDR: Sarah Miller • NYC, USA</p>
         </div>

         <div className="p-6 space-y-8 flex-1">
            <div className="grid grid-cols-2 gap-3">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 leading-none">Net Rev</p>
                  <p className="text-xl font-black text-slate-800 leading-none tracking-tight">$12.4k</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 leading-none">Lifetime</p>
                  <p className="text-xl font-black text-slate-800 leading-none tracking-tight">412d</p>
               </div>
            </div>

            <div>
               <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
                  Open Records
                  <ChevronRight size={14} className="text-slate-300" />
               </h5>
               <div className="space-y-2.5">
                  <div className="flex items-center gap-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl group hover:bg-indigo-50 transition-colors cursor-pointer">
                     <div className="p-2 bg-white rounded-lg shadow-sm border border-indigo-100">
                        <FileText size={16} className="text-indigo-600" />
                     </div>
                     <div className="flex-1 overflow-hidden">
                        <p className="text-[11px] font-black text-slate-800 truncate leading-none mb-1">Draft Invoice #INV821</p>
                        <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-widest">Awaiting Artwork</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-rose-50/50 border border-rose-100 rounded-xl group hover:bg-rose-50 transition-colors cursor-pointer">
                     <div className="p-2 bg-white rounded-lg shadow-sm border border-rose-100">
                        <ShoppingBag size={16} className="text-rose-600" />
                     </div>
                     <div className="flex-1 overflow-hidden">
                        <p className="text-[11px] font-black text-slate-800 truncate leading-none mb-1">Critical Lead #L-22</p>
                        <p className="text-[9px] text-rose-600 font-bold uppercase tracking-widest">SLA Overdue 4m</p>
                     </div>
                  </div>
               </div>
            </div>

            <div>
               <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4 uppercase">Profile Tags</h5>
               <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-slate-800 text-white text-[9px] font-black rounded-lg tracking-widest uppercase">VIP Client</span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded-lg tracking-widest uppercase border border-slate-200">Bulk Buyer</span>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-lg tracking-widest uppercase border border-indigo-100">Tech Brand</span>
               </div>
            </div>
         </div>
         
         <div className="p-6 border-t border-slate-100">
             <button className="w-full py-3 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-200">
                View Intelligence Profile
             </button>
         </div>
      </div>
    </div>

  );
}
