export enum AppView {
  DISCOVER = 'DISCOVER',
  ITINERARY = 'ITINERARY',
  GUIDES = 'GUIDES',
  PAYMENT = 'PAYMENT',
  PROFILE = 'PROFILE'
}

export enum ExperienceType {
  FOOD = 'Culinary',
  NATURE = 'Nature',
  CULTURE = 'Culture',
  ADVENTURE = 'Adventure',
  RELAX = 'Relaxation'
}

export interface Place {
  name: string;
  description: string;
  address?: string;
  rating?: string;
  uri?: string; // Google Maps URI
  type: ExperienceType;
}

export interface ItineraryActivity {
  time: string;
  activity: string;
  location: string;
  notes: string;
}

export interface DayPlan {
  day: number;
  theme: string;
  activities: ItineraryActivity[];
}

export interface Guide {
  id: string;
  name: string;
  bio: string;
  specialties: string[];
  rating: number;
  pricePerDay: number;
  imageUrl: string;
  reviews: number;
}

export interface PaymentDetails {
  guideId: string;
  date: string;
  travelers: number;
  totalAmount: number;
}
