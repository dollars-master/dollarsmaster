import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tradingReducer from './slices/tradingSlice';
import marketReducer from './slices/marketSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trading: tradingReducer,
    market: marketReducer,
    ui: uiReducer
  }
});

export default store;