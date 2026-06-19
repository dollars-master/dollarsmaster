# dollarsmaster

Professional AI-powered market analysis, automated trading, and manual trading platform for Deriv markets.

## Overview

DollarsMaster is a comprehensive trading platform that combines:
- **AI Market Analysis** - Advanced price prediction and trend analysis
- **Automated Trading** - Algorithmic trading with risk management
- **Manual Trading** - Real-time execution interface
- **Portfolio Management** - Track and analyze your trading performance

## Tech Stack

### Backend
- **Runtime**: Node.js / Python 3.10+
- **API Framework**: Express.js / FastAPI
- **Real-time**: Socket.io / WebSockets
- **Database**: MongoDB / PostgreSQL
- **AI/ML**: TensorFlow / PyTorch
- **Deriv Integration**: deriv-api library

### Frontend
- **Framework**: React 18+
- **State Management**: Redux Toolkit
- **Charts**: TradingView Lightweight Charts
- **Styling**: Tailwind CSS
- **Real-time**: Socket.io client

## Project Structure

```
dollarsmaster/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   ├── services/
│   │   ├── models/
│   │   ├── utils/
│   │   └── config/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── services/
│   └── package.json
├── ai-engine/
│   ├── models/
│   ├── training/
│   └── inference/
└── docker-compose.yml
```

## Getting Started

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## License

MIT License - see LICENSE file for details