import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stocks: [],
  loading: false,
  error: null,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    setWatchlistData: (state, action) => {
      state.stocks = action.payload;
    },
    addToWatchlist: (state, action) => {
      state.stocks.push(action.payload);
    },
    removeFromWatchlist: (state, action) => {
      state.stocks = state.stocks.filter(stock => stock.symbol !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setWatchlistData, addToWatchlist, removeFromWatchlist, setLoading, setError } = watchlistSlice.actions;
export default watchlistSlice.reducer;