import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.userData = action.payload;
    },
    updateProfile: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setProfileData, updateProfile, setLoading, setError } = profileSlice.actions;
export default profileSlice.reducer;