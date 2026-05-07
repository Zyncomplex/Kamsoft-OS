import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Paperclip, 
  Smile, 
  Send, 
  Phone, 
  MoreVertical, 
  ShoppingBag, 
  FileText,
  ChevronRight,
  Mail,
  Instagram,
  Facebook
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useConversations } from '../hooks/useConversations';
import { useRealtime } from '../hooks/useRealtime';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

export default function SharedInbox() {
  const { user } = useAuth();
  const { data: threads, loading: threadsLoading, getMessages, sendMessage, fetchAll: refreshThreads } = useConversations();
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find(t => t.id === activeThreadId);

  const loadMessages = async (id: string) => {
    setMessagesLoading(true);
    try {
      const res = await getMessages(id);
      setMessages(res);
    } catch (err) {
      console.error(err);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (activeThreadId) {
      loadMessages(activeThreadId);
    }
  }, [activeThreadId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Realtime
  useRealtime('messages', () => activeThreadId && loadMessages(activeThreadId));
  useRealtime('conversations', refreshThreads);

  const handleSend = async () => {
    if (!inputText.trim() || !activeThreadId) return;
    try {
      await sendMessage(activeThreadId, inputText);
      setInputText('');
      loadMessages(activeThreadId);
    } catch (err) {
      alert('Failed to send message');
    }
  };

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
          {threadsLoading && <div className="p-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading threads...</div>}
          {threads.map((thread: any) => (
            <button 
              key={thread.id}
              onClick={() => setActiveThreadId(thread.id)}
              className={cn(
                "w-full p-4 flex gap-3 text-left transition-colors hover:bg-slate-50",
                activeThreadId === thread.id && "bg-indigo-50/50"
              )}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 overflow-hidden border border-slate-200 uppercase">
                   {thread.customer?.name.substring(0, 2)}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-slate-100">
                   {thread.channel === 'Email' ? <Mail size={10} className="text-slate-400" /> : <Instagram size={10} className="text-rose-500" />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={cn("text-xs truncate transition-colors", activeThreadId === thread.id ? "text-indigo-900 font-black" : "font-bold text-slate-700")}>{thread.customer?.name}</h4>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                    {formatDistanceToNow(new Date(thread.updated_at), { addSuffix: false })}
                  </span>
                </div>
                <p className={cn(
                  "text-[11px] truncate leading-tight",
                  thread.unread_count > 0 ? "text-slate-900 font-bold" : "text-slate-400 font-medium"
                )}>
                  {thread.last_message || 'No messages yet'}
                </p>
              </div>
            </button>
          ))}
          {!threadsLoading && threads.length === 0 && (
            <div className="p-12 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">
              Inbox is empty
            </div>
          )}
        </div>
      </div>

      {/* Center: Conversation Panel */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {!activeThreadId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
            <Mail size={48} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="text-xs font-black uppercase tracking-widest">Select a conversation to start</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
               <div className="flex items-center gap-3">
                  <h3 className="font-black text-slate-800 tracking-tight text-sm uppercase">{activeThread?.customer?.name}</h3>
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
                    msg.sender_id === user?.id ? "ml-auto items-end" : "items-start"
                  )}>
                     <div className={cn(
                       "p-4 rounded-2xl text-sm shadow-sm transition-all",
                       msg.sender_id === user?.id 
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-100" 
                        : "bg-white border border-slate-200 rounded-tl-none"
                     )}>
                        <p className="leading-relaxed">{msg.content?.text || msg.content}</p>
                     </div>
                     <span className="text-[9px] text-slate-400 mt-2 uppercase font-black tracking-[0.1em]">
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                     </span>
                  </div>
               ))}
               <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
               <div className="bg-slate-100 rounded-2xl p-1.5 flex items-center gap-1 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all border border-transparent focus-within:border-indigo-100 shadow-inner">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                     <Paperclip size={18} />
                  </button>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={`Type a message to ${activeThread?.customer?.name}...`}
                    className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-[13px] py-2 px-1 font-medium placeholder:text-slate-400"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="bg-indigo-600 text-white p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:scale-100"
                  >
                     <Send size={18} />
                  </button>
               </div>
            </div>
          </>
        )}
      </div>

      {/* Right Sidebar: Customer Snapshot */}
      <div className="w-80 border-l border-slate-100 flex flex-col shrink-0 overflow-y-auto hidden xl:flex bg-white">
         {activeThread ? (
           <>
             <div className="p-8 text-center border-b border-slate-50">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 mx-auto mb-4 overflow-hidden border-4 border-slate-50 shadow-xl shadow-slate-100 flex items-center justify-center text-2xl font-black text-slate-300 uppercase">
                   {activeThread.customer?.name.substring(0, 2)}
                </div>
                <h4 className="font-black text-slate-800 text-lg tracking-tight">{activeThread.customer?.name}</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Status: {activeThread.customer?.status || 'Active'}</p>
             </div>

             <div className="p-6 space-y-8 flex-1">
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 leading-none">Net Rev</p>
                      <p className="text-xl font-black text-slate-800 leading-none tracking-tight">$0</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 leading-none">Record</p>
                      <p className="text-xl font-black text-slate-800 leading-none tracking-tight">New</p>
                   </div>
                </div>

                <div>
                   <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
                      Linked Records
                      <ChevronRight size={14} className="text-slate-300" />
                   </h5>
                   <div className="space-y-2.5">
                      <div className="p-12 text-center text-[9px] font-black text-slate-300 uppercase tracking-widest">No records found</div>
                   </div>
                </div>
             </div>
           </>
         ) : (
           <div className="flex-1 flex items-center justify-center p-12 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">
              Customer snapshot will appear here
           </div>
         )}
      </div>
    </div>
  );
}
;
}
