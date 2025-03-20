import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stocks: [],
  totalValue: 0,
  dailyGainLoss: 0,
  loading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setPortfolioData: (state, action) => {
      state.stocks = action.payload.stocks;
      state.totalValue = action.payload.totalValue;
      state.dailyGainLoss = action.payload.dailyGainLoss;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setPortfolioData, setLoading, setError } = portfolioSlice.actions;
export default portfolioSlice.reducer;