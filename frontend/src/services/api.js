import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealth = async () => {
  const res = await api.get('/health');
  return res.data;
};

export const getAgriculturalConstants = async () => {
  const res = await api.get('/farm/constants');
  return res.data;
};

export const getDemoFarm = async (farmId) => {
  const res = await api.get(`/farm/demo/${farmId}`);
  return res.data;
};

export const listDemoFarms = async () => {
  const res = await api.get('/farm/demos');
  return res.data;
};

export const analyzeFarm = async (farmData) => {
  const res = await api.post('/farm/analyze', farmData);
  return res.data;
};

export const getWeather = async (lat, lon, location) => {
  const res = await api.get('/weather', {
    params: { lat, lon, location }
  });
  return res.data;
};

export const analyzeSatellite = async (formData) => {
  const res = await api.post('/satellite/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const getDemoSatellite = async (scenario = 'moderate_stress') => {
  const res = await api.get('/satellite/demo', {
    params: { scenario }
  });
  return res.data;
};

export const sendAIChat = async (message, farmContext) => {
  const res = await api.post('/ai/chat', {
    message,
    farm_context: farmContext
  });
  return res.data;
};

export const predictStress = async (farmData) => {
  const res = await api.post('/predict/stress', farmData);
  return res.data;
};

export const recommendIrrigation = async (farmData) => {
  const res = await api.post('/recommend/irrigation', farmData);
  return res.data;
};

export const recommendCropSuitability = async (farmData) => {
  const res = await api.post('/recommend/crop', farmData);
  return res.data;
};

export const recommendSowingWindow = async (farmData) => {
  const res = await api.post('/recommend/sowing', farmData);
  return res.data;
};

export const recommendFertilizer = async (farmData) => {
  const res = await api.post('/recommend/fertilizer', farmData);
  return res.data;
};

export const evaluatePestRisk = async (farmData) => {
  const res = await api.post('/pest/risk', farmData);
  return res.data;
};

export default api;
