import axios from 'axios';
import { firebaseAuth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 second timeout — fail fast instead of hanging
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token cache to avoid slow Firebase refresh calls on every request
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getAuthToken(): Promise<string | null> {
  const user = firebaseAuth.currentUser;
  if (!user) return null;

  const now = Date.now();
  // Reuse cached token if still valid (refresh 5 min before expiry)
  if (cachedToken && now < tokenExpiry - 5 * 60 * 1000) {
    return cachedToken;
  }

  // Get fresh token (forces refresh only when truly expired)
  const token = await user.getIdToken();
  cachedToken = token;
  tokenExpiry = now + 55 * 60 * 1000; // Firebase tokens last 60 min, cache for 55
  return token;
}

// Clear token cache on auth state changes (logout, etc.)
firebaseAuth.onAuthStateChanged(() => {
  cachedToken = null;
  tokenExpiry = 0;
});

// Attach Firebase auth token to every request
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token may have been revoked — clear cache and sign out
      cachedToken = null;
      tokenExpiry = 0;
      firebaseAuth.signOut();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
