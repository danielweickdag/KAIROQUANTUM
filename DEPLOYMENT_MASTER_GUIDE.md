# KAIRO QUANTUM - Master Deployment Guide

**Complete automation suite for deploying to kairoquantum.com**

---

## 🎯 Deployment Overview

This guide provides the complete automation toolkit for deploying KAIRO QUANTUM to production at **kairoquantum.com**.

### Three Deployment Phases

1. **Pre-Deployment** (Automated) - Preparation and configuration
2. **Deployment** (Manual) - Platform and service deployment
3. **Post-Deployment** (Automated) - Setup and verification

---

## 📦 Complete Automation Suite

### Core Deployment Scripts

| Script | Phase | Purpose | Time |
|--------|-------|---------|------|
| `deploy-to-production.sh` | Pre | Automated deployment preparation | 3 min |
| `post-deployment-setup.sh` | Post | Database setup and verification | 5 min |
| `verify-deployment.sh` | Post | Test all endpoints | 2 min |

### Service Management Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `start-all-services.sh` | Start all services locally | Dev environment |
| `stop-all-services.sh` | Stop all services | Dev environment |

### Testing Scripts

| Script | Tests | Purpose |
|--------|-------|---------|
| `backend/scripts/quick-api-test.sh` | 8 tests | Quick health check |
| `backend/scripts/test-api-endpoints.sh` | 39 tests | Full API test suite |

### Helper Scripts

| Script | Purpose |
|--------|---------|
| `DEPLOYMENT_COMMANDS.sh` | Ready-to-copy deployment commands |

---

## 🚀 Complete Deployment Workflow

### Phase 1: Pre-Deployment (3 minutes) ✅ AUTOMATED

```bash
./deploy-to-production.sh
```

**What it does:**
1. ✅ Validates prerequisites (Node.js, npm, git, Vercel CLI, Railway CLI)
2. ✅ Generates production secrets:
   - JWT_SECRET (64 bytes)
   - JWT_REFRESH_SECRET (64 bytes)
   - SESSION_SECRET (32 bytes)
   - ENCRYPTION_KEY (32 bytes)
3. ✅ Creates production environment files:
   - `backend/.env.production`
   - `.env.production`
4. ✅ Builds backend for production
5. ✅ Creates Railway configuration (`railway.json`, `railway.toml`)
6. ✅ Generates deployment documentation
7. ✅ Creates git commit with all changes

**Output:**
- Production-ready environment files
- Built backend
- Deployment documentation
- Git commit ready to push

---

### Phase 2: Deployment (40 minutes) 🔧 MANUAL

#### Step 1: Push to GitHub (1 minute)

```bash
# Create repository on GitHub: https://github.com/new
# Repository name: KAIROQUANTUM
# Then run:

git remote add origin https://github.com/yourusername/KAIROQUANTUM.git
git push -u origin main
```

#### Step 2: Deploy Backend to Railway (10 minutes)

```bash
# Login to Railway
railway login

# Initialize project
railway init
# Select: Create new project
# Name: kairoquantum-backend

# Add PostgreSQL database
railway add --database postgresql

# Deploy backend
railway up
```

**Railway Dashboard Configuration:**

1. **Add Environment Variables:**
   - Go to your project → Variables
   - Click "RAW Editor"
   - Copy ALL contents from `backend/.env.production`
   - Paste and save
   - Important: Update `DATABASE_URL` with the one from Railway

2. **Get DATABASE_URL:**
   - Go to PostgreSQL service → Connect
   - Copy the `DATABASE_URL`
   - Update in Variables: `DATABASE_URL=postgresql://...`

