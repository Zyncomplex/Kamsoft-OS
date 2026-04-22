import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  FileText, 
  ShoppingCart, 
  Palette, 
  Factory, 
  Truck, 
  ShieldCheck, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  Plus, 
  ChevronDown,
  LogOut,
  Menu,
  X,
  Globe,
  Package,
  Clock
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Leads', path: '/leads' },
  { icon: MessageSquare, label: 'Messages', path: '/inbox' },
  { icon: FileText, label: 'Invoices', path: '/invoices' },
  { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { icon: Palette, label: 'Design', path: '/design' },
  { icon: Factory, label: 'Manufacturing', path: '/production' },
  { icon: Globe, label: 'Suppliers', path: '/vendors' },
  { icon: ShieldCheck, label: 'Quality Check', path: '/qa' },
  { icon: Truck, label: 'Shipping', path: '/shipping' },
  { icon: Users, label: 'Clients', path: '/clients' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Clock, label: 'Activity Log', path: '/activity' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

function Logo({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-transparent overflow-hidden">
        {hasError ? (
          <span className="text-indigo-900 font-black text-lg bg-indigo-50 rounded-lg w-full h-full flex items-center justify-center">K</span>
        ) : (
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-full h-full object-contain" 
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
          />
        )}
      </div>
      {isSidebarOpen && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-black text-xl tracking-tighter text-indigo-900 whitespace-nowrap uppercase"
        >
          Operations
        </motion.span>
      )}
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 240 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col z-50 overflow-hidden shadow-sm"
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-100 h-16 shrink-0">
          <Logo isSidebarOpen={isSidebarOpen} />
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-slate-50 rounded-md shrink-0 lg:block hidden transition-colors"
          >
            {isSidebarOpen ? <X size={18} className="text-slate-400" /> : <Menu size={18} className="text-slate-400" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1 scrollbar-hide">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative text-sm",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 font-semibold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                )}
              >
                <item.icon size={18} className={cn("shrink-0", isActive ? "opacity-100" : "opacity-60")} />
                {isSidebarOpen && (
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="whitespace-nowrap"
                    >
                        {item.label}
                    </motion.span>
                )}
                {!isSidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] font-bold">
                        {item.label}
                    </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
              <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" referrerPolicy="no-referrer" />
            </div>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden"
              >
                <p className="text-xs font-bold truncate">Ikhlaque A.</p>
                <p className="text-[10px] text-slate-400 truncate tracking-wide">CEO / Super Admin</p>
              </motion.div>
            )}
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('app_authenticated');
              window.location.reload();
            }}
            className={cn(
            "flex items-center gap-3 w-full p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-sm font-medium",
            !isSidebarOpen && "justify-center"
          )}>
            <LogOut size={18} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40 shrink-0">
          <div className="flex flex-col">
             <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none mb-1">Admin Console</p>
             <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
                {sidebarItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
             </h1>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search leads, orders... (Cmd+K)" 
                className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center relative group">
               <select className="appearance-none bg-transparent hover:bg-slate-50 border-none rounded-lg py-1.5 pl-3 pr-8 text-xs font-bold text-slate-500 tracking-wider cursor-pointer outline-none transition-colors">
                  <option value="USD">$ USD</option>
                  <option value="GBP">£ GBP</option>
                  <option value="NZD">$ NZD</option>
                  <option value="AUD">$ AUD</option>
                  <option value="CAD">$ CAD</option>
               </select>
               <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={12} />
               </div>
            </div>
            
            <div className="relative group">
               <select className="appearance-none bg-transparent hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg py-1.5 pl-3 pr-8 text-sm font-black text-slate-800 tracking-tight cursor-pointer outline-none transition-colors max-w-[220px]">
                  <option>The American Patch</option>
                  <option>The Eagle Patch</option>
                  <option>Eagle Patch UK</option>
                  <option>Embroidered Patch</option>
                  <option>Patch Makers CA</option>
                  <option>Embroidered Patch NZ</option>
               </select>
               <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={14} />
               </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
           <AnimatePresence mode="wait">
             <motion.div
               key={location.pathname}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
             >
                {children}
             </motion.div>
           </AnimatePresence>
        </main>
      </div>
    </div>

  );
}
