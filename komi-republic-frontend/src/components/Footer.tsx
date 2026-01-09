import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-header">
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--primary)' }}>
                location_on
              </span>
              <h3 className="text-lg font-bold">Сыктывкар Гид</h3>
            </div>
            <p className="footer-brand-text">
              Ваш надежный проводник по культурной столице Республики Коми.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Навигация</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">Главная</Link>
              </li>
              <li>
                <Link to="/attractions" className="footer-link">Достопримечательности</Link>
              </li>
              <li>
                <a href="#" className="footer-link">Маршруты</a>
              </li>
              <li>
                <a href="#" className="footer-link">О городе</a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Информация</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">Контакты</a>
              </li>
              <li>
                <a href="#" className="footer-link">Карта сайта</a>
              </li>
              <li>
                <a href="#" className="footer-link">Политика конфиденциальности</a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Социальные сети</h4>
            <div className="footer-social">
              <a href="#" className="social-icon">
                <span className="material-symbols-outlined">public</span>
              </a>
              <a href="#" className="social-icon">
                <span className="material-symbols-outlined">send</span>
              </a>
              <a href="#" className="social-icon">
                <span className="material-symbols-outlined">smart_display</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 Сыктывкар Гид. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
