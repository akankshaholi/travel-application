import axios from 'axios';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

// Nominatim requires a descriptive User-Agent per their usage policy
const nominatimClient = axios.create({
  baseURL: NOMINATIM_BASE,
  headers: {
    'Accept-Language': 'en',
    'User-Agent': 'TravelApp/1.0 (educational project)',
  },
});

/**
 * Search for locations by query string.
 * Returns an array of location objects with lat, lon, display_name, address, etc.
 * Min 3 chars recommended; results limited to 8.
 */
export const searchLocations = async (query) => {
  const response = await nominatimClient.get('/search', {
    params: {
      q: query,
      format: 'json',
      addressdetails: 1,
      limit: 8,
      featuretype: 'city',
    },
  });
  return response.data.map(normaliseResult);
};

/**
 * Reverse geocode coordinates into a human-readable address.
 */
export const reverseGeocode = async (latitude, longitude) => {
  const response = await nominatimClient.get('/reverse', {
    params: {
      lat: latitude,
      lon: longitude,
      format: 'json',
      addressdetails: 1,
    },
  });
  return normaliseResult(response.data);
};

/**
 * Normalise a Nominatim result into a consistent shape the app can consume.
 */
function normaliseResult(item) {
  const addr = item.address || {};
  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.municipality ||
    addr.county ||
    '';
  const state = addr.state || addr.region || '';
  const country = addr.country || '';

  // Build a short human-friendly label, e.g. "Paris, France" or "Bengaluru, Karnataka, India"
  const parts = [city, state, country].filter(Boolean);
  const displayName = parts.length > 0 ? parts.join(', ') : item.display_name;

  return {
    id: item.place_id || `${item.lat}-${item.lon}`,
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
    displayName,
    fullAddress: item.display_name,
    city,
    state,
    country,
  };
}
