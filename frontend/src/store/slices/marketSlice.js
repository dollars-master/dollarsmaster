import { createSlice } from '@reduxjs/toolkit';

const marketSlice = createSlice({
  name: 'market',
  initialState: {
    markets: [],
    selectedSymbol: 'EURUSD',
    quotes: {},
    loading: false,
    error: null
  },
  reducers: {
    setMarkets: (state, action) => {
      state.markets = action.payload;
    },
    setSelectedSymbol: (state, action) => {
      state.selectedSymbol = action.payload;
    },
    updateQuote: (state, action) => {
      state.quotes[action.payload.symbol] = action.payload;
    }
  }
});

export const { setMarkets, setSelectedSymbol, updateQuote } = marketSlice.actions;
export default marketSlice.reducer;