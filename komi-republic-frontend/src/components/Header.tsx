import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <Link to="/" className="flex items-center gap-4">
            <div className="header-logo-icon">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>location_on</span>
            </div>
            <h2 className="header-logo-text">Сыктывкар Гид</h2>
          </Link>
        </div>
        
        <nav className="header-nav">
          <Link to="/" className="header-nav-link">
            Главная
          </Link>
          <Link to="/attractions" className="header-nav-link">
            Достопримечательности
          </Link>
          <a href="#" className="header-nav-link">
            Маршруты
          </a>
          <a href="#" className="header-nav-link">
            О городе
          </a>
          <a href="#" className="header-nav-link">
            Галерея
          </a>
        </nav>
        
        <div className="header-actions">
          <button className="btn btn-primary">
            <span>Планировщик</span>
          </button>
          <button className="menu-button">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
