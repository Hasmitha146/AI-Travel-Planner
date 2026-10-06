export type TravelStyle = 'luxury' | 'balanced' | 'budget' | 'adventure' | 'family' | 'foodie';

export interface TripRequest {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  style: TravelStyle;
  interests: string[];
  additionalNotes?: string;
  geminiApiKey?: string;
}

export type AgentRole = 
  | 'orchestrator' 
  | 'flight_agent' 
  | 'hotel_agent' 
  | 'activity_agent' 
  | 'budget_agent' 
  | 'packing_agent';

export type AgentStatusType = 'idle' | 'thinking' | 'communicating' | 'done' | 'error';

export interface AgentInfo {
  id: AgentRole;
  name: string;
  roleTitle: string;
  avatar: string;
  color: string;
  accentBg: string;
  description: string;
  status: AgentStatusType;
  currentTask?: string;
}

export interface AgentMessage {
  id: string;
  timestamp: string;
  sender: AgentRole;
  receiver: AgentRole | 'all';
  type: 'request' | 'response' | 'proposal' | 'negotiation' | 'approval' | 'summary';
  title: string;
  content: string;
  payload?: any;
  status?: 'pending' | 'accepted' | 'revised' | 'rejected';
}

export interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  duration: string;
  stops: number;
  pricePerPerson: number;
  totalPrice: number;
  cabinClass: string;
  baggageIncluded: boolean;
  score: number;
  notes: string;
}

export interface HotelOption {
  id: string;
  name: string;
  stars: number;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  totalPrice: number;
  address: string;
  neighborhood: string;
  amenities: string[];
  image: string;
  roomType: string;
  notes: string;
}

export interface ActivitySlot {
  id: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  title: string;
  description: string;
  category: 'Sightseeing' | 'Dining' | 'Adventure' | 'Culture' | 'Relaxation' | 'Shopping';
  location: string;
  estimatedCost: number;
  durationHours: number;
  tips?: string;
}

export interface DayItinerary {
  dayNumber: number;
  date: string;
  title: string;
  theme: string;
  activities: ActivitySlot[];
  dayTotalCost: number;
}

export interface BudgetBreakdown {
  totalBudget: number;
  estimatedTotal: number;
  flights: number;
  accommodation: number;
  activitiesAndDining: number;
  contingencyBuffer: number;
  remainingBalance: number;
  isWithinBudget: boolean;
  costSavingsTips: string[];
}

export interface WeatherForecast {
  averageTempC: number;
  condition: string;
  recommendation: string;
}

export interface PackingCategory {
  category: string;
  items: { name: string; checked: boolean; essential: boolean }[];
}

export interface ItineraryPlan {
  id: string;
  tripRequest: TripRequest;
  createdAt: string;
  summary: string;
  overallConfidence: number;
  selectedFlight: FlightOption;
  selectedHotel: HotelOption;
  dailyItinerary: DayItinerary[];
  budgetBreakdown: BudgetBreakdown;
  weatherForecast: WeatherForecast;
  packingList: PackingCategory[];
  agentTraceLogs: AgentMessage[];
}
