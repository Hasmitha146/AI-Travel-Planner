import type { TripRequest, DayItinerary, ActivitySlot, AgentMessage } from '../types/travel';

export interface ActivityAgentResult {
  dailyItinerary: DayItinerary[];
  totalActivitiesCost: number;
  message: AgentMessage;
}

export function executeActivityAgent(
  request: TripRequest,
  allocatedBudget: number,
  daysCount: number
): ActivityAgentResult {
  const destination = request.destination || 'Tokyo, Japan';
  const interests = request.interests.length > 0 ? request.interests : ['Culture', 'Foodie', 'Sightseeing'];
  const days = Math.max(1, Math.min(10, daysCount));

  const dailyItinerary: DayItinerary[] = [];
  let totalCost = 0;

  for (let d = 1; d <= days; d++) {
    const dayTheme = getDayTheme(d);
    const dateStr = getFormattedDate(request.startDate, d - 1);

    const activities = generateActivitiesForDay(d, destination);
    const dayCost = activities.reduce((sum, act) => sum + act.estimatedCost, 0) * request.travelers;
    totalCost += dayCost;

    dailyItinerary.push({
      dayNumber: d,
      date: dateStr,
      title: `Day ${d}: ${dayTheme.title}`,
      theme: dayTheme.description,
      activities,
      dayTotalCost: dayCost
    });
  }

  const message: AgentMessage = {
    id: `msg-${Date.now()}-act`,
    timestamp: new Date().toLocaleTimeString(),
    sender: 'activity_agent',
    receiver: 'orchestrator',
    type: 'proposal',
    title: `Crafted ${days}-Day Experiences & Dining`,
    content: `Formulated ${days} full-day itineraries featuring ${interests.join(', ')}. Curated ${days * 3} morning, afternoon, and evening experiences. Total activity & dining budget: ${request.currency}${totalCost}.`,
    payload: { days, totalCost, allocatedBudget },
    status: 'accepted'
  };

  return {
    dailyItinerary,
    totalActivitiesCost: totalCost,
    message
  };
}

function getFormattedDate(start: string, addDays: number): string {
  try {
    const d = start ? new Date(start) : new Date();
    d.setDate(d.getDate() + addDays);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  } catch (e) {
    return `Day ${addDays + 1}`;
  }
}

function getDayTheme(day: number) {
  const themes = [
    { title: 'Iconic Landmarks & First Impressions', description: 'Explore world-famous sights and soak in the vibrant atmosphere.' },
    { title: 'Culinary Journey & Local Gastronomy', description: 'Delight your palate with authentic street food, markets, and chef-curated dining.' },
    { title: 'Historical Heritage & Cultural Deep Dive', description: 'Visit historic temples, museums, and traditional artisan workshops.' },
    { title: 'Nature, Views & Outdoor Adventure', description: 'Scenic hikes, panoramic view decks, and serene parkways.' },
    { title: 'Hidden Gems & Local Neighborhoods', description: 'Wander off-the-beaten-path alleyways, vintage shops, and cozy cafes.' },
    { title: 'Shopping, Sunset Cruise & Farewell Feast', description: 'Pick up local crafts, enjoy a breathtaking sunset, and celebrate the finale.' }
  ];

  return themes[(day - 1) % themes.length];
}

