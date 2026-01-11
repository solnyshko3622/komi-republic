import { Link } from 'react-router-dom';
import type { Attraction } from '../types';

interface AttractionCardProps {
  attraction: Attraction;
}

export default function AttractionCard({ attraction }: AttractionCardProps) {
  const getCategoryClass = (category: string) => {
    const classes: Record<string, string> = {
      architecture: 'category-architecture',
      places: 'category-places',
      art: 'category-art',
      museums: 'category-museums',
      parks: 'category-parks',
      monuments: 'category-monuments',
      theaters: 'category-theaters',
    };
    return classes[category] || 'category-places';
  };

  return (
    <div className="card">
      <div className="card-image">
        <div 
          className="card-image-bg"
          style={{ backgroundImage: `url('${attraction.image}')` }}
        />

      </div>
      
      <div className="card-content">
        <div className="card-meta">
          <span className={`card-category ${getCategoryClass(attraction.category)}`}>
            {attraction.categoryRu}
          </span>
          <span className="card-rating">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>star</span>
            {attraction.rating}
          </span>
        </div>
        
        <h3 className="card-title">{attraction.nameRu}</h3>
        
        <p className="card-description">{attraction.description}</p>
        
        <Link to={`/attractions/${attraction.documentId}`} className="card-link">
          Подробнее
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
