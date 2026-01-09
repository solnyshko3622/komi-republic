// Data models for the application

export interface Attraction {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
  category: string;
  categoryRu: string;
  rating: number;
  image: string;
  images: string[];
  address: string;
  addressRu: string;
  openingHours: string;
  openingHoursRu: string;
  entryFee: string;
  entryFeeRu: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  isOpen?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameRu: string;
  slug: string;
}

export interface Review {
  id: string;
  attractionId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}