3. **Configure Custom Domain:**
   - Go to Settings → Networking
   - Click "Generate Domain" (you'll get: your-app.up.railway.app)
   - Click "Custom Domain"
   - Enter: `api.kairoquantum.com`
   - Copy CNAME record (save for DNS step)

4. **Run Database Migrations:**
```bash
railway run npx prisma migrate deploy
railway run npx prisma generate
```

#### Step 3: Deploy Frontend to Vercel (10 minutes)

```bash
# Login to Vercel
vercel login

# Deploy to production
cd /Users/blvckdlphn/projects/KAIROQUANTUM
vercel --prod
```

Follow prompts:
- Setup and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- Project name? **kairoquantum**
- Directory? **./** (root)
- Override settings? **N**

**Vercel Dashboard Configuration:**

1. **Add Environment Variables:**
   - Go to your project → Settings → Environment Variables
   - Add each variable from `.env.production`:
     ```
     NEXT_PUBLIC_API_URL=https://api.kairoquantum.com
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
     NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY=price_xxxxx
     NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_ANNUAL=price_xxxxx
     NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_xxxxx
     ```
   - Select "Production" environment
   - Click "Save"

2. **Configure Domains:**
   - Go to Settings → Domains
   - Click "Add"
   - Enter: `kairoquantum.com` → Add
   - Enter: `www.kairoquantum.com` → Add
   - Vercel will show DNS records

3. **Redeploy with Environment Variables:**
```bash
vercel --prod
```

#### Step 4: Configure DNS (5 minutes + propagation)

**Option A: Using Cloudflare (Recommended)**

1. Go to https://cloudflare.com
2. Add site: `kairoquantum.com`
3. Update nameservers at your domain registrar
4. Add these DNS records in Cloudflare:

| Type  | Name | Target | Proxy Status |
|-------|------|--------|--------------|
| CNAME | www  | cname.vercel-dns.com | Proxied ✅ |
| CNAME | @    | cname.vercel-dns.com | Proxied ✅ |
| CNAME | api  | your-app.up.railway.app | Proxied ✅ |

5. SSL/TLS Settings:
   - Mode: Full (strict)
   - Always Use HTTPS: ON
   - Automatic HTTPS Rewrites: ON

**Option B: At Your Domain Registrar**

Add these DNS records:

| Type  | Name | Target |
|-------|------|--------|
| CNAME | www  | cname.vercel-dns.com |
| CNAME | @    | cname.vercel-dns.com |
| CNAME | api  | your-app.up.railway.app |

**DNS Verification:**
```bash
# Check DNS propagation (takes 5-30 minutes)
dig www.kairoquantum.com
dig api.kairoquantum.com

# Or use online tool
open https://dnschecker.org
```

#### Step 5: Create Stripe Products (10 minutes)

Go to https://dashboard.stripe.com → Products

**Product 1: Pro Monthly**
1. Click "Add product"
2. Name: `KAIRO QUANTUM Pro - Monthly`
3. Description: `Professional trading with 20% fee discount`
4. Price: `$49.00`
5. Billing period: `Monthly`
6. Click "Save product"
7. **Copy Price ID** (starts with `price_`)

**Product 2: Pro Annual**
1. Click "Add product"
2. Name: `KAIRO QUANTUM Pro - Annual`
3. Description: `Professional trading with 20% fee discount (25% savings)`
4. Price: `$490.00`
5. Billing period: `Yearly`
6. Click "Save product"
7. **Copy Price ID**

**Product 3: Enterprise**
1. Click "Add product"
2. Name: `KAIRO QUANTUM Enterprise`
3. Description: `Enterprise trading with zero fees`
4. Price: `$199.00`
5. Billing period: `Monthly`
6. Click "Save product"
7. **Copy Price ID**

**Update Environment Variables:**

1. Update `.env.production` locally:
```bash
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY=price_xxxxx_YOUR_ACTUAL_ID
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_ANNUAL=price_xxxxx_YOUR_ACTUAL_ID
NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE=price_xxxxx_YOUR_ACTUAL_ID
```

2. Update in Vercel Dashboard:
   - Settings → Environment Variables
   - Edit each Price ID variable
   - Paste new values

3. Redeploy:
```bash
vercel --prod
```

#### Step 6: Configure Stripe Webhook (5 minutes)

Go to Stripe Dashboard → Developers → Webhooks

1. Click "Add endpoint"
2. Endpoint URL: `https://api.kairoquantum.com/api/webhooks/stripe`
3. Description: `KAIRO QUANTUM Production`
4. Click "Select events"
5. Select these events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.paid`
   - ✅ `invoice.payment_failed`
6. Click "Add events"
7. Click "Add endpoint"
8. **Copy Signing secret** (starts with `whsec_`)

**Add to Railway:**
1. Go to Railway → Your Project → Variables
2. Update: `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`
3. Redeploy: `railway up`

**Enable Stripe Tax:**
1. Go to Settings → Tax
2. Click "Enable Stripe Tax"
3. Configure tax settings for your jurisdictions

---

### Phase 3: Post-Deployment (10 minutes) ✅ AUTOMATED

#### Step 1: Run Post-Deployment Setup

```bash
./post-deployment-setup.sh
```

**What it does:**
1. ✅ Runs database migrations on Railway
2. ✅ Generates Prisma client
3. ✅ Seeds initial data (optional)
4. ✅ Verifies environment variables
5. ✅ Tests backend health
6. ✅ Shows post-deployment checklist

#### Step 2: Verify Deployment

```bash
./verify-deployment.sh
```

**What it tests:**
1. ✅ Frontend accessibility (3 pages)
2. ✅ API health checks (4 endpoints)
3. ✅ SSL certificates (2 domains)
4. ✅ DNS resolution (2 domains)
5. ✅ Total: 11 automated tests

**Expected output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Test Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Passed: 11
Failed: 0

✓ All tests passed!
Your deployment is working correctly.
```

---

## 📊 Deployment Timeline

| Phase | Steps | Time | Cumulative |
|-------|-------|------|------------|
| **Pre-Deployment** | Automated script | 3 min | 3 min |
| **Deployment** | Push to GitHub | 1 min | 4 min |
| | Deploy backend | 10 min | 14 min |
| | Deploy frontend | 10 min | 24 min |
| | Configure DNS | 5 min | 29 min |
| | Create Stripe products | 10 min | 39 min |
| | Configure webhook | 5 min | 44 min |
| **Post-Deployment** | Setup script | 5 min | 49 min |
| | Verify script | 2 min | **51 min** |

**Total Active Time: ~51 minutes**
**Plus DNS propagation: 5-30 minutes**

---

## 🧪 Testing Your Deployment

### Automated Tests

```bash
# Full verification suite
./verify-deployment.sh

# Quick API test (8 endpoints)
./backend/scripts/quick-api-test.sh

# Full API test (39 endpoints) - requires auth
./backend/scripts/test-api-endpoints.sh
```

### Manual Tests

```bash
# 1. Frontend
curl -I https://www.kairoquantum.com
# Expected: HTTP/2 200

# 2. API Health
curl https://api.kairoquantum.com/api/health/status
# Expected: {"status":"healthy",...}

# 3. API Ping
curl https://api.kairoquantum.com/api/health/ping
# Expected: {"status":"ok",...}
```

### User Flow Tests

1. **Registration:**
   - Visit https://www.kairoquantum.com
   - Click "Sign Up"
   - Create account with email/password
   - Verify success

2. **Login:**
   - Click "Login"
   - Enter credentials
   - Verify redirect to dashboard

3. **Stripe Checkout:**
   - Go to Pricing page
   - Click "Subscribe" on Pro plan
   - Should redirect to Stripe
   - Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
   - Complete checkout
   - Verify success redirect

4. **Fee Calculator:**
   - Go to dashboard
   - Find fee calculator
   - Enter test amount
   - Verify instant calculation

---

## 📚 Documentation Reference

### Quick Start Guides

- `QUICKSTART_PRODUCTION.md` - Fast track to production (this file)
- `DEPLOYMENT_SUMMARY.md` - Post-script deployment summary
- `DEPLOY_TO_KAIROQUANTUM.md` - Step-by-step deployment guide

### Configuration Guides

- `DOMAIN_CONFIGURATION.md` - Exact configuration for kairoquantum.com
- `PRE_DOMAIN_SETUP.md` - Production deployment checklist
- `backend/.env.production.template` - Backend environment template
- `.env.production.template` - Frontend environment template

### Complete Documentation

- `COMPLETE_DOCUMENTATION.md` - Full platform documentation (200+ pages)
- `API_REFERENCE.md` - Complete API documentation (39 endpoints)
- `FEES_AND_TAXES.md` - Fee structure and tax handling
- `AUTOMATION_GUIDE.md` - Service management and automation
- `DOCUMENTATION_INDEX.md` - Master documentation index

### Automation Scripts

- `DEPLOYMENT_COMMANDS.sh` - Copy-paste deployment commands
- `deploy-to-production.sh` - Automated deployment preparation
- `post-deployment-setup.sh` - Post-deployment automation
- `verify-deployment.sh` - Deployment verification tests

---

## 🎯 Production URLs

After successful deployment:

- **Website**: https://www.kairoquantum.com
- **API**: https://api.kairoquantum.com
- **Health Check**: https://api.kairoquantum.com/api/health/status
- **API Documentation**: https://api.kairoquantum.com/api/docs (if enabled)
- **Stripe Webhook**: https://api.kairoquantum.com/api/webhooks/stripe

### Platform Dashboards

- **Railway**: https://railway.app (Backend & Database)
- **Vercel**: https://vercel.com (Frontend)
- **Stripe**: https://dashboard.stripe.com (Payments)
- **Cloudflare**: https://cloudflare.com (DNS & CDN)

---

## 🆘 Troubleshooting

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Frontend not loading | Check Vercel logs: `vercel logs` |
| API not responding | Check Railway logs: `railway logs` |
| Database connection error | Verify DATABASE_URL in Railway |
| Stripe checkout fails | Verify Price IDs and webhook |
| DNS not resolving | Wait for propagation (5-30 min) |
| SSL certificate error | Check Cloudflare SSL mode |

### Debug Commands

```bash
# Check service status
railway status

# View backend logs
railway logs

# View frontend logs
vercel logs

# Test DNS
dig www.kairoquantum.com
dig api.kairoquantum.com

# Test SSL
openssl s_client -connect www.kairoquantum.com:443 -servername www.kairoquantum.com

# Test API
curl -v https://api.kairoquantum.com/api/health/ping
```

---

## ✅ Final Checklist

### Pre-Launch Verification

- [ ] All automated tests passing (`./verify-deployment.sh`)
- [ ] Frontend loads at https://www.kairoquantum.com
- [ ] API responds at https://api.kairoquantum.com
- [ ] SSL certificates active (both domains)
- [ ] DNS configured correctly
- [ ] User registration works
- [ ] User login works
- [ ] Stripe checkout works (test card)
- [ ] Webhooks receiving events
- [ ] Fee calculator works
- [ ] Health checks all green
- [ ] Database migrations applied
- [ ] Environment variables set correctly

### Post-Launch Monitoring

- [ ] Setup UptimeRobot monitoring
- [ ] Configure email alerts
- [ ] Enable error tracking (Sentry)
- [ ] Setup daily backups
- [ ] Configure log retention
- [ ] Review security settings
- [ ] Test with real card (small amount)
- [ ] Monitor first user signups
- [ ] Test all user flows
- [ ] Document any issues

---

## 🎉 Success!

Your KAIRO QUANTUM trading platform is now live at:

**https://www.kairoquantum.com**

### What's Next?

1. **Monitor** your platform using the dashboards
2. **Test** all features thoroughly
3. **Share** with early users
4. **Gather** feedback
5. **Iterate** and improve

### Support

- Check documentation in `/docs`
- Run `./verify-deployment.sh` anytime
- Use `./backend/scripts/quick-api-test.sh` for health checks
- Review logs in Railway and Vercel dashboards

---

**Platform**: kairoquantum.com
**Status**: Live 🚀
**Version**: 1.0.0
**Deployment Date**: 2025-10-23
**Total Automation**: 90%
