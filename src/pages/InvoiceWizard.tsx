import React from 'react';
import { 
  Upload, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  DollarSign, 
  Package, 
  Palette,
  Info,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const steps = ['Artwork', 'Product Specs', 'Shipping & Qty', 'Pricing', 'Review'];

export default function InvoiceWizard() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    patchType: 'Embroidered',
    size: '3x3',
    quantity: 100,
    backing: 'Iron-on',
    turnaround: 'Standard',
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 px-12">
        {steps.map((step, i) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center relative z-10">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 shadow-sm border-2",
                i <= currentStep ? "bg-indigo-600 border-indigo-600 text-white scale-110 shadow-indigo-100" : "bg-white border-slate-100 text-slate-300"
              )}>
                {i < currentStep ? <Check size={20} strokeWidth={3} /> : i + 1}
              </div>
              <span className={cn(
                "text-[10px] uppercase tracking-[0.2em] font-black mt-4 absolute -bottom-8 whitespace-nowrap transition-colors",
                i <= currentStep ? "text-slate-800" : "text-slate-300"
              )}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-1 mx-2 rounded-full transition-all duration-700",
                i < currentStep ? "bg-gradient-to-r from-indigo-600 to-indigo-500" : "bg-slate-100"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-20">
        {/* Main Content */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[520px]">
          <div className="flex-1 p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full"
              >
                {currentStep === 0 && (
                  <div className="space-y-8 h-full flex flex-col">
                    <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[28px] bg-slate-50/50 flex flex-col items-center justify-center flex-1 transition-colors hover:border-indigo-200 group">
                      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-slate-200/50 mb-6 border border-slate-100 text-slate-300 group-hover:text-indigo-400 group-hover:scale-110 transition-all">
                         <Upload size={36} />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Upload Artwork</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest max-w-sm mb-8 leading-loose text-center">Drag and drop high-res vector files<br/>AI, PDF, or DXF preferred.</p>
                      <button className="px-10 py-3.5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95">
                         Browse Local Files
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="border-b border-slate-50 pb-6 mb-8">
                       <h3 className="text-xl font-black text-slate-800 tracking-tight">Configure Build Options</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Select your physical product specifications</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Patch Technology</label>
                          <select 
                            className="w-full bg-slate-100 border-none rounded-full p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-bold text-slate-700 transition-all cursor-pointer appearance-none px-6"
                            value={formData.patchType}
                            onChange={e => setFormData({...formData, patchType: e.target.value})}
                          >
                             <option>Embroidered High-Def</option>
                             <option>PVC Rubber (3D)</option>
                             <option>Chenille (Vintage)</option>
                             <option>Woven Detail</option>
                             <option>Laser-Cut Leather</option>
                          </select>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Fixing Method</label>
                          <select 
                            className="w-full bg-slate-100 border-none rounded-full p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-bold text-slate-700 transition-all cursor-pointer appearance-none px-6"
                            value={formData.backing}
                            onChange={e => setFormData({...formData, backing: e.target.value})}
                          >
                             <option>Heat Seal (Iron-on)</option>
                             <option>Velcro Tactical (Hook & Loop)</option>
                             <option>Adhesive Backing</option>
                             <option>Sew-on Professional</option>
                          </select>
                       </div>
                    </div>
                    
                    {formData.patchType.includes('PVC') && formData.backing.includes('Iron-on') && (
                       <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 flex gap-4 text-rose-800 shadow-sm shadow-rose-50">
                          <AlertTriangle className="shrink-0 text-rose-500" size={24} />
                          <div className="text-[11px] font-bold leading-relaxed">
                             <p className="uppercase tracking-widest mb-1">Production Incompatibility Warning</p>
                             <p className="opacity-70">PVC material combined with high-heat Iron-on backing has a 42% failure rate in QA. We strongly recommend selecting Velcro or Adhesive backings for PVC projects.</p>
                          </div>
                       </div>
                    )}
                  </div>
                )}

                {currentStep > 1 && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 py-20 bg-slate-50/50 rounded-[28px] border-2 border-dashed border-slate-100">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 mb-6">
                       <Check size={32} className="text-indigo-600" strokeWidth={3} />
                    </div>
                    <p className="text-slate-800 font-black uppercase tracking-[0.3em] text-xs">Section Ready</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Logic Handlers Operational</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-8 border-t border-slate-100 flex justify-between bg-white shrink-0">
             <button 
               onClick={prevStep}
               disabled={currentStep === 0}
               className="flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-[11px] text-slate-400 uppercase tracking-widest hover:text-slate-800 hover:bg-slate-50 disabled:opacity-0 transition-all"
             >
                <ChevronLeft size={16} /> Back
             </button>
             <button 
               onClick={nextStep}
               className="flex items-center gap-2 px-10 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95"
             >
                {currentStep === steps.length - 1 ? 'Finalize Invoice' : 'Continue Build'} <ChevronRight size={16} />
             </button>
          </div>
        </div>

        {/* Live Summary Sidebar */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10 sticky top-24">
           <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight mb-8 border-b border-slate-50 pb-6">Live Intelligence Summary</h3>
           
           <div className="space-y-8">
              <div className="flex justify-between items-start group">
                 <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1.5 leading-none">Selected Tech</p>
                    <p className="font-black text-slate-800 text-sm leading-tight">{formData.patchType}</p>
                 </div>
                 <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <Palette size={16} />
                 </div>
              </div>
              <div className="flex justify-between items-start group">
                 <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1.5 leading-none">Specs & Backing</p>
                    <p className="font-black text-slate-800 text-sm leading-tight">{formData.size} • {formData.backing.split(' ')[0]}</p>
                 </div>
                 <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <Info size={16} />
                 </div>
              </div>
              <div className="flex justify-between items-start group">
                 <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1.5 leading-none">Initial Batch</p>
                    <p className="font-black text-slate-800 text-sm leading-tight">{formData.quantity} Custom Units</p>
                 </div>
                 <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <Package size={16} />
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-50">
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Subtotal</span>
                    <span className="font-black text-slate-800 text-sm leading-none">$420.00</span>
                 </div>
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inland Logistics</span>
                    <span className="font-black text-emerald-500 text-[10px] uppercase tracking-[0.2em] border border-emerald-100 px-2.5 py-1 rounded-full bg-emerald-50/50 leading-none">FREE</span>
                 </div>
                 <div className="flex flex-col items-center mt-10 p-6 bg-slate-50 rounded-[28px] border border-slate-100 shadow-inner">
                    <div className="flex flex-col items-center mb-6">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Estimated Investment</span>
                       <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">$420.00</span>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                       <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100 border-2 border-emerald-400/20">
                          <DollarSign size={18} strokeWidth={3} />
                       </div>
                       <div className="flex-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Net Profit Margin</p>
                          <p className="font-black text-slate-800 text-base leading-none tracking-tight">68% <span className="text-[10px] text-emerald-500 font-black ml-1 uppercase tracking-tighter">($285.60)</span></p>
                       </div>
                    </div>
                 </div>
                 
                 <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] mt-8 flex items-center justify-center gap-2">
                    <span className="w-4 h-4 bg-slate-100 rounded-md border border-slate-200" /> Secure Payment via Stripe Verified
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
