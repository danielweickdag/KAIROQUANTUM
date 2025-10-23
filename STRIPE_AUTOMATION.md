# Stripe Subscription Automation

Complete automation setup for Stripe subscription events in KAIRO QUANTUM.

---

## 🎯 Overview

The system automatically syncs Stripe subscription events across the entire platform:
- **Node.js Backend**: Handles webhooks and user updates
- **Python Analytics**: Syncs subscription status for feature access
- **Database**: Single source of truth for subscription state
- **Frontend**: Real-time updates via WebSocket

---

## 🔄 Automated Event Flow

```
Stripe Event → Webhook Handler → Database Update → Python Sync → Feature Provisioning
```

### Step 1: Stripe Sends Event
```
User upgrades/downgrades/cancels → Stripe webhook triggered
```

### Step 2: Webhook Verification
```typescript
// backend/src/routes/webhooks.ts
stripe.webhooks.constructEvent(payload, signature, webhookSecret)
```

### Step 3: Database Update
```typescript
await prisma.user.update({
  where: { id: user.id },
  data: {
    subscriptionStatus: 'active',
    subscriptionPlan: 'pro',
    subscriptionEndDate: new Date(...)
  }
});
```

### Step 4: Python Service Sync
```typescript
await axios.post(`${pythonServiceUrl}/webhooks/stripe`, {
  type: event.type,
  data: { user_id, tier, status, ... }
});
```

### Step 5: Feature Provisioning
```typescript
await SubscriptionAutomationService.provisionFeatures(userId, 'pro');
// Enables: auto-trading, AI signals, comparative analytics
```

---

## 📡 Webhook Events Handled

### Subscription Events
| Event | Action | Result |
|-------|--------|--------|
| `customer.subscription.created` | Create subscription record | User gets Pro/Elite features |
| `customer.subscription.updated` | Update subscription status | Features enabled/disabled |
| `customer.subscription.deleted` | Mark as canceled | Downgrade to Free tier |
| `customer.subscription.paused` | Pause subscription | Features temporarily disabled |
| `customer.subscription.resumed` | Resume subscription | Features re-enabled |

### Payment Events
| Event | Action | Result |
|-------|--------|--------|
| `payment_intent.succeeded` | Log successful payment | Subscription continues |
| `payment_intent.payment_failed` | Mark as past_due | Grace period starts |
| `invoice.paid` | Update payment date | Extend subscription period |
| `invoice.payment_failed` | Send notification | Alert user to update payment |

---

## 🛠️ Setup Instructions

### 1. Configure Stripe Webhook

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3002/api/webhooks/stripe

# Copy webhook signing secret
export STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Set Environment Variables

**Backend (.env)**:
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PYTHON_SERVICE_URL=http://localhost:8000
```

**Python (.env)**:
```bash
DATABASE_URL=postgresql://...
```

### 3. Start Services

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Python
cd python-service && source venv/bin/activate && uvicorn main:app --reload

# Terminal 3: Frontend
npm run dev
```

### 4. Test Webhook

```bash
# Trigger test event
stripe trigger customer.subscription.created

# Check logs
tail -f backend/logs/all.log
```

---

## 🔗 API Endpoints

### Subscription Sync
```http
POST /api/subscription-sync/sync/:userId
Authorization: Bearer {token}

# Response
{
  "success": true,
  "message": "Subscription synced successfully"
}
```

### Manual Sync All (Admin)
```http
POST /api/subscription-sync/sync-all
Authorization: Bearer {admin_token}

# Response
{
  "success": true,
  "synced": 145,
  "failed": 2
}
```

### Handle Subscription Change
```http
POST /api/subscription-sync/change
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan": "pro"
}

# Response
{
  "success": true,
  "message": "Subscription change initiated"
}
```

---

## 🤖 Automated Features

### Feature Provisioning

**Free Tier**:
- ✅ Max 5 positions
- ❌ Auto-trading disabled
- ❌ AI signals disabled
- ❌ Comparative analytics disabled

**Pro Tier ($99/month)**:
- ✅ Max 50 positions
- ✅ Auto-trading enabled
- ✅ AI signals enabled
- ✅ Comparative analytics enabled

**Elite Tier ($299/month)**:
- ✅ Unlimited positions
- ✅ Auto-trading enabled
- ✅ AI signals enabled
- ✅ Comparative analytics enabled
- ✅ Priority support
- ✅ Custom strategies

### Automatic Sync Schedule

```typescript
// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  await SubscriptionAutomationService.syncAllSubscriptions();
});
```

---

## 📊 Monitoring

