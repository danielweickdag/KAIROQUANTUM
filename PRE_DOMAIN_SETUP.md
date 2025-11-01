# Pre-Domain Setup Guide

This guide covers the essential setup steps before configuring your custom domain for KAIROQUANTUM.

## 🚀 Quick Setup Overview

1. **Environment Configuration**
2. **Database Setup**
3. **API Keys Configuration**
4. **Railway Deployment**
5. **Domain Preparation**

## 📋 Prerequisites

- Node.js 18+ installed
- Railway CLI installed
- GitHub account
- Domain registrar access (for custom domain)

## 🔧 Environment Setup

### 1. Backend Environment Variables

Create your production environment file:

```bash
cp backend/.env.example backend/.env.production
```

Configure the following variables in `backend/.env.production`:

```env
# Database
DATABASE_URL="your_production_database_url"

# JWT
JWT_SECRET="your_secure_jwt_secret_here"

# Stripe (Production)
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# External APIs
BINANCE_API_KEY="your_binance_api_key"
BINANCE_SECRET_KEY="your_binance_secret_key"
ALPHA_VANTAGE_API_KEY="your_alpha_vantage_key"

# Application
NODE_ENV="production"
PORT="3001"
FRONTEND_URL="https://your-domain.com"

# CORS Origins (comma-separated)
CORS_ORIGINS="https://your-domain.com,https://www.your-domain.com"
```

### 2. Frontend Environment Variables

Create your production environment file:

```bash
cp .env.example .env.production
```

Configure the following variables in `.env.production`:

```env
# API Configuration
NEXT_PUBLIC_API_URL="https://your-backend-railway-url.railway.app"
NEXT_PUBLIC_FRONTEND_URL="https://your-domain.com"

# Stripe (Production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_publishable_key"

# Environment
NODE_ENV="production"
```

## 🗄️ Database Setup

### 1. Railway PostgreSQL

1. Create a new Railway project
2. Add PostgreSQL service
3. Copy the DATABASE_URL from Railway dashboard
4. Update your `backend/.env.production` file

### 2. Database Migration

```bash
cd backend
npm run db:migrate:prod
npm run db:seed:prod
```

## 🔑 API Keys Setup

### 1. Stripe Configuration

1. **Get Production Keys:**
   - Login to [Stripe Dashboard](https://dashboard.stripe.com)
   - Switch to "Live" mode
   - Go to Developers > API keys
   - Copy your publishable and secret keys

2. **Webhook Setup:**
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-backend-url/api/stripe/webhook`
   - Select events: `payment_intent.succeeded`, `customer.subscription.created`, etc.
   - Copy webhook secret

### 2. Trading APIs

1. **Binance API:**
   - Login to [Binance](https://www.binance.com)
   - Go to API Management
   - Create new API key with trading permissions
   - Configure IP restrictions for security

2. **Alpha Vantage:**
   - Get free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)

## 🚀 Railway Deployment

### 1. Backend Deployment

```bash
# Login to Railway
railway login

# Link to your project
railway link

# Deploy backend
cd backend
railway up
```

### 2. Frontend Deployment

```bash
# Deploy frontend (separate Railway service)
railway up
```

### 3. Environment Variables in Railway

Set these in Railway dashboard for each service:

**Backend Service:**
- All variables from `backend/.env.production`

**Frontend Service:**
- All variables from `.env.production`

## 🌐 Domain Preparation

### 1. DNS Records Setup

Before configuring custom domain, prepare these DNS records:

```
Type: CNAME
Name: @
Value: your-frontend-railway-url.railway.app

Type: CNAME  
Name: api
Value: your-backend-railway-url.railway.app
```

### 2. SSL Certificate

Railway automatically provides SSL certificates for custom domains.

## ✅ Pre-Domain Checklist

Before proceeding to domain configuration:

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Railway  
- [ ] Database connected and migrated
- [ ] All environment variables configured
- [ ] Stripe webhooks configured
- [ ] API keys tested
- [ ] DNS records prepared
- [ ] Both services responding on Railway URLs

## 🔍 Testing Before Domain Setup

### 1. Test Backend API

```bash
curl https://your-backend-railway-url.railway.app/api/health
```

### 2. Test Frontend

Visit: `https://your-frontend-railway-url.railway.app`

### 3. Test Authentication Flow

1. Register new account
2. Login
3. Test payment flow
4. Verify trading features

## 📝 Next Steps

Once pre-domain setup is complete:

1. Follow `DOMAIN_CONFIGURATION.md` for custom domain setup
2. Update CORS origins after domain is active
3. Test all functionality on custom domain
4. Monitor deployment with provided scripts

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed:**
   - Verify DATABASE_URL format
   - Check Railway PostgreSQL service status

2. **API Keys Not Working:**
   - Verify keys are for production environment
   - Check IP restrictions on trading APIs

3. **CORS Errors:**
   - Ensure CORS_ORIGINS includes your domain
   - Verify frontend URL configuration

### Support

- Check Railway logs: `railway logs`
- Review deployment status: `railway status`
- Test endpoints with provided scripts

---

**⚠️ Security Note:** Never commit actual API keys to version control. Use Railway's environment variable system for all sensitive data.