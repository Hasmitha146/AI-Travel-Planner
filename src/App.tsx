import { useState } from 'react';
import type { TripRequest, ItineraryPlan, AgentMessage, AgentInfo, AgentRole } from './types/travel';
import { INITIAL_AGENTS, runMultiAgentPlanner } from './agents/orchestrator';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ApiKeyModal } from './components/ApiKeyModal';
import { PlannerForm } from './components/PlannerForm';
import { AgentNetworkVisualizer } from './components/AgentNetworkVisualizer';
import { ItineraryView } from './components/ItineraryView';
import { Compass, CheckCircle2, Bookmark } from 'lucide-react';

export function App() {
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'my-trips' | 'saved' | 'profile'>('home');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const [agents, setAgents] = useState<Record<AgentRole, AgentInfo>>(INITIAL_AGENTS);
  const [traceLogs, setTraceLogs] = useState<AgentMessage[]>([]);
  const [currentStepTitle, setCurrentStepTitle] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  const [isExecuting, setIsExecuting] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryPlan | null>(null);
  const [savedTrips, setSavedTrips] = useState<ItineraryPlan[]>([]);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleStartPlanning = async (request: TripRequest) => {
    setIsExecuting(true);
    setItinerary(null);
    setAgents(JSON.parse(JSON.stringify(INITIAL_AGENTS)));
    setTraceLogs([]);
    setProgressPercent(0);
    setCurrentStepTitle('Orchestrator breaking down trip requirements...');

    try {
      const fullRequest = { ...request, geminiApiKey: apiKey };

      const result = await runMultiAgentPlanner(fullRequest, {
        onAgentStateChange: (updatedAgents) => {
          setAgents(updatedAgents);
        },
        onMessageLogged: (msg) => {
          setTraceLogs((prev) => [...prev, msg]);
        },
        onStepProgress: (title, percent) => {
          setCurrentStepTitle(title);
          setProgressPercent(percent);
        }
      });

      setTimeout(() => {
        setItinerary(result);
        setSavedTrips((prev) => [result, ...prev]);
        setIsExecuting(false);
      }, 800);

    } catch (error) {
      console.error('Multi-Agent Execution Error:', error);
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setIsExecuting(false);
    setProgressPercent(0);
    setTraceLogs([]);
    setAgents(INITIAL_AGENTS);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans antialiased">
      
      {/* 1. LEFT SIDEBAR (DARK NAVY) */}
      <Sidebar
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        onResetHome={handleReset}
      />

      {/* 2. RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <TopHeader
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          hasApiKey={Boolean(apiKey)}
        />

        {/* Api Key Modal */}
        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
        />

        {/* Main Body View Content */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          
          {/* NAV TAB 1: HOME */}
          {activeNavTab === 'home' && (
            <>
              {/* State A: Input Form */}
              {!isExecuting && !itinerary && (
                <PlannerForm
                  onSubmit={handleStartPlanning}
                  isExecuting={isExecuting}
                />
              )}

              {/* State B: Agent Execution Visualizer */}
              {isExecuting && (
                <AgentNetworkVisualizer
                  agents={agents}
                  traceLogs={traceLogs}
                  currentStepTitle={currentStepTitle}
                  progressPercent={progressPercent}
                />
              )}

              {/* State C: Generated Itinerary Dashboard */}
              {!isExecuting && itinerary && (
                <ItineraryView
                  itinerary={itinerary}
                  onRefine={handleReset}
                />
              )}
            </>
          )}

          {/* NAV TAB 2: MY TRIPS / HISTORY */}
          {activeNavTab === 'my-trips' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-outfit">My Planned Trips</h1>
                  <p className="text-xs text-slate-500">History of itineraries generated by sub-agents</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {savedTrips.length} Saved Trips
                </span>
              </div>

              {savedTrips.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                  <Compass className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-sm font-outfit">No Trips Generated Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Go to the Home tab and run our multi-agent engine to create your first trip!
                  </p>
                  <button
                    onClick={() => setActiveNavTab('home')}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                  >
                    Plan a New Trip
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedTrips.map((trip) => (
                    <div 
                      key={trip.id}
                      onClick={() => {
                        setItinerary(trip);
                        setActiveNavTab('home');
                      }}
                      className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-600 font-outfit">{trip.tripRequest.destination}</span>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {trip.overallConfidence}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{trip.summary}</p>
                      <div className="flex justify-between items-center text-xs text-slate-400 font-medium pt-2 border-t border-slate-100">
                        <span>{trip.dailyItinerary.length} Days</span>
                        <span className="font-bold text-slate-800">{trip.tripRequest.currency}{trip.budgetBreakdown.estimatedTotal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NAV TAB 3: SAVED PLANS */}
          {activeNavTab === 'saved' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-outfit">Bookmarked & Saved Plans</h1>
                  <p className="text-xs text-slate-500">Your favorite trip drafts</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm font-outfit">Saved Plans Collection</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You can bookmark activities and flight routes from generated itineraries here.
                </p>
              </div>
            </div>
          )}

          {/* NAV TAB 4: PROFILE */}
          {activeNavTab === 'profile' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-outfit">User Profile & Settings</h1>
                  <p className="text-xs text-slate-500">Manage LLM key, currency preferences and agent defaults</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                  <div className="w-16 h-16 rounded-full bg-[#0e1a38] text-white font-extrabold text-2xl flex items-center justify-center">
                    H
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-outfit">Hasmitha</h2>
                    <p className="text-xs text-slate-500">Traveler Profile • Multi-Agent Explorer</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Gemini LLM Key Configuration</h4>
                      <p className="text-[11px] text-slate-500">
                        {apiKey ? 'API key active and configured' : 'Using built-in autonomous agent simulator'}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsApiKeyModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                    >
                      Configure Key
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Discrete Sub-Agents Active</h4>
                      <p className="text-[11px] text-slate-500">Orchestrator, Flight, Hotel, Activity, Budget Auditor, Packing Specialist</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 6 Active
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}

export default App;
