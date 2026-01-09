import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Attraction } from '../types';
import { apiService } from '../services/api';
import YandexMap from '../components/YandexMap';

export default function AttractionDetail() {
  const { id } = useParams<{ id: string }>();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [nearbyAttractions, setNearbyAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setShowCopyNotification(true);
      setShowShareMenu(false);
      setTimeout(() => setShowCopyNotification(false), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Не удалось скопировать ссылку');
    }
  };

  const handleShareTelegram = () => {
    if (!attraction) return;
    const text = encodeURIComponent(`${attraction.nameRu}\n${attraction.description}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  const toggleShareMenu = () => {
    setShowShareMenu(!showShareMenu);
  };

  useEffect(() => {
    const loadAttractionData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const [attractionData, nearbyData] = await Promise.all([
          apiService.getAttractionById(id),
          apiService.getFeaturedAttractions(4),
        ]);
        
        setAttraction(attractionData);
        setNearbyAttractions(nearbyData.filter(a => a.documentId !== id));
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

      {/* Copy Notification */}
      {showCopyNotification && (
        <div style={{
          position: 'fixed',
          top: '5rem',
          right: '2rem',
          backgroundColor: 'var(--primary)',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <span className="material-symbols-outlined">check_circle</span>
          <span>Ссылка скопирована в буфер обмена!</span>
        </div>
      )}

      {/* Header & Intro */}
      <div className="detail-header">
        <div className="flex flex-col gap-2">
          <h1 className="detail-title">{attraction.nameRu}</h1>
          <p className="detail-subtitle">{attraction.categoryRu}</p>
        </div>
        <div className="detail-actions" style={{ position: 'relative' }}>
          <button className="icon-button">
            <span className="material-symbols-outlined">favorite</span>
          </button>
          <button className="icon-button" onClick={toggleShareMenu} title="Поделиться">
            <span className="material-symbols-outlined">share</span>
          </button>
          
          {/* Share Menu */}
          {showShareMenu && (
            <>
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 999
                }}
                onClick={() => setShowShareMenu(false)}
              />
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                border: '1px solid var(--slate-200)',
                minWidth: '200px',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                <button
                  onClick={handleShareTelegram}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: 'var(--text-dark)',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--slate-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#0088cc' }}>
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.094.036.308.02.475z"/>
                  </svg>
                  <span>Telegram</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: 'var(--text-dark)',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--slate-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--primary)' }}>
                    content_copy
                  </span>
                  <span>Скопировать ссылку</span>
                </button>
              </div>
            </>
          )}
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
                {attraction.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Info Sidebar */}
        <div>
          <div style={{ position: 'sticky', top: '6rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Info Card */}
            <div className="info-card">
              {/* Map */}
              <div className="info-card-map">
                {attraction.latitude && attraction.longitude ? (
                  <YandexMap
                    latitude={attraction.latitude}
                    longitude={attraction.longitude}
                    placeName={attraction.nameRu}
                    zoom={15}
                  />
                ) : (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--slate-100)'
                  }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      Координаты не указаны
                    </span>
                  </div>
                )}
              </div>
              
              <div className="info-card-content">
                {/* Address */}
                <div className="info-item">
                  <div style={{ marginTop: '0.125rem', minWidth: '1.25rem' }}>
                    <span className="material-symbols-outlined info-icon">location_city</span>
                  </div>
                  <div>
                    <p className="info-label">Адрес</p>
                    <p className="info-value">{attraction.address}</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="info-item">
                  <div style={{ marginTop: '0.125rem', minWidth: '1.25rem' }}>
                    <span className="material-symbols-outlined info-icon">schedule</span>
                  </div>
                  <div>
                    <p className="info-label">Часы работы</p>
                    <p className="info-value">{attraction.openingHours || 'Не указано'}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="info-item">
                  <div style={{ marginTop: '0.125rem', minWidth: '1.25rem' }}>
                    <span className="material-symbols-outlined info-icon">payments</span>
                  </div>
                  <div>
                    <p className="info-label">Стоимость</p>
                    <p className="info-value">{attraction.entryFee || 'Не указано'}</p>
                  </div>
                </div>

                <hr className="divider" />

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
              <Link key={nearby.id} to={`/attractions/${nearby.documentId}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
