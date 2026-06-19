import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';

function Dashboard() {
  const { user } = useSelector(state => state.auth);
  const [portfolio, setPortfolio] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [portfolioRes, marketsRes] = await Promise.all([
        api.get('/trading/portfolio'),
        api.get('/deriv/markets')
      ]);
      setPortfolio(portfolioRes.data);
      setMarkets(marketsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user?.firstName}!</h2>
        <p className="text-blue-100">Your AI-powered trading assistant is ready</p>
      </div>
      
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-2">Account Balance</p>
          <p className="text-2xl font-bold text-white">${portfolio?.balance?.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-2">Equity</p>
          <p className="text-2xl font-bold text-white">${portfolio?.equity?.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-2">Open Trades</p>
          <p className="text-2xl font-bold text-green-400">{portfolio?.openTrades}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-2">Win Rate</p>
          <p className="text-2xl font-bold text-blue-400">{portfolio?.winRate}%</p>
        </div>
      </div>
      
      {/* Markets Overview */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Live Markets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {markets.map(market => (
            <div key={market.symbol} className="bg-gray-700 rounded p-4">
              <p className="text-gray-300 text-sm">{market.name}</p>
              <p className="text-white font-bold">{market.symbol}</p>
              <p className="text-gray-400 text-sm mt-2">
                Bid: {market.bid.toFixed(4)} | Ask: {market.ask.toFixed(4)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;