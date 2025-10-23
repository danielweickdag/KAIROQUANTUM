# KAIRO QUANTUM - Production Quick Start

**Deploy your trading platform to kairoquantum.com in under 1 hour**

---

## 🚀 One-Command Deployment Preparation

```bash
./deploy-to-production.sh
```

This automated script will:
- ✅ Generate production secrets (JWT, encryption keys)
- ✅ Create production environment files
- ✅ Build backend for production
- ✅ Generate Railway and Vercel configurations
- ✅ Create git commit with all changes
- ✅ Generate deployment documentation

**Time**: 2-3 minutes

---

## 📋 Quick Deployment Checklist

### 1. Pre-Deployment (Automated) ✅

Run the deployment preparation script:
```bash
./deploy-to-production.sh
```

### 2. Push to GitHub (1 minute)

```bash
# Create repository on GitHub first, then:
git remote add origin https://github.com/yourusername/KAIROQUANTUM.git
git push -u origin main
```

### 3. Deploy Backend to Railway (5 minutes)

```bash
# Login
railway login

# Initialize and deploy
railway init
railway add --database postgresql
railway up
```

**In Railway Dashboard:**
1. Go to Variables → Add all from `backend/.env.production`
2. Go to Settings → Networking → Add custom domain: `api.kairoquantum.com`
3. Copy CNAME record for DNS

**Run migrations:**
```bash
railway run npx prisma migrate deploy
railway run npx prisma generate
```

### 4. Deploy Frontend to Vercel (5 minutes)

```bash
# Login
vercel login

# Deploy
vercel --prod
```

**In Vercel Dashboard:**
1. Settings → Environment Variables → Add all from `.env.production`
2. Settings → Domains → Add `kairoquantum.com` and `www.kairoquantum.com`
3. Redeploy: `vercel --prod`

### 5. Configure DNS (5 minutes)

Add these records at your domain registrar or Cloudflare:

| Type  | Name | Target | TTL |
|-------|------|--------|-----|
| CNAME | www  | cname.vercel-dns.com | 300 |
| CNAME | @    | cname.vercel-dns.com | 300 |
| CNAME | api  | [your-app].railway.app | 300 |

Wait 5-30 minutes for DNS propagation.

### 6. Create Stripe Products (10 minutes)

Go to https://dashboard.stripe.com → Products → Create:

**Product 1: Pro Monthly**
- Name: KAIRO QUANTUM Pro - Monthly
- Price: $49.00/month
- Copy Price ID → Update `.env.production`

**Product 2: Pro Annual**
- Name: KAIRO QUANTUM Pro - Annual
- Price: $490.00/year
- Copy Price ID → Update `.env.production`

**Product 3: Enterprise**
- Name: KAIRO QUANTUM Enterprise
- Price: $199.00/month
- Copy Price ID → Update `.env.production`

Redeploy frontend:
```bash
vercel --prod
```

### 7. Configure Stripe Webhook (5 minutes)

Go to Stripe Dashboard → Developers → Webhooks:

1. Add endpoint: `https://api.kairoquantum.com/api/webhooks/stripe`
2. Select events:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.paid
   - invoice.payment_failed
3. Copy webhook signing secret
4. Add to Railway environment variables
5. Redeploy: `railway up`

### 8. Post-Deployment Setup (5 minutes)

Run the automated post-deployment script:
```bash
./post-deployment-setup.sh
```

This will:
- Run database migrations
- Seed initial data (optional)
- Verify environment variables
- Test backend health
- Show post-deployment checklist

### 9. Verify Deployment (2 minutes)

Run the verification script:
```bash
./verify-deployment.sh
```

This will test:
- Frontend accessibility
- API health checks
- SSL certificates
- DNS resolution
- All critical endpoints

---

## 🎯 Expected Timeline

| Step | Time | Total |
|------|------|-------|
| 1. Automated preparation | 3 min | 3 min |
| 2. Push to GitHub | 1 min | 4 min |
| 3. Deploy backend | 5 min | 9 min |
| 4. Deploy frontend | 5 min | 14 min |
| 5. Configure DNS | 5 min | 19 min |
| 6. Create Stripe products | 10 min | 29 min |
| 7. Configure webhook | 5 min | 34 min |
| 8. Post-deployment setup | 5 min | 39 min |
| 9. Verify deployment | 2 min | **41 min** |

**Total: ~40 minutes** (plus DNS propagation time)

---

## 🛠️ Available Scripts

