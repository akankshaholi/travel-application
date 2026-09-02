import { useState, useEffect, useRef, useCallback } from 'react';
import { searchLocations } from '../services/locationService';

// ── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '0.9rem',
        height: '0.9rem',
        border: '2px solid rgba(255,255,255,0.4)',
        borderTopColor: 'white',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
      aria-hidden="true"
    />
  );
}

// Inject keyframe once
if (typeof document !== 'undefined') {
  if (!document.getElementById('spinner-style')) {
    const s = document.createElement('style');
    s.id = 'spinner-style';
    s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(s);
  }
}

// ── SelectedLocationCard ─────────────────────────────────────────────────────
function SelectedLocationCard({ location, onClear }) {
  return (
    <div className="selected-location-card" role="region" aria-label="Selected location">
      <div className="selected-location-info">
        <div className="selected-location-label">📍 Selected Location</div>
        <div className="selected-location-name">{location.displayName}</div>
        <div className="selected-location-coords">
          {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
          {location.country && ` · ${location.country}`}
        </div>
      </div>
      <button
        className="btn-change-location"
        onClick={onClear}
        aria-label="Change selected location"
      >
        Change Location
      </button>
    </div>
  );
}

// ── StatusBanner ─────────────────────────────────────────────────────────────
function StatusBanner({ type, icon, message }) {
  return (
    <div className={`location-status ${type}`} role="status" aria-live="polite">
      <span aria-hidden="true">{icon}</span>
      <span>{message}</span>
    </div>
  );
}

// ── SearchResults ─────────────────────────────────────────────────────────────
function SearchResults({ results, loading, error, query, onSelect }) {
  if (!query || query.length < 3) return null;
  if (loading) {
    return (
      <div className="location-results">
        <div className="location-result-empty">Searching for "{query}"…</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="location-results">
        <div className="location-result-empty" style={{ color: '#b91c1c' }}>
          Search failed. Please try again.
        </div>
      </div>
    );
  }
  if (results.length === 0) {
    return (
      <div className="location-results">
        <div className="location-result-empty">No results found for "{query}".</div>
      </div>
    );
  }
  return (
    <div className="location-results" role="listbox" aria-label="Location search results">
      {results.map((loc) => (
        <div
          key={loc.id}
          className="location-result-item"
          role="option"
          tabIndex={0}
          aria-selected="false"
          onClick={() => onSelect(loc)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(loc)}
        >
          <span className="location-result-icon" aria-hidden="true">📍</span>
          <div>
            <div className="location-result-name">{loc.city || loc.displayName}</div>
            <div className="location-result-sub">
              {[loc.state, loc.country].filter(Boolean).join(', ')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main LocationSelector ─────────────────────────────────────────────────────
/**
 * Props:
 *   location        – current location (from useLocation hook) or null
 *   geoStatus       – 'idle' | 'requesting' | 'success' | 'denied' | 'unsupported' | 'error'
 *   geoError        – string | null
 *   onUseMyLocation – () => void   triggers browser geolocation
 *   onSelectLocation – (loc) => void  sets a manually searched location
 *   onClearLocation  – () => void   clears the location
 */
function LocationSelector({
  location,
  geoStatus,
  geoError,
  onUseMyLocation,
  onSelectLocation,
  onClearLocation,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchInputRef = useRef(null);

  // Debounce the search query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Run search when debounced query changes
  const runSearch = useCallback(async (q) => {
    if (!q || q.trim().length < 3) {
      setSearchResults([]);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    try {
      const results = await searchLocations(q.trim());
      setSearchResults(results);
    } catch {
      setSearchError('Search failed.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch(debouncedQuery);
  }, [debouncedQuery, runSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSearchResults([]);
    setSearchError(null);
    searchInputRef.current?.focus();
  };

  const handleSelect = (loc) => {
    onSelectLocation(loc);
    setSearchQuery('');
    setDebouncedQuery('');
    setSearchResults([]);
  };

  const isRequesting = geoStatus === 'requesting';

  // ── If a location is already selected, show the card ──
  if (location) {
    return (
      <div className="location-selector">
        <SelectedLocationCard location={location} onClear={onClearLocation} />
      </div>
    );
  }

  return (
    <div className="location-selector">
      {/* Status banners */}
      {geoStatus === 'requesting' && (
        <StatusBanner type="loading" icon="🛰️" message="Getting your location…" />
      )}
      {(geoStatus === 'denied' || geoStatus === 'unsupported' || geoStatus === 'error') && geoError && (
        <StatusBanner type="error" icon="⚠️" message={geoError} />
      )}

      {/* Action row */}
      <div className="location-actions">
        <button
          className="btn-geo"
          onClick={onUseMyLocation}
          disabled={isRequesting}
          aria-label="Use my current browser location"
          aria-busy={isRequesting}
        >
          {isRequesting ? <Spinner /> : '📍'}
          {isRequesting ? 'Getting your location…' : 'Use My Location'}
        </button>

        <span className="location-divider">or</span>

        <div className="location-search-wrap">
          <input
            ref={searchInputRef}
            id="location-search"
            type="text"
            className="location-search-input"
            placeholder="Search city or location…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search for a city or location"
            aria-autocomplete="list"
            aria-controls="location-results-list"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              className="location-search-clear"
              onClick={handleClearSearch}
              aria-label="Clear location search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Search results */}
      <div id="location-results-list">
        <SearchResults
          results={searchResults}
          loading={searchLoading}
          error={searchError}
          query={searchQuery}
          onSelect={handleSelect}
        />
      </div>

      {/* Hint when idle */}
      {geoStatus === 'idle' && !searchQuery && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginBottom: 0 }}>
          Allow location access for automatic detection, or type a city name to search.
        </p>
      )}
    </div>
  );
}

export default LocationSelector;
