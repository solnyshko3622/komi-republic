// API Service for Strapi backend
import type { Attraction, Category, Review } from '../types';

// Strapi response types
interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiEntity<T> {
  id: number;
  documentId?: string;
  attributes?: T;
  // Strapi v5 может возвращать данные напрямую без attributes
  [key: string]: any;
}

interface StrapiPlace {
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
  category: string;
  categoryRu: string;
  rating: number;
  image?: {
    data?: {
      attributes: {
        url: string;
      };
    };
  };
  images?: {
    data?: Array<{
      attributes: {
        url: string;
      };
    }>;
  };
  address: string;
  addressRu: string;
  openingHours?: string;
  openingHoursRu?: string;
  entryFee?: string;
  entryFeeRu?: string;
  latitude: number;
  longitude: number;
  amenities?: string[];
  isOpen?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiCategory {
  name: string;
  nameRu: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiReview {
  author: string;
  rating: number;
  comment: string;
  date: string;
  place?: {
    data?: {
      id: number;
    };
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// API Service Class
class ApiService {
  private baseUrl: string;
  private apiUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337') {
    this.baseUrl = baseUrl;
    this.apiUrl = `${baseUrl}/api`;
  }

  // Helper to get full image URL
  private getImageUrl(url?: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${this.baseUrl}${url}`;
  }

  // Transform Strapi place to Attraction
  private transformPlace(entity: StrapiEntity<StrapiPlace>): Attraction {
    // Strapi v5 может возвращать данные напрямую или через attributes
    const data = entity.attributes || entity;
    const { id } = entity;
    
    const mainImage = data.image?.data?.attributes?.url || data.image?.url;
    const additionalImages = data.images?.data?.map((img: any) =>
      this.getImageUrl(img.attributes?.url || img.url)
    ) || [];

    return {
      id: id.toString(),
      name: data.name || '',
      nameRu: data.nameRu || '',
      description: data.description || '',
      descriptionRu: data.descriptionRu || '',
      category: data.category || '',
      categoryRu: data.categoryRu || '',
      rating: data.rating || 0,
      image: this.getImageUrl(mainImage),
      images: additionalImages,
      address: data.address || '',
      addressRu: data.addressRu || '',
      openingHours: data.openingHours || '',
      openingHoursRu: data.openingHoursRu || '',
      entryFee: data.entryFee || '',
      entryFeeRu: data.entryFeeRu || '',
      coordinates: {
        lat: data.latitude || 0,
        lng: data.longitude || 0,
      },
      amenities: data.amenities || [],
      isOpen: data.isOpen !== false,
    };
  }

  // Transform Strapi category to Category
  private transformCategory(entity: StrapiEntity<StrapiCategory>): Category {
    // Strapi v5 может возвращать данные напрямую или через attributes
    const data = entity.attributes || entity;
    const { id } = entity;
    
    return {
      id: id.toString(),
      name: data.name || '',
      nameRu: data.nameRu || '',
      slug: data.slug || '',
    };
  }

  // Transform Strapi review to Review
  private transformReview(entity: StrapiEntity<StrapiReview>): Review {
    // Strapi v5 может возвращать данные напрямую или через attributes
    const data = entity.attributes || entity;
    const { id } = entity;
    
    return {
      id: id.toString(),
      attractionId: data.place?.data?.id?.toString() || data.place?.id?.toString() || '',
      author: data.author || '',
      rating: data.rating || 0,
      comment: data.comment || '',
      date: data.date || '',
    };
  }

  // Attractions
  async getAttractions(category?: string, search?: string): Promise<Attraction[]> {
    try {
      const params = new URLSearchParams({
        'populate': '*',
        'pagination[pageSize]': '100',
      });

      // Filter by category if provided
      if (category && category !== 'all') {
        params.append('filters[category][$eq]', category);
      }

      // Search filter
      if (search) {
        params.append('filters[$or][0][name][$containsi]', search);
        params.append('filters[$or][1][nameRu][$containsi]', search);
        params.append('filters[$or][2][description][$containsi]', search);
        params.append('filters[$or][3][descriptionRu][$containsi]', search);
      }

      const response = await fetch(`${this.apiUrl}/places?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json: StrapiResponse<StrapiEntity<StrapiPlace>[]> = await response.json();
      return json.data.map(entity => this.transformPlace(entity));
    } catch (error) {
      console.error('Error fetching attractions:', error);
      return [];
    }
  }

  async getAttractionById(id: string): Promise<Attraction | null> {
    try {
      const params = new URLSearchParams({
        'populate': '*',
      });

      const response = await fetch(`${this.apiUrl}/places/${id}?${params.toString()}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json: StrapiResponse<StrapiEntity<StrapiPlace>> = await response.json();
      return this.transformPlace(json.data);
    } catch (error) {
      console.error('Error fetching attraction by id:', error);
      return null;
    }
  }

  async getFeaturedAttractions(limit: number = 4): Promise<Attraction[]> {
    try {
      const params = new URLSearchParams({
        'populate': '*',
        'pagination[pageSize]': limit.toString(),
        'sort': 'rating:desc',
      });

      const response = await fetch(`${this.apiUrl}/places?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json: StrapiResponse<StrapiEntity<StrapiPlace>[]> = await response.json();
      return json.data.map(entity => this.transformPlace(entity));
    } catch (error) {
      console.error('Error fetching featured attractions:', error);
      return [];
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const params = new URLSearchParams({
        'pagination[pageSize]': '100',
        'sort': 'name:asc',
      });

      const response = await fetch(`${this.apiUrl}/categories?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json: StrapiResponse<StrapiEntity<StrapiCategory>[]> = await response.json();
      
      // Add "All" category at the beginning
      const categories = json.data.map(entity => this.transformCategory(entity));
      return [
        { id: '0', name: 'All Places', nameRu: 'Все места', slug: 'all' },
        ...categories,
      ];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [{ id: '0', name: 'All Places', nameRu: 'Все места', slug: 'all' }];
    }
  }

  // Reviews
  async getReviewsByAttractionId(attractionId: string): Promise<Review[]> {
    try {
      const params = new URLSearchParams({
        'filters[place][id][$eq]': attractionId,
        'populate': 'place',
        'pagination[pageSize]': '100',
        'sort': 'date:desc',
      });

      const response = await fetch(`${this.apiUrl}/reviews?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json: StrapiResponse<StrapiEntity<StrapiReview>[]> = await response.json();
      return json.data.map(entity => this.transformReview(entity));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  // Create a new review
  async createReview(review: Omit<Review, 'id'>): Promise<Review | null> {
    try {
      const response = await fetch(`${this.apiUrl}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            author: review.author,
            rating: review.rating,
            comment: review.comment,
            date: review.date,
            place: review.attractionId,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json: StrapiResponse<StrapiEntity<StrapiReview>> = await response.json();
      return this.transformReview(json.data);
    } catch (error) {
      console.error('Error creating review:', error);
      return null;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
