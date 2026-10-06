import type { TripRequest, FlightOption, AgentMessage } from '../types/travel';

export interface FlightAgentResult {
  flight: FlightOption;
  message: AgentMessage;
  alternativeOptions: FlightOption[];
}

export function executeFlightAgent(
  request: TripRequest,
  allocatedBudget: number
): FlightAgentResult {
  const origin = request.origin || 'New York (JFK)';
  const destination = request.destination || 'Tokyo (HND)';
  const travelers = request.travelers || 1;
  const style = request.style || 'balanced';

  // Determine flight parameters based on style & budget
  let cabinClass = 'Economy';
  const pricePerPerson = Math.round(allocatedBudget / travelers * 0.85);

  if (style === 'luxury' && allocatedBudget >= 2000 * travelers) {
    cabinClass = 'Business Class';
  } else if (style === 'balanced' && allocatedBudget >= 1200 * travelers) {
    cabinClass = 'Premium Economy';
  }

  // Realistic mock airline options based on destination
  const airlines = getAirlinesForDestination(destination);
  
  const primaryAirline = airlines[0];
  const flightNum = `${primaryAirline.code}-${Math.floor(100 + Math.random() * 800)}`;
  
  const flightCostPerPerson = Math.max(150, Math.min(pricePerPerson, Math.round(allocatedBudget / travelers)));
  const totalCost = flightCostPerPerson * travelers;

  const primaryFlight: FlightOption = {
    id: `fl-${Date.now()}-1`,
    airline: primaryAirline.name,
    flightNumber: flightNum,
    departureTime: '08:45 AM',
    arrivalTime: '04:15 PM (+1 day)',
    departureAirport: `${origin.split(' ')[0]} Int'l`,
    arrivalAirport: `${destination.split(' ')[0]} Int'l`,
    duration: getEstimatedDuration(),
    stops: style === 'luxury' ? 0 : (flightCostPerPerson < 400 ? 1 : 0),
    pricePerPerson: flightCostPerPerson,
    totalPrice: totalCost,
    cabinClass: cabinClass,
    baggageIncluded: true,
    score: 9.4,
    notes: `${cabinClass} non-stop route with complimentary meal service & inflight Wi-Fi.`
  };

  const altFlight: FlightOption = {
    id: `fl-${Date.now()}-2`,
    airline: airlines[1]?.name || 'SkyWings Express',
    flightNumber: `${airlines[1]?.code || 'SW'}-${Math.floor(100 + Math.random() * 800)}`,
    departureTime: '11:20 PM',
    arrivalTime: '07:30 AM (+1 day)',
    departureAirport: `${origin.split(' ')[0]} Int'l`,
    arrivalAirport: `${destination.split(' ')[0]} Int'l`,
    duration: getEstimatedDuration(),
    stops: 1,
    pricePerPerson: Math.round(flightCostPerPerson * 0.82),
    totalPrice: Math.round(flightCostPerPerson * 0.82) * travelers,
    cabinClass: 'Economy',
    baggageIncluded: true,
    score: 8.7,
    notes: 'Budget option with 1 quick 55-min layover.'
  };

  const message: AgentMessage = {
    id: `msg-${Date.now()}-fl`,
    timestamp: new Date().toLocaleTimeString(),
    sender: 'flight_agent',
    receiver: 'orchestrator',
    type: 'proposal',
    title: 'Flight Recommendations Ready',
    content: `Analyzed airfares for ${origin} → ${destination} for ${travelers} traveler(s). Selected ${primaryAirline.name} (${cabinClass}) at ${request.currency}${totalCost} total (${request.currency}${flightCostPerPerson}/person).`,
    payload: { primaryFlight, totalCost, allocatedBudget },
    status: 'accepted'
  };

  return {
    flight: primaryFlight,
    message,
    alternativeOptions: [altFlight]
  };
}

function getAirlinesForDestination(destination: string) {
  const dest = destination.toLowerCase();
  if (dest.includes('tokyo') || dest.includes('japan')) {
    return [{ name: 'ANA (All Nippon Airways)', code: 'NH' }, { name: 'Japan Airlines', code: 'JL' }];
  } else if (dest.includes('paris') || dest.includes('france') || dest.includes('europe')) {
    return [{ name: 'Air France', code: 'AF' }, { name: 'Delta Air Lines', code: 'DL' }];
  } else if (dest.includes('bali') || dest.includes('indonesia') || dest.includes('asia')) {
    return [{ name: 'Singapore Airlines', code: 'SQ' }, { name: 'Garuda Indonesia', code: 'GA' }];
  } else if (dest.includes('london') || dest.includes('uk')) {
    return [{ name: 'British Airways', code: 'BA' }, { name: 'Virgin Atlantic', code: 'VS' }];
  } else {
    return [{ name: 'Emirates Global', code: 'EK' }, { name: 'Star Alliance Express', code: 'SA' }];
  }
}

function getEstimatedDuration(): string {
  return '11h 30m';
}