function generateActivitiesForDay(
  day: number,
  destination: string
): ActivitySlot[] {
  const dest = destination.toLowerCase();

  if (dest.includes('tokyo') || dest.includes('japan')) {
    return getTokyoActivities(day);
  } else if (dest.includes('paris') || dest.includes('france')) {
    return getParisActivities(day);
  } else if (dest.includes('bali') || dest.includes('indonesia')) {
    return getBaliActivities(day);
  }

  // Generic curated activities for any destination
  return [
    {
      id: `act-${day}-1`,
      timeSlot: 'Morning',
      title: `Guided City Walking Tour & Old Town Exploration`,
      description: `Join a local historian for a 2.5-hour immersion into historic architecture, hidden courtyards, and local coffee culture.`,
      category: 'Culture',
      location: `Old Town Center, ${destination}`,
      estimatedCost: 35,
      durationHours: 3,
      tips: 'Wear comfortable walking shoes and bring camera.'
    },
    {
      id: `act-${day}-2`,
      timeSlot: 'Afternoon',
      title: `Artisan Food Market Tasting & Lunch Experience`,
      description: `Sample regional delicacies, freshly baked breads, signature cheeses, and artisan desserts at the central market.`,
      category: 'Dining',
      location: `Central Market Hall`,
      estimatedCost: 45,
      durationHours: 2.5,
      tips: 'Come hungry! Covers 6 distinct tasting stalls.'
    },
    {
      id: `act-${day}-3`,
      timeSlot: 'Evening',
      title: `Sunset View Deck & Fine Local Gastronomy`,
      description: `Watch the city lights come alive from the highest observation terrace followed by a multi-course dinner at a top-rated bistro.`,
      category: 'Sightseeing',
      location: `Skyline Observatory`,
      estimatedCost: 65,
      durationHours: 3.5,
      tips: 'Reservations pre-confirmed. Arrive 15 minutes before sunset.'
    }
  ];
}

function getTokyoActivities(day: number): ActivitySlot[] {
  const daySchedules: Record<number, ActivitySlot[]> = {
    1: [
      {
        id: 'tokyo-1-m',
        timeSlot: 'Morning',
        title: 'Senso-ji Temple & Asakusa Traditional Nakamise Street',
        description: 'Explore Tokyo’s oldest Buddhist temple, witness morning incense rituals, and sample hot melonpan and dango.',
        category: 'Culture',
        location: 'Asakusa, Taito City',
        estimatedCost: 15,
        durationHours: 3,
        tips: 'Visit early to avoid crowds. Take photos at Kaminarimon Gate.'
      },
      {
        id: 'tokyo-1-a',
        timeSlot: 'Afternoon',
        title: 'Sumida River Cruise to Odaiba Futuristic Bay',
        description: 'Board the futuristic Himiko water bus for a scenic river trip to Odaiba, featuring the giant Unicorn Gundam and teamLab Planets.',
        category: 'Sightseeing',
        location: 'Odaiba Bay',
        estimatedCost: 35,
        durationHours: 3.5,
        tips: 'Pre-booked teamLab digital art tickets included.'
      },
      {
        id: 'tokyo-1-e',
        timeSlot: 'Evening',
        title: 'Shibuya Crossing & Omoide Yokocho Yakitori Alley',
        description: 'Experience the world’s busiest pedestrian intersection before navigating retro lantern-lit alleyways for charcoal-grilled skewers and sake.',
        category: 'Dining',
        location: 'Shibuya & Shinjuku',
        estimatedCost: 50,
        durationHours: 3,
        tips: 'Try the tsukune (chicken meatballs) and cold draft beer.'
      }
    ],
    2: [
      {
        id: 'tokyo-2-m',
        timeSlot: 'Morning',
        title: 'Meiji Jingu Shrine & Harajuku Takeshita Street',
        description: 'Walk through serene evergreen forest paths into Meiji Shrine, then cross into colorful pop-culture fashion alleys.',
        category: 'Culture',
        location: 'Harajuku / Shibuya',
        estimatedCost: 20,
        durationHours: 3,
        tips: 'Try Marion Crepes on Takeshita Street.'
      },
      {
        id: 'tokyo-2-a',
        timeSlot: 'Afternoon',
        title: 'Tsukiji Outer Market Food Tour & Sushi Masterclass',
        description: 'Savor fresh tamagoyaki, wagyu skewers, king crab leg, and watch a master chef prepare nigiri sushi.',
        category: 'Dining',
        location: 'Tsukiji Outer Market',
        estimatedCost: 65,
        durationHours: 2.5,
        tips: 'Cash recommended for small food stalls.'
      },
      {
        id: 'tokyo-2-e',
        timeSlot: 'Evening',
        title: 'Roppongi Hills Observatory & Cocktail Lounge',
        description: 'Ascend Tokyo City View outdoor sky deck for 360-degree night views of Tokyo Tower and Mount Fuji silhouette.',
        category: 'Sightseeing',
        location: 'Roppongi Hills',
        estimatedCost: 45,
        durationHours: 3,
        tips: 'Dress smart-casual for the sky lounge.'
      }
    ]
  };

  return daySchedules[day] || [
    {
      id: `tokyo-${day}-m`,
      timeSlot: 'Morning',
      title: 'Akihabara Tech & Vintage Anime District Exploration',
      description: 'Discover multi-story electronics arcades, retro gaming shops, and manga collectibles.',
      category: 'Shopping',
      location: 'Akihabara Electric Town',
      estimatedCost: 25,
      durationHours: 3
    },
    {
      id: `tokyo-${day}-a`,
      timeSlot: 'Afternoon',
      title: 'Shinjuku Gyoen National Garden Tea Ceremony',
      description: 'Relax in traditional Japanese gardens, footbridges, and participate in an authentic matcha tea ritual.',
      category: 'Relaxation',
      location: 'Shinjuku Gyoen',
      estimatedCost: 30,
      durationHours: 2.5
    },
    {
      id: `tokyo-${day}-e`,
      timeSlot: 'Evening',
      title: 'Michelin-Rated Ramen Tasting & Golden Gai Bars',
      description: 'Enjoy rich tonkotsu or shoyu broth ramen followed by drinks in miniature 6-seat Tokyo bars.',
      category: 'Dining',
      location: 'Golden Gai, Shinjuku',
      estimatedCost: 55,
      durationHours: 3.5
    }
  ];
}

