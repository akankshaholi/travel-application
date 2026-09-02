import { Link } from 'react-router-dom';
import LocationSelector from '../components/LocationSelector';
import WeatherCard from '../components/WeatherCard';
import Earth3DHero from '../components/Earth3DHero';
import { useLocation } from '../hooks/useLocation';

function Home() {
  const {
    location,
    geoStatus,
    geoError,
    requestBrowserLocation,
    setManualLocation,
    clearLocation,
  } = useLocation();

  return (
    <div className="home-page-wrapper">
      {/* ── 3D Earth Hero Container ── */}
      <div className="home-hero-earth-container">
        {/* 3D Rotating Earth Canvas */}
        <Earth3DHero />

        {/* Translucent Glass Overlay */}
        <div className="hero-earth-overlay" aria-hidden="true"></div>

        {/* Hero Content */}
        <div className="hero-content">
          <span className="hero-tagline">DISCOVER • EXPLORE • EXPERIENCE</span>
          <h1>Explore the World<br /><span className="hero-subheading-highlight">With Travel Explorer</span></h1>
          <p>Discover world destinations, check real-time weather, and get AI-powered itineraries — all in one place.</p>

          <div className="hero-cta-row">
            <Link to="/destinations" className="btn-hero-primary" id="hero-explore-btn">
              🌍 Explore Destinations
            </Link>
            <Link to="/plan" className="btn-hero-secondary" id="hero-plan-btn">
              ✈️ Plan Your Trip
            </Link>
          </div>
        </div>
      </div>

      {/* ── Feature Highlights Strip ── */}
      <section className="features-strip" aria-label="App features">
        <div className="features-strip-inner">
          <div className="feature-chip"><span>🌍</span> 3D World Exploration</div>
          <div className="feature-chip"><span>✈️</span> AI Trip Planner</div>
          <div className="feature-chip"><span>🌤️</span> Live Weather</div>
          <div className="feature-chip"><span>📸</span> Dynamic Pexels Photos</div>
        </div>
      </section>

      {/* ── Location & Weather Glassmorphism Section ── */}
      <section className="location-section" aria-labelledby="location-section-heading">
        <div className="location-section-inner location-glass-card">
          <h2 className="location-section-title" id="location-section-heading">
            🌍 Discover What's Near You
          </h2>
          <p className="location-section-subtitle">
            Use your current location or search for a city to explore real-time weather.
          </p>

          <LocationSelector
            location={location}
            geoStatus={geoStatus}
            geoError={geoError}
            onUseMyLocation={requestBrowserLocation}
            onSelectLocation={setManualLocation}
            onClearLocation={clearLocation}
          />

          {location ? (
            <WeatherCard
              latitude={location.latitude}
              longitude={location.longitude}
              overrideName={location.displayName}
            />
          ) : (
            <div className="weather-prompt-placeholder">
              🌤️ Select a location to see current weather.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;

