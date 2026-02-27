import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// @ts-ignore
const API_URL = import.meta.env.VITE_API_URL || 'https://sakubumi-api.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Untuk refresh token cookie
});

// Request interceptor: Sisipkan token JWT di setiap request HTTP
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Nanti bisa ditambahkan Response interceptor untuk auto-refresh token API

export default api;
