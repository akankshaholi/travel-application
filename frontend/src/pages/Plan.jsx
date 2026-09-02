import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateItinerary } from '../services/aiService';
import Itinerary from '../components/Itinerary';

const TRAVEL_STYLES = ['Standard', 'Budget', 'Luxury', 'Adventure', 'Relaxed', 'Family'];
const INTEREST_OPTIONS = ['Culture', 'Food', 'Shopping', 'Nature', 'History', 'Nightlife'];

function Plan() {
  const [searchParams] = useSearchParams();
  const initialDest = searchParams.get('destination') || '';

  const [destination, setDestination] = useState(initialDest);
  const [country, setCountry] = useState('');
  const [days, setDays] = useState(4);
  const [travelStyle, setTravelStyle] = useState('Standard');
  const [selectedInterests, setSelectedInterests] = useState(['Culture', 'Food']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itineraryResult, setItineraryResult] = useState(null);

  useEffect(() => {
    if (initialDest) {
      setDestination(initialDest);
    }
  }, [initialDest]);

  const toggleInterest = (item) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!destination || !destination.trim()) {
      setError('Destination is required.');
      return;
    }

    const numDays = parseInt(days, 10);
    if (isNaN(numDays) || numDays < 1 || numDays > 14) {
      setError('Trip duration must be between 1 and 14 days.');
      return;
    }

    setError(null);
    setLoading(true);
    setItineraryResult(null);

    try {
      const data = await generateItinerary({
        destination: destination.trim(),
        country: country.trim(),
        days: numDays,
        travelStyle,
        interests: selectedInterests,
      });
      setItineraryResult(data);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Unable to generate the itinerary right now. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plan-page-container">
      <header className="plan-header">
        <h1>✈️ Plan Your Trip</h1>
        <p>Personalized AI-powered itineraries tailored to your style and interests.</p>
      </header>

      {/* Input Form */}
      <form className="plan-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Destination */}
          <div className="form-group">
            <label htmlFor="plan-dest">Destination Name *</label>
            <input
              id="plan-dest"
              type="text"
              className="form-input"
              placeholder="e.g. Paris, Tokyo, Bali..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          {/* Country */}
          <div className="form-group">
            <label htmlFor="plan-country">Country (Optional)</label>
            <input
              id="plan-country"
              type="text"
              className="form-input"
              placeholder="e.g. France, Japan, Indonesia..."
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          {/* Days */}
          <div className="form-group">
            <label htmlFor="plan-days">Duration (1–14 Days) *</label>
            <input
              id="plan-days"
              type="number"
              min="1"
              max="14"
              className="form-input"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              required
            />
          </div>

          {/* Travel Style */}
          <div className="form-group">
            <label htmlFor="plan-style">Travel Style</label>
            <select
              id="plan-style"
              className="form-select"
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
            >
              {TRAVEL_STYLES.map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Interests */}
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label>Interests</label>
          <div className="checkbox-group">
            {INTEREST_OPTIONS.map((item) => (
              <label key={item} className="checkbox-chip">
                <input
                  type="checkbox"
                  checked={selectedInterests.includes(item)}
                  onChange={() => toggleInterest(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
          >
            {loading ? 'Creating your itinerary…' : '✨ Generate Itinerary'}
          </button>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="plan-error-banner" role="alert">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="itinerary-skeleton-wrap" aria-label="Loading itinerary">
          <div className="skeleton skeleton-h w-60" style={{ margin: '0 auto 1.5rem' }}></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="itinerary-day-card" style={{ marginBottom: '1rem' }}>
              <div className="skeleton skeleton-h w-40" style={{ marginBottom: '1rem' }}></div>
              <div className="skeleton skeleton-p" style={{ width: '90%' }}></div>
              <div className="skeleton skeleton-p" style={{ width: '80%' }}></div>
            </div>
          ))}
        </div>
      )}

      {/* Generated Itinerary */}
      {!loading && itineraryResult && (
        <Itinerary
          itineraryData={itineraryResult}
          onRegenerate={handleSubmit}
        />
      )}
    </div>
  );
}

export default Plan;
