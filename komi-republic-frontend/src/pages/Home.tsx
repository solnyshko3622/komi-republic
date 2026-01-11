import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Attraction } from '../types';
import { apiService } from '../services/api';

export default function Home() {
  const [featuredAttractions, setFeaturedAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedAttractions = async () => {
      try {
        const data = await apiService.getFeaturedAttractions(4);
        setFeaturedAttractions(data);
      } catch (error) {
        console.error('Failed to load featured attractions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedAttractions();
  }, []);

  return (
    <main className="main-content">
      {/* Hero Section */}
      <section 
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://i.ytimg.com/vi/GgHeQ__khvY/maxresdefault.jpg")`
        }}
      >
        <div className="hero-content">
          <h1 className="hero-title">Откройте для себя Сыктывкар</h1>
          <h2 className="hero-subtitle">
            Сердце Республики Коми ждет вас. Погрузитесь в историю, культуру и уникальную атмосферу северного города.
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
            <Link to="/attractions" className="hero-button">
              <span style={{ marginRight: '0.5rem' }}>Смотреть места</span>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_downward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="section" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="section-title">Популярные места</h2>
              <p className="section-subtitle">Самые посещаемые достопримечательности города</p>
            </div>
            <Link to="/attractions" className="card-link" style={{ display: 'none' }}>
              Смотреть все
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 grid-cols-lg-4" style={{ gap: '1.5rem' }}>
              {featuredAttractions.map((attraction) => (
                <div key={attraction.id} style={{ cursor: 'pointer' }}>
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0.75rem', aspectRatio: '4/3', marginBottom: '1rem' }}>
                    <div 
                      style={{ 
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url('${attraction.image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'transform 0.5s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div style={{ 
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(4px)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}>
                      {attraction.categoryRu}
                    </div>
                  </div>
                  <h3 className="card-title" style={{ transition: 'color 0.2s' }}>
                    {attraction.nameRu}
                  </h3>
                  <p className="card-description">{attraction.description}</p>
                  <Link to={`/attractions/${attraction.documentId}`} className="card-link" style={{ marginTop: '0.75rem' }}>
                    Подробнее
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', marginLeft: '0.25rem' }}>arrow_forward</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
