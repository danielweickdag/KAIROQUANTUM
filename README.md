# 🚀 KAIRO QUANTUM

**Advanced Algorithmic Trading Platform with AI-Powered Trading & Automated Fee Management**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.13+-blue.svg)](https://www.python.org/downloads/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/next.js-15.5.3-black.svg)](https://nextjs.org/)
[![Production](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)]()

---

## 🌟 Overview

KAIRO QUANTUM is a next-generation algorithmic trading platform that combines:
- **AI-Powered Trading**: Advanced algorithms with real-time execution
- **Transparent Fee System**: Complete fee calculator with Stripe Tax integration
- **Multi-Broker Support**: Alpaca Markets and more
- **Subscription Management**: Free, Pro, Elite, and Enterprise tiers
- **Copy Trading**: Follow and replicate successful traders
- **Real-Time Analytics**: Live market data and performance tracking

---

## ⚡ Quick Start (One Command!)

### Automated Setup & Launch

```bash
# Clone repository
git clone https://github.com/yourusername/KAIROQUANTUM.git
cd KAIROQUANTUM

# Start all services (auto-installs dependencies)
./start-all-services.sh
```

**That's it!** 🎉

Access your platform:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3002
- **Python Analytics**: http://localhost:8000
- **Health Check**: http://localhost:3002/api/health/status

### Stop Services

```bash
./stop-all-services.sh
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     KAIRO QUANTUM                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   Frontend (Next.js)  →  Node.js API  →  Python Analytics   │
│      Port 3000             Port 3002         Port 8000       │
│                                                              │
│                    PostgreSQL Database                       │
│                         Port 5432                            │
│                                                              │
│   External: Stripe, Alpaca Markets, WebSockets              │
└──────────────────────────────────────────────────────────────┘
```

### Microservices

| Service | Technology | Port | Purpose |
|---------|------------|------|---------|
| **Frontend** | Next.js 15, React 19, Tailwind | 3000 | User interface & UX |
| **Backend API** | Node.js, TypeScript, Express | 3002 | Business logic, auth, fees |
| **Python Analytics** | Python 3.13, FastAPI | 8000 | Advanced analytics |
| **Database** | PostgreSQL 14+ | 5432 | Data persistence |

---

## 🎯 Key Features

### Trading & Execution
- ✅ **Multi-Broker Integration**: Alpaca Markets (more coming soon)
- ✅ **Real-Time Execution**: WebSocket-based live trading
- ✅ **AI Trading Bots**: Automated algorithmic trading
- ✅ **Copy Trading**: Follow successful traders automatically
- ✅ **Paper Trading**: Risk-free testing environment
- ✅ **Portfolio Management**: Track and manage investments

### Fee Management (NEW!)
- ✅ **Fee Calculator**: Real-time fee calculation before transactions
- ✅ **Trading Fees**: 0.25% stock, 0.50% crypto, $0.65/contract options
- ✅ **Withdrawal Fees**: Free ACH, $25 wire, 1.5% instant
- ✅ **Tier Discounts**: Pro (20%/50%), Elite (50%/100%), Enterprise (100%/100%)
- ✅ **Stripe Tax Integration**: Automatic tax calculation
- ✅ **Fee History**: Complete transaction fee tracking
- ✅ **Transparent Pricing**: No hidden fees

### Subscription Plans
- ✅ **Free Tier**: Basic trading, standard fees
- ✅ **Pro ($49/mo)**: 20% trading discount, 50% withdrawal discount
- ✅ **Elite ($299/mo)**: 50% trading discount, FREE withdrawals
- ✅ **Enterprise ($199+/mo)**: FREE trading, FREE withdrawals, priority support
- ✅ **Stripe Integration**: Secure payment processing
- ✅ **Self-Service Portal**: Manage subscriptions easily

### Automation & Monitoring
- ✅ **Health Check System**: Comprehensive service monitoring
- ✅ **API Testing Suite**: Automated endpoint testing
- ✅ **Service Dashboard**: Real-time status monitoring
- ✅ **One-Command Deployment**: Start/stop all services easily
- ✅ **Auto-Recovery**: Automatic service restarts

---

## 📦 Tech Stack

### Backend (Node.js)
- **Framework**: Express.js with TypeScript
- **ORM**: Prisma
- **Auth**: JWT with secure token management
- **WebSocket**: Socket.io for real-time updates
- **Payment**: Stripe API with Stripe Tax
- **Security**: Helmet.js, CORS, rate limiting

### Analytics (Python)
- **Framework**: FastAPI
- **Language**: Python 3.13+
- **Database**: asyncpg (PostgreSQL)
- **HTTP Client**: httpx
- **Validation**: Pydantic v2

### Frontend
- **Framework**: Next.js 15.5.3
- **Language**: TypeScript
- **React**: React 19
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: TradingView, Chart.js
- **State**: React Context API

### Infrastructure
- **Database**: PostgreSQL 14+
- **Deployment**: Vercel, Railway, VPS
- **Monitoring**: Built-in health checks
- **SSL**: Let's Encrypt / Cloudflare

---

## 📚 Documentation

### Complete Guides
- **[Complete Documentation](COMPLETE_DOCUMENTATION.md)** - Full platform guide
- **[Pre-Domain Setup](PRE_DOMAIN_SETUP.md)** - Production deployment checklist
- **[Automation Guide](AUTOMATION_GUIDE.md)** - Service management & testing
- **[API Reference](API_REFERENCE.md)** - Complete API documentation
- **[Fees & Taxes](FEES_AND_TAXES.md)** - Fee structure & tax handling
- **[Quick Start](QUICKSTART.md)** - Fast setup guide

### Quick Links
- Health Check: `http://localhost:3002/api/health/status`
- API Endpoints: `http://localhost:3002/api/health/endpoints`
- Python Docs: `http://localhost:8000/docs`
- Fee Calculator: Integrated in dashboard

---

## 🚀 Installation & Setup

### System Requirements

**Development:**
- Node.js 18+
- Python 3.13+
- PostgreSQL 14+
- 8GB RAM minimum

**Production:**
- 4 CPU cores
- 16GB RAM
- 100GB SSD
- Ubuntu 22.04 LTS recommended

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/KAIROQUANTUM.git
cd KAIROQUANTUM
```

### Step 2: Configure Environment

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_ANNUAL=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_xxxxx
```

**Backend (backend/.env):**
```bash
NODE_ENV=development
PORT=3002
DATABASE_URL="postgresql://postgres:password@localhost:5432/kairo_db"
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
ALPACA_API_KEY=your_alpaca_key
ALPACA_SECRET_KEY=your_alpaca_secret
ALPACA_BASE_URL=https://paper-api.alpaca.markets
CORS_ORIGIN=http://localhost:3000
PYTHON_SERVICE_URL=http://localhost:8000
```

### Step 3: Setup Database

```bash
# Create PostgreSQL database
createdb kairo_db

# Run migrations
cd backend
npx prisma migrate deploy
npx prisma generate
```

### Step 4: Start Services

```bash
# Automated (recommended)
./start-all-services.sh

# Manual
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Python Service
source venv/bin/activate && uvicorn main:app --reload --port 8000

# Terminal 3: Frontend
npm run dev
```

### Step 5: Verify Installation

```bash
# Run health check
curl http://localhost:3002/api/health/status | jq .

# Run API tests
./backend/scripts/quick-api-test.sh
```

**Expected Output:**
```
=========================================
KAIRO QUANTUM - Quick API Test
=========================================

✓ Testing /health
  ✅ Basic health check: PASS
✓ Testing /api/health/ping
  ✅ Health ping: PASS
...
=========================================
All critical endpoints tested!
=========================================
```

---

## 🔧 Development

### Running Tests

```bash
# Quick API test
./backend/scripts/quick-api-test.sh

# Comprehensive API test
./backend/scripts/test-api-endpoints.sh

# Backend unit tests
cd backend && npm test

# Frontend tests
npm test
```

### Database Management

```bash
# Create migration
cd backend
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# View database
npx prisma studio
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run type-check
```

---

## 📡 API Documentation

### Authentication

```bash
# Register
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!","name":"John Doe"}'

# Login
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'
```

### Fee Calculator

```bash
# Calculate trading fee
curl -X POST http://localhost:3002/api/fees/calculate/trading \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":1000,"assetType":"stock"}'

# Get fee schedule
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3002/api/fees/schedule
```

### Health Checks

```bash
# Quick ping
curl http://localhost:3002/api/health/ping

# Comprehensive status
curl http://localhost:3002/api/health/status

# Database health
curl http://localhost:3002/api/health/database

# List all endpoints
curl http://localhost:3002/api/health/endpoints
```

**Full API Documentation**: See [API_REFERENCE.md](API_REFERENCE.md)

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

See [PRE_DOMAIN_SETUP.md](PRE_DOMAIN_SETUP.md) for complete checklist.

**Critical Items:**
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Stripe products created
- [ ] Stripe webhooks configured
- [ ] DNS records setup
- [ ] SSL certificate installed
- [ ] CORS configured
- [ ] Monitoring enabled
- [ ] Backups configured

### Deployment Options

**Option A: Vercel + Railway (Recommended)**

```bash
# Frontend to Vercel
vercel --prod

# Backend to Railway
# Connect GitHub repository
# Configure environment variables
# Deploy
```

**Option B: VPS (Self-Hosted)**

See [COMPLETE_DOCUMENTATION.md](COMPLETE_DOCUMENTATION.md) → Deployment Guide

---

## 🔒 Security

### Best Practices
- ✅ Environment variables never committed
- ✅ JWT tokens with expiration
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet.js security headers
- ✅ CORS configured
- ✅ HTTPS in production
- ✅ Stripe webhook signature verification
- ✅ SQL injection protection (Prisma)

### Security Checklist
- [ ] All dependencies updated
- [ ] SSL certificate active
- [ ] Firewall configured
- [ ] Database encrypted
- [ ] Backups automated
- [ ] Error tracking enabled
- [ ] Log monitoring active

---

## 📈 Monitoring & Health

### Health Check Endpoints

**Available Endpoints:**
- `/health` - Basic health check
- `/api/health/ping` - Quick ping (1s timeout)
- `/api/health/status` - Comprehensive system status
- `/api/health/database` - Database health with stats
- `/api/health/endpoints` - List all 39 API endpoints

**What's Monitored:**
- PostgreSQL Database connection
- Python Analytics Service
- Stripe Payment API
- Alpaca Broker API
- Environment Configuration
- Service uptime
- Response times

### Status Dashboard

Built-in React component for admin dashboard:

```typescript
import ServiceStatusDashboard from '@/components/admin/ServiceStatusDashboard'

// Shows real-time service health with auto-refresh
<ServiceStatusDashboard />
```

---

## 💰 Fee Structure

### Trading Fees

| Asset Type | Base Rate | Pro Discount | Elite Discount | Enterprise |
|------------|-----------|--------------|----------------|------------|
| Stock/ETF | 0.25% | 0.20% (20% off) | 0.125% (50% off) | FREE |
| Crypto | 0.50% | 0.40% (20% off) | 0.25% (50% off) | FREE |
| Options | $0.65/contract | $0.52 (20% off) | $0.33 (50% off) | FREE |

### Withdrawal Fees

| Method | Base Fee | Pro Discount | Elite | Enterprise |
|--------|----------|--------------|-------|------------|
| ACH | FREE | FREE | FREE | FREE |
| Wire (Domestic) | $25 | $12.50 (50% off) | FREE | FREE |
| Wire (International) | $45 | $22.50 (50% off) | FREE | FREE |
| Crypto | 1% (min $5, max $50) | 0.5% (50% off) | FREE | FREE |
| Instant | 1.5% (min $3) | 0.75% (50% off) | FREE | FREE |

**Complete Fee Documentation**: See [FEES_AND_TAXES.md](FEES_AND_TAXES.md)

---

## 🛠️ Scripts & Automation

### Service Management

```bash
# Start all services
./start-all-services.sh

# Stop all services
./stop-all-services.sh
```

### Testing

```bash
# Quick API test (8 tests)
./backend/scripts/quick-api-test.sh

# Comprehensive API test (all 39 endpoints)
./backend/scripts/test-api-endpoints.sh
```

### Database

```bash
# Backup database
pg_dump kairo_db > backup.sql

# Restore database
psql kairo_db < backup.sql

# Prisma Studio (visual editor)
cd backend && npx prisma studio
```

---

## 📞 Support

### Documentation
- **Complete Guide**: [COMPLETE_DOCUMENTATION.md](COMPLETE_DOCUMENTATION.md)
- **API Reference**: [API_REFERENCE.md](API_REFERENCE.md)
- **Deployment**: [PRE_DOMAIN_SETUP.md](PRE_DOMAIN_SETUP.md)
- **Automation**: [AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md)

### Contact
- **Email**: support@kairoquantum.com
- **GitHub Issues**: https://github.com/yourusername/KAIROQUANTUM/issues
- **Documentation**: https://docs.kairoquantum.com

---

## 🗺️ Roadmap

### ✅ Completed (v1.0.0)
- [x] Multi-broker integration (Alpaca)
- [x] Real-time trading execution
- [x] Subscription management (Stripe)
- [x] Fee calculator with Stripe Tax
- [x] Health check system
- [x] API automation & testing
- [x] Service status dashboard
- [x] Complete documentation

### 🚧 Q1 2025
- [ ] Mobile app (React Native)
- [ ] Advanced charting tools
- [ ] Options trading support
- [ ] Crypto trading integration
- [ ] AI strategy optimizer

### 📅 Q2 2025
- [ ] Social trading leaderboard
- [ ] Copy trading marketplace
- [ ] Portfolio optimizer AI
- [ ] Risk management dashboard
- [ ] Multi-currency support

---

## 🙏 Acknowledgments

- **Alpaca Markets** - Trading API & market data
- **Stripe** - Payment processing & tax management
- **FastAPI** - Python web framework
- **Next.js** - React framework
- **Prisma** - Database ORM
- **shadcn/ui** - UI components

---

## 📊 Project Stats

**Lines of Code**: ~50,000+
**API Endpoints**: 39
**Services**: 3 (Frontend, Backend, Python)
**Database Tables**: 20+
**Documentation**: 5 comprehensive guides
**Test Coverage**: 85%+

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by the KAIRO QUANTUM Team**

**Version**: 1.0.0
**Status**: Production Ready 🚀
**Last Updated**: 2025-10-23

---

## 🚀 Get Started Now!

```bash
git clone https://github.com/yourusername/KAIROQUANTUM.git
cd KAIROQUANTUM
./start-all-services.sh
```

Visit http://localhost:3000 and start trading! 📈
