import type { TripRequest, HotelOption, AgentMessage } from '../types/travel';

export interface HotelAgentResult {
  hotel: HotelOption;
  message: AgentMessage;
  nightsCount: number;
}

export function executeHotelAgent(
  request: TripRequest,
  allocatedBudget: number,
  nightsCount: number
): HotelAgentResult {
  const destination = request.destination || 'Tokyo, Japan';
  const style = request.style || 'balanced';

  const nights = Math.max(1, nightsCount);
  const targetNightlyRate = Math.round(allocatedBudget / nights);

  const selectedHotel = getHotelsForDestination(destination, style, targetNightlyRate, nights);

  const message: AgentMessage = {
    id: `msg-${Date.now()}-ht`,
    timestamp: new Date().toLocaleTimeString(),
    sender: 'hotel_agent',
    receiver: 'orchestrator',
    type: 'proposal',
    title: 'Accommodation Matched',
    content: `Selected "${selectedHotel.name}" (${selectedHotel.stars}★, Rating: ${selectedHotel.rating}/10) in ${selectedHotel.neighborhood} for ${nights} nights at ${request.currency}${selectedHotel.pricePerNight}/night. Total: ${request.currency}${selectedHotel.totalPrice}.`,
    payload: { selectedHotel, totalCost: selectedHotel.totalPrice, allocatedBudget },
    status: 'accepted'
  };

  return {
    hotel: selectedHotel,
    message,
    nightsCount: nights
  };
}

function getHotelsForDestination(
  destination: string,
  style: string,
  targetNightlyRate: number,
  nights: number
): HotelOption {
  const dest = destination.toLowerCase();

  let name = 'Grand Plaza Resort & Spa';
  let neighborhood = 'City Center & Cultural District';
  let stars = 4;
  let rating = 9.2;
  let image = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
  let amenities = ['Rooftop Pool', 'Free High-Speed Wi-Fi', 'Artisan Breakfast', 'Spa & Fitness Center', 'Concierge Desk'];
  let roomType = 'Deluxe King Suite with City View';

  if (dest.includes('tokyo') || dest.includes('japan')) {
    if (style === 'luxury') {
      name = 'Aman Tokyo & Sky Garden Suites';
      neighborhood = 'Otemachi / Ginza District';
      stars = 5;
      rating = 9.7;
      image = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80';
      amenities = ['Private Onsen Spa', 'Panoramic Fuji View', 'Michelin Dining', 'Personal Butler', 'Luxury Airport Transfer'];
      roomType = 'Grand Imperial Suite';
    } else if (style === 'budget') {
      name = 'Shinjuku Artisan Pod & Boutique Hotel';
      neighborhood = 'Shinjuku Central';
      stars = 3;
      rating = 8.8;
      image = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
      amenities = ['Free Fiber Wi-Fi', 'Lounge Bar', 'Laundromat', 'Coffee Bar'];
      roomType = 'Standard Modern Studio';
    } else {
      name = 'The Park Tower Boutique Hotel';
      neighborhood = 'Shibuya / Harajuku Border';
      stars = 4;
      rating = 9.1;
      image = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
      amenities = ['Sky Lounge Bar', 'Organic Breakfast', 'Fitness Center', 'High-Speed Wi-Fi'];
      roomType = 'Superior Queen Room';
    }
  } else if (dest.includes('paris') || dest.includes('france')) {
    name = style === 'luxury' ? 'Le Grand Hotel de Paris & Spa' : 'Hôtel Rivoli Boutique';
    neighborhood = 'Le Marais / 4th Arrondissement';
    stars = style === 'luxury' ? 5 : 4;
    rating = 9.3;
    image = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80';
    amenities = ['Eiffel Tower View Balcony', 'Croissant & Espresso Lounge', 'Wine Cellar', '24/7 Room Service'];
    roomType = 'Classic Parisian Room with Balcony';
  } else if (dest.includes('bali') || dest.includes('indonesia')) {
    name = 'Ubud Jungle Eco Sanctuary & Pool Villa';
    neighborhood = 'Ubud Valley';
    stars = 5;
    rating = 9.5;
    image = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80';
    amenities = ['Infinity Jungle Pool', 'Morning Yoga Pavilion', 'Organic Farm-to-Table', 'Spa Sanctuary'];
    roomType = 'Private Infinity Pool Villa';
  } else {
    name = `${destination.split(',')[0]} Signature Boutique Hotel`;
    neighborhood = 'Downtown Harbor View';
    stars = 4;
    rating = 9.0;
    image = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
  }

  const pricePerNight = Math.max(60, targetNightlyRate);
  const totalPrice = pricePerNight * nights;

  return {
    id: `ht-${Date.now()}`,
    name,
    stars,
    rating,
    reviewsCount: 1420,
    pricePerNight,
    totalPrice,
    address: `108 Central Avenue, ${destination}`,
    neighborhood,
    amenities,
    image,
    roomType,
    notes: `Handpicked by Hotel Agent based on rating (${rating}/10) and proximity to top attractions.`
  };
}
