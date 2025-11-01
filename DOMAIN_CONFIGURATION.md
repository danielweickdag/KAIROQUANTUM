# Domain Configuration Guide

Complete guide for setting up custom domain for KAIROQUANTUM trading platform.

## 🌐 Overview

This guide covers:
- Custom domain setup for Railway deployment
- DNS configuration
- SSL certificate setup
- CORS configuration
- Testing and verification

## 📋 Prerequisites

Before starting, ensure you have completed:
- ✅ [PRE_DOMAIN_SETUP.md](./PRE_DOMAIN_SETUP.md) - All pre-domain setup steps
- ✅ Railway services deployed and working
- ✅ Domain purchased and DNS access available
- ✅ Railway CLI installed and authenticated

## 🚀 Step 1: Railway Domain Configuration

### 1.1 Add Custom Domain to Frontend Service

```bash
# Navigate to your project
cd /path/to/KAIROQUANTUM

# Login to Railway (if not already)
railway login

# Link to your frontend service
railway link

# Add custom domain
railway domain add yourdomain.com
railway domain add www.yourdomain.com
```

### 1.2 Add Custom Domain to Backend Service

```bash
# Switch to backend service
cd backend
railway link

# Add API subdomain
railway domain add api.yourdomain.com
```

### 1.3 Get Railway DNS Information

After adding domains, Railway will provide:
- CNAME records to configure
- SSL certificate status
- Domain verification status

## 🔧 Step 2: DNS Configuration

### 2.1 Configure DNS Records

Add these records in your domain registrar's DNS settings:

```dns
# Frontend domains
Type: CNAME
Name: @
Value: your-frontend-service.railway.app
TTL: 300

Type: CNAME
Name: www
Value: your-frontend-service.railway.app
TTL: 300

# Backend API domain
Type: CNAME
Name: api
Value: your-backend-service.railway.app
TTL: 300
```

### 2.2 Verify DNS Propagation

```bash
# Check DNS propagation
dig yourdomain.com
dig www.yourdomain.com
dig api.yourdomain.com

# Or use online tools
# https://dnschecker.org/
```

## ⚙️ Step 3: Update Environment Variables

### 3.1 Backend Environment Variables

Update in Railway dashboard or via CLI:

```bash
# Set CORS origins for your domain
railway variables set CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"

# Update frontend URL
railway variables set FRONTEND_URL="https://yourdomain.com"

# Verify Stripe webhook URL points to your domain
railway variables set STRIPE_WEBHOOK_ENDPOINT="https://api.yourdomain.com/api/stripe/webhook"
```

### 3.2 Frontend Environment Variables

```bash
# Update API URL to use custom domain
railway variables set NEXT_PUBLIC_API_URL="https://api.yourdomain.com"

# Update frontend URL
railway variables set NEXT_PUBLIC_FRONTEND_URL="https://yourdomain.com"
```

## 🔒 Step 4: SSL Certificate Setup

Railway automatically provisions SSL certificates for custom domains.

### 4.1 Verify SSL Status

```bash
# Check SSL certificate status
railway domain list

# Test SSL certificate
curl -I https://yourdomain.com
curl -I https://api.yourdomain.com
```

### 4.2 Force HTTPS Redirect

Ensure your application redirects HTTP to HTTPS:

```javascript
// This is already configured in your Next.js app
// Check next.config.js for redirect rules
```

## 🧪 Step 5: Testing and Verification

### 5.1 Test Frontend Domain

```bash
# Test main domain
curl -I https://yourdomain.com

# Test www subdomain
curl -I https://www.yourdomain.com

# Test in browser
open https://yourdomain.com
```

### 5.2 Test Backend API Domain

```bash
# Test API health endpoint
curl https://api.yourdomain.com/api/health

# Test authentication endpoint
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'

# Test market data endpoint
curl https://api.yourdomain.com/api/market/symbols
```

### 5.3 Test CORS Configuration

```bash
# Test CORS from your domain
curl -H "Origin: https://yourdomain.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://api.yourdomain.com/api/auth/login
```

## 🔄 Step 6: Update Stripe Webhooks

### 6.1 Update Webhook Endpoint

