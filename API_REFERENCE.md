# KAIRO QUANTUM - API Quick Reference

Fast reference guide for all API endpoints.

**Base URL**: `https://api.yourdomain.com` (or `http://localhost:3002` for dev)

---

## 🔐 Authentication

All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

Response 201:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response 200:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "subscriptionPlan": "pro"
  }
}
```

---

## 🏥 Health & Status

### Quick Ping
```http
GET /api/health/ping

Response 200:
{
  "status": "ok",
  "timestamp": "2025-10-23T04:04:05.342Z",
  "uptime": 36.335770458
}
```

### Comprehensive Status
```http
GET /api/health/status

Response 200:
{
  "status": "healthy",
  "uptime": 55.108872292,
  "checks": [
    {
      "service": "PostgreSQL Database",
      "status": "healthy",
      "responseTime": 17
    },
    {
      "service": "Python Analytics",
      "status": "healthy",
      "responseTime": 269
    }
  ],
  "summary": {
    "total": 5,
    "healthy": 5,
    "degraded": 0,
    "unhealthy": 0
  }
}
```

### Database Health
```http
GET /api/health/database

Response 200:
{
  "status": "healthy",
  "responseTime": 49,
  "stats": {
    "users": 8,
    "trades": 0
  }
}
```

### List All Endpoints
```http
GET /api/health/endpoints

Response 200:
{
  "success": true,
  "totalEndpoints": 39,
  "endpoints": {
    "authentication": [...],
    "users": [...],
    "trading": [...],
    "fees": [...]
  }
}
```

---

## 💰 Fee Calculator

### Calculate Trading Fee
```http
POST /api/fees/calculate/trading
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 1000,
  "assetType": "stock"
}

Response 200:
{
  "success": true,
  "calculation": {
    "amount": 100000,
    "fee": 200,
    "tax": 0,
    "total": 100200,
    "breakdown": {
      "subtotal": "1000.00",
      "fee": "2.00",
      "tax": "0.00",
      "total": "1002.00"
    }
  }
}
```

**Asset Types**: `stock`, `crypto`, `options`

### Calculate Withdrawal Fee
```http
POST /api/fees/calculate/withdrawal
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 5000,
  "method": "instant",
  "wireDomestic": true
}

Response 200:
{
  "success": true,
  "calculation": {
    "amount": 500000,
    "fee": 7500,
    "tax": 0,
    "total": 492500,
    "breakdown": {
      "subtotal": "5000.00",
      "fee": "75.00",
      "tax": "0.00",
      "total": "4925.00"
    }
  }
}
```

**Methods**: `ach`, `wire`, `crypto`, `instant`

### Calculate Deposit Fee
```http
POST /api/fees/calculate/deposit
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 1000,
  "method": "ach"
}

Response 200:
{
  "success": true,
  "calculation": {
    "amount": 100000,
    "fee": 0,
    "tax": 0,
    "total": 100000,
    "breakdown": {
      "subtotal": "1000.00",
      "fee": "0.00",
      "tax": "0.00",
      "total": "1000.00"
    }
  }
}
```

**Methods**: `ach`, `wire`, `creditCard`, `crypto`

### Calculate Payout Fee
```http
POST /api/fees/calculate/payout
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 1000,
  "speed": "standard"
}

Response 200:
{
  "success": true,
  "calculation": {
    "amount": 100000,
    "fee": 0,
    "tax": 0,
    "total": 100000,
    "breakdown": {
      "subtotal": "1000.00",
      "fee": "0.00",
      "tax": "0.00",
      "total": "1000.00"
    }
  }
}
```

**Speeds**: `standard`, `express`, `instant`

### Get Fee Schedule
```http
GET /api/fees/schedule
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "schedule": {
    "trading": {
      "stock": {
        "baseRate": "0.25%",
        "discount": "20%",
        "effectiveRate": "0.20%",
        "min": "$1.00",
        "max": "$100.00"
      },
      "crypto": {
        "baseRate": "0.50%",
        "discount": "20%"
      },
      "options": {
        "perContract": "$0.65"
      }
    },
    "withdrawal": {
      "ach": "Free",
      "wireDomestic": "$25.00",
      "wireInternational": "$45.00",
      "crypto": "1% (min $5.00, max $50.00)",
      "instant": "1.5% (min $3.00)",
      "discount": "50%"
    },
    "subscriptionTier": "pro"
  }
}
```

### Get Fee Summary
```http
GET /api/fees/summary?startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "summary": {
    "totalFees": 125.50,
    "totalTax": 0,
    "transactionCount": 45,
    "byType": {
      "trading": 85.00,
      "withdrawal": 40.50
    }
  }
}
```

---

## 💳 Subscriptions & Checkout

### Get Subscription Plans
```http
GET /api/subscription/plans

