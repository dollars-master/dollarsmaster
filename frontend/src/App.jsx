import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import MarketAnalysis from './pages/MarketAnalysis';
import AutomatedTrading from './pages/AutomatedTrading';
import ManualTrading from './pages/ManualTrading';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Register from './pages/Register';

// Services
import { initializeWebSocket } from './services/websocket';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize WebSocket connection
    initializeWebSocket();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analysis" element={<MarketAnalysis />} />
              <Route path="/automated" element={<AutomatedTrading />} />
              <Route path="/manual" element={<ManualTrading />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;