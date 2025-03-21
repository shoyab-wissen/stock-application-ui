import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const watchlistApi = {
  getWatchlist: async (userId) => {
    try {
      const response = await api.get(`/portfolio/${userId}/watchlist`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to fetch watchlist';
    }
  },

  addToWatchlist: async (userId, stockId) => {
    try {
      const response = await api.post(`/portfolio/${userId}/watchlist/${stockId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to add to watchlist';
    }
  },

  removeFromWatchlist: async (userId, stockId) => {
    try {
      const response = await api.delete(`/portfolio/${userId}/watchlist/${stockId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to remove from watchlist';
    }
  }
};