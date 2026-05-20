import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCartOpen: false,
  isDetailOpen: false,
  selectedProduct: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    openDetail: (state, action) => {
      state.selectedProduct = action.payload;
      state.isDetailOpen = true;
    },
    closeDetail: (state) => {
      state.selectedProduct = null;
      state.isDetailOpen = false;
    },
  },
});

export const { openCart, closeCart, toggleCart, openDetail, closeDetail } = uiSlice.actions;
export default uiSlice.reducer;
