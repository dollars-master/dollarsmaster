import { createSlice } from '@reduxjs/toolkit';

const tradingSlice = createSlice({
  name: 'trading',
  initialState: {
    trades: [],
    openTrades: 0,
    closedTrades: 0,
    totalProfit: 0,
    loading: false,
    error: null
  },
  reducers: {
    addTrade: (state, action) => {
      state.trades.push(action.payload);
      state.openTrades += 1;
    },
    closeTrade: (state, action) => {
      const trade = state.trades.find(t => t.tradeId === action.payload.tradeId);
      if (trade) {
        trade.status = 'closed';
        state.openTrades -= 1;
        state.closedTrades += 1;
        state.totalProfit += trade.profit || 0;
      }
    }
  }
});

export const { addTrade, closeTrade } = tradingSlice.actions;
export default tradingSlice.reducer;