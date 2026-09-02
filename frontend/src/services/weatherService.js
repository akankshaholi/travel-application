import axios from 'axios';

const API_URL = 'http://localhost:8080/api/weather';

export const getWeather = async (latitude, longitude) => {
  const response = await axios.get(`${API_URL}?lat=${latitude}&lon=${longitude}`);
  return response.data;
};
