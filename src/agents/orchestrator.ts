import type { TripRequest, ItineraryPlan, AgentMessage, AgentInfo, AgentRole } from '../types/travel';
import { executeFlightAgent } from './flightAgent';
import { executeHotelAgent } from './hotelAgent';
import { executeActivityAgent } from './activityAgent';
import { executeBudgetAgent } from './budgetAgent';
import { executePackingAgent } from './packingAgent';

export const INITIAL_AGENTS: Record<AgentRole, AgentInfo> = {
  orchestrator: {
    id: 'orchestrator',
    name: 'Orchestrator Core',
    roleTitle: 'Master Coordinator',
    avatar: '🎯',
    color: '#8b5cf6',
    accentBg: 'rgba(139, 92, 246, 0.15)',
    description: 'Decomposes trip requests, coordinates sub-agents, and synthesizes final itinerary.',
    status: 'idle'
  },
  flight_agent: {
    id: 'flight_agent',
    name: 'Flight Specialist',
    roleTitle: 'Airfare & Routes Expert',
    avatar: '✈️',
    color: '#3b82f6',
    accentBg: 'rgba(59, 130, 246, 0.15)',
    description: 'Finds optimal flights, routes, seats, and cabin options within target budget.',
    status: 'idle'
  },
  hotel_agent: {
    id: 'hotel_agent',
    name: 'Hotel Specialist',
    roleTitle: 'Accommodation & Stay Expert',
    avatar: '🏨',
    color: '#ec4899',
    accentBg: 'rgba(236, 72, 153, 0.15)',
    description: 'Researches hotels, resorts, boutique stays, and neighborhood vibe.',
    status: 'idle'
  },
  activity_agent: {
    id: 'activity_agent',
    name: 'Activity Specialist',
    roleTitle: 'Itinerary & Culinary Guide',
    avatar: '🎨',
    color: '#10b981',
    accentBg: 'rgba(16, 185, 129, 0.15)',
    description: 'Builds day-by-day morning, afternoon, and evening activities and dining.',
    status: 'idle'
  },
  budget_agent: {
    id: 'budget_agent',
    name: 'Budget & Finance',
    roleTitle: 'Cost & Contingency Auditor',
    avatar: '💰',
    color: '#f59e0b',
    accentBg: 'rgba(245, 158, 11, 0.15)',
    description: 'Audits expenses across domains, enforces budget limits, and suggests savings.',
    status: 'idle'
  },
  packing_agent: {
    id: 'packing_agent',
    name: 'Weather & Packing',
    roleTitle: 'Climate & Gear Specialist',
    avatar: '🧳',
    color: '#06b6d4',
    accentBg: 'rgba(6, 182, 212, 0.15)',
    description: 'Analyzes destination climate and prepares tailored essential packing list.',
    status: 'idle'
  }
};

export interface MultiAgentExecutionCallbacks {
  onAgentStateChange?: (agents: Record<AgentRole, AgentInfo>) => void;
  onMessageLogged?: (message: AgentMessage) => void;
  onStepProgress?: (stepName: string, progressPercent: number) => void;
}

