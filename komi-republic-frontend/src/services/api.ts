// API Service for Django REST Framework backend
import type { Attraction, Category, Review } from '../types';

interface DjangoPlace {
  id: number;
  name: string;
  name_ru: string;
  description: string;
  description_ru?: string;
  category_slug: string;
  category_name_ru: string;
  rating: number;
  image_url?: string;
  address: string;
  address_ru?: string;
  latitude?: number;
  longitude?: number;
}

interface DjangoPlaceDetail extends DjangoPlace {
  category: {
    id: number;
    name: string;
    name_ru: string;
    slug: string;
  };
  images: Array<{
    id: number;
    url: string;
    caption?: string;
    order: number;
  }>;
  opening_hours?: string;
  opening_hours_ru?: string;
  entry_fee?: string;
  entry_fee_ru?: string;
  amenities?: string[];
  is_open: boolean;
  created_at: string;
  updated_at: string;
}

interface DjangoCategory {
  id: number;
  name: string;
  name_ru: string;
  slug: string;
}

interface DjangoReview {
  id: number;
  place: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  created_at: string;
}

// API Service Class
class ApiService {
  private apiUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:8000') {
    this.apiUrl = `${baseUrl}/api`;
  }

  // Transform Django place to Attraction
  private transformPlace(place: DjangoPlace | DjangoPlaceDetail): Attraction {
    return {
      id: place.id.toString(),
      documentId: place.id.toString(),
      name: place.name,
      nameRu: place.name_ru,
      description: place.description,
      category: place.category_slug,
      categoryRu: place.category_name_ru,
      rating: place.rating,
      image: place.image_url || '',
      images: 'images' in place ? place.images.map(img => img.url) : [],
      address: place.address,
      openingHours: 'opening_hours' in place ? place.opening_hours : undefined,
      entryFee: 'entry_fee' in place ? place.entry_fee : undefined,
      latitude: place.latitude,
      longitude: place.longitude,
    };
  }

  // Transform Django category to Category
  private transformCategory(category: DjangoCategory): Category {
    return {
      id: category.id.toString(),
      name: category.name,
      nameRu: category.name_ru,
      slug: category.slug,
    };
  }

  // Transform Django review to Review
  private transformReview(review: DjangoReview): Review {
    return {
      id: review.id.toString(),
      attractionId: review.place.toString(),
      author: review.author,
      rating: review.rating,
      comment: review.comment,
      date: review.date,
    };
  }

  // Attractions
  async getAttractions(category?: string, search?: string): Promise<Attraction[]> {
    try {
      const params = new URLSearchParams();

      // Filter by category if provided
      if (category && category !== 'all') {
        params.append('category', category);
      }

      // Search filter
      if (search) {
        params.append('search', search);
      }

      const url = `${this.apiUrl}/places/${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Django REST Framework может возвращать либо массив, либо объект с results
      const places: DjangoPlace[] = Array.isArray(data) ? data : (data.results || []);
      return places.map(place => this.transformPlace(place));
    } catch (error) {
      console.error('Error fetching attractions:', error);
      return [];
    }
  }

  async getAttractionById(id: string): Promise<Attraction | null> {
    try {
      const response = await fetch(`${this.apiUrl}/places/${id}/`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const place: DjangoPlaceDetail = await response.json();
      return this.transformPlace(place);
    } catch (error) {
      console.error('Error fetching attraction by id:', error);
      return null;
    }
  }

  async getFeaturedAttractions(limit: number = 4): Promise<Attraction[]> {
    try {
      const response = await fetch(`${this.apiUrl}/places/featured/?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const places: DjangoPlace[] = await response.json();
      return places.map(place => this.transformPlace(place));
    } catch (error) {
      console.error('Error fetching featured attractions:', error);
      return [];
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${this.apiUrl}/categories/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const categories: DjangoCategory[] = Array.isArray(data) ? data : (data.results || []);
      
      // Add "All" category at the beginning
      const transformedCategories = categories.map(cat => this.transformCategory(cat));
      return [
        { id: '0', name: 'All Places', nameRu: 'Все места', slug: 'all' },
        ...transformedCategories,
      ];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [{ id: '0', name: 'All Places', nameRu: 'Все места', slug: 'all' }];
    }
  }

  // Reviews
  async getReviewsByAttractionId(attractionId: string): Promise<Review[]> {
    try {
      const response = await fetch(`${this.apiUrl}/reviews/?place=${attractionId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const reviews: DjangoReview[] = Array.isArray(data) ? data : (data.results || []);
      return reviews.map(review => this.transformReview(review));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  // Create a new review
  async createReview(review: Omit<Review, 'id'>): Promise<Review | null> {
    try {
      const response = await fetch(`${this.apiUrl}/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          place: parseInt(review.attractionId),
          author: review.author,
          rating: review.rating,
          comment: review.comment,
          date: review.date,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const djangoReview: DjangoReview = await response.json();
      return this.transformReview(djangoReview);
    } catch (error) {
      console.error('Error creating review:', error);
      return null;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
