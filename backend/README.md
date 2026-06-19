# DollarsMaster Backend

Node.js + Express.js API server with real-time WebSocket support.

## Features

- **Deriv API Integration** - Connect to Deriv markets
- **Real-time WebSocket** - Live market data and trading updates
- **JWT Authentication** - Secure user authentication
- **Database** - MongoDB/PostgreSQL support
- **AI Integration** - Market analysis engine
- **Trading Engine** - Automated and manual trading

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Add your Deriv API credentials
3. Configure database connection

```bash
cp .env.example .env
# Edit .env with your credentials
```

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### Deriv Integration
- `GET /api/deriv/markets` - Get available markets
- `GET /api/deriv/symbols/:symbol/quotes` - Get market quotes
- `GET /api/deriv/account/balance` - Get account balance

### Trading
- `POST /api/trading/trades` - Create a trade
- `GET /api/trading/trades` - Get user trades
- `POST /api/trading/trades/:id/close` - Close a trade
- `GET /api/trading/portfolio` - Get portfolio details

### Analysis
- `GET /api/analysis/predict/:symbol` - Get AI price prediction
- `GET /api/analysis/signals/:symbol` - Get trading signals
- `GET /api/analysis/performance` - Get strategy performance

## Database Models

- **User** - User accounts and authentication
- **Trade** - Trade history and open positions
- **Signal** - AI-generated trading signals
- **Market** - Market data snapshots
- **StrategyConfig** - Automation strategy configurations

## Next Steps

1. Set up database (MongoDB or PostgreSQL)
2. Implement authentication routes
3. Create Deriv API service layer
4. Build trading engine
5. Integrate AI models

## Testing

```bash
npm test
```

## Documentation

See [API Documentation](../docs/API.md) for detailed endpoint descriptions.