### Deployment Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `deploy-to-production.sh` | Automated deployment prep | `./deploy-to-production.sh` |
| `post-deployment-setup.sh` | Post-deployment configuration | `./post-deployment-setup.sh` |
| `verify-deployment.sh` | Test deployment | `./verify-deployment.sh` |

### Service Management

| Script | Purpose | Usage |
|--------|---------|-------|
| `start-all-services.sh` | Start all services locally | `./start-all-services.sh` |
| `stop-all-services.sh` | Stop all services | `./stop-all-services.sh` |

### Testing

| Script | Purpose | Usage |
|--------|---------|-------|
| `backend/scripts/quick-api-test.sh` | Quick API test (8 tests) | `./backend/scripts/quick-api-test.sh` |
| `backend/scripts/test-api-endpoints.sh` | Full API test (39 endpoints) | `./backend/scripts/test-api-endpoints.sh` |

---

## 🔑 Environment Variables

All environment variables are automatically generated in:
- `backend/.env.production` - Backend configuration
- `.env.production` - Frontend configuration

**You need to manually add:**
1. Stripe Price IDs (after creating products)
2. DATABASE_URL (from Railway)

---

## 🧪 Testing Your Deployment

### Manual Tests

After deployment, verify:

```bash
# 1. Frontend loads
curl -I https://www.kairoquantum.com

# 2. API health check
curl https://api.kairoquantum.com/api/health/status

# 3. API ping
curl https://api.kairoquantum.com/api/health/ping
```

### Automated Tests

Run the verification script:
```bash
./verify-deployment.sh
```

### User Flow Tests

1. Visit https://www.kairoquantum.com
2. Click "Sign Up" → Create account
3. Login with new account
4. Go to Pricing → Subscribe to Pro plan
5. Test Stripe checkout with test card: `4242 4242 4242 4242`
6. Verify subscription in dashboard

---

## 📊 Production URLs

After deployment:

- **Frontend**: https://www.kairoquantum.com
- **API**: https://api.kairoquantum.com
- **Health Check**: https://api.kairoquantum.com/api/health/status
- **Stripe Webhook**: https://api.kairoquantum.com/api/webhooks/stripe

---

## 🆘 Troubleshooting

### Frontend not loading

```bash
# Check Vercel deployment logs
vercel logs

# Check DNS
dig www.kairoquantum.com

# Clear browser cache and test
curl -I https://www.kairoquantum.com
```

### API not responding

```bash
# Check Railway logs
railway logs

# Check backend service status
railway status

# Test API directly
curl https://api.kairoquantum.com/api/health/ping
```

### Database errors

```bash
# Check migrations
railway run npx prisma migrate status

# Re-run migrations if needed
railway run npx prisma migrate deploy
```

### Stripe checkout not working

1. Verify Price IDs in `.env.production`
2. Check webhook is configured correctly
3. Test webhook in Stripe Dashboard
4. Check Railway environment variables

---

## 📚 Documentation

For detailed information, see:

- `DEPLOYMENT_SUMMARY.md` - Complete deployment guide
- `DEPLOY_TO_KAIROQUANTUM.md` - Step-by-step deployment
- `DOMAIN_CONFIGURATION.md` - Configuration reference
- `COMPLETE_DOCUMENTATION.md` - Full platform documentation
- `API_REFERENCE.md` - API endpoints
- `FEES_AND_TAXES.md` - Fee structure

---

## ✅ Post-Deployment Checklist

After successful deployment:

- [ ] All tests passing (`./verify-deployment.sh`)
- [ ] Frontend accessible at https://www.kairoquantum.com
- [ ] API accessible at https://api.kairoquantum.com
- [ ] User registration works
- [ ] User login works
- [ ] Stripe checkout works
- [ ] Webhooks receiving events
- [ ] Fee calculator works
- [ ] Health checks passing
- [ ] SSL certificates active
- [ ] DNS configured correctly
- [ ] Monitoring setup (UptimeRobot)
- [ ] Backup configured

---

## 🎉 Success!

Your KAIRO QUANTUM trading platform is now live at:

**https://www.kairoquantum.com**

Monitor your platform:
- Railway Dashboard: https://railway.app
- Vercel Dashboard: https://vercel.com
- Stripe Dashboard: https://dashboard.stripe.com

---

**Deployed**: kairoquantum.com
**Status**: Live 🚀
**Version**: 1.0.0
**Date**: 2025-10-23