### Webhook Logs
```http
GET /api/webhooks/logs?provider=stripe&limit=50

# Response
{
  "success": true,
  "data": [
    {
      "id": "log_...",
      "provider": "stripe",
      "eventType": "customer.subscription.updated",
      "status": "processed",
      "timestamp": "2025-10-23T10:30:00Z",
      "automationRulesTriggered": ["rule_1", "rule_3"]
    }
  ]
}
```

### Health Check
```http
GET /api/webhooks/stripe/health

# Response
{
  "status": "ok",
  "webhookConfigured": true,
  "pythonServiceUrl": "http://localhost:8000"
}
```

---

## 🎨 Frontend Integration

### Create Checkout Session

```typescript
// components/pricing/PricingPlans.tsx
const handleUpgrade = async (priceId: string) => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem('token');

  const response = await axios.post(
    `${apiBase}/api/checkout/create-checkout-session`,
    { priceId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  // Redirect to Stripe Checkout
  window.location.href = response.data.url;
};
```

### Handle Payment Success

```typescript
// pages/payment/success.tsx
useEffect(() => {
  const sessionId = new URLSearchParams(window.location.search).get('session_id');

  if (sessionId) {
    // Trigger sync
    axios.post(`${apiBase}/api/subscription-sync/sync/${userId}`);

    // Show success message
    toast.success('Subscription activated!');
  }
}, []);
```

---

## 🚨 Error Handling

### Payment Failures

```typescript
// Automatic retry logic
if (event.type === 'invoice.payment_failed') {
  const invoice = event.data.object as Stripe.Invoice;

  // Mark user as past_due
  await SubscriptionAutomationService.handlePaymentFailure(userId);

  // Send email notification
  await sendPaymentFailureEmail(user.email);

  // Schedule retry in 24 hours
  schedulePaymentRetry(invoice.id, 24);
}
```

### Webhook Failures

```typescript
// Retry webhook processing
const retryConfig = {
  retries: 3,
  delay: 1000,
  backoff: 2
};

await retry(processWebhook, retryConfig);
```

---

## 🔒 Security

### Webhook Signature Verification

```typescript
const isValid = stripe.webhooks.constructEvent(
  payload,
  signature,
  webhookSecret
);

if (!isValid) {
  throw new Error('Invalid signature');
}
```

### Rate Limiting

```typescript
// Limit webhook endpoint
const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // 100 requests per minute
});

app.use('/api/webhooks/stripe', webhookLimiter);
```

---

## 📈 Testing

### Test Mode

```bash
# Use Stripe test keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# Trigger test events
stripe trigger customer.subscription.created
stripe trigger payment_intent.succeeded
stripe trigger invoice.payment_failed
```

### Manual Testing

```bash
# Create test subscription
curl -X POST http://localhost:3002/api/subscription/checkout \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"planId": "pro"}'

# Verify sync
curl http://localhost:3002/api/users/me \
  -H "Authorization: Bearer {token}"
```

---

## 🎯 Production Deployment

### 1. Configure Production Webhook

```bash
# In Stripe Dashboard:
# 1. Go to Developers → Webhooks
# 2. Click "Add endpoint"
# 3. Enter URL: https://api.yourdomain.com/api/webhooks/stripe
# 4. Select events:
#    - customer.subscription.*
#    - payment_intent.*
#    - invoice.*
# 5. Copy signing secret
```

### 2. Update Environment

```bash
# Production .env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PYTHON_SERVICE_URL=https://analytics.yourdomain.com
```

### 3. Enable Monitoring

```bash
# Set up alerts for:
# - Webhook failures
# - Payment failures
# - Sync errors
```

---

## 📝 Maintenance

### Daily Tasks

```typescript
// Sync all subscriptions
await SubscriptionAutomationService.syncAllSubscriptions();

// Check for expired trials
await checkExpiredTrials();

// Process failed payments
await retryFailedPayments();
```

### Weekly Tasks

```typescript
// Generate subscription reports
await generateSubscriptionReport();

// Clean up old webhook logs
await cleanupWebhookLogs(30); // Keep 30 days
```

---

## 🆘 Troubleshooting

### Webhook Not Received

1. Check webhook URL is correct
2. Verify firewall allows Stripe IPs
3. Check Stripe Dashboard for delivery attempts
4. Test with Stripe CLI

### Subscription Not Syncing

1. Check database connection
2. Verify Python service is running
3. Check user has stripeCustomerId
4. Manually trigger sync

### Features Not Provisioned

1. Check subscription status in database
2. Verify feature flags are updated
3. Clear frontend cache
4. Re-login to refresh session

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
**Status**: Production Ready ✅
