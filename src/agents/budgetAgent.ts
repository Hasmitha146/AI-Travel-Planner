import type { TripRequest, BudgetBreakdown, AgentMessage } from '../types/travel';

export interface BudgetAgentResult {
  budgetBreakdown: BudgetBreakdown;
  message: AgentMessage;
  needsRebalance: boolean;
}

export function executeBudgetAgent(
  request: TripRequest,
  flightCost: number,
  hotelCost: number,
  activityCost: number
): BudgetAgentResult {
  const totalUserBudget = request.budget || 2000;
  const currency = request.currency || '$';

  // 10% Contingency Buffer for local transit, SIM card, tipping, souvenirs
  const subtotal = flightCost + hotelCost + activityCost;
  const contingencyBuffer = Math.round(subtotal * 0.10);
  const estimatedTotal = subtotal + contingencyBuffer;

  const remainingBalance = totalUserBudget - estimatedTotal;
  const isWithinBudget = remainingBalance >= 0;

  const costSavingsTips: string[] = [];

  if (!isWithinBudget) {
    const deficit = Math.abs(remainingBalance);
    costSavingsTips.push(`Over budget by ${currency}${deficit}. Consider switching flights to economy or choosing 1-stop options.`);
    costSavingsTips.push(`Opt for boutique 3-star or high-rated apartments to save ~15-25% on lodging.`);
    costSavingsTips.push(`Utilize local public transit passes (metro 72-hour pass) instead of taxis.`);
  } else {
    costSavingsTips.push(`Under budget by ${currency}${remainingBalance}. Recommended to keep ${currency}${contingencyBuffer} as emergency buffer.`);
    costSavingsTips.push(`Book airport express train tickets in advance to save on ground transfer.`);
    costSavingsTips.push(`Consider a city tourist pass (includes free museum entry and transit).`);
  }

  const budgetBreakdown: BudgetBreakdown = {
    totalBudget: totalUserBudget,
    estimatedTotal,
    flights: flightCost,
    accommodation: hotelCost,
    activitiesAndDining: activityCost,
    contingencyBuffer,
    remainingBalance,
    isWithinBudget,
    costSavingsTips
  };

  const statusText = isWithinBudget 
    ? `ALL CLEAR: Total estimate is ${currency}${estimatedTotal} (${Math.round((estimatedTotal / totalUserBudget) * 100)}% of user budget ${currency}${totalUserBudget}). Remaining cushion: ${currency}${remainingBalance}.`
    : `BUDGET ALERT: Total estimate is ${currency}${estimatedTotal}, exceeding budget limit of ${currency}${totalUserBudget} by ${currency}${Math.abs(remainingBalance)}.`;

  const message: AgentMessage = {
    id: `msg-${Date.now()}-bg`,
    timestamp: new Date().toLocaleTimeString(),
    sender: 'budget_agent',
    receiver: 'orchestrator',
    type: isWithinBudget ? 'approval' : 'negotiation',
    title: isWithinBudget ? 'Budget Audited & Approved' : 'Budget Rebalance Requested',
    content: statusText,
    payload: budgetBreakdown,
    status: isWithinBudget ? 'accepted' : 'revised'
  };

  return {
    budgetBreakdown,
    message,
    needsRebalance: !isWithinBudget
  };
}
