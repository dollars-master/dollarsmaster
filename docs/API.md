# DollarsMaster API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: { user: {...}, token: "jwt_token" }
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { user: {...}, token: "jwt_token" }
```

### Markets

#### Get Available Markets
```
GET /deriv/markets
Authorization: Bearer <token>

Response: [
  {
    "symbol": "EURUSD",
    "name": "EUR/USD",
    "category": "forex",
    "bid": 1.0850,
    "ask": 1.0852
  },
  ...
]
```

#### Get Market Quotes
```
GET /deriv/symbols/:symbol/quotes
Authorization: Bearer <token>

Response: {
  "symbol": "EURUSD",
  "bid": 1.0850,
  "ask": 1.0852,
  "last": 1.0851,
  "high": 1.0865,
  "low": 1.0835,
  "timestamp": "2024-06-19T10:30:00Z"
}
```

### Trading

#### Create Trade
```
POST /trading/trades
Authorization: Bearer <token>
Content-Type: application/json

{
  "symbol": "EURUSD",
  "direction": "call",
  "amount": 10,
  "duration": 3600,
  "durationUnit": "seconds"
}

Response: {
  "tradeId": "12345",
  "symbol": "EURUSD",
  "direction": "call",
  "entryPrice": 1.0851,
  "amount": 10,
  "status": "open",
  "createdAt": "2024-06-19T10:30:00Z"
}
```

#### Get User Trades
```
GET /trading/trades
Authorization: Bearer <token>

Query Parameters:
- status: open, closed, all
- limit: default 50
- offset: default 0

Response: [
  { tradeId: "12345", ... },
  ...
]
```

#### Close Trade
```
POST /trading/trades/:tradeId/close
Authorization: Bearer <token>

Response: {
  "tradeId": "12345",
  "status": "closed",
  "exitPrice": 1.0860,
  "profit": 45.50,
  "closedAt": "2024-06-19T11:30:00Z"
}
```

### Analysis

#### Get Price Prediction
```
GET /analysis/predict/:symbol
Authorization: Bearer <token>

Query Parameters:
- timeframe: 1h, 4h, 1d (default: 1h)

Response: {
  "symbol": "EURUSD",
  "prediction": {
    "direction": "up",
    "confidence": 0.85,
    "targetPrice": 1.0875,
    "timestamp": "2024-06-19T10:30:00Z"
  }
}
```

#### Get Trading Signals
```
GET /analysis/signals/:symbol
Authorization: Bearer <token>

Response: [
  {
    "signal": "BUY",
    "strength": 0.92,
    "reason": "Golden Cross on 4H chart",
    "timestamp": "2024-06-19T10:30:00Z"
  },
  ...
]
```

### Portfolio

#### Get Account Balance
```
GET /deriv/account/balance
Authorization: Bearer <token>

Response: {
  "balance": 5000.00,
  "equity": 5150.00,
  "availableMargin": 5000.00,
  "usedMargin": 0,
  "currency": "USD"
}
```

#### Get Portfolio
```
GET /trading/portfolio
Authorization: Bearer <token>

Response: {
  "balance": 5000.00,
  "equity": 5150.00,
  "openTrades": 3,
  "closedTrades": 25,
  "totalProfit": 150.00,
  "winRate": 0.68,
  "trades": [...]
}
```

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: { token: 'jwt_token' }
});
```

### Subscribe to Market Data
```javascript
socket.emit('subscribe-market', 'EURUSD');
socket.on('market-update', (data) => {
  console.log('Market data:', data);
});
```

### Trading Events
```javascript
socket.on('trade-opened', (trade) => {
  console.log('New trade:', trade);
});

socket.on('trade-closed', (trade) => {
  console.log('Trade closed:', trade);
});

socket.on('signal-generated', (signal) => {
  console.log('New signal:', signal);
});
```

## Error Responses

All errors return a status code with an error object:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

Common error codes:
- `UNAUTHORIZED` - Missing or invalid token
- `VALIDATION_ERROR` - Invalid request data
- `TRADE_REJECTED` - Trade cannot be executed
- `INSUFFICIENT_BALANCE` - Not enough balance
- `MARKET_CLOSED` - Market is not open
- `INTERNAL_ERROR` - Server error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Standard: 100 requests per minute
- Trading endpoints: 30 requests per minute
- WebSocket: No rate limit

Rate limit information is included in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1624089000
```