1. Login to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to Developers > Webhooks
3. Edit your existing webhook
4. Update endpoint URL to: `https://api.yourdomain.com/api/stripe/webhook`
5. Test the webhook

### 6.2 Verify Webhook

```bash
# Test Stripe webhook endpoint
curl -X POST https://api.yourdomain.com/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test" \
  -d '{"type":"test"}'
```

## 📊 Step 7: Update External API Configurations

### 7.1 Update Binance API Settings

If using Binance API with IP restrictions:
1. Login to Binance
2. Go to API Management
3. Update IP restrictions to include Railway's IP ranges
4. Test API connectivity

### 7.2 Update Other External Services

Update any external services that reference your old Railway URLs:
- Payment processors
- Third-party integrations
- Monitoring services
- Analytics tools

## ✅ Step 8: Final Verification

### 8.1 Complete Application Test

1. **Frontend Test:**
   - Visit https://yourdomain.com
   - Test user registration
   - Test user login
   - Navigate through all pages

2. **Backend API Test:**
   - Test all API endpoints
   - Verify authentication flow
   - Test trading functionality
   - Check payment processing

3. **Integration Test:**
   - Complete end-to-end user journey
   - Test payment flow
   - Verify trading operations
   - Check data persistence

### 8.2 Performance Test

```bash
# Test response times
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com
curl -w "@curl-format.txt" -o /dev/null -s https://api.yourdomain.com/api/health
```

Create `curl-format.txt`:
```
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

## 🔍 Monitoring and Maintenance

### 9.1 Set Up Monitoring

```bash
# Use the provided monitoring script
./monitor-dns.sh yourdomain.com

# Monitor Railway services
railway status
railway logs
```

### 9.2 Regular Health Checks

```bash
# Create a cron job for regular health checks
# Add to crontab:
# */5 * * * * curl -f https://yourdomain.com/api/health || echo "Health check failed"
```

## 🆘 Troubleshooting

### Common Issues

1. **DNS Not Propagating:**
   ```bash
   # Check TTL settings (should be low during setup)
   # Wait up to 48 hours for full propagation
   # Use different DNS servers to test
   ```

2. **SSL Certificate Issues:**
   ```bash
   # Verify domain ownership
   railway domain verify yourdomain.com
   
   # Check certificate status
   openssl s_client -connect yourdomain.com:443
   ```

3. **CORS Errors:**
   ```bash
   # Verify CORS_ORIGINS environment variable
   railway variables get CORS_ORIGINS
   
   # Update if necessary
   railway variables set CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
   ```

4. **API Not Responding:**
   ```bash
   # Check backend service status
   railway status
   
   # Check logs
   railway logs
   
   # Verify environment variables
   railway variables list
   ```

### Emergency Rollback

If issues occur, you can quickly rollback:

```bash
# Use Railway URLs temporarily
railway variables set NEXT_PUBLIC_API_URL="https://your-backend-service.railway.app"
railway variables set FRONTEND_URL="https://your-frontend-service.railway.app"

# Update Stripe webhook back to Railway URL
# Update CORS origins to include Railway URLs
```

## 📝 Post-Configuration Checklist

- [ ] Frontend accessible via custom domain
- [ ] API accessible via api.yourdomain.com
- [ ] SSL certificates active and valid
- [ ] CORS configured correctly
- [ ] Stripe webhooks updated
- [ ] External API configurations updated
- [ ] All functionality tested end-to-end
- [ ] Monitoring scripts configured
- [ ] DNS propagation complete
- [ ] Performance benchmarks recorded

## 🎉 Success!

Your KAIROQUANTUM platform is now running on your custom domain!

### Next Steps

1. Update any documentation with new URLs
2. Notify users of the new domain
3. Set up monitoring and alerts
4. Plan for scaling and optimization
5. Regular security audits

### Support Resources

- Railway Documentation: https://docs.railway.app/
- DNS Propagation Checker: https://dnschecker.org/
- SSL Certificate Checker: https://www.ssllabs.com/ssltest/
- CORS Tester: https://cors-test.codehappy.dev/

---

**🔐 Security Note:** Always use HTTPS in production and regularly update your SSL certificates and security configurations.