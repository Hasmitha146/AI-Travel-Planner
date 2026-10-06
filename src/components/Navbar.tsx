import React from 'react';
import { Compass, Key, Sparkles, Cpu, PlusCircle } from 'lucide-react';

interface NavbarProps {
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
  isExecuting: boolean;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasApiKey,
  onOpenApiKeyModal,
  isExecuting,
  onReset
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 px-4 sm:px-8 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-outfit">
                AI TRAVEL <span className="text-indigo-400">PLANNER</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Multi-Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Autonomous Specialized Sub-Agents
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>6 Agents Ready</span>
          </div>

          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              hasApiKey
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            <Key className={`w-3.5 h-3.5 ${hasApiKey ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{hasApiKey ? 'Gemini Active' : 'API Key'}</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </button>

          <button
            onClick={onReset}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all disabled:opacity-50"
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>New Trip</span>
          </button>

        </div>

      </div>
    </header>
  );
};
