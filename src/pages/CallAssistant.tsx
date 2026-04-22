import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Pause, 
  PhoneOff, 
  CheckCircle2, 
  AlertTriangle,
  Save,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function CallAssistant() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  React.useEffect(() => {
    let interval: any;
    if (!isPaused) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const [warnings, setWarnings] = useState<string[]>([]);
  const [patchType, setPatchType] = useState('Embroidered');
  const [borderType, setBorderType] = useState('');
  const [backingType, setBackingType] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  React.useEffect(() => {
    const newWarnings = [];
    if (patchType === 'Leather' && borderType === 'Merrow') {
      newWarnings.push('Merrow border is NOT possible on leather patches. Do not proceed with this combination. Redirect client to alternative border options in your follow-up email.');
    }
    if (patchType === 'PVC' && backingType === 'Iron-On') {
      newWarnings.push('PVC with iron-on backing requires the client to verbally confirm they understand heat application risk.');
    }
    if (parseFloat(width) > 6 || parseFloat(height) > 6) {
      newWarnings.push('Maximum patch size is 6x6 inches. You must offer a proportional alternative.');
    }
    setWarnings(newWarnings);
  }, [patchType, borderType, backingType, width, height]);

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-slate-50 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white h-14 flex items-center justify-between px-6 shrink-0 z-10 shadow-md">
        <div>
          <h1 className="text-[17px] font-bold">Acme Corp</h1>
          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
            <span>+1 (555) 123-4567</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>The American Patch</span>
          </div>
        </div>
        
        <div className="text-2xl font-mono text-white tracking-widest pl-20">
          {formatTime(timer)}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPaused(!isPaused)} 
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <Pause size={18} />
          </button>
          <button 
            onClick={() => navigate('/leads')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            <PhoneOff size={16} />
            End Call & Save
          </button>
        </div>
      </div>

      {/* Main Content Columns */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Col 1: Call Brief */}
        <div className="w-[28%] bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
          <div className="p-6 space-y-6">
            <h2 className="text-xs uppercase tracking-[0.1em] text-slate-500 font-bold mb-4">Call Brief</h2>
            
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Client</h3>
                <p className="text-base font-bold">Acme Corp</p>
                <div className="text-sm text-slate-600 mt-1">
                  <p>john@acmecorp.com</p>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold">
                    New Client
                  </span>
                </div>
              </div>

              <div className="border-l-4 border-amber-500 bg-white rounded-r-xl border-y border-r border-slate-200 p-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Your Goal</h3>
                <ol className="list-decimal pl-4 space-y-1.5 text-sm text-slate-700">
                  <li>Confirm all order details</li>
                  <li>Deliver an invoice (via email after call)</li>
                  <li>Upsell: suggest higher quantity for better unit rate</li>
                </ol>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer select-none">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <AlertTriangle size={16} className="text-amber-500"/>
                      Product Rules (tap to expand)
                    </div>
                    <ChevronDown size={16} className="text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-4 text-sm text-slate-600 bg-white border-t border-slate-200">
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>Merrow border:</strong> not possible on leather</li>
                      <li><strong>PVC iron-on:</strong> allowed — must confirm heat risk</li>
                      <li><strong>Metallic + velcro:</strong> not recommended</li>
                      <li><strong>Max size:</strong> 6x6 inches</li>
                    </ul>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: Live Checklist */}
        <div className="w-[42%] bg-slate-50 flex flex-col overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xs uppercase tracking-[0.1em] text-slate-500 font-bold mb-4">Questions to Ask</h2>
            
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">1. Open the call</h4>
                    <p className="text-[13px] text-slate-600 mt-1">"Hi [Client], this is [Name] from The American Patch. I'm calling about your patch invoice request — do you have about 30 seconds?"</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <div className="w-full">
                    <h4 className="text-sm font-bold text-slate-800">2. Confirm patch type</h4>
                    <p className="text-[13px] text-slate-600 mt-1">"What type of patches are you looking for?"</p>
                    <select 
                      value={patchType}
                      onChange={e => setPatchType(e.target.value)}
                      className="mt-3 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Embroidered</option>
                      <option>PVC</option>
                      <option>Leather</option>
                      <option>Woven</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <div className="w-full">
                    <h4 className="text-sm font-bold text-slate-800">3. Confirm dimensions</h4>
                    <p className="text-[13px] text-slate-600 mt-1">"What size do you need? Width and height in inches."</p>
                    <div className="mt-3 flex gap-3">
                      <input 
                        type="number" 
                        placeholder="Width" 
                        value={width}
                        onChange={e => setWidth(e.target.value)}
                        className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500"
                      />
                      <input 
                        type="number" 
                        placeholder="Height" 
                        value={height}
                        onChange={e => setHeight(e.target.value)}
                        className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <div className="w-full">
                    <h4 className="text-sm font-bold text-slate-800">4. Confirm borders & backing</h4>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <select 
                        value={borderType}
                        onChange={e => setBorderType(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500"
                      >
                        <option value="">Select Border</option>
                        <option>Merrow</option>
                        <option>Laser Cut</option>
                        <option>Hot Cut</option>
                      </select>
                      <select 
                        value={backingType}
                        onChange={e => setBackingType(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500"
                      >
                        <option value="">Select Backing</option>
                        <option>Iron-On</option>
                        <option>Velcro (Hook)</option>
                        <option>Sew-On</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Upsell Example */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <div className="w-full">
                    <h4 className="text-sm font-bold text-slate-800">5. Confirm quantity</h4>
                    <input type="number" placeholder="Quantity" className="mt-3 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500" />
                    
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                       <span className="text-amber-500 text-lg leading-none">💡</span>
                       <p className="text-xs text-amber-800 font-medium">Upsell: More pieces = lower unit cost. If they say 50, suggest 100.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warnings Panel */}
            <AnimatePresence>
              {warnings.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 border-l-4 border-red-500 bg-red-50 rounded-r-xl overflow-hidden shadow-sm"
                >
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
                      <AlertTriangle size={16} /> Conflict Warnings
                    </h3>
                    <ul className="space-y-2">
                      {warnings.map((w, i) => (
                        <li key={i} className="text-xs text-red-700 flex items-start gap-2">
                          <span className="mt-0.5">⛔</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Col 3: Notes & Next Step */}
        <div className="w-[30%] bg-white border-l border-slate-200 flex flex-col p-6 overflow-y-auto">
          <h2 className="text-xs uppercase tracking-[0.1em] text-slate-500 font-bold mb-4">Call Notes</h2>
          <textarea 
            className="w-full min-h-[200px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none mb-6"
            placeholder="Notes as you go — no formatting needed. Auto-saved every 10 seconds."
          ></textarea>

          <h2 className="text-xs uppercase tracking-[0.1em] text-slate-500 font-bold mb-4">Upsell Tracker</h2>
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700">Quantity upsell mentioned?</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="upsell1" className="text-blue-600 focus:ring-blue-500" /> Yes
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="upsell1" className="text-blue-600 focus:ring-blue-500" /> No
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700">Add-on suggested?</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="upsell2" className="text-blue-600 focus:ring-blue-500" /> Yes
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="upsell2" className="text-blue-600 focus:ring-blue-500" /> No
                </label>
              </div>
            </div>
          </div>

          <h2 className="text-xs uppercase tracking-[0.1em] text-slate-500 font-bold mb-4">Next Step</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">What is the next step?</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500">
                <option>Sending invoice by email</option>
                <option>Sending revised invoice</option>
                <option>Follow-up call</option>
                <option>Close — no sale</option>
              </select>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button 
              onClick={() => navigate('/leads')}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-red-100 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              End Call & Save
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
