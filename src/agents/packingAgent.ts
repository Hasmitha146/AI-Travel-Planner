import type { TripRequest, PackingCategory, WeatherForecast, AgentMessage } from '../types/travel';

export interface PackingAgentResult {
  weatherForecast: WeatherForecast;
  packingList: PackingCategory[];
  message: AgentMessage;
}

export function executePackingAgent(
  request: TripRequest
): PackingAgentResult {
  const destination = request.destination || 'Tokyo, Japan';
  const weatherForecast = getWeatherForDestination(destination);
  const packingList = getPackingListForDestination();

  const message: AgentMessage = {
    id: `msg-${Date.now()}-pk`,
    timestamp: new Date().toLocaleTimeString(),
    sender: 'packing_agent',
    receiver: 'orchestrator',
    type: 'response',
    title: 'Weather Analysis & Smart Packing Generated',
    content: `Forecast for ${destination}: ${weatherForecast.condition}, avg ${weatherForecast.averageTempC}°C (72°F). Generated ${packingList.reduce((acc, c) => acc + c.items.length, 0)} tailored packing essentials.`,
    payload: { weatherForecast, packingList },
    status: 'accepted'
  };

  return {
    weatherForecast,
    packingList,
    message
  };
}

function getWeatherForDestination(destination: string): WeatherForecast {
  const dest = destination.toLowerCase();

  if (dest.includes('tokyo') || dest.includes('japan')) {
    return {
      averageTempC: 22,
      condition: 'Pleasant & Partly Sunny',
      recommendation: 'Mild spring/autumn weather with light breeze. Perfect for walking tours.'
    };
  } else if (dest.includes('paris') || dest.includes('france')) {
    return {
      averageTempC: 19,
      condition: 'Clear Blue Skies',
      recommendation: 'Comfortable day temperatures. Cool evenings require a stylish jacket.'
    };
  } else if (dest.includes('bali') || dest.includes('indonesia')) {
    return {
      averageTempC: 29,
      condition: 'Tropical Sunshine & Coastal Breeze',
      recommendation: 'Warm & humid. Pack breathable cotton, swimwear, and sunscreen.'
    };
  }

  return {
    averageTempC: 24,
    condition: 'Sunny with Occasional Breeze',
    recommendation: 'Ideal travel conditions. Layered clothing recommended for evening outings.'
  };
}

function getPackingListForDestination(): PackingCategory[] {
  return [
    {
      category: 'Travel Documents & Essentials',
      items: [
        { name: 'Passport & Visa Copies (Digital + Physical)', checked: false, essential: true },
        { name: 'Flight Boarding Passes & Hotel Confirmations', checked: false, essential: true },
        { name: 'Travel Insurance Documents', checked: false, essential: true },
        { name: 'International Credit / Debit Cards & Cash', checked: false, essential: true }
      ]
    },
    {
      category: 'Clothing & Footwear',
      items: [
        { name: 'Comfortable Ergonomic Walking Shoes', checked: false, essential: true },
        { name: 'Versatile Outfits (Breathable & Layerable)', checked: false, essential: true },
        { name: 'Evening / Smart Casual Dinner Attire', checked: false, essential: false },
        { name: 'Light Weather Jacket or Windbreaker', checked: false, essential: true },
        { name: 'UV Sunglasses & Sun Hat', checked: false, essential: false }
      ]
    },
    {
      category: 'Tech & Electronics',
      items: [
        { name: 'Universal International Power Adapter', checked: false, essential: true },
        { name: 'High-Capacity Power Bank (10,000mAh+)', checked: false, essential: true },
        { name: 'Smartphone & Camera Charging Cables', checked: false, essential: true },
        { name: 'Noise-Canceling Wireless Headphones', checked: false, essential: false }
      ]
    },
    {
      category: 'Health, Toiletries & Comfort',
      items: [
        { name: 'Personal First Aid & Prescription Medicines', checked: false, essential: true },
        { name: 'High SPF Sunscreen & Lip Balm', checked: false, essential: true },
        { name: 'Travel-Size Toiletries & Hand Sanitizer', checked: false, essential: true },
        { name: 'Reusable Insulated Water Bottle', checked: false, essential: false }
      ]
    }
  ];
}
