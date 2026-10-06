import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

interface TopHeaderProps {
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenApiKeyModal, hasApiKey }) => {
  return (
    <header className="w-full bg-white border-b border-slate-200/80 px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      
      {/* Search Input Bar */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search destinations..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 border-none text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
        />
      </div>

      {/* Right Controls: Bell Notification & User Avatar Pill */}
      <div className="flex items-center gap-4">
        
        {/* API Key Status Indicator */}
        <button
          onClick={onOpenApiKeyModal}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            hasApiKey
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
          }`}
        >
          {hasApiKey ? 'Gemini API Active' : 'Configure API Key'}
        </button>

        {/* Bell Notification */}
        <button className="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 border-2 border-white" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-[#0e1a38] text-white font-bold flex items-center justify-center text-sm shadow-xs">
            H
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 font-sans group-hover:text-blue-600 transition-colors">
            <span>Hello, <strong className="font-bold text-slate-900">Hasmitha</strong></span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>

      </div>

    </header>
  );
};
