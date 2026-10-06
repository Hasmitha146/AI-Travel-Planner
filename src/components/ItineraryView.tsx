import React, { useState, useEffect } from 'react';
import type { ItineraryPlan } from '../types/travel';
import { 
  Calendar, 
  MapPin, 
  Plane, 
  Hotel, 
  Clock, 
  Download, 
  Sparkles, 
  Sun, 
  Luggage, 
  PieChart, 
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ItineraryViewProps {
  itinerary: ItineraryPlan;
  onRefine: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, onRefine }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'budget' | 'packing' | 'trace'>('schedule');
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [packingState, setPackingState] = useState(itinerary.packingList);

  useEffect(() => {
    // Fire festive celebration confetti on itinerary reveal
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, [itinerary]);

  const toggleDayExpand = (dayNum: number) => {
    setExpandedDays(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const togglePackingItem = (catIdx: number, itemIdx: number) => {
    const updated = [...packingState];
    updated[catIdx].items[itemIdx].checked = !updated[catIdx].items[itemIdx].checked;
    setPackingState(updated);
  };

  const handlePrintExport = () => {
    window.print();
  };

  const { tripRequest, selectedFlight, selectedHotel, dailyItinerary, budgetBreakdown, weatherForecast } = itinerary;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold uppercase tracking-wider border border-indigo-500/30">
            Multi-Agent Plan Ready
          </span>
          <span>Synthesized by 6 Autonomous Sub-Agents</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onRefine}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Refine Criteria</span>
          </button>

          <button
            onClick={handlePrintExport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export / Print PDF</span>
          </button>
        </div>
      </div>

      {/* Hero Destination Header */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="h-64 md:h-80 w-full relative">
          <img 
            src={selectedHotel.image} 
            alt={tripRequest.destination} 
            className="w-full h-full object-cover brightness-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span>{tripRequest.destination}</span>
                <span>•</span>
                <span>{dailyItinerary.length} Days / {dailyItinerary.length - 1} Nights</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white font-outfit tracking-tight">
                {tripRequest.destination.split(',')[0]} Itinerary
              </h1>
            </div>

            {/* Confidence Badge */}
            <div className="flex items-center gap-3 glass-panel px-4 py-2.5 border-slate-700/80 bg-slate-950/70">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-sm border border-emerald-500/30">
                {itinerary.overallConfidence}%
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Agent Confidence Score</span>
                <span className="text-xs font-bold text-emerald-300">Verified & Feasible</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            {itinerary.summary}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Budget</span>
              <span className="text-base font-extrabold text-white font-outfit">{tripRequest.currency}{budgetBreakdown.totalBudget.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Total Expenses</span>
              <span className="text-base font-extrabold text-emerald-400 font-outfit">{tripRequest.currency}{budgetBreakdown.estimatedTotal.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Travelers</span>
              <span className="text-base font-extrabold text-white font-outfit">{tripRequest.travelers} Traveler(s)</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Travel Style</span>
              <span className="text-base font-extrabold text-indigo-400 capitalize font-outfit">{tripRequest.style}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'schedule'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Daily Schedule & Stays</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'budget'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Budget & Cost Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('packing')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'packing'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Luggage className="w-4 h-4" />
          <span>Weather & Packing List</span>
        </button>

        <button
          onClick={() => setActiveTab('trace')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'trace'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Agent Trace Logs ({itinerary.agentTraceLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: DAILY SCHEDULE & STAYS */}
      {activeTab === 'schedule' && (
        <div className="space-y-8">
          
          {/* Flight & Hotel Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Selected Flight Card */}
            <div className="glass-panel p-6 border-slate-800/80 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm font-outfit">
                  <Plane className="w-4 h-4" />
                  <span>Recommended Flight</span>
                </div>
                <span className="text-xs font-bold text-white bg-indigo-500/20 px-2.5 py-0.5 rounded-md border border-indigo-500/30">
                  {selectedFlight.cabinClass}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-outfit">{selectedFlight.airline}</h3>
                  <p className="text-xs text-slate-400">Flight {selectedFlight.flightNumber}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-emerald-400 font-outfit">{tripRequest.currency}{selectedFlight.totalPrice}</span>
                  <p className="text-[10px] text-slate-500">Total for {tripRequest.travelers} traveler(s)</p>
                </div>
              </div>

              {/* Flight Route Diagram */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{selectedFlight.departureTime}</span>
                  <span className="text-slate-400 text-[10px]">{selectedFlight.departureAirport}</span>
                </div>
                <div className="flex flex-col items-center px-4 flex-1">
                  <span className="text-[10px] text-slate-400">{selectedFlight.duration}</span>
                  <div className="w-full flex items-center gap-1 my-1">
                    <div className="h-0.5 w-full bg-slate-700"></div>
                    <Plane className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <div className="h-0.5 w-full bg-slate-700"></div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">{selectedFlight.stops === 0 ? 'Non-Stop' : `${selectedFlight.stops} Stop`}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white block">{selectedFlight.arrivalTime}</span>
                  <span className="text-slate-400 text-[10px]">{selectedFlight.arrivalAirport}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic">"{selectedFlight.notes}"</p>
            </div>

            {/* Selected Hotel Card */}
            <div className="glass-panel p-6 border-slate-800/80 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-pink-400 font-bold text-sm font-outfit">
                  <Hotel className="w-4 h-4" />
                  <span>Recommended Accommodation</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <span>★ {selectedHotel.stars}</span>
                  <span className="text-slate-400">({selectedHotel.rating}/10)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-outfit">{selectedHotel.name}</h3>
                  <p className="text-xs text-slate-400">{selectedHotel.neighborhood}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-emerald-400 font-outfit">{tripRequest.currency}{selectedHotel.totalPrice}</span>
                  <p className="text-[10px] text-slate-500">{tripRequest.currency}{selectedHotel.pricePerNight}/night</p>
                </div>
              </div>

              {/* Room & Amenities */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-300 block">{selectedHotel.roomType}</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHotel.amenities.map((am) => (
                    <span key={am} className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 text-[10px]">
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-400 italic">"{selectedHotel.notes}"</p>
            </div>

          </div>

          {/* Day-by-Day Timeline */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white font-outfit">Day-by-Day Detailed Itinerary</h2>
            
            {dailyItinerary.map((day) => {
              const isExpanded = expandedDays[day.dayNumber] !== false;

              return (
                <div key={day.dayNumber} className="glass-panel overflow-hidden border-slate-800/80">
                  
                  {/* Day Header Bar */}
                  <button
                    onClick={() => toggleDayExpand(day.dayNumber)}
                    className="w-full p-5 bg-slate-900/80 hover:bg-slate-900 transition-colors flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-indigo-600/25 font-outfit">
                        D{day.dayNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white font-outfit">{day.title}</h3>
                          <span className="text-xs text-slate-400 font-medium">({day.date})</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{day.theme}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-emerald-400 hidden sm:block">
                        Est. Cost: {tripRequest.currency}{day.dayTotalCost}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Day Activities Content */}
                  {isExpanded && (
                    <div className="p-6 space-y-4 bg-slate-950/40 divide-y divide-slate-800/60">
                      {day.activities.map((act) => (
                        <div key={act.id} className="pt-4 first:pt-0 grid grid-cols-1 md:grid-cols-4 gap-4">
                          
                          {/* Time & Category */}
                          <div className="md:col-span-1 space-y-1">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{act.timeSlot}</span>
                            </span>
                            <div className="text-[11px] font-semibold text-slate-400">
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                                {act.category}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 pt-1">
                              Duration: {act.durationHours}h
                            </div>
                          </div>

                          {/* Activity Specs */}
                          <div className="md:col-span-3 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-bold text-white font-outfit">{act.title}</h4>
                              <span className="text-xs font-extrabold text-emerald-400 shrink-0">
                                {tripRequest.currency}{act.estimatedCost} / person
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed">{act.description}</p>

                            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-pink-400" />
                                <span>{act.location}</span>
                              </span>
                              {act.tips && (
                                <span className="text-amber-400 italic">
                                  💡 Tip: {act.tips}
                                </span>
                              )}
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: BUDGET & COST AUDIT */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          
          <div className="glass-panel p-6 border-slate-800/80 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white font-outfit">Financial Breakdown & Budget Auditor</h2>
                <p className="text-xs text-slate-400">Audited by Budget & Finance Specialist Agent</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                budgetBreakdown.isWithinBudget
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {budgetBreakdown.isWithinBudget ? 'Within Target Budget' : 'Budget Rebalanced'}
              </span>
            </div>

            {/* Distribution Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Flights</span>
                <span className="text-2xl font-extrabold text-indigo-400 font-outfit">{tripRequest.currency}{budgetBreakdown.flights.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block">{Math.round((budgetBreakdown.flights / budgetBreakdown.estimatedTotal) * 100)}% of total</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Hotel Stay</span>
                <span className="text-2xl font-extrabold text-pink-400 font-outfit">{tripRequest.currency}{budgetBreakdown.accommodation.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block">{Math.round((budgetBreakdown.accommodation / budgetBreakdown.estimatedTotal) * 100)}% of total</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Activities & Food</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-outfit">{tripRequest.currency}{budgetBreakdown.activitiesAndDining.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block">{Math.round((budgetBreakdown.activitiesAndDining / budgetBreakdown.estimatedTotal) * 100)}% of total</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">10% Emergency Cushion</span>
                <span className="text-2xl font-extrabold text-amber-400 font-outfit">{tripRequest.currency}{budgetBreakdown.contingencyBuffer.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block">Ground transit & SIM</span>
              </div>

            </div>

            {/* Cost Savings Tips from Agent */}
            <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
              <h3 className="text-sm font-bold text-indigo-300 font-outfit flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Cost Optimization Tips from Finance Agent</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {budgetBreakdown.costSavingsTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: WEATHER & PACKING LIST */}
      {activeTab === 'packing' && (
        <div className="space-y-6">
          
          {/* Weather Widget */}
          <div className="glass-panel p-6 border-slate-800/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Sun className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-outfit">Seasonal Weather Forecast</h3>
                <p className="text-xs text-amber-300 font-semibold">{weatherForecast.condition} • Avg {weatherForecast.averageTempC}°C (72°F)</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{weatherForecast.recommendation}</p>
          </div>

          {/* Packing Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packingState.map((cat, catIdx) => (
              <div key={cat.category} className="glass-panel p-6 border-slate-800/80 space-y-3">
                <h3 className="text-sm font-bold text-white font-outfit border-b border-slate-800 pb-2">
                  {cat.category}
                </h3>
                <div className="space-y-2">
                  {cat.items.map((item, itemIdx) => (
                    <label
                      key={item.name}
                      onClick={() => togglePackingItem(catIdx, itemIdx)}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 transition-colors cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => {}}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 accent-indigo-500"
                      />
                      <span className={`flex-1 ${item.checked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {item.name}
                      </span>
                      {item.essential && (
                        <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                          Essential
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4: AGENT TRACE LOGS */}
      {activeTab === 'trace' && (
        <div className="glass-panel p-6 border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-outfit">Complete Agent Execution Audit Trail</h3>
            <span className="text-xs text-slate-400">{itinerary.agentTraceLogs.length} Execution Steps</span>
          </div>

          <div className="space-y-3">
            {itinerary.agentTraceLogs.map((msg, idx) => (
              <div key={msg.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 text-[10px]">#{idx + 1}</span>
                    <span className="font-bold text-indigo-400 uppercase tracking-wider">{msg.sender}</span>
                    <span className="text-slate-600">→</span>
                    <span className="text-slate-400 uppercase font-semibold">{msg.receiver}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
                </div>
                <h4 className="text-xs font-bold text-white font-outfit">{msg.title}</h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
