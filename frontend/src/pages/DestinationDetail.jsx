import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDestinationById, getPlacesByDestination } from '../services/destinationService';
import { getDestinationImage } from '../services/imageService';
import PlaceCard from '../components/PlaceCard';
import PlaceCardSkeleton from '../components/PlaceCardSkeleton';
import WeatherCard from '../components/WeatherCard';
import Chatbot from '../components/Chatbot';

// ── Page-level skeleton ──────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <>
      <div className="skeleton skeleton-hero"></div>
      <div className="skeleton-section">
        {/* About */}
        <div className="skeleton skeleton-h w-40" style={{ marginBottom: '1.5rem' }}></div>
        <div className="skeleton skeleton-p" style={{ width: '100%' }}></div>
        <div className="skeleton skeleton-p" style={{ width: '90%' }}></div>
        <div className="skeleton skeleton-p" style={{ width: '80%', marginBottom: '2rem' }}></div>
        {/* Meta grid */}
        <div className="skeleton skeleton-h w-40" style={{ marginBottom: '1.5rem' }}></div>
        <div className="meta-grid" style={{ marginBottom: '2rem' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="meta-card">
              <div className="skeleton" style={{ width: '2rem', height: '2rem', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
              <div className="skeleton skeleton-p" style={{ width: '60%' }}></div>
              <div className="skeleton skeleton-p" style={{ width: '80%' }}></div>
            </div>
          ))}
        </div>
        {/* Places */}
        <div className="skeleton skeleton-h w-60" style={{ marginBottom: '1.5rem' }}></div>
        <div className="places-grid">
          {[...Array(6)].map((_, i) => <PlaceCardSkeleton key={i} />)}
        </div>
      </div>
    </>
  );
}

// ── Metadata card ────────────────────────────────────────────────────────────
function MetaCard({ icon, label, value }) {
  return (
    <div className="meta-card">
      <div className="meta-card-icon" aria-hidden="true">{icon}</div>
      <div className="meta-card-label">{label}</div>
      <div className="meta-card-value">{value || '—'}</div>
    </div>
  );
}

// ── Famous Places section ────────────────────────────────────────────────────
function FamousPlaces({ destinationId, destinationName, country }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPlacesByDestination(destinationId);
      setPlaces(data);
    } catch {
      setError('Unable to load famous places.');
    } finally {
      setLoading(false);
    }
  }, [destinationId]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  if (loading) {
    return (
      <div className="places-grid">
        {[...Array(6)].map((_, i) => <PlaceCardSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container" style={{ padding: '2rem' }}>
        <p className="state-desc">{error}</p>
        <button className="btn btn-primary" onClick={fetchPlaces}>Try Again</button>
      </div>
    );
  }

  if (places.length === 0) {
    return <p className="state-desc">No famous places found for this destination.</p>;
  }

  return (
    <div className="places-grid">
      {places.map(place => (
        <PlaceCard
          key={place.id}
          place={place}
          destinationName={destinationName}
          country={country}
        />
      ))}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
function DestinationDetail() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDestinationById(id);
        setDestination(data);

        // Fetch places for chatbot context
        getPlacesByDestination(id).then((p) => setPlaces(p)).catch(() => {});

        // Asynchronously fetch hero image without blocking page render
        getDestinationImage(data).then((imgData) => {
          if (imgData && imgData.imageUrl) {
            setHeroImage(imgData);
          }
        }).catch(() => {});
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Destination not found.');
        } else {
          setError('Unable to load destination details.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [id]);

  // ── Loading ──
  if (loading) return <DetailSkeleton />;

  // ── Error / Not Found ──
  if (error) {
    return (
      <div className="state-container" style={{ paddingTop: '6rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
        <h2 className="state-title">{error}</h2>
        <p className="state-desc">The destination you're looking for could not be loaded.</p>
        <Link to="/destinations" className="btn btn-primary">Back to Destinations</Link>
      </div>
    );
  }

  const heroStyle = heroImage && heroImage.imageUrl
    ? {
        backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(30, 27, 75, 0.8) 50%, rgba(49, 46, 129, 0.85) 100%), url(${heroImage.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  return (
    <main>
      {/* Back navigation */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <Link to="/destinations" className="back-nav" aria-label="Back to destinations list">
            ← Back to Destinations
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="detail-hero" style={heroStyle} aria-label={`Hero for ${destination.name}`}>
        {heroImage && heroImage.photographer && (
          <span className="image-attribution-badge">
            📷 Photo by {heroImage.photographer}
          </span>
        )}
        <div className="detail-hero-content">
          <div className="detail-hero-badge">
            <span aria-hidden="true">🌍</span>
            {destination.category}
          </div>
          <h1 className="detail-hero-title">{destination.name}</h1>
          <p className="detail-hero-location">
            {destination.country} · {destination.continent}
          </p>
          <p className="detail-hero-desc">{destination.shortDescription}</p>
          <div className="detail-hero-actions">
            <Link to={`/plan?destination=${encodeURIComponent(destination.name)}`} className="btn-hero-primary" aria-label="Plan a trip to this destination">
              ✈️ Plan My Trip
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="detail-container">

        {/* About section */}
        <section className="detail-section" aria-labelledby="about-heading">
          <h2 className="section-title" id="about-heading">About {destination.name}</h2>
          <p className="about-text">{destination.description}</p>
        </section>

        {/* Metadata cards */}
        <section className="detail-section" aria-labelledby="details-heading">
          <h2 className="section-title" id="details-heading">Destination Details</h2>
          <div className="meta-grid">
            <MetaCard icon="🏳️" label="Country" value={destination.country} />
            <MetaCard icon="🌐" label="Continent" value={destination.continent} />
            <MetaCard icon="🏷️" label="Category" value={destination.category} />
            <MetaCard icon="🗓️" label="Best Time to Visit" value={destination.bestTimeToVisit} />
            <MetaCard icon="⭐" label="Popularity Score" value={`${destination.popularity} / 100`} />
          </div>
        </section>

        {/* Current Weather */}
        {destination.latitude != null && destination.longitude != null && (
          <section className="detail-section" aria-labelledby="weather-heading">
            <h2 className="section-title" id="weather-heading">Current Weather in {destination.name}</h2>
            <WeatherCard
              latitude={destination.latitude}
              longitude={destination.longitude}
              overrideName={`${destination.name}, ${destination.country}`}
            />
          </section>
        )}

        {/* Famous Places */}
        <section className="detail-section" aria-labelledby="places-heading">
          <h2 className="section-title" id="places-heading">Famous Places in {destination.name}</h2>
          <FamousPlaces
            destinationId={id}
            destinationName={destination.name}
            country={destination.country}
          />
        </section>

      </div>

      {/* AI Travel Assistant Chatbot */}
      <Chatbot destination={destination ? { ...destination, places } : null} />

    </main>
  );
}

export default DestinationDetail;