function getParisActivities(day: number): ActivitySlot[] {
  return [
    {
      id: `paris-${day}-m`,
      timeSlot: 'Morning',
      title: 'Louvre Museum Priority Entry & Masterpiece Highlights',
      description: 'View Mona Lisa, Venus de Milo, and Winged Victory with a curated audio guide route.',
      category: 'Culture',
      location: '1st Arrondissement',
      estimatedCost: 40,
      durationHours: 3
    },
    {
      id: `paris-${day}-a`,
      timeSlot: 'Afternoon',
      title: 'Le Marais Bakery Tour & Seine River Picnic',
      description: 'Pick up fresh baguettes, artisanal cheeses, and macarons, then relax along the Seine embankments.',
      category: 'Dining',
      location: 'Le Marais / Canal Saint-Martin',
      estimatedCost: 35,
      durationHours: 2.5
    },
    {
      id: `paris-${day}-e`,
      timeSlot: 'Evening',
      title: 'Eiffel Tower Sunset Cruise & French Bistro Dinner',
      description: 'Glide along the river on Bateaux Parisiens as the Eiffel Tower sparkles, followed by classic duck confit and Bordeaux wine.',
      category: 'Sightseeing',
      location: 'Trocadéro & Seine River',
      estimatedCost: 80,
      durationHours: 3.5
    }
  ];
}

function getBaliActivities(day: number): ActivitySlot[] {
  return [
    {
      id: `bali-${day}-m`,
      timeSlot: 'Morning',
      title: 'Tegallalang Rice Terraces & Jungle Swing Experience',
      description: 'Walk through emerald rice paddies in Ubud, soar over palm trees on the giant swing, and taste Luwak coffee.',
      category: 'Adventure',
      location: 'Ubud, Gianyar',
      estimatedCost: 25,
      durationHours: 3
    },
    {
      id: `bali-${day}-a`,
      timeSlot: 'Afternoon',
      title: 'Sacred Monkey Forest Sanctuary & Balinese Massage',
      description: 'Stroll among ancient banyan trees and macaques, followed by a 90-minute traditional Balinese spa therapy.',
      category: 'Relaxation',
      location: 'Ubud Center',
      estimatedCost: 45,
      durationHours: 3
    },
    {
      id: `bali-${day}-e`,
      timeSlot: 'Evening',
      title: 'Jimbaran Bay Sunset Seafood Feast on the Beach',
      description: 'Dine under the stars directly on the sand while enjoying freshly grilled snapper, prawns, and Balinese sambal.',
      category: 'Dining',
      location: 'Jimbaran Beach',
      estimatedCost: 50,
      durationHours: 3
    }
  ];
}
