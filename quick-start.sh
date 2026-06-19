#!/bin/bash

# DollarsMaster Quick Start Script

echo "🚀 Starting DollarsMaster..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "📦 Starting Docker containers..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 5

echo "📚 Installing backend dependencies..."
cd backend
npm install

echo "🎨 Installing frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "✅ DollarsMaster is ready!"
echo ""
echo "📍 Backend:  http://localhost:5000"
echo "📍 Frontend: http://localhost:3000"
echo "📍 MongoDB:  mongodb://localhost:27017"
echo "📍 Redis:    localhost:6379"
echo ""
echo "To start developing:"
echo "  1. cd backend && npm run dev"
echo "  2. cd frontend && npm start"
echo ""
echo "To stop services:"
echo "  docker-compose down"
echo ""
