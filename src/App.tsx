import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import { motion, AnimatePresence } from 'motion/react';

// Pages
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import SharedInbox from './pages/SharedInbox';
import InvoiceWizard from './pages/InvoiceWizard';
import ProductionBoard from './pages/ProductionBoard';
import DesignBoard from './pages/DesignBoard';
import Orders from './pages/Orders';
import QA from './pages/QA';
import LoginPage from './pages/Login';
import Reports from './pages/Reports';
import ShippingDashboard from './pages/ShippingDashboard';
import Vendors from './pages/Vendors';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import CallAssistant from './pages/CallAssistant';
import Inventory from './pages/Inventory';
import Pricing from './pages/Pricing';
import ActivityLog from './pages/ActivityLog';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <AppShell>
         {/* Command Palette Modal */}
         <AnimatePresence>
            {isCommandPaletteOpen && (
               <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsCommandPaletteOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-white rounded-3xl shadow-2xl z-[110] overflow-hidden border border-[#E5E7EB]"
                  >
                     <div className="p-6 border-b border-[#F3F4F6] flex items-center gap-4">
                        <span className="text-gray-400 font-bold uppercase text-[10px] bg-gray-100 px-2 py-1 rounded">Search</span>
                        <input 
                          autoFocus
                          type="text" 
                          placeholder="What can I help you find..." 
                          className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-lg font-medium"
                        />
                     </div>
                     <div className="p-4 max-h-[400px] overflow-y-auto">
                        <div className="space-y-6">
                           <div>
                              <h5 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-2 mb-3">Suggested Actions</h5>
                              <div className="space-y-1">
                                 <CommandItem label="Create New Invoice" icon="+" shortcut="Q" />
                                 <CommandItem label="Register New Lead" icon="L" shortcut="N" />
                                 <CommandItem label="Open Shared Inbox" icon="I" shortcut="S" />
                              </div>
                           </div>
                           <div>
                              <h5 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-2 mb-3">Recent Records</h5>
                              <div className="space-y-1">
                                 <CommandItem label="Order #TAP-1025" icon="#" />
                                 <CommandItem label="Lead #LD-8821 (Acme Corp)" icon="#" />
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="p-4 bg-gray-50 border-t border-[#F3F4F6] flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>ESC to close</span>
                        <span>ENTER to select</span>
                     </div>
                  </motion.div>
               </>
            )}
         </AnimatePresence>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/inbox" element={<SharedInbox />} />
          <Route path="/invoices" element={<InvoiceWizard />} />
          <Route path="/production" element={<ProductionBoard />} />
          <Route path="/design" element={<DesignBoard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/qa" element={<QA />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/shipping" element={<ShippingDashboard />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/activity" element={<ActivityLog />} />
          <Route path="/call-assistant/:leadId?" element={<CallAssistant />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </Router>
  );
}


function CommandItem({ label, icon, shortcut }: any) {
   return (
      <button className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-black hover:text-white transition-all text-left group">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-black border border-gray-200 group-hover:bg-white/10 group-hover:border-white/20 group-hover:text-white">
               {icon}
            </div>
            <span className="text-sm font-bold">{label}</span>
         </div>
         {shortcut && <span className="text-[10px] font-bold opacity-40 uppercase">⌘{shortcut}</span>}
      </button>
   );
}



function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
      <h2 className="text-3xl font-bold mb-2 text-black">{name}</h2>
      <p>This module is currently being built...</p>
    </div>
  );
}

