import axios from 'axios';

const API_URL = 'http://localhost:8080/api/images';

// In-memory frontend cache for the current session to avoid duplicate image API calls
const imageCache = new Map();

export const searchImage = async (query) => {
  if (!query || !query.trim()) return null;
  
  const cacheKey = query.trim().toLowerCase();
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  try {
    const response = await axios.get(`${API_URL}/search?query=${encodeURIComponent(query.trim())}`);
    const data = response.data;
    imageCache.set(cacheKey, data);
    return data;
  } catch (err) {
    // Return null so the component cleanly displays the fallback UI
    return null;
  }
};

export const getDestinationImage = async (destination) => {
  if (!destination) return null;
  const query = `${destination.name} ${destination.country || ''} travel`;
  return searchImage(query);
};

export const getPlaceImage = async (place, destinationName, country) => {
  if (!place) return null;
  const query = `${place.name} ${destinationName || ''} ${country || ''}`;
  return searchImage(query);
};
