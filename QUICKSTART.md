# 🚀 KAIRO QUANTUM - Quick Start Guide

Get KAIRO QUANTUM running in **under 5 minutes** with complete automation!

---

## ⚡ Lightning Setup (One Command)

```bash
# Navigate to the project
cd KAIROQUANTUM

# Run automated setup
./scripts/setup.sh

# Start all services
./scripts/start.sh
```

**That's it!** 🎉

Your platform is now running:
- 📱 Frontend: http://localhost:3000
- 🔧 Backend API: http://localhost:3002
- 📊 Analytics: http://localhost:8000
- 📚 API Docs: http://localhost:8000/docs

---

## 📋 What Just Happened?

The setup script automatically:
1. ✅ Checked all prerequisites (Node.js, Python, PostgreSQL, Docker)
2. ✅ Created environment files from examples
3. ✅ Installed all dependencies (npm, pip)
4. ✅ Started PostgreSQL database (Docker)
5. ✅ Ran database migrations (Prisma)
6. ✅ Seeded database with demo data
7. ✅ Built all services

---

## 🎯 Next Steps

### 1. Update Environment Variables

Add your API keys to enable all features:

**Backend (.env)**:
```bash
cd backend
nano .env  # or use your favorite editor
```

Update these values:
```bash
STRIPE_SECRET_KEY=sk_live_your_actual_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
ALPACA_API_KEY=your_alpaca_key
ALPACA_SECRET_KEY=your_alpaca_secret
JWT_SECRET=generate-a-strong-secret-key-here
```

**Python Service (.env)**:
```bash
cd python-service
nano .env
```

Update these values:
```bash
ALPACA_API_KEY=your_alpaca_key
ALPACA_SECRET_KEY=your_alpaca_secret
```

**Frontend (.env.local)**:
```bash
nano .env.local
```

Update these values:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
```

### 2. Login to the Platform

**Demo Credentials**:
- Email: `demo@kairo.com`
- Password: `Demo123!`

**Admin Credentials**:
- Email: `danielw@blvckdlphn.com`
- Password: `Mougouli05172023!!#$!!*`

### 3. Explore Features

- **Dashboard**: View portfolio and performance
- **Trading**: Execute trades with AI assistance
- **Automation**: Set up automated strategies
- **Analytics**: Compare performance vs benchmarks
- **Subscriptions**: Upgrade to Pro/Elite for advanced features

---

## 🛠️ Common Commands

### Start/Stop Services

```bash
# Start all services
./scripts/start.sh

# Stop all services
./scripts/stop.sh
```

### Run Tests

```bash
# Run all tests
./scripts/test.sh

# Run specific tests
./scripts/test.sh backend
./scripts/test.sh python
./scripts/test.sh frontend
```

### Deploy

```bash
# Deploy to production
./scripts/deploy.sh production

# Deploy to staging
./scripts/deploy.sh staging
```

### Database Operations

```bash
cd backend

# Create new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Seed database
npm run seed

# View database
npx prisma studio
```

### Logs

```bash
# Backend logs
tail -f backend/logs/all.log

# Python logs (if using Docker)
docker logs -f kairo-python-analytics

# PostgreSQL logs
docker logs -f kairo-postgres
```

---

## 🐳 Docker Quickstart

Prefer Docker? We've got you covered:

```bash
# Start everything with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

---

## 🔧 Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3002 (backend)
lsof -ti:3002 | xargs kill -9

# Kill process on port 8000 (python)
lsof -ti:8000 | xargs kill -9
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker ps | grep kairo-postgres

# Start PostgreSQL if not running
docker-compose up -d postgres

# Test connection
psql "postgresql://postgres:postgres@localhost:5432/kairo_db" -c "SELECT 1"
```

### Missing Dependencies

```bash
# Reinstall backend dependencies
cd backend && rm -rf node_modules && npm install

# Reinstall Python dependencies
cd python-service && rm -rf venv && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt

# Reinstall frontend dependencies
rm -rf node_modules && npm install
```

### Prisma Issues

```bash
cd backend

# Regenerate Prisma client
npx prisma generate

# Force push schema to database
npx prisma db push --accept-data-loss

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

---

## 📚 Documentation

- [README.md](./README.md) - Complete overview
- [ARCHITECTURE.md](./MICROSERVICES_ARCHITECTURE.md) - System architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contributing guidelines

---

## 🎓 Learn More

### API Documentation

- **Backend API**: http://localhost:3002/api-docs (coming soon)
- **Python API**: http://localhost:8000/docs

### Key Features to Explore

1. **95% Profit AI Bot** (`/profit-bot`)
   - Automated trading with advanced algorithms
   - Risk management and position sizing
   - Real-time signal generation

2. **Comparative Analytics** (`/trading`)
   - Compare your performance vs S&P 500, NASDAQ, etc.
   - Sharpe Ratio calculation
   - Risk-adjusted returns

3. **Compliance Automation** (automatic)
   - Pattern Day Trading detection
   - Wash Sale prevention
   - Position limit enforcement

4. **Multi-Broker Support** (`/brokers`)
   - Alpaca Markets
   - Interactive Brokers
   - TD Ameritrade (coming soon)

5. **Subscription Tiers** (`/pricing`)
   - Free: Basic features
   - Pro ($99/month): Advanced analytics
   - Elite ($299/month): AI bot + compliance

---

## 💡 Tips

### Development Workflow

1. **Make Changes**: Edit code in your editor
2. **Auto-Reload**: Services automatically reload on save
3. **Test**: Run `./scripts/test.sh` before committing
4. **Commit**: Use conventional commits (see CONTRIBUTING.md)
5. **Deploy**: Push to trigger CI/CD pipeline

### Performance Optimization

- Frontend pages are statically generated where possible
- Backend uses connection pooling
- Python service caches benchmark data
- Database queries are optimized with indexes

### Security Best Practices

- Never commit `.env` files
- Rotate API keys regularly
- Use strong JWT secrets (min 32 characters)
- Enable 2FA for production deployments
- Monitor error logs for suspicious activity

---

## 🤝 Getting Help

### Community

- **Discord**: https://discord.gg/kairoquantum
- **GitHub Discussions**: https://github.com/yourusername/KAIROQUANTUM/discussions
- **Email**: support@kairoquantum.com

### Report Issues

- **Bugs**: https://github.com/yourusername/KAIROQUANTUM/issues/new?template=bug_report.md
- **Features**: https://github.com/yourusername/KAIROQUANTUM/issues/new?template=feature_request.md

---

## 🎉 You're All Set!

Welcome to KAIRO QUANTUM - the future of algorithmic trading!

**Happy Trading! 📈**

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
