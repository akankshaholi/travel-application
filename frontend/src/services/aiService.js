import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const sendChatMessage = async (chatData) => {
  const response = await axios.post(`${BASE_URL}/chat`, chatData);
  return response.data;
};

export const generateItinerary = async (itineraryData) => {
  const response = await axios.post(`${BASE_URL}/itinerary`, itineraryData);
  return response.data;
};
