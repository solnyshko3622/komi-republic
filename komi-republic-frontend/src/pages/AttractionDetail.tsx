import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Attraction, Review } from '../types';
import { apiService } from '../services/api';

export default function AttractionDetail() {
  const { id } = useParams<{ id: string }>();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [nearbyAttractions, setNearbyAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const loadAttractionData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const [attractionData, reviewsData, nearbyData] = await Promise.all([
          apiService.getAttractionById(id),
          apiService.getReviewsByAttractionId(id),
          apiService.getFeaturedAttractions(4),
        ]);
        
        setAttraction(attractionData);
        setReviews(reviewsData);
        setNearbyAttractions(nearbyData.filter(a => a.id !== id));
      } catch (error) {
        console.error('Failed to load attraction data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAttractionData();
  }, [id]);

  if (loading) {
    return (
      <div className="loading" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="empty-state" style={{ minHeight: '100vh' }}>
        <span className="material-symbols-outlined empty-state-icon">location_off</span>
        <p className="empty-state-text mb-4">Достопримечательность не найдена</p>
        <Link to="/attractions" className="card-link">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  const displayImages = attraction.images.length > 0 ? attraction.images : [attraction.image];

  return (
    <main className="main-content" style={{ padding: '1.5rem 2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/" className="breadcrumb-link">Главная</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/attractions" className="breadcrumb-link">Достопримечательности</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{attraction.nameRu}</span>
      </div>

      {/* Header & Intro */}
      <div className="detail-header">
        <div className="flex flex-col gap-2">
          <h1 className="detail-title">{attraction.nameRu}</h1>
          <p className="detail-subtitle">{attraction.categoryRu}</p>
        </div>
        <div className="detail-actions">
          <button className="icon-button">
            <span className="material-symbols-outlined">favorite</span>
          </button>
          <button className="icon-button">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="detail-grid">
        {/* Left Column: Gallery & Description */}
        <div className="detail-main">
          {/* Main Feature Image */}
          <div className="detail-image">
            <div 
              className="detail-image-bg"
              style={{ backgroundImage: `url('${displayImages[selectedImageIndex]}')` }}
            />
          </div>

          {/* Carousel / Gallery Strip */}
          {displayImages.length > 1 && (
            <div className="gallery-strip">
              {displayImages.map((image, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`gallery-thumb ${selectedImageIndex === index ? 'active' : ''}`}
                >
                  <div 
                    className="gallery-thumb-bg"
                    style={{ backgroundImage: `url('${image}')` }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 className="text-2xl font-bold mb-4">О достопримечательности</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.75' }}>
                {attraction.descriptionRu}
              </p>
            </div>

            {/* Features / Amenities */}
            {attraction.amenities.length > 0 && (
              <div className="grid grid-cols-2" style={{ 
                gap: '1rem', 
                padding: '1.5rem 0', 
                borderTop: '1px solid var(--slate-200)', 
                borderBottom: '1px solid var(--slate-200)' 
              }}>
                {attraction.amenities.includes('parking') && (
                  <div className="flex items-center gap-2" style={{ color: 'var(--slate-700)' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>local_parking</span>
                    <span className="text-sm font-bold">Парковка</span>
                  </div>
                )}
                {attraction.amenities.includes('museum') && (
                  <div className="flex items-center gap-2" style={{ color: 'var(--slate-700)' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>museum</span>
                    <span className="text-sm font-bold">Музей</span>
                  </div>
                )}
                {attraction.amenities.includes('photo_allowed') && (
                  <div className="flex items-center gap-2" style={{ color: 'var(--slate-700)' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>camera_alt</span>
                    <span className="text-sm font-bold">Фото разрешено</span>
                  </div>
                )}
                {attraction.amenities.includes('audio_guide') && (
                  <div className="flex items-center gap-2" style={{ color: 'var(--slate-700)' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>translate</span>
                    <span className="text-sm font-bold">Аудиогид</span>
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 className="text-2xl font-bold">Отзывы посетителей</h3>
                  <a href="#" className="card-link">
                    Смотреть все ({reviews.length})
                  </a>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reviews.map((review) => (
                    <div key={review.id} className="card" style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ 
                            width: '2rem', 
                            height: '2rem', 
                            borderRadius: '50%', 
                            backgroundColor: '#f3e8ff', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: '#6b21a8', 
                            fontWeight: 700, 
                            fontSize: '0.75rem' 
                          }}>
                            {review.author.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-bold">{review.author}</span>
                        </div>
                        <div style={{ display: 'flex', color: '#facc15', fontSize: '0.875rem' }}>
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined fill-current" style={{ fontSize: '18px' }}>star</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Info Sidebar */}
        <div>
          <div style={{ position: 'sticky', top: '6rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Info Card */}
            <div className="info-card">
              {/* Map Placeholder */}
              <div className="info-card-map">
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  pointerEvents: 'none' 
                }}>
                  <span className="material-symbols-outlined" style={{ color: '#ef4444', fontSize: '2.5rem', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>
                    location_on
                  </span>
                </div>
                <button className="btn btn-primary" style={{ 
                  position: 'absolute', 
                  bottom: '0.75rem', 
                  right: '0.75rem', 
                  fontSize: '0.75rem', 
                  padding: '0.375rem 0.75rem' 
                }}>
                  Открыть карту
                </button>
              </div>
              
              <div className="info-card-content">
                {/* Address */}
                <div className="info-item">
                  <div style={{ marginTop: '0.125rem', minWidth: '1.25rem' }}>
                    <span className="material-symbols-outlined info-icon">location_city</span>
                  </div>
                  <div>
                    <p className="info-label">Адрес</p>
                    <p className="info-value">{attraction.addressRu}</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="info-item">
                  <div style={{ marginTop: '0.125rem', minWidth: '1.25rem' }}>
                    <span className="material-symbols-outlined info-icon">schedule</span>
                  </div>
                  <div>
                    <p className="info-label">Часы работы</p>
                    {attraction.isOpen && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="status-badge">Открыто</span>
                      </div>
                    )}
                    <p className="info-value">{attraction.openingHoursRu}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="info-item">
                  <div style={{ marginTop: '0.125rem', minWidth: '1.25rem' }}>
                    <span className="material-symbols-outlined info-icon">payments</span>
                  </div>
                  <div>
                    <p className="info-label">Стоимость</p>
                    <p className="info-value">{attraction.entryFeeRu}</p>
                  </div>
                </div>

                <hr className="divider" />

                <button className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', boxShadow: '0 10px 15px -3px rgba(19, 127, 236, 0.3)' }}>
                  <span className="material-symbols-outlined">directions</span>
                  Построить маршрут
                </button>
                
                <button className="btn" style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem', 
                  padding: '0.625rem',
                  backgroundColor: 'var(--slate-100)',
                  color: 'var(--slate-900)'
                }}>
                  <span className="material-symbols-outlined">call</span>
                  Контакты
                </button>
              </div>
            </div>

            {/* Rating Display */}
            <div style={{ 
              background: 'linear-gradient(to bottom right, rgba(19, 127, 236, 0.1), transparent)', 
              borderRadius: '0.75rem', 
              padding: '1rem', 
              border: '1px solid rgba(19, 127, 236, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>Рейтинг</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{attraction.rating}</span>
                  <span className="material-symbols-outlined" style={{ color: '#facc15' }}>star</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Attractions Section */}
      {nearbyAttractions.length > 0 && (
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--slate-200)' }}>
          <h3 className="text-2xl font-bold mb-6">Рядом находятся</h3>
          <div className="grid grid-cols-1 grid-cols-lg-4" style={{ gap: '1.5rem' }}>
            {nearbyAttractions.map((nearby) => (
              <Link key={nearby.id} to={`/attractions/${nearby.id}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: 'var(--slate-200)' }}>
                  <div 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      backgroundImage: `url('${nearby.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'transform 0.5s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                <div>
                  <h4 className="font-bold" style={{ transition: 'color 0.2s' }}>
                    {nearby.nameRu}
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--slate-500)' }}>{nearby.categoryRu}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
