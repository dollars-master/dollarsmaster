import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';

function ManualTrading() {
  const [symbol, setSymbol] = useState('EURUSD');
  const [direction, setDirection] = useState('call');
  const [amount, setAmount] = useState('10');
  const [duration, setDuration] = useState('60');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const SYMBOLS = ['EURUSD', 'GBPUSD', 'USDJPY', 'GOLD', 'SP500'];

  const handleTrade = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await api.post('/trading/trades', {
        symbol,
        direction,
        amount: parseFloat(amount),
        duration: parseInt(duration),
        durationUnit: 'seconds'
      });
      setMessage(`✅ Trade executed! Trade ID: ${response.data.tradeId}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || 'Failed to execute trade'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Manual Trading</h1>
      
      <div className="max-w-2xl">
        <form onSubmit={handleTrade} className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          {message && (
            <div className={`p-4 rounded mb-6 ${
              message.includes('✅') ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'
            }`}>
              {message}
            </div>
          )}
          
          {/* Symbol Selection */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-2">Select Market</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            >
              {SYMBOLS.map(sym => (
                <option key={sym} value={sym}>{sym}</option>
              ))}
            </select>
          </div>
          
          {/* Direction */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-2">Direction</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setDirection('call')}
                className={`flex-1 py-3 rounded font-bold transition ${
                  direction === 'call'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📈 CALL (Up)
              </button>
              <button
                type="button"
                onClick={() => setDirection('put')}
                className={`flex-1 py-3 rounded font-bold transition ${
                  direction === 'put'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📉 PUT (Down)
              </button>
            </div>
          </div>
          
          {/* Amount */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max="1000"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          
          {/* Duration */}
          <div className="mb-6">
            <label className="block text-white font-bold mb-2">Duration (seconds)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
              <option value="900">15 minutes</option>
              <option value="3600">1 hour</option>
            </select>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition disabled:opacity-50 text-lg"
          >
            {loading ? 'Executing Trade...' : '🎯 Execute Trade'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManualTrading;