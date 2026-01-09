import { useEffect, useState } from 'react';
import type { Attraction, Category } from '../types';
import { apiService } from '../services/api';
import AttractionCard from '../components/AttractionCard';
import PageHeader from '../components/PageHeader';

export default function Attractions() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadAttractions = async () => {
      setLoading(true);
      try {
        const data = await apiService.getAttractions(
          selectedCategory === 'all' ? undefined : selectedCategory,
          searchQuery || undefined
        );
        setAttractions(data);
      } catch (error) {
        console.error('Failed to load attractions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAttractions();
  }, [selectedCategory, searchQuery]);

  return (
    <main className="main-content">
      <PageHeader 
        title="Достопримечательности"
        subtitle="Исследуйте историю, культуру и природу столицы Республики Коми. Откройте для себя лучшие места для прогулок и фотосессий."
      />

      <section className="search">
        <div className="search-filters">
          <div className="search-input-wrapper">
            <div className="search-icon">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              className="search-input"
              placeholder="Поиск по названию..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Category Chips */}
          <div className="filter-chips">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`filter-chip ${selectedCategory === category.slug ? 'active' : ''}`}
              >
                {category.nameRu}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Attractions Grid Section */}
      <section className="section" style={{ backgroundColor: 'var(--background-light)' }}>
        <div className="container">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : attractions.length === 0 ? (
            <div className="empty-state">
              <span className="material-symbols-outlined empty-state-icon">search_off</span>
              <p className="empty-state-text">
                Ничего не найдено. Попробуйте изменить параметры поиска.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 grid-cols-lg-3 grid-cols-xl-4">
                {attractions.map((attraction) => (
                  <AttractionCard key={attraction.id} attraction={attraction} />
                ))}
              </div>
              
              {/* Load More Button */}
              {attractions.length >= 8 && (
                <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
                  <button className="btn" style={{ 
                    minWidth: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    border: '1px solid var(--slate-300)',
                    backgroundColor: 'white',
                    color: 'var(--slate-700)',
                    padding: '0.75rem 1.5rem'
                  }}>
                    <span className="material-symbols-outlined">refresh</span>
                    Загрузить еще
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
