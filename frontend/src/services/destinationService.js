import axios from 'axios';

const API_URL = 'http://localhost:8080/api/destinations';

export const getDestinations = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const searchDestinations = async (query) => {
  const response = await axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const filterDestinations = async (continent, category) => {
  const params = new URLSearchParams();
  if (continent && continent !== 'All') params.append('continent', continent);
  if (category && category !== 'All') params.append('category', category);
  
  const response = await axios.get(`${API_URL}/filter?${params.toString()}`);
  return response.data;
};

export const getDestinationById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const getPlacesByDestination = async (destinationId) => {
  const response = await axios.get(`${API_URL}/${destinationId}/places`);
  return response.data;
};
