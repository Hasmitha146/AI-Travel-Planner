import React, { useState } from 'react';
import type { TripRequest } from '../types/travel';
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Sparkles, 
  Plane, 
  Hotel, 
  Compass, 
  Wallet, 
  Luggage,
  ArrowRight,
  Minus,
  Plus,
  ChevronDown,
  Building2,
  GitCommit
} from 'lucide-react';

interface PlannerFormProps {
  onSubmit: (request: TripRequest) => void;
  isExecuting: boolean;
}

export const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit, isExecuting }) => {
  const today = '2026-09-14';
  const defaultEnd = '2026-09-19';

  const [origin, setOrigin] = useState('New York (JFK)');
  const [destination, setDestination] = useState('Tokyo, Japan');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(2500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      origin,
      destination,
      startDate,
      endDate,
      travelers,
      budget,
      currency: '$',
      style: 'balanced',
      interests: ['Culture & History', 'Foodie & Dining', 'Sightseeing'],
      additionalNotes: ''
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-7 font-sans pb-20">
      
      {/* 1. HERO BANNER WITH SCENIC SANTORINI BACKGROUND */}
      <div className="relative rounded-3xl overflow-hidden shadow-xs border border-slate-100 bg-white">
        
        {/* Scenic Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80" 
            alt="Santorini Greece Banner" 
            className="w-full h-full object-cover object-right"
          />
          {/* Soft White/Blue Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#e0f2fe] via-[#f0f9ff]/95 to-transparent w-full md:w-3/4" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 p-8 sm:p-10 space-y-4 max-w-2xl">
          
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-100/70 px-3 py-1 rounded-md">
            TRAVEL PLANNER
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-outfit leading-tight">
            Plan Your Trip with <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Autonomous Agents
            </span>
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed font-sans font-medium">
            Set your budget, dates, and interests. Specialized domain agents collaborate to build your flight, hotel, activities and more!
          </p>

          {/* 5 Domain Agent Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-slate-200/80 text-xs font-semibold text-slate-700">
              <Plane className="w-4 h-4 text-blue-600" />
              <span>Flight Agent</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-slate-200/80 text-xs font-semibold text-slate-700">
              <Hotel className="w-4 h-4 text-emerald-600" />
              <span>Hotel Agent</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-slate-200/80 text-xs font-semibold text-slate-700">
              <Compass className="w-4 h-4 text-purple-600" />
              <span>Activity Agent</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-slate-200/80 text-xs font-semibold text-slate-700">
              <Wallet className="w-4 h-4 text-amber-600" />
              <span>Budget Auditor</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-slate-200/80 text-xs font-semibold text-slate-700">
              <Luggage className="w-4 h-4 text-cyan-600" />
              <span>Packing Agent</span>
            </div>

          </div>

        </div>

        {/* Good Vibes Only Script Overlay Graphic */}
        <div className="absolute top-6 right-10 hidden lg:block z-10 pointer-events-none text-right">
          <span className="font-serif italic text-slate-800 text-2xl font-bold block opacity-80 leading-snug">
            Good<br />Vibes ♡<br />Only ✈️
          </span>
        </div>

      </div>

      {/* 2. DOMAIN QUICK FEATURE CARDS ROW (4 soft pastel cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        
        {/* Find Flights Card */}
        <div className="bg-[#eff6ff] border border-blue-100 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center mb-3">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm font-outfit">Find Flights</h3>
            <p className="text-xs text-slate-500">Get the best routes & prices</p>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
        </div>

        {/* Book Hotels Card */}
        <div className="bg-[#f0fdf4] border border-emerald-100 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center mb-3">
              <Hotel className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm font-outfit">Book Hotels</h3>
            <p className="text-xs text-slate-500">Comfortable stays, curated for you</p>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
        </div>

        {/* Plan Activities Card */}
        <div className="bg-[#faf5ff] border border-purple-100 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm font-outfit">Plan Activities</h3>
            <p className="text-xs text-slate-500">Explore top attractions</p>
          </div>
          <ArrowRight className="w-4 h-4 text-purple-600 shrink-0" />
        </div>

        {/* Track Budget Card */}
        <div className="bg-[#fff7ed] border border-amber-100 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center mb-3">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm font-outfit">Track Budget</h3>
            <p className="text-xs text-slate-500">Stay within your budget</p>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-600 shrink-0" />
        </div>

      </div>

      {/* FORM CONTAINER */}
      <form onSubmit={handleSubmit} className="space-y-7">
        
        {/* 3. STEP 1 CARD: DESTINATION & TRAVEL DATES */}
        <div className="bg-white rounded-3xl p-8 sm:p-9 border border-slate-200/80 shadow-xs space-y-7">
          
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-outfit">Destination & Travel Dates</h2>
                <p className="text-xs text-slate-500 mt-0.5">Tell us where you want to go and when, so we can plan the perfect trip for you!</p>
              </div>
            </div>

            {/* Step Progress Segment */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-semibold text-slate-500">Step 1 of 3</span>
              <div className="flex items-center gap-1.5">
                <div className="w-9 h-1.5 rounded-full bg-blue-600" />
                <div className="w-9 h-1.5 rounded-full bg-slate-200" />
                <div className="w-9 h-1.5 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>

          {/* Form Fields Grid (2 columns with spacious gap) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Origin City */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Origin City</span>
              </label>
              <div className="relative flex items-center">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="New York (JFK)"
                  required
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-slate-800 font-semibold text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
              </div>
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5 text-slate-400" />
                <span>Destination</span>
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Tokyo, Japan"
                  required
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-slate-800 font-semibold text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Start Date</span>
              </label>
              <div className="relative flex items-center">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-slate-800 font-semibold text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>End Date</span>
              </label>
              <div className="relative flex items-center">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-slate-800 font-semibold text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

          </div>

          {/* Next Step Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('step-2-card');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* 4. STEP 2 CARD: TRAVELERS & TOTAL BUDGET */}
        <div id="step-2-card" className="bg-white rounded-3xl p-8 sm:p-9 border border-slate-200/80 shadow-xs space-y-7">
          
          {/* Card Header */}
          <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
            <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-outfit">Travelers & Total Budget</h2>
              <p className="text-xs text-slate-500 mt-0.5">Add the number of travelers and your total budget for this trip.</p>
            </div>
          </div>

          {/* Input Controls (2 columns with spacious gap) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Number of Travelers Counter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Number of Travelers</span>
              </label>
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/70 border border-slate-200/90">
                <button
                  type="button"
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 shadow-2xs transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-extrabold text-slate-800 text-base font-outfit px-4">{travelers}</span>
                <button
                  type="button"
                  onClick={() => setTravelers(Math.min(10, travelers + 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center hover:bg-slate-100 shadow-2xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Total Budget Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                <span>Total Budget (USD)</span>
              </label>
              <div className="relative flex items-center">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="number"
                  min="500"
                  max="20000"
                  step="100"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/90 text-slate-800 font-extrabold text-base focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-outfit"
                />
                <DollarSign className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Primary Action Button: Generate Plan */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={isExecuting}
              className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/25 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </form>
    </div>
  );
};
