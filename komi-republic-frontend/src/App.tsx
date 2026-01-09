import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Attractions from './pages/Attractions';
import AttractionDetail from './pages/AttractionDetail';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/attractions/:id" element={<AttractionDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
