// Data models for the application

export interface Attraction {
  id: string;
  documentId: string;
  name: string;
  nameRu: string;
  description: string;
  category: string;
  categoryRu: string;
  rating: number;
  image: string;
  images: string[];
  address: string;
  openingHours?: string;
  entryFee?: string;
  latitude?: number;
  longitude?: number;
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
