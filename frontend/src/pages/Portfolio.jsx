import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await api.get('/trading/portfolio');
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading portfolio...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Portfolio</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-2">Total Balance</p>
          <p className="text-3xl font-bold text-white">${portfolio?.balance?.toFixed(2)}</p>
          <p className="text-gray-500 text-xs mt-2">Account Balance</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-2">Current Equity</p>
          <p className="text-3xl font-bold text-green-400">${portfolio?.equity?.toFixed(2)}</p>
          <p className={`text-xs mt-2 ${
            (portfolio?.equity - portfolio?.balance) >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {(portfolio?.equity - portfolio?.balance) >= 0 ? '+' : '-'}${Math.abs(portfolio?.equity - portfolio?.balance).toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-2">Total Profit</p>
          <p className={`text-3xl font-bold ${
            portfolio?.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            ${portfolio?.totalProfit?.toFixed(2)}
          </p>
          <p className="text-gray-500 text-xs mt-2">All Time</p>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-xs mb-1">Open Trades</p>
          <p className="text-2xl font-bold text-white">{portfolio?.openTrades}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-xs mb-1">Closed Trades</p>
          <p className="text-2xl font-bold text-white">{portfolio?.closedTrades}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-xs mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-blue-400">{portfolio?.winRate}%</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-xs mb-1">Total Trades</p>
          <p className="text-2xl font-bold text-white">{(portfolio?.openTrades || 0) + (portfolio?.closedTrades || 0)}</p>
        </div>
      </div>
      
      {/* Recent Trades */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Trades</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400">Trade ID</th>
                <th className="text-left py-3 px-4 text-gray-400">Symbol</th>
                <th className="text-left py-3 px-4 text-gray-400">Direction</th>
                <th className="text-left py-3 px-4 text-gray-400">Amount</th>
                <th className="text-left py-3 px-4 text-gray-400">Profit</th>
                <th className="text-left py-3 px-4 text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {portfolio?.trades?.slice(0, 10).map(trade => (
                <tr key={trade.tradeId} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-3 px-4 text-gray-300 font-mono text-xs">{trade.tradeId.substring(0, 12)}...</td>
                  <td className="py-3 px-4 text-white font-bold">{trade.symbol}</td>
                  <td className={`py-3 px-4 font-bold ${
                    trade.direction === 'call' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.direction.toUpperCase()}
                  </td>
                  <td className="py-3 px-4 text-white">${trade.amount}</td>
                  <td className={`py-3 px-4 font-bold ${
                    trade.profit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ${trade.profit?.toFixed(2) || '0.00'}
                  </td>
                  <td className={`py-3 px-4 font-bold ${
                    trade.status === 'open' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {trade.status.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;