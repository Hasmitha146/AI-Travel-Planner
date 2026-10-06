import React from 'react';
import { Plane, Home, Compass, Bookmark, User, Mountain } from 'lucide-react';

interface SidebarProps {
  activeTab: 'home' | 'my-trips' | 'saved' | 'profile';
  setActiveTab: (tab: 'home' | 'my-trips' | 'saved' | 'profile') => void;
  onResetHome: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onResetHome
}) => {
  return (
    <aside className="w-64 bg-[#0e1a38] text-white flex flex-col justify-between p-6 shrink-0 min-h-screen border-r border-slate-800">
      
      {/* Top Logo & Navigation Menu */}
      <div className="space-y-8">
        
        {/* Brand Logo */}
        <div 
          onClick={() => {
            setActiveTab('home');
            onResetHome();
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2563eb] flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <Plane className="w-6 h-6 transform -rotate-45" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg leading-tight tracking-tight text-white font-outfit">
              Travel Planner
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              Plan • Explore • Create Memories
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2 font-sans">
          
          <button
            onClick={() => {
              setActiveTab('home');
              onResetHome();
            }}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'home'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('my-trips')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'my-trips'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>My Trips</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span>Saved Plans</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>

        </nav>

      </div>

      {/* Bottom Footer Graphic (Mountain Wireframe & Tagline) */}
      <div className="pt-6 border-t border-slate-800/60 text-slate-400 space-y-2 relative">
        <div className="flex items-center gap-2.5 text-slate-300">
          <Mountain className="w-6 h-6 text-slate-400" />
          <div className="text-xs font-bold leading-tight font-outfit">
            Better Trips<br />Bigger Dreams
          </div>
        </div>
        <div className="flex justify-end pt-1">
          <Plane className="w-4 h-4 text-slate-500 transform rotate-45" />
        </div>
      </div>

    </aside>
  );
};
