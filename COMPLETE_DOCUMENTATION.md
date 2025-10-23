# KAIRO QUANTUM - Complete Documentation

**Version**: 1.0.0
**Last Updated**: 2025-10-23
**Environment**: Production Ready

---

## 📋 Table of Contents

1. [Platform Overview](#platform-overview)
2. [System Requirements](#system-requirements)
3. [Installation Guide](#installation-guide)
4. [Configuration Guide](#configuration-guide)
5. [API Documentation](#api-documentation)
6. [User Guide](#user-guide)
7. [Admin Guide](#admin-guide)
8. [Deployment Guide](#deployment-guide)
9. [Security Guide](#security-guide)
10. [Troubleshooting](#troubleshooting)
11. [Maintenance](#maintenance)

---

## 🚀 Platform Overview

### What is KAIRO QUANTUM?

KAIRO QUANTUM is a comprehensive algorithmic trading platform featuring:

- **AI-Powered Trading Bots** - Automated trading with machine learning
- **Copy Trading** - Follow and copy successful traders
- **Real-Time Market Data** - Live quotes and charts
- **Portfolio Management** - Track and manage investments
- **Fee Calculator** - Transparent fee calculation before transactions
- **Multi-Broker Support** - Connect to Alpaca and other brokers
- **Subscription Plans** - Free, Pro, Elite, and Enterprise tiers
- **Stripe Integration** - Secure payment processing
- **Tax Management** - Automated tax calculation with Stripe Tax

### Technology Stack

**Frontend:**
- Next.js 15.5.3 (React 19)
- TypeScript
- TailwindCSS
- shadcn/ui components
- TradingView charts

**Backend:**
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL database
- WebSocket (Socket.io)
- Stripe API
- Alpaca Trading API

**Python Analytics:**
- FastAPI
- Python 3.13+
- NumPy, Pandas
- Machine learning libraries

### Architecture

```
┌─────────────────┐
│   Frontend      │
│   Next.js       │
│   Port 3000     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Backend       │
│   Express API   │
│   Port 3002     │
└────┬───┬───┬────┘
     │   │   │
     ↓   ↓   ↓
┌────┴─┐ │ ┌─┴──────┐
│ DB   │ │ │ Python │
│ 5432 │ │ │ 8000   │
└──────┘ │ └────────┘
         ↓
    ┌────┴────┐
    │ Stripe  │
    │ Alpaca  │
    └─────────┘
```

---

## 💻 System Requirements

### Development Environment

**Required:**
- Node.js 18.x or higher
- Python 3.13 or higher
- PostgreSQL 14.x or higher
- npm or yarn
- Git

**Recommended:**
- 8GB RAM minimum
- 20GB free disk space
- macOS, Linux, or Windows with WSL2

### Production Environment

**Server Specifications:**
- 4 CPU cores minimum
- 16GB RAM minimum
- 100GB SSD storage
- Ubuntu 22.04 LTS or similar

**Services:**
- PostgreSQL 14.x (or managed database)
- Redis (for caching/sessions)
- NGINX (reverse proxy)
- SSL certificate (Let's Encrypt)

---

## 📦 Installation Guide

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/KAIROQUANTUM.git
cd KAIROQUANTUM
```

### 2. Install Dependencies

**Frontend & Backend:**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

**Python Service:**
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# OR
venv\Scripts\activate  # On Windows

# Install Python dependencies
pip install fastapi uvicorn pydantic asyncpg httpx python-dotenv numpy pandas
```

### 3. Database Setup

**Create Database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE kairo_db;

# Create user (optional)
CREATE USER kairo_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE kairo_db TO kairo_user;
\q
```

**Run Migrations:**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

**Seed Database (Optional):**
```bash
npx ts-node prisma/seed.ts
```

### 4. Environment Configuration

**Frontend (.env.local):**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3002

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY=price_your_pro_monthly_id
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_ANNUAL=price_your_pro_annual_id
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_your_enterprise_id
```

**Backend (backend/.env):**
```bash
# Server Configuration
NODE_ENV=development
PORT=3002
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/kairo_db?schema=public"

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Alpaca Trading API
ALPACA_API_KEY=your_alpaca_api_key
ALPACA_SECRET_KEY=your_alpaca_secret_key
ALPACA_BASE_URL=https://paper-api.alpaca.markets

# Python Service
PYTHON_SERVICE_URL=http://localhost:8000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Python Service (.env in root):**
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/kairo_db
```

### 5. Start Services

**Option A: Automated (Recommended)**
```bash
./start-all-services.sh
```

**Option B: Manual**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Python Service
source venv/bin/activate
uvicorn main:app --reload --port 8000

# Terminal 3: Frontend
npm run dev
```

### 6. Verify Installation

```bash
# Run health check
curl http://localhost:3002/api/health/status | jq .

# Run quick API test
./backend/scripts/quick-api-test.sh
```

**Expected Output:**
```
All critical endpoints tested!
All tests PASSED ✅
```

---

## ⚙️ Configuration Guide

### Stripe Setup

#### 1. Create Stripe Account
- Go to https://stripe.com
- Create account and verify business
- Enable live mode

#### 2. Create Products
In Stripe Dashboard → Products:

**Pro Monthly:**
- Name: "Pro Monthly"
- Price: $49/month
- Recurring: Monthly
- Copy Price ID to `.env.local`

**Pro Annual:**
- Name: "Pro Annual"
- Price: $490/year
- Recurring: Yearly
- Copy Price ID to `.env.local`

**Enterprise:**
- Name: "Enterprise"
- Price: $199+/month
- Recurring: Monthly
- Copy Price ID to `.env.local`

#### 3. Configure Webhooks
- Go to Developers → Webhooks
- Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
- Select events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid`
  - `invoice.payment_failed`
- Copy webhook secret to backend `.env`

#### 4. Enable Stripe Tax
- Go to Settings → Tax
- Enable automatic tax calculation
- Configure tax registration in your jurisdictions

### Alpaca Trading Setup

#### 1. Create Alpaca Account
- Go to https://alpaca.markets
- Sign up for trading account
- Complete KYC verification

#### 2. Get API Keys
- Go to Paper Trading Dashboard
- Generate API keys
- Copy to backend `.env`:
  - `ALPACA_API_KEY`
  - `ALPACA_SECRET_KEY`

#### 3. For Production
- Switch to Live Trading
- Use production keys
- Update `ALPACA_BASE_URL` to `https://api.alpaca.markets`

### Database Configuration

#### PostgreSQL Optimization

**Edit postgresql.conf:**
```conf
# Memory Settings
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 16MB

# Connection Settings
max_connections = 100

# Performance
random_page_cost = 1.1
effective_io_concurrency = 200

# Logging
log_statement = 'mod'
log_duration = on
log_line_prefix = '%t [%p]: '
```

#### Prisma Configuration

**Connection Pooling:**
```typescript
// backend/src/server.ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['query', 'info', 'warn', 'error']
})
```

### Email Configuration (Optional)

For production, configure email service for notifications:

```bash
# Add to backend/.env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

---

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:3002`
- **Production**: `https://api.yourdomain.com`

### Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### Authentication

**POST /api/auth/register**
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

Response:
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

**POST /api/auth/login**
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "subscriptionPlan": "pro"
  }
}
```

#### Health Check

**GET /api/health/status**
```json
Response:
{
  "status": "healthy",
  "uptime": 123.45,
  "checks": [
    {
      "service": "PostgreSQL Database",
      "status": "healthy",
      "responseTime": 15
    }
  ]
}
```

#### Fee Calculation

**POST /api/fees/calculate/trading**
```json
Request:
{
  "amount": 1000,
  "assetType": "stock"
}

Response:
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

**POST /api/fees/calculate/withdrawal**
```json
Request:
{
  "amount": 5000,
  "method": "instant",
  "wireDomestic": true
}

Response:
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

**GET /api/fees/schedule**
```json
Response:
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
      }
    },
    "withdrawal": {...},
    "deposit": {...},
    "subscriptionTier": "pro"
  }
}
```

#### Subscriptions

**POST /api/checkout/create-checkout-session**
```json
Request:
{
  "priceId": "price_1234567890"
}

Response:
{
  "success": true,
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**GET /api/subscription/plans**
```json
Response:
{
  "success": true,
  "plans": [
    {
      "id": "free",
      "name": "Free",
      "price": 0,
      "features": [...]
    },
    {
      "id": "pro",
      "name": "Pro",
      "price": 49,
      "features": [...]
    }
  ]
}
```

#### Trading

**POST /api/trades**
```json
Request:
{
  "symbol": "AAPL",
  "quantity": 10,
  "side": "buy",
  "type": "market"
}

Response:
{
  "success": true,
  "trade": {
    "id": "uuid",
    "symbol": "AAPL",
    "quantity": 10,
    "price": 150.25,
    "total": 1502.50,
    "status": "filled"
  }
}
```

**GET /api/trades**
```json
Response:
{
  "success": true,
  "trades": [
    {
      "id": "uuid",
      "symbol": "AAPL",
      "quantity": 10,
      "price": 150.25,
      "timestamp": "2025-10-23T10:30:00Z"
    }
  ]
}
```

#### Portfolios

**GET /api/portfolios**
```json
Response:
{
  "success": true,
  "portfolios": [
    {
      "id": "uuid",
      "name": "Main Portfolio",
      "totalValue": 50000.00,
      "performance": "+12.5%",
      "positions": [...]
    }
  ]
}
```

#### Brokers

**GET /api/brokers**
```json
Response:
{
  "success": true,
  "brokers": [
    {
      "id": "alpaca",
      "name": "Alpaca",
      "status": "connected",
      "accountValue": 50000.00
    }
  ]
}
```

**POST /api/brokers/connect**
```json
Request:
{
  "broker": "alpaca",
  "apiKey": "your_api_key",
  "secretKey": "your_secret_key"
}

Response:
{
  "success": true,
  "connection": {
    "id": "uuid",
    "broker": "alpaca",
    "status": "connected"
  }
}
```

### Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**:
  - `X-RateLimit-Limit`: Total allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

**429 Too Many Requests:**
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid request parameters"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 👥 User Guide

### Getting Started

#### 1. Create Account
- Visit `https://yourdomain.com`
- Click "Sign Up"
- Enter email, password, and name
- Verify email address

#### 2. Choose Subscription Plan
- Navigate to "Pricing"
- Select plan: Free, Pro ($49/mo), Elite ($299/mo), or Enterprise
- For paid plans, complete Stripe checkout
- Free plan has no payment required

#### 3. Connect Broker
- Go to "Settings" → "Broker Connections"
- Select broker (Alpaca)
- Enter API credentials
- Click "Connect"

### Using the Platform

#### Dashboard
- View portfolio value and performance
- See recent trades
- Monitor account balance
- Track profit/loss

#### Trading
- Click "Trading" in navigation
- Enter symbol (e.g., AAPL)
- Choose buy/sell
- Select quantity
- Review order details
- Click "Place Order"

#### Fee Calculator
- Go to "Dashboard" → "Fee Calculator"
- Select transaction type (Trading, Withdrawal, Deposit, Payout)
- Enter amount
- See instant fee calculation
- Upgrade to save on fees

#### Copy Trading
- Navigate to "Social" tab
- Browse top traders
- View performance metrics
- Click "Copy" on trader
- Set allocation amount
- Confirm copy trading setup

#### Withdrawals
- Go to "Portfolio" → "Withdraw"
- Enter amount
- Choose method (ACH, Wire, Crypto, Instant)
- Review fees
- Confirm withdrawal
- Track withdrawal status

### Subscription Management

#### Upgrade/Downgrade
- Go to "Settings" → "Subscription"
- Click "Change Plan"
- Select new plan
- Confirm change
- Changes take effect immediately

#### Cancel Subscription
- Go to "Settings" → "Subscription"
- Click "Cancel Plan"
- Confirm cancellation
- Access continues until end of billing period

### Security

#### Two-Factor Authentication (2FA)
- Go to "Settings" → "Security"
- Enable 2FA
- Scan QR code with authenticator app
- Enter verification code
- Save backup codes

#### API Keys
- Go to "Settings" → "API Keys"
- Click "Generate New Key"
- Save secret key (shown once)
- Use for programmatic access

---

## 🛡️ Admin Guide

### Admin Dashboard

Access: `https://yourdomain.com/admin`

**Required Role**: `admin` in database

#### Service Status Dashboard

Monitor system health:
```typescript
import ServiceStatusDashboard from '@/components/admin/ServiceStatusDashboard'

// In admin page
<ServiceStatusDashboard />
```

Features:
- Real-time service health
- Response times
- Auto-refresh every 30 seconds
- Service details and errors

#### User Management

**View Users:**
```sql
SELECT id, email, name, "subscriptionPlan", "createdAt"
FROM "User"
ORDER BY "createdAt" DESC;
```

**Update User Plan:**
```sql
UPDATE "User"
SET "subscriptionPlan" = 'pro'
WHERE email = 'user@example.com';
```

**Disable User:**
```sql
UPDATE "User"
SET "isActive" = false
WHERE id = 'user_uuid';
```

#### Fee Management

**View Fee Transactions:**
```sql
SELECT * FROM "FeeTransaction"
WHERE "userId" = 'user_uuid'
ORDER BY "createdAt" DESC
LIMIT 100;
```

**Fee Statistics:**
```sql
SELECT
  "transactionType",
  COUNT(*) as count,
  SUM("feeAmount") as total_fees
FROM "FeeTransaction"
WHERE "createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY "transactionType";
```

#### Monitoring

**Check Backend Logs:**
```bash
tail -f /tmp/kairo-backend.log
```

**Check Python Service:**
```bash
tail -f /tmp/kairo-python.log
```

**Database Performance:**
```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Long running queries
SELECT pid, query, state, query_start
FROM pg_stat_activity
WHERE state = 'active'
AND query_start < NOW() - INTERVAL '1 minute';
```

### Maintenance Tasks

#### Daily
- Check health endpoints
- Review error logs
- Monitor disk space
- Verify backups

#### Weekly
- Review user activity
- Check fee transactions
- Update dependencies (security patches)
- Test restore from backup

#### Monthly
- Update SSL certificates (automated with Let's Encrypt)
- Review subscription metrics
- Database optimization
- Security audit

---

## 🚀 Deployment Guide

### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backed up
- [ ] SSL certificate ready
- [ ] Domain DNS configured
- [ ] Stripe webhooks configured
- [ ] API keys secured
- [ ] Rate limiting configured
- [ ] Monitoring setup

### Deployment Options

#### Option 1: Vercel + Railway (Recommended)

**Frontend on Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Backend on Railway:**
1. Go to https://railway.app
2. Connect GitHub repository
3. Select `backend` folder as root
4. Add environment variables
5. Deploy

**Database on Railway:**
1. Add PostgreSQL service
2. Copy DATABASE_URL
3. Run migrations

#### Option 2: VPS (Digital Ocean, AWS, etc.)

**Server Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install NGINX
sudo apt install nginx

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx
```

**Deploy Application:**
```bash
# Clone repository
git clone https://github.com/yourusername/KAIROQUANTUM.git
cd KAIROQUANTUM

# Install dependencies
npm install
cd backend && npm install && cd ..

# Build frontend
npm run build

# Setup PM2 for process management
npm install -g pm2

# Start backend
cd backend
pm2 start npm --name "kairo-backend" -- start

# Start frontend
cd ..
pm2 start npm --name "kairo-frontend" -- start

# Save PM2 config
pm2 save
pm2 startup
```

**NGINX Configuration:**
```nginx
# /etc/nginx/sites-available/kairoquantum

server {
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
}

server {
    if ($host = www.yourdomain.com) {
        return 301 https://$host$request_uri;
    }

    if ($host = yourdomain.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 404;
}
```

**Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/kairoquantum /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**SSL Certificate:**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Post-Deployment

#### 1. Verify Health
```bash
curl https://yourdomain.com/api/health/status
```

#### 2. Test Endpoints
```bash
# Update script with production URL
sed -i 's/localhost:3002/api.yourdomain.com/g' backend/scripts/quick-api-test.sh
./backend/scripts/quick-api-test.sh
```

#### 3. Monitor Services
```bash
# PM2 monitoring
pm2 monit

# Logs
pm2 logs kairo-backend
pm2 logs kairo-frontend
```

#### 4. Setup Monitoring

**Uptime Monitoring:**
- Use UptimeRobot or Pingdom
- Monitor: https://yourdomain.com/api/health/ping
- Alert on downtime

**Error Tracking:**
- Integrate Sentry
- Add to frontend and backend

---

## 🔒 Security Guide

### Best Practices

#### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use different keys for dev/prod
- ✅ Rotate secrets regularly (every 90 days)
- ✅ Use strong, random passwords
- ❌ Never expose API keys in frontend

#### API Security
- ✅ Rate limiting enabled (100 req/15min)
- ✅ JWT token expiration (24 hours)
- ✅ HTTPS only in production
- ✅ CORS configured
- ✅ Helmet.js for HTTP headers
- ❌ Never disable CORS in production

#### Database Security
- ✅ Use parameterized queries (Prisma handles this)
- ✅ Restrict database user permissions
- ✅ Regular backups
- ✅ Encrypt sensitive data
- ❌ Never expose database credentials

#### Stripe Security
- ✅ Verify webhook signatures
- ✅ Use live keys only in production
- ✅ Never log payment details
- ✅ PCI compliance maintained by Stripe

### Security Checklist

#### Before Production
- [ ] All dependencies updated
- [ ] Security audit completed
- [ ] Penetration testing done
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Database encrypted
- [ ] Backups automated
- [ ] Monitoring enabled
- [ ] Rate limiting active
- [ ] Error tracking setup

#### Ongoing
- [ ] Weekly dependency updates
- [ ] Monthly security audit
- [ ] Quarterly password rotation
- [ ] Annual penetration test
- [ ] Review logs daily
- [ ] Monitor failed login attempts
- [ ] Check for suspicious activity

### Incident Response

**If Breach Detected:**
1. Immediately disable affected services
2. Rotate all API keys and secrets
3. Notify affected users within 72 hours
4. Document incident
5. Implement fixes
6. Review security practices

---

## 🐛 Troubleshooting

### Common Issues

#### Services Won't Start

**Problem**: Port already in use
```bash
# Check what's using port
lsof -ti:3002

# Kill process
lsof -ti:3002 | xargs kill -9

# Restart services
./start-all-services.sh
```

**Problem**: Database connection failed
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check DATABASE_URL in .env
```

#### Frontend Issues

**Problem**: API calls failing with CORS errors
```typescript
// backend/src/server.ts
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
```

**Problem**: Environment variables not loading
```bash
# Ensure .env.local exists
ls -la .env.local

# Restart Next.js
npm run dev
```

#### Backend Issues

**Problem**: JWT token invalid
```bash
# Check JWT_SECRET is set
echo $JWT_SECRET

# Verify token format in Authorization header
# Should be: "Bearer eyJhbGciOiJIUzI..."
```

**Problem**: Stripe webhook failing
```bash
# Test webhook signature
stripe listen --forward-to localhost:3002/api/webhooks/stripe

# Verify STRIPE_WEBHOOK_SECRET matches
```

#### Database Issues

**Problem**: Migration failed
```bash
# Reset database (DEV ONLY)
npx prisma migrate reset

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

**Problem**: Slow queries
```sql
-- Find slow queries
SELECT query, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Add indexes
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_trade_user ON "Trade"("userId");
```

### Log Locations

**Development:**
- Backend: `/tmp/kairo-backend.log`
- Python: `/tmp/kairo-python.log`
- Frontend: `/tmp/kairo-frontend.log`

**Production (PM2):**
```bash
pm2 logs kairo-backend --lines 100
pm2 logs kairo-frontend --lines 100
```

**NGINX:**
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## 🔧 Maintenance

### Backup Strategy

#### Database Backup
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump kairo_db > /backups/kairo_db_$DATE.sql
gzip /backups/kairo_db_$DATE.sql

# Keep last 30 days
find /backups -name "kairo_db_*.sql.gz" -mtime +30 -delete
```

**Automated with cron:**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh
```

#### Application Backup
```bash
# Backup application files
tar -czf kairo_backup_$(date +%Y%m%d).tar.gz /path/to/KAIROQUANTUM

# Sync to S3 or remote storage
aws s3 sync /backups s3://your-bucket/backups/
```

### Updates

#### Dependency Updates
```bash
# Check outdated packages
npm outdated

# Update specific package
npm update package-name

# Update all (test in dev first)
npm update

# Backend
cd backend && npm update && cd ..
```

#### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Deploy to production
npx prisma migrate deploy
```

#### Security Updates
```bash
# Check vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Fix with breaking changes (test first)
npm audit fix --force
```

### Performance Optimization

#### Database
```sql
-- Vacuum database
VACUUM ANALYZE;

-- Reindex
REINDEX DATABASE kairo_db;

-- Update statistics
ANALYZE;
```

#### Backend
```bash
# Enable compression
# Already enabled in server.ts

# Optimize build
npm run build --production
```

#### Frontend
```bash
# Build optimization
npm run build

# Analyze bundle
npm run analyze
```

---

## 📞 Support

### Documentation
- **Complete Guide**: `/COMPLETE_DOCUMENTATION.md`
- **Automation Guide**: `/AUTOMATION_GUIDE.md`
- **Fees & Taxes**: `/FEES_AND_TAXES.md`
- **Quick Start**: `/QUICKSTART.md`

### Scripts
- Start services: `./start-all-services.sh`
- Stop services: `./stop-all-services.sh`
- Quick test: `./backend/scripts/quick-api-test.sh`
- Full test: `./backend/scripts/test-api-endpoints.sh`

### Health Checks
- Ping: `http://localhost:3002/api/health/ping`
- Status: `http://localhost:3002/api/health/status`
- Database: `http://localhost:3002/api/health/database`
- Endpoints: `http://localhost:3002/api/health/endpoints`

### Contact
- **Email**: support@kairoquantum.com
- **GitHub**: https://github.com/yourusername/KAIROQUANTUM
- **Documentation**: https://docs.kairoquantum.com

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
**Status**: Production Ready ✅
