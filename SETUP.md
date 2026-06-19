# DollarsMaster Setup Guide

## Prerequisites

- Node.js 16+ or Python 3.10+
- Git
- Docker & Docker Compose (recommended)
- Deriv API key (https://app.deriv.com/settings/api)

## Quick Start

### 1. Clone and Navigate
```bash
cd dollarsmaster
```

### 2. Backend Setup

#### Option A: Node.js Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Deriv API credentials
npm run dev
```

#### Option B: Python Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Docker Compose (All Services)
```bash
docker-compose up -d
```

## Environment Variables

Create `.env` file in backend directory:

```
# Deriv API
DERIV_API_KEY=your_api_key_here
DERIV_API_SECRET=your_api_secret_here
DERIV_APP_ID=your_app_id_here

# Database
DATABASE_URL=mongodb://localhost:27017/dollarsmaster
# or PostgreSQL: postgresql://user:password@localhost:5432/dollarsmaster

# Server
PORT=5000
NODE_ENV=development

# AI Model
MODEL_PATH=./ai-engine/models/trading_model.h5
PREDICTION_CONFIDENCE_THRESHOLD=0.75
```

## Available Services

- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **Database**: localhost:27017 (MongoDB) or localhost:5432 (PostgreSQL)
- **WebSocket**: ws://localhost:5000

## Next Steps

1. [Backend Setup Guide](./backend/README.md)
2. [Frontend Setup Guide](./frontend/README.md)
3. [AI Engine Setup](./ai-engine/README.md)
4. [API Documentation](./docs/API.md)

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.