Response 200:
{
  "success": true,
  "plans": [
    {
      "id": "free",
      "name": "Free",
      "price": 0,
      "interval": null,
      "features": [
        "Basic trading",
        "Standard fees"
      ]
    },
    {
      "id": "pro",
      "name": "Pro",
      "price": 49,
      "interval": "month",
      "features": [
        "Advanced trading",
        "20% fee discount",
        "50% withdrawal discount"
      ]
    },
    {
      "id": "elite",
      "name": "Elite",
      "price": 299,
      "interval": "month",
      "features": [
        "Professional trading",
        "50% fee discount",
        "FREE withdrawals"
      ]
    },
    {
      "id": "enterprise",
      "name": "Enterprise",
      "price": 199,
      "interval": "month",
      "features": [
        "Enterprise trading",
        "FREE trading fees",
        "FREE withdrawals"
      ]
    }
  ]
}
```

### Create Checkout Session
```http
POST /api/checkout/create-checkout-session
Authorization: Bearer {token}
Content-Type: application/json

{
  "priceId": "price_1234567890"
}

Response 200:
{
  "success": true,
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### Get Checkout Session
```http
GET /api/checkout/session/{sessionId}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "session": {
    "id": "cs_test_...",
    "payment_status": "paid",
    "customer_email": "user@example.com"
  }
}
```

### Sync Subscription (Admin)
```http
POST /api/subscription-sync/sync/{userId}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "user": {
    "id": "uuid",
    "subscriptionPlan": "pro"
  }
}
```

---

## 👤 User Management

### Get Current User
```http
GET /api/users/me
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "subscriptionPlan": "pro",
    "createdAt": "2025-10-23T00:00:00.000Z"
  }
}
```

### Update Current User
```http
PUT /api/users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+1234567890"
}

Response 200:
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Smith",
    "phone": "+1234567890"
  }
}
```

---

## 📊 Trading

### Place Trade
```http
POST /api/trades
Authorization: Bearer {token}
Content-Type: application/json

{
  "symbol": "AAPL",
  "quantity": 10,
  "side": "buy",
  "type": "market"
}

Response 201:
{
  "success": true,
  "trade": {
    "id": "uuid",
    "symbol": "AAPL",
    "quantity": 10,
    "side": "buy",
    "type": "market",
    "price": 150.25,
    "total": 1502.50,
    "status": "filled",
    "timestamp": "2025-10-23T10:30:00Z"
  }
}
```

### Get Trades
```http
GET /api/trades?limit=50&offset=0
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "trades": [
    {
      "id": "uuid",
      "symbol": "AAPL",
      "quantity": 10,
      "price": 150.25,
      "total": 1502.50,
      "timestamp": "2025-10-23T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0
  }
}
```

### Get Trade by ID
```http
GET /api/trades/{tradeId}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "trade": {
    "id": "uuid",
    "symbol": "AAPL",
    "quantity": 10,
    "price": 150.25,
    "details": {...}
  }
}
```

### Execute Live Trade
```http
POST /api/live-trading/execute
Authorization: Bearer {token}
Content-Type: application/json

{
  "symbol": "TSLA",
  "quantity": 5,
  "side": "sell",
  "type": "limit",
  "limitPrice": 250.00
}

Response 200:
{
  "success": true,
  "order": {
    "id": "uuid",
    "status": "pending",
    "symbol": "TSLA"
  }
}
```

---

## 💼 Portfolio Management

### Get Portfolios
```http
GET /api/portfolios
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "portfolios": [
    {
      "id": "uuid",
      "name": "Main Portfolio",
      "totalValue": 50000.00,
      "cashBalance": 10000.00,
      "performance": {
        "daily": "+2.5%",
        "total": "+15.3%"
      },
      "positions": [
        {
          "symbol": "AAPL",
          "quantity": 50,
          "avgCost": 145.00,
          "currentPrice": 150.25,
          "value": 7512.50,
          "profitLoss": "+262.50",
          "profitLossPercent": "+3.62%"
        }
      ]
    }
  ]
}
```

### Get Portfolio by ID
```http
GET /api/portfolios/{portfolioId}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "portfolio": {
    "id": "uuid",
    "name": "Main Portfolio",
    "totalValue": 50000.00,
    "positions": [...]
  }
}
```

### Update Portfolio
```http
PUT /api/portfolios/{portfolioId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Growth Portfolio"
}

Response 200:
{
  "success": true,
  "portfolio": {
    "id": "uuid",
    "name": "Growth Portfolio"
  }
}
```

---

## 🔌 Broker Connections

### Get Brokers
```http
GET /api/brokers
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "brokers": [
    {
      "id": "uuid",
      "name": "Alpaca",
      "status": "connected",
      "accountValue": 50000.00,
      "connectedAt": "2025-10-23T00:00:00Z"
    }
  ]
}
```

### Connect Broker
```http
POST /api/brokers/connect
Authorization: Bearer {token}
Content-Type: application/json

{
  "broker": "alpaca",
  "apiKey": "your_api_key",
  "secretKey": "your_secret_key"
}

Response 201:
{
  "success": true,
  "connection": {
    "id": "uuid",
    "broker": "alpaca",
    "status": "connected"
  }
}
```

### Disconnect Broker
```http
DELETE /api/brokers/{brokerId}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Broker disconnected successfully"
}
```

---

## 📈 Analytics

### Get Comparative Profit
```http
GET /api/comparative-profit/{userId}
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "analysis": {
    "actualProfit": 1250.00,
    "projectedManualProfit": 850.00,
    "difference": 400.00,
    "percentageGain": "+47%"
  }
}
```

---

## 🤖 Auto Trading

### Start Auto Trading
```http
POST /api/autotrading/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "strategy": "momentum",
  "riskLevel": "medium",
  "maxPositionSize": 1000
}

Response 200:
{
  "success": true,
  "session": {
    "id": "uuid",
    "status": "active",
    "startedAt": "2025-10-23T10:00:00Z"
  }
}
```

### Stop Auto Trading
```http
POST /api/autotrading/stop
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "message": "Auto trading stopped"
}
```

### Get Auto Trading Config
```http
POST /api/autotrading/config
Authorization: Bearer {token}
Content-Type: application/json

{
  "strategy": "scalping",
  "riskLevel": "low"
}

Response 200:
{
  "success": true,
  "config": {...}
}
```

### Get Auto Trading Stats
```http
GET /api/autotrading/stats
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "stats": {
    "totalTrades": 150,
    "profitableTrades": 95,
    "winRate": "63%",
    "totalProfit": 2450.00
  }
}
```

### Get Current Session
```http
GET /api/autotrading/session
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "session": {
    "id": "uuid",
    "status": "active",
    "duration": 3600,
    "tradesExecuted": 12
  }
}
```

---

## 📊 Market Data

### Get Market Data
```http
GET /api/market?symbols=AAPL,TSLA,MSFT
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "price": 150.25,
      "change": "+2.50",
      "changePercent": "+1.69%",
      "volume": 45123000
    }
  ]
}
```

---

## 🔔 Webhooks

### Stripe Webhook (Internal)
```http
POST /api/webhooks/stripe
Stripe-Signature: {signature}
Content-Type: application/json

{
  "type": "checkout.session.completed",
  "data": {...}
}

Response 200:
{
  "received": true
}
```

---

## 📊 Monitoring (Admin)

### Get Broker Status
```http
GET /api/monitoring
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "brokers": [
    {
      "id": "uuid",
      "status": "healthy",
      "lastCheck": "2025-10-23T10:00:00Z"
    }
  ]
}
```

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request parameters",
  "details": {
    "field": "amount",
    "message": "Amount must be a positive number"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 📈 Rate Limiting

**Default Limits:**
- 100 requests per 15 minutes per IP
- Applies to all `/api/*` endpoints

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634567890
```

---

## 🔗 Quick Links

- **Health Check**: `/api/health/status`
- **API Docs**: `/api/health/endpoints`
- **Subscription Plans**: `/api/subscription/plans`
- **Fee Schedule**: `/api/fees/schedule`

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
**Base URL**: `https://api.yourdomain.com`
