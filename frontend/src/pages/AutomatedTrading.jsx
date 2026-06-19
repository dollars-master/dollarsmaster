import React, { useState } from 'react';
import api from '../services/api';

function AutomatedTrading() {
  const [strategies, setStrategies] = useState([
    {
      id: 1,
      name: 'Golden Cross Strategy',
      enabled: true,
      winRate: 68.5,
      trades: 150,
      profit: 2450.50
    },
    {
      id: 2,
      name: 'RSI Divergence',
      enabled: false,
      winRate: 62.3,
      trades: 89,
      profit: 1200.75
    }
  ]);

  const toggleStrategy = (id) => {
    setStrategies(strategies.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Automated Trading</h1>
      
      {/* Create New Strategy */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Create Trading Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Strategy Name</label>
            <input
              type="text"
              placeholder="My Strategy"
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Risk Level</label>
            <select className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>
        <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition">
          Create Strategy
        </button>
      </div>
      
      {/* Active Strategies */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Your Strategies</h2>
        <div className="space-y-4">
          {strategies.map(strategy => (
            <div key={strategy.id} className="bg-gray-700 rounded-lg p-6 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-xl font-bold text-white">{strategy.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    strategy.enabled 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {strategy.enabled ? '🟢 Active' : '⚫ Inactive'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Win Rate</p>
                    <p className="text-lg font-bold text-blue-400">{strategy.winRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Trades</p>
                    <p className="text-lg font-bold text-white">{strategy.trades}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Profit</p>
                    <p className="text-lg font-bold text-green-400">${strategy.profit.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleStrategy(strategy.id)}
                className={`ml-4 px-6 py-3 rounded font-bold transition ${
                  strategy.enabled
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {strategy.enabled ? 'Stop' : 'Start'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AutomatedTrading;