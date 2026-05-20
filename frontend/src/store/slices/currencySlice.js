import { createSlice } from '@reduxjs/toolkit';

const getInitialCurrency = () => {
  try {
    const saved = localStorage.getItem('currency');
    return saved ? JSON.parse(saved) : { code: 'INR', symbol: '₹', rate: 83.0 };
  } catch (e) {
    return { code: 'INR', symbol: '₹', rate: 83.0 };
  }
};

const currencySlice = createSlice({
  name: 'currency',
  initialState: getInitialCurrency(),
  reducers: {
    setCurrency: (state, action) => {
      const code = action.payload; // 'INR' or 'USD'
      if (code === 'INR') {
        state.code = 'INR';
        state.symbol = '₹';
        state.rate = 83.0;
      } else {
        state.code = 'USD';
        state.symbol = '$';
        state.rate = 1.0;
      }
      try {
        localStorage.setItem('currency', JSON.stringify({ code: state.code, symbol: state.symbol, rate: state.rate }));
      } catch (e) {
        console.error('Failed to save currency to localStorage', e);
      }
    }
  }
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
