// types/home.ts
export interface Home {
  id: string;
  title: string;
  location: string;
  distanceOrHighlight: string;
  dates: string;
  pricePerNight: number;
  rating: number;
  imageUrl: string;
  isGuestFavorite?: boolean;
}

// data/mockHomes.ts
export const mockHomes: Home[] = [
  {
    id: "1",
    title: "Boutique Sky Villa with Panoramic City View",
    location: "BKK1, Phnom Penh",
    distanceOrHighlight: "1.2 km from Independence Monument",
    dates: "Aug 15 - 20",
    pricePerNight: 145,
    rating: 4.95,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
    isGuestFavorite: true,
  },
  {
    id: "2",
    title: "Mekong Riverside Zen Haven & Pool",
    location: "Chroy Changvar, Phnom Penh",
    distanceOrHighlight: "Amazing waterfront views",
    dates: "Sep 1 - 6",
    pricePerNight: 98,
    rating: 4.88,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    isGuestFavorite: true,
  },
  {
    id: "3",
    title: "Minimalist Studio in Heritage French Quarter",
    location: "Daun Penh, Phnom Penh",
    distanceOrHighlight: "Steps away from the Riverside",
    dates: "Aug 22 - 27",
    pricePerNight: 65,
    rating: 4.79,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "4",
    title: "Tropical Oasis Villa with Private Saltwater Pool",
    location: "Siem Reap, Cambodia",
    distanceOrHighlight: "Near Pub Street & Old Market",
    dates: "Oct 10 - 15",
    pricePerNight: 220,
    rating: 4.98,
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
    isGuestFavorite: true,
  },
  {
    id: "5",
    title: "Cozy Modern Loft with Rooftop Access",
    location: "Toul Kork, Phnom Penh",
    distanceOrHighlight: "Quiet neighborhood retreat",
    dates: "Aug 18 - 23",
    pricePerNight: 55,
    rating: 4.72,
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "6",
    title: "Luxury Penthouse Suite & Infinity Pool",
    location: "Koh Pich, Phnom Penh",
    distanceOrHighlight: "Stunning island skyline views",
    dates: "Sep 12 - 17",
    pricePerNight: 180,
    rating: 4.92,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    isGuestFavorite: true,
  },
  {
    id: "7",
    title: "Artisan Colonial Apartment with Balcony",
    location: "Wat Phnom, Phnom Penh",
    distanceOrHighlight: "Historic architecture charm",
    dates: "Aug 25 - 30",
    pricePerNight: 85,
    rating: 4.81,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "8",
    title: "Seaside Eco-Lodge & Sunset Deck",
    location: "Otres Beach, Sihanoukville",
    distanceOrHighlight: "Direct beach access",
    dates: "Nov 5 - 10",
    pricePerNight: 125,
    rating: 4.86,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    isGuestFavorite: true,
  },
];