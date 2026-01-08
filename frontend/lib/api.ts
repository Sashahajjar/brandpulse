import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Brand API calls
export const getBrands = async () => {
  const response = await api.get('/brands');
  return response.data;
};

export const getBrandById = async (id: string) => {
  const response = await api.get(`/brands/${id}`);
  return response.data;
};

// Insights API calls
export const getInsights = async (params?: {
  brandId?: string;
  metricType?: string;
  period?: string;
}) => {
  const response = await api.get('/insights', { params });
  return response.data;
};

export const getBrandInsights = async (brandId: string) => {
  const response = await api.get(`/insights/brand/${brandId}`);
  return response.data;
};