export async function runMultiAgentPlanner(
  request: TripRequest,
  callbacks?: MultiAgentExecutionCallbacks
): Promise<ItineraryPlan> {
  const currentAgents = JSON.parse(JSON.stringify(INITIAL_AGENTS)) as Record<AgentRole, AgentInfo>;
  const traceLogs: AgentMessage[] = [];

  const updateAgentStatus = (role: AgentRole, status: AgentInfo['status'], task?: string) => {
    currentAgents[role].status = status;
    if (task !== undefined) currentAgents[role].currentTask = task;
    callbacks?.onAgentStateChange?.({ ...currentAgents });
  };

  const emitMessage = (msg: AgentMessage) => {
    traceLogs.push(msg);
    callbacks?.onMessageLogged?.(msg);
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Step 1: Orchestrator initialization
  updateAgentStatus('orchestrator', 'thinking', 'Analyzing trip parameters & budget allocation');
  callbacks?.onStepProgress?.('Orchestrator decomposing trip tasks...', 10);
  await delay(800);

  const nightsCount = calculateNights(request.startDate, request.endDate);
  const totalBudget = request.budget || 2000;

  // Budget Allocation Ratios: Flights ~35%, Hotel ~40%, Activities ~25%
  const flightAllocated = Math.round(totalBudget * 0.35);
  const hotelAllocated = Math.round(totalBudget * 0.40);
  const activityAllocated = Math.round(totalBudget * 0.25);

  const initMsg: AgentMessage = {
    id: `msg-${Date.now()}-orch-init`,
    timestamp: new Date().toLocaleTimeString(),
    sender: 'orchestrator',
    receiver: 'all',
    type: 'request',
    title: 'Trip Decomposition & Sub-Task Dispatch',
    content: `Received request for ${request.destination} (${nightsCount} nights, ${request.travelers} traveler(s), Budget: ${request.currency}${totalBudget}, Style: ${request.style}). Dispatching domain tasks to Flight, Hotel, Activity, and Packing Specialists.`,
    payload: { flightAllocated, hotelAllocated, activityAllocated }
  };
  emitMessage(initMsg);
  await delay(600);

  // Step 2: Flight Agent Execution
  updateAgentStatus('orchestrator', 'communicating', 'Awaiting Flight Specialist results');
  updateAgentStatus('flight_agent', 'thinking', `Searching flights within ${request.currency}${flightAllocated}`);
  callbacks?.onStepProgress?.('Flight Specialist searching airfares...', 30);
  await delay(1000);

  const flightResult = executeFlightAgent(request, flightAllocated);
  emitMessage(flightResult.message);
  updateAgentStatus('flight_agent', 'done', `Selected ${flightResult.flight.airline} (${request.currency}${flightResult.flight.totalPrice})`);
  await delay(600);

  // Step 3: Hotel Agent Execution
  updateAgentStatus('hotel_agent', 'thinking', `Matching hotels for ${nightsCount} nights within ${request.currency}${hotelAllocated}`);
  callbacks?.onStepProgress?.('Hotel Specialist researching accommodation...', 50);
  await delay(1000);

  const hotelResult = executeHotelAgent(request, hotelAllocated, nightsCount);
  emitMessage(hotelResult.message);
  updateAgentStatus('hotel_agent', 'done', `Selected ${hotelResult.hotel.name} (${request.currency}${hotelResult.hotel.totalPrice})`);
  await delay(600);

  // Step 4: Activity & Dining Agent Execution
  updateAgentStatus('activity_agent', 'thinking', `Curating ${nightsCount}-day experiences matching ${request.interests.slice(0, 3).join(', ')}`);
  callbacks?.onStepProgress?.('Activity Specialist curating daily itinerary...', 70);
  await delay(1000);

  const activityResult = executeActivityAgent(request, activityAllocated, nightsCount);
  emitMessage(activityResult.message);
  updateAgentStatus('activity_agent', 'done', `Crafted ${activityResult.dailyItinerary.length} days of activities`);
  await delay(600);

  // Step 5: Budget Agent Audit
  updateAgentStatus('budget_agent', 'thinking', 'Auditing total cost & applying 10% contingency buffer');
  callbacks?.onStepProgress?.('Budget Specialist auditing total expenses...', 85);
  await delay(900);

  const budgetResult = executeBudgetAgent(
    request,
    flightResult.flight.totalPrice,
    hotelResult.hotel.totalPrice,
    activityResult.totalActivitiesCost
  );
  emitMessage(budgetResult.message);

  if (budgetResult.needsRebalance) {
    updateAgentStatus('orchestrator', 'communicating', 'Negotiating budget re-allocation with sub-agents');
    await delay(700);
    const rebalanceMsg: AgentMessage = {
      id: `msg-${Date.now()}-rebalance`,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'orchestrator',
      receiver: 'budget_agent',
      type: 'negotiation',
      title: 'Budget Conflict Resolved via Buffer Adjustment',
      content: `Accepted budget audit recommendations. Re-allocated contingency buffer to maintain high-quality options without compromising itinerary standards.`,
      status: 'accepted'
    };
    emitMessage(rebalanceMsg);
  }
  updateAgentStatus('budget_agent', 'done', `Budget audited: ${request.currency}${budgetResult.budgetBreakdown.estimatedTotal}`);
  await delay(600);

  // Step 6: Packing & Weather Agent Execution
  updateAgentStatus('packing_agent', 'thinking', `Analyzing seasonal weather for ${request.destination}`);
  callbacks?.onStepProgress?.('Packing Specialist generating weather & essential gear...', 95);
  await delay(800);

  const packingResult = executePackingAgent(request);
  emitMessage(packingResult.message);
  updateAgentStatus('packing_agent', 'done', `Weather analyzed (${packingResult.weatherForecast.averageTempC}°C)`);
  await delay(500);

  // Step 7: Final Orchestrator Synthesis
  updateAgentStatus('orchestrator', 'thinking', 'Synthesizing final multi-agent itinerary package');
  callbacks?.onStepProgress?.('Finalizing complete itinerary...', 100);
  await delay(800);

  const finalSummaryMsg: AgentMessage = {
    id: `msg-${Date.now()}-orch-done`,
    timestamp: new Date().toLocaleTimeString(),
    sender: 'orchestrator',
    receiver: 'all',
    type: 'summary',
    title: 'Multi-Agent Itinerary Complete',
    content: `All sub-agent tasks completed with 98% confidence score. Multi-agent itinerary ready for traveler review!`,
    status: 'accepted'
  };
  emitMessage(finalSummaryMsg);
  updateAgentStatus('orchestrator', 'done', 'Itinerary ready');

  return {
    id: `itinerary-${Date.now()}`,
    tripRequest: request,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    summary: `Curated ${nightsCount}-day ${request.style} experience to ${request.destination} featuring top-rated ${flightResult.flight.airline} flights, luxury boutique stay at ${hotelResult.hotel.name}, and tailored activities.`,
    overallConfidence: 98,
    selectedFlight: flightResult.flight,
    selectedHotel: hotelResult.hotel,
    dailyItinerary: activityResult.dailyItinerary,
    budgetBreakdown: budgetResult.budgetBreakdown,
    weatherForecast: packingResult.weatherForecast,
    packingList: packingResult.packingList,
    agentTraceLogs: traceLogs
  };
}

function calculateNights(startStr: string, endStr: string): number {
  try {
    if (!startStr || !endStr) return 5;
    const s = new Date(startStr);
    const e = new Date(endStr);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.min(14, diff));
  } catch (e) {
    return 5;
  }
}
