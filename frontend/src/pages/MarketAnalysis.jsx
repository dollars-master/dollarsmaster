import React, { useEffect, useState } from 'react';
import api from '../services/api';

function MarketAnalysis() {
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [prediction, setPrediction] = useState(null);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);

  const SYMBOLS = ['EURUSD', 'GBPUSD', 'USDJPY', 'GOLD', 'SP500'];

  useEffect(() => {
    fetchAnalysis();
  }, [selectedSymbol]);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const [predRes, sigRes] = await Promise.all([
        api.get(`/analysis/predict/${selectedSymbol}`),
        api.get(`/analysis/signals/${selectedSymbol}`)
      ]);
      setPrediction(predRes.data);
      setSignals(sigRes.data);
    } catch (error) {
      console.error('Error fetching analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">AI Market Analysis</h1>
      
      {/* Symbol Selection */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
        <p className="text-gray-300 mb-4">Select Market:</p>
        <div className="flex flex-wrap gap-2">
          {SYMBOLS.map(symbol => (
            <button
              key={symbol}
              onClick={() => setSelectedSymbol(symbol)}
              className={`px-4 py-2 rounded font-medium transition ${
                selectedSymbol === symbol
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="text-white">Loading analysis...</div>
      ) : (
        <>
          {/* Prediction */}
          {prediction && (
            <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Price Prediction</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Direction</p>
                  <p className={`text-2xl font-bold ${
                    prediction.prediction.direction === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {prediction.prediction.direction.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Confidence</p>
                  <p className="text-2xl font-bold text-blue-400">{(prediction.prediction.confidence * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Target Price</p>
                  <p className="text-2xl font-bold text-white">{prediction.prediction.targetPrice.toFixed(4)}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Signals */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Trading Signals</h2>
            <div className="space-y-4">
              {signals.map((signal, idx) => (
                <div key={idx} className="bg-gray-700 rounded p-4 flex items-center justify-between">
                  <div>
                    <p className={`font-bold text-lg ${
                      signal.signal === 'BUY' ? 'text-green-400' :
                      signal.signal === 'SELL' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {signal.signal}
                    </p>
                    <p className="text-gray-300 text-sm">{signal.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{(signal.strength * 100).toFixed(1)}% Strength</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MarketAnalysis;