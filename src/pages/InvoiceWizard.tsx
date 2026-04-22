import React, { useState, useMemo } from 'react';
import { 
  Upload, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  DollarSign, 
  Package, 
  Palette,
  Info,
  AlertTriangle,
  Truck,
  FileText,
  BadgePercent
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const steps = ['Artwork', 'Product Specs', 'Shipping', 'Pricing', 'Review'];

const basePrices: Record<string, number> = {
  'Embroidered High-Def': 1.50,
  'PVC Rubber (3D)': 2.50,
  'Chenille (Vintage)': 2.00,
  'Woven Detail': 1.20,
  'Laser-Cut Leather': 3.00
};

const sizeMultipliers: Record<string, number> = {
  '2x2': 0.8,
  '3x3': 1.0,
  '4x4': 1.5,
  '5x5': 2.0,
};

const rushFees: Record<string, number> = {
  'Standard (14 Days)': 0,
  'Expedited (7 Days)': 50,
  'Rush (3 Days)': 150,
};

export default function InvoiceWizard({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    patchType: 'Embroidered High-Def',
    size: '3x3',
    quantity: 100,
    backing: 'Iron-on',
    turnaround: 'Standard (14 Days)',
    shippingDestination: 'USA - Domestic',
    margin: 68
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  // Calculations
  const calculated = useMemo(() => {
    const baseUnit = basePrices[formData.patchType] || 1.5;
    const sizeMult = sizeMultipliers[formData.size] || 1.0;
    const unitPrice = baseUnit * sizeMult;
    const subtotal = unitPrice * formData.quantity;
    const rushFee = rushFees[formData.turnaround] || 0;
    const total = subtotal + rushFee;
    
    // Profit margin calc
    const profit = total * (formData.margin / 100);

    return {
      unitPrice,
      subtotal,
      rushFee,
      total,
      profit
    };
  }, [formData]);

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 px-12">
        {steps.map((step, i) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center relative z-10 cursor-pointer" onClick={() => i < currentStep && setCurrentStep(i)}>
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
          <div className="flex-1 p-10 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full"
              >
                {/* STEP 0: ARTWORK */}
                {currentStep === 0 && (
                  <div className="space-y-8 h-full flex flex-col">
                    <div className="border-b border-slate-50 pb-6 mb-2">
                       <h3 className="text-xl font-black text-slate-800 tracking-tight">Upload Artwork</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Submit vector designs for digitizing</p>
                    </div>
                    <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-[28px] bg-slate-50/50 flex flex-col items-center justify-center flex-1 transition-colors hover:border-indigo-300 hover:bg-slate-50 group cursor-pointer">
                      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-slate-200/50 mb-6 border border-slate-100 text-slate-300 group-hover:text-indigo-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                         <Upload size={36} />
                      </div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest max-w-sm mb-6 leading-loose text-center">Drag and drop high-res vector files<br/>AI, PDF, or DXF preferred.</p>
                      <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95 pointer-events-none">
                         Browse Local Files
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 1: SPECS */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="border-b border-slate-50 pb-6 mb-8">
                       <h3 className="text-xl font-black text-slate-800 tracking-tight">Configure Build Options</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Select physical product specifications</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Patch Technology</label>
                          <select 
                            className="w-full bg-slate-100 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-slate-700 transition-all cursor-pointer appearance-none px-6"
                            value={formData.patchType}
                            onChange={e => setFormData({...formData, patchType: e.target.value})}
                          >
                             {Object.keys(basePrices).map(type => <option key={type} value={type}>{type}</option>)}
                          </select>
                       </div>
                       
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Estimated Size</label>
                          <select 
                            className="w-full bg-slate-100 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-slate-700 transition-all cursor-pointer appearance-none px-6"
                            value={formData.size}
                            onChange={e => setFormData({...formData, size: e.target.value})}
                          >
                             {Object.keys(sizeMultipliers).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                       </div>

                       <div className="space-y-3 col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Fixing Method</label>
                          <select 
                            className="w-full bg-slate-100 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-slate-700 transition-all cursor-pointer appearance-none px-6"
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
                       <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 flex gap-4 text-rose-800 shadow-sm shadow-rose-50 animate-in fade-in slide-in-from-bottom-2">
                          <AlertTriangle className="shrink-0 text-rose-500" size={24} />
                          <div className="text-[11px] font-bold leading-relaxed">
                             <p className="uppercase tracking-widest mb-1">Production Incompatibility</p>
                             <p className="opacity-70">PVC combined with high-heat Iron-on backing has a 42% failure rate. We strongly recommend selecting Velcro.</p>
                          </div>
                       </div>
                    )}
                  </div>
                )}

                {/* STEP 2: SHIPPING & QTY */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div className="border-b border-slate-50 pb-6 mb-8">
                       <h3 className="text-xl font-black text-slate-800 tracking-tight">Logistics & Scale</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Determine volume and delivery speed</p>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Production Volume</label>
                            <span className="text-2xl font-black text-indigo-600">{formData.quantity} Units</span>
                          </div>
                          <input 
                            type="range" 
                            min="50" max="5000" step="50"
                            value={formData.quantity}
                            onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 px-2">
                            <span>50 (Min)</span>
                            <span>5,000+</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Turnaround Time</label>
                            <select 
                              className="w-full bg-slate-100 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-slate-700 transition-all cursor-pointer appearance-none px-6"
                              value={formData.turnaround}
                              onChange={e => setFormData({...formData, turnaround: e.target.value})}
                            >
                               {Object.keys(rushFees).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Destination Region</label>
                            <select 
                              className="w-full bg-slate-100 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-slate-700 transition-all cursor-pointer appearance-none px-6"
                              value={formData.shippingDestination}
                              onChange={e => setFormData({...formData, shippingDestination: e.target.value})}
                            >
                               <option>USA - Domestic (Free)</option>
                               <option>Canada / Mexico</option>
                               <option>Europe / UK</option>
                               <option>Rest of World</option>
                            </select>
                         </div>
                       </div>
                       
                       {formData.turnaround.includes('Rush') && (
                          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-4 text-amber-800 text-xs font-bold">
                            <Truck className="shrink-0 text-amber-500" />
                            Rush processing adds a ${rushFees['Rush (3 Days)']} flat expediting fee to the invoice.
                          </div>
                       )}
                    </div>
                  </div>
                )}

                {/* STEP 3: PRICING */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="border-b border-slate-50 pb-6 mb-8 flex justify-between items-end">
                       <div>
                         <h3 className="text-xl font-black text-slate-800 tracking-tight">Financials</h3>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Review costs and adjust margins</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Unit Cost</p>
                         <p className="text-xl font-black text-emerald-500">${calculated.unitPrice.toFixed(2)} Base</p>
                       </div>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-6 space-y-4 border border-slate-100">
                       <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                         <span>Subtotal ({formData.quantity} units)</span>
                         <span>${calculated.subtotal.toFixed(2)}</span>
                       </div>
                       {calculated.rushFee > 0 && (
                         <div className="flex justify-between items-center text-sm font-bold text-rose-500">
                           <span>Expediting Fee ({formData.turnaround})</span>
                           <span>+ ${calculated.rushFee.toFixed(2)}</span>
                         </div>
                       )}
                       <div className="flex justify-between items-center text-sm font-bold text-emerald-600 border-b border-slate-200 pb-4">
                         <span>Logistics ({formData.shippingDestination})</span>
                         <span>INCLUDED</span>
                       </div>
                       <div className="flex justify-between items-center pt-2">
                         <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800">Total Client Invoice</span>
                         <span className="text-2xl font-black text-slate-900">${calculated.total.toFixed(2)}</span>
                       </div>
                    </div>

                    <div className="space-y-4 pt-4">
                       <div className="flex justify-between items-center">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                           <BadgePercent size={14}/> Target Margin
                         </label>
                         <span className="text-sm font-black text-indigo-600">{formData.margin}%</span>
                       </div>
                       <input 
                         type="range" 
                         min="20" max="90" step="1"
                         value={formData.margin}
                         onChange={e => setFormData({...formData, margin: parseInt(e.target.value)})}
                         className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                       />
                       <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
                         Estimated Profit: <span className="text-emerald-500 font-black">${calculated.profit.toFixed(2)}</span>
                       </p>
                    </div>
                  </div>
                )}

                {/* STEP 4: REVIEW */}
                {currentStep === 4 && (
                  <div className="space-y-8">
                    <div className="border-b border-slate-50 pb-6 mb-8 text-center">
                       <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 scale-110">
                         <Check size={32} strokeWidth={3} />
                       </div>
                       <h3 className="text-xl font-black text-slate-800 tracking-tight">Ready to Deploy</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Review final invoice before generating link</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Product</p>
                         <p className="font-bold text-sm text-slate-800 line-clamp-1">{formData.patchType}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Scale</p>
                         <p className="font-bold text-sm text-slate-800">{formData.quantity} Units @ {formData.size}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Logistics</p>
                         <p className="font-bold text-sm text-slate-800">{formData.shippingDestination} • {formData.turnaround}</p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-center justify-between">
                       <div className="flex items-center gap-3 text-indigo-800 font-black">
                         <FileText size={20} />
                         Invoice #INV-2993
                       </div>
                       <div className="text-2xl font-black text-indigo-900 tracking-tighter">
                         ${calculated.total.toFixed(2)}
                       </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-6 border-t border-slate-100 flex justify-between bg-white shrink-0">
             <button 
               onClick={prevStep}
               disabled={currentStep === 0}
               className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[11px] text-slate-400 uppercase tracking-widest hover:text-slate-800 hover:bg-slate-50 disabled:opacity-0 transition-all"
             >
                <ChevronLeft size={16} /> Back
             </button>
             <button 
               onClick={() => {
                 if (currentStep === steps.length - 1) {
                   if (onComplete) onComplete();
                 } else {
                   nextStep();
                 }
               }}
               className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95"
             >
                {currentStep === steps.length - 1 ? 'Generate Invoice Link' : 'Continue Build'} <ChevronRight size={16} />
             </button>
          </div>
        </div>

        {/* Live Summary Sidebar */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 sticky top-24">
           <h3 className="font-black text-slate-800 text-xs uppercase tracking-[0.2em] mb-8 border-b border-slate-50 pb-5">Live Intelligence</h3>
           
           <div className="space-y-6">
              <div className="flex justify-between items-start group">
                 <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1 leading-none">Selected Tech</p>
                    <p className="font-black text-slate-800 text-sm leading-tight max-w-[150px]">{formData.patchType}</p>
                 </div>
                 <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <Palette size={14} />
                 </div>
              </div>
              <div className="flex justify-between items-start group">
                 <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1 leading-none">Specs & Backing</p>
                    <p className="font-black text-slate-800 text-sm leading-tight">{formData.size} • {formData.backing.split(' ')[0]}</p>
                 </div>
                 <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <Info size={14} />
                 </div>
              </div>
              <div className="flex justify-between items-start group">
                 <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1 leading-none">Job Scale</p>
                    <p className="font-black text-slate-800 text-sm leading-tight">{formData.quantity.toLocaleString()} Custom Units</p>
                 </div>
                 <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <Package size={14} />
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                 <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Subtotal</span>
                    <span className="font-black text-slate-800 text-sm leading-none">${calculated.subtotal.toFixed(2)}</span>
                 </div>
                 {calculated.rushFee > 0 && (
                   <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rush Fee</span>
                      <span className="font-black text-amber-500 text-sm leading-none">+${calculated.rushFee.toFixed(2)}</span>
                   </div>
                 )}
                 <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics</span>
                    <span className="font-black text-emerald-500 text-[9px] uppercase tracking-[0.2em] border border-emerald-100 px-2 py-0.5 rounded-full bg-emerald-50/50 leading-none">FREE</span>
                 </div>
                 
                 <div className="flex flex-col items-center mt-8 p-5 bg-slate-50 rounded-[24px] border border-slate-100 shadow-inner">
                    <div className="flex flex-col items-center mb-5">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Estimated Investment</span>
                       <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">${calculated.total.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full p-3.5 bg-white rounded-2xl shadow-sm border border-slate-100">
                       <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100 border-2 border-emerald-400/20 shrink-0">
                          <DollarSign size={14} strokeWidth={3} />
                       </div>
                       <div className="flex-1 overflow-hidden">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Net Profit Margin</p>
                          <p className="font-black text-slate-800 text-sm leading-none tracking-tight truncate">{formData.margin}% <span className="text-[9px] text-emerald-500 font-black ml-0.5 uppercase tracking-tighter">(${calculated.profit.toFixed(2)})</span></p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
