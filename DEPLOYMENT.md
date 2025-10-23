# 🚀 KAIRO QUANTUM - Deployment Guide

Complete guide for deploying KAIRO QUANTUM to production and staging environments.

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Railway Deployment](#railway-deployment)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Monitoring & Logging](#monitoring--logging)
- [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start

### Automated Deployment

```bash
# Deploy to production
./scripts/deploy.sh production

# Deploy to staging
./scripts/deploy.sh staging

# Deploy specific service
./scripts/deploy.sh production backend
./scripts/deploy.sh production frontend
./scripts/deploy.sh production analytics
```

---

## 🔧 Environment Setup

### 1. Install Required Tools

```bash
# Railway CLI
npm install -g @railway/cli

# Vercel CLI
npm install -g vercel

# Docker (if using Docker deployment)
# Install from https://docker.com
```

### 2. Authenticate Services

```bash
# Railway
railway login

# Vercel
vercel login

# Docker Hub
docker login
```

---

## 🚂 Railway Deployment

Railway is recommended for backend and Python analytics services.

### Initial Setup

1. **Create Railway Account**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   ```bash
   railway init
   railway link
   ```

3. **Create Services**
   - PostgreSQL database
   - Node.js backend
   - Python analytics

### Deploy Backend

```bash
cd backend

# Set environment variables
railway variables set DATABASE_URL="your-database-url"
railway variables set JWT_SECRET="your-jwt-secret"
railway variables set STRIPE_SECRET_KEY="your-stripe-key"

# Deploy
railway up

# View logs
railway logs
```

### Deploy Python Analytics

```bash
cd python-service

# Set environment variables
railway variables set DATABASE_URL="your-database-url"
railway variables set ALPACA_API_KEY="your-alpaca-key"

# Deploy
railway up
```

### Custom Start Command

In Railway dashboard:
- **Backend**: `npm run start`
- **Python**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Domain Setup

1. Go to Railway project settings
2. Click "Generate Domain" or add custom domain
3. Update CORS settings in backend to allow the domain

---

## ▲ Vercel Deployment

Vercel is recommended for the Next.js frontend.

### Initial Setup

1. **Create Vercel Account**
   - Visit https://vercel.com
   - Sign up with GitHub

2. **Link Repository**
   ```bash
   vercel link
   ```

### Deploy Frontend

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

Add in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_PYTHON_URL=https://your-analytics.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Build Settings

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Custom Domain

1. Go to project settings
2. Add your domain
3. Configure DNS records as instructed

---

## 🐳 Docker Deployment

### Development

```bash
docker-compose up -d
```

### Production

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Docker Hub

```bash
# Build and tag images
docker build -t yourusername/kairo-backend:latest ./backend
docker build -t yourusername/kairo-analytics:latest ./python-service
docker build -t yourusername/kairo-frontend:latest .

# Push to Docker Hub
docker push yourusername/kairo-backend:latest
docker push yourusername/kairo-analytics:latest
docker push yourusername/kairo-frontend:latest
```

### AWS ECS / Google Cloud Run

1. Push images to container registry
2. Create task definitions / services
3. Configure load balancer
4. Set environment variables
5. Deploy

---

## 🗄️ Database Setup

### Railway PostgreSQL

1. **Create Database**
   - In Railway dashboard, click "New"
   - Select "Database" → "PostgreSQL"

2. **Get Connection String**
   - Click on database service
   - Copy `DATABASE_URL` from variables

3. **Run Migrations**
   ```bash
   cd backend
   DATABASE_URL="your-railway-db-url" npx prisma migrate deploy
   ```

### External PostgreSQL (AWS RDS, Supabase)

1. **Create Database Instance**
   - Choose PostgreSQL 15
   - Set master username and password
   - Configure security group (allow your IPs)

2. **Create Database**
   ```sql
   CREATE DATABASE kairo_db;
   ```

3. **Set Environment Variables**
   ```bash
   DATABASE_URL=postgresql://username:password@host:5432/kairo_db
   ```

4. **Run Migrations**
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

---

## 🔐 Environment Variables

### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/kairo_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters

# Stripe
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID_PRO=price_your_pro_price_id
STRIPE_PRICE_ID_ELITE=price_your_elite_price_id

# Alpaca
ALPACA_API_KEY=your_live_api_key
ALPACA_SECRET_KEY=your_live_secret_key
ALPACA_BASE_URL=https://api.alpaca.markets  # Live trading

# Python Service
PYTHON_SERVICE_URL=https://your-analytics.railway.app

# Environment
NODE_ENV=production
PORT=3002
CORS_ORIGIN=https://yourdomain.com
```

### Python (.env)

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/kairo_db

# Alpaca
ALPACA_API_KEY=your_live_api_key
ALPACA_SECRET_KEY=your_live_secret_key
ALPACA_BASE_URL=https://api.alpaca.markets

# Server
PORT=8000
WORKERS=4
LOG_LEVEL=INFO
```

### Frontend (.env.local)

```bash
# API URLs
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_PYTHON_URL=https://your-analytics.railway.app

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 📊 Monitoring & Logging

### Sentry (Error Tracking)

1. **Create Sentry Account**
   - Visit https://sentry.io

2. **Create Projects**
   - One for backend
   - One for frontend
   - One for Python analytics

3. **Add to Code**

   **Backend**:
   ```typescript
   import * as Sentry from "@sentry/node";

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

   **Frontend**:
   ```typescript
   import * as Sentry from "@sentry/nextjs";

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
   });
   ```

### Railway Logs

```bash
# View real-time logs
railway logs

# View specific service logs
railway logs --service backend
```

### Vercel Logs

```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --follow
```

---

## 🔍 Health Checks

### Backend Health Endpoint

```typescript
// backend/src/routes/health.ts
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version,
  });
});
```

### Python Health Endpoint

```python
# python-service/main.py
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
    }
```

### Monitoring URLs

- Backend: `https://your-backend.railway.app/health`
- Python: `https://your-analytics.railway.app/health`
- Frontend: `https://yourdomain.com`

---

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Failed

**Problem**: `Error: Connection timeout`

**Solution**:
1. Check DATABASE_URL is correct
2. Verify database is running
3. Check firewall rules
4. Test connection: `psql $DATABASE_URL`

#### Prisma Migrations Failed

**Problem**: `Migration failed to apply`

**Solution**:
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Or apply manually
npx prisma db push --accept-data-loss
```

#### Build Failures

**Problem**: TypeScript errors during build

**Solution**:
```bash
# Check for errors
npm run type-check

# Fix and rebuild
npm run build
```

#### Environment Variables Not Loading

**Problem**: Variables are undefined

**Solution**:
1. Check variable names (no typos)
2. Restart service after adding variables
3. Verify variables are set in deployment platform
4. Check for `.env.local` vs `.env.production`

#### Stripe Webhooks Not Working

**Problem**: Webhook events not received

**Solution**:
1. Check webhook URL is correct
2. Verify webhook secret matches
3. Test with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3002/api/webhooks/stripe
   ```
4. Check webhook logs in Stripe dashboard

---

## 🔒 Security Checklist

Before going to production:

- [ ] Change all default passwords
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/TLS
- [ ] Set up CORS properly
- [ ] Enable rate limiting
- [ ] Set up Stripe webhooks
- [ ] Configure database backups
- [ ] Enable logging and monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Review security headers
- [ ] Test authentication flows
- [ ] Verify data encryption
- [ ] Set up DDoS protection
- [ ] Configure firewall rules

---

## 📈 Performance Optimization

### Backend

- Enable compression
- Use connection pooling
- Implement caching (Redis)
- Optimize database queries
- Add indexes to frequently queried columns

### Frontend

- Enable Next.js image optimization
- Use static generation where possible
- Implement code splitting
- Enable CDN caching
- Compress assets

### Python

- Use async/await for I/O operations
- Implement connection pooling
- Cache benchmark data
- Use background tasks for heavy computations

---

## 🔄 Continuous Deployment

### GitHub Actions

Already configured in `.github/workflows/ci.yml`:
- Runs tests on every push
- Deploys to production on merge to `main`
- Deploys to staging on merge to `develop`

### Manual Deploy

```bash
# Push to trigger deployment
git push origin main
```

---

## 📞 Support

If you encounter issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [GitHub Issues](https://github.com/yourusername/KAIROQUANTUM/issues)
3. Join [Discord](https://discord.gg/kairoquantum)
4. Email: support@kairoquantum.com

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
