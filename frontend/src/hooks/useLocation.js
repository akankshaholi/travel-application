import { useState, useCallback } from 'react';
import { reverseGeocode } from '../services/locationService';

/**
 * useLocation — manages user location state.
 *
 * Exposes:
 *   location        – { latitude, longitude, displayName, city, state, country } | null
 *   geoStatus       – 'idle' | 'requesting' | 'success' | 'denied' | 'unsupported' | 'error'
 *   geoError        – string | null
 *   requestBrowserLocation() – triggers navigator.geolocation
 *   setManualLocation(loc)   – sets a location from the search results
 *   clearLocation()          – resets to null
 */
export function useLocation() {
  const [location, setLocation] = useState(null);
  const [geoStatus, setGeoStatus] = useState('idle'); // idle | requesting | success | denied | unsupported | error
  const [geoError, setGeoError] = useState(null);

  const requestBrowserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus('unsupported');
      setGeoError('Location services are not supported by your browser.');
      return;
    }

    setGeoStatus('requesting');
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const resolved = await reverseGeocode(latitude, longitude);
          setLocation({ ...resolved, latitude, longitude });
          setGeoStatus('success');
        } catch {
          // Even if reverse geocoding fails, save the raw coordinates
          setLocation({
            latitude,
            longitude,
            displayName: `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`,
            city: '',
            state: '',
            country: '',
          });
          setGeoStatus('success');
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeoStatus('denied');
          setGeoError('Location access was denied. Search for a location instead.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGeoStatus('error');
          setGeoError('Unable to determine your location. Position unavailable.');
        } else if (err.code === err.TIMEOUT) {
          setGeoStatus('error');
          setGeoError('Location request timed out. Please try again.');
        } else {
          setGeoStatus('error');
          setGeoError('Unable to determine your location.');
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const setManualLocation = useCallback((loc) => {
    setLocation(loc);
    setGeoStatus('success');
    setGeoError(null);
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setGeoStatus('idle');
    setGeoError(null);
  }, []);

  return {
    location,
    geoStatus,
    geoError,
    requestBrowserLocation,
    setManualLocation,
    clearLocation,
  };
}
