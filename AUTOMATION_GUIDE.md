# KAIRO QUANTUM - Automation Guide

Complete guide to automated systems, health checks, and easy service management.

---

## 🚀 Quick Start

### Start All Services

```bash
./start-all-services.sh
```

This single command will:
- ✅ Check and install all dependencies
- ✅ Clean up any existing processes
- ✅ Start Backend API (port 3002)
- ✅ Start Python Analytics Service (port 8000)
- ✅ Start Frontend (port 3000)
- ✅ Run health checks to verify all services
- ✅ Display service URLs and process IDs

### Stop All Services

```bash
./stop-all-services.sh
```

This will gracefully stop all running services and clean up log files.

---

## 🏥 Health Check System

The health check system monitors all critical services and provides real-time status.

### Health Check Endpoints

#### 1. Quick Ping

```bash
curl http://localhost:3002/api/health/ping
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-23T04:04:05.342Z",
  "uptime": 36.335770458
}
```

#### 2. Comprehensive Status

```bash
curl http://localhost:3002/api/health/status
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-23T04:04:24.115Z",
  "uptime": 55.108872292,
  "responseTime": 889,
  "version": "1.0.0",
  "environment": "development",
  "checks": [
    {
      "service": "PostgreSQL Database",
      "status": "healthy",
      "responseTime": 17,
      "details": { "connected": true }
    },
    {
      "service": "Python Analytics",
      "status": "healthy",
      "responseTime": 269,
      "details": { "url": "http://localhost:8000" }
    },
    {
      "service": "Stripe Payment API",
      "status": "healthy",
      "responseTime": 360,
      "details": { "configured": true }
    },
    {
      "service": "Environment Configuration",
      "status": "healthy",
      "details": {
        "required": 4,
        "configured": 4,
        "missing": []
      }
    },
    {
      "service": "Alpaca Broker API",
      "status": "healthy",
      "responseTime": 242,
      "details": {
        "account": "PA38U7IUJPB9",
        "status": "ACTIVE"
      }
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

#### 3. Database Health

```bash
curl http://localhost:3002/api/health/database
```

**Response:**
```json
{
  "status": "healthy",
  "responseTime": 49,
  "stats": {
    "users": 8,
    "trades": 0
  },
  "connection": {
    "url": "localhost:5432/kairo_db?schema=public",
    "poolSize": 10
  }
}
```

#### 4. API Endpoints List

```bash
curl http://localhost:3002/api/health/endpoints
```

**Response:**
```json
{
  "success": true,
  "totalEndpoints": 39,
  "endpoints": {
    "authentication": [...],
    "users": [...],
    "trading": [...],
    "portfolios": [...],
    "fees": [...],
    "subscriptions": [...],
    "autotrading": [...],
    "brokers": [...],
    "analytics": [...],
    "webhooks": [...],
    "health": [...]
  }
}
```

---

## 🧪 API Testing

### Quick API Test

Run the automated quick test suite:

```bash
./backend/scripts/quick-api-test.sh
```

**Output:**
```
=========================================
KAIRO QUANTUM - Quick API Test
=========================================

✓ Testing /health
  ✅ Basic health check: PASS
✓ Testing /api/health/ping
  ✅ Health ping: PASS
✓ Testing /api/health/status
  ✅ Health status: PASS
✓ Testing /api/health/database
  ✅ Database health: PASS
✓ Testing /api/health/endpoints
  ✅ Endpoints list: PASS

✓ Testing /api/subscription/plans
  ✅ Subscription plans: PASS

✓ Testing Python Analytics Service
  ✅ Python service health: PASS

✓ Testing Protected Endpoints (should return 401)
  ✅ Protected endpoint auth: PASS (401)

=========================================
All critical endpoints tested!
=========================================
```

### Comprehensive API Test

For detailed testing of all endpoints:

```bash
./backend/scripts/test-api-endpoints.sh
```

This will test all 39 API endpoints and provide a detailed pass/fail report.

---

## 📊 Service Architecture

### Service Ports

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Frontend | 3000 | http://localhost:3000 | Next.js UI |
| Backend | 3002 | http://localhost:3002 | Express API |
| Python Analytics | 8000 | http://localhost:8000 | FastAPI Service |
| PostgreSQL | 5432 | localhost:5432 | Database |

### Service Dependencies

```
Frontend (3000)
    ↓ calls
Backend (3002)
    ↓ calls
    ├─→ PostgreSQL (5432)
    ├─→ Python Analytics (8000)
    ├─→ Stripe API
    └─→ Alpaca Broker API
```

---

## 🔧 Troubleshooting

### Services Won't Start

1. **Check if ports are in use:**
```bash
lsof -ti:3000 -ti:3002 -ti:8000
```

2. **Kill processes and restart:**
```bash
./stop-all-services.sh
./start-all-services.sh
```

3. **Check logs:**
```bash
tail -f /tmp/kairo-backend.log
tail -f /tmp/kairo-python.log
tail -f /tmp/kairo-frontend.log
```

### Database Connection Issues

1. **Verify PostgreSQL is running:**
```bash
pg_isready -h localhost -p 5432
```

2. **Check database health:**
```bash
curl http://localhost:3002/api/health/database
```

3. **Test connection:**
```bash
psql -h localhost -p 5432 -U postgres -d kairo_db
```

### Environment Variables Missing

1. **Check configuration:**
```bash
curl http://localhost:3002/api/health/status | jq '.checks[] | select(.service=="Environment Configuration")'
```

2. **Verify .env files exist:**
```bash
ls -la backend/.env
ls -la .env.local
```

### Dependency Issues

1. **Reinstall backend dependencies:**
```bash
cd backend && rm -rf node_modules && npm install
```

2. **Reinstall frontend dependencies:**
```bash
rm -rf node_modules && npm install
```

3. **Recreate Python environment:**
```bash
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 📈 Monitoring

### Real-Time Service Status

Access the comprehensive health dashboard at:
```
http://localhost:3002/api/health/status
```

### Monitor Logs

**Backend logs:**
```bash
tail -f /tmp/kairo-backend.log
```

**Python service logs:**
```bash
tail -f /tmp/kairo-python.log
```

**Frontend logs:**
```bash
tail -f /tmp/kairo-frontend.log
```

### Performance Metrics

Each service reports:
- Uptime
- Response time
- Connection status
- Resource usage

---

## 🔄 CI/CD Integration

### Health Check in CI Pipeline

Add to your CI pipeline:

```yaml
steps:
  - name: Start Services
    run: ./start-all-services.sh

  - name: Wait for Services
    run: sleep 10

  - name: Run Health Checks
    run: |
      curl --fail http://localhost:3002/api/health/status
      ./backend/scripts/quick-api-test.sh

  - name: Stop Services
    run: ./stop-all-services.sh
```

### Automated Testing

```bash
# Start services, run tests, stop services
./start-all-services.sh
npm test
./backend/scripts/test-api-endpoints.sh
./stop-all-services.sh
```

---

## 🛠️ Development Workflow

### Starting Development

```bash
# 1. Start all services
./start-all-services.sh

# 2. Open in browser
open http://localhost:3000

# 3. Monitor logs in separate terminals
tail -f /tmp/kairo-backend.log
tail -f /tmp/kairo-python.log
```

### Making Changes

All services run in development mode with hot-reload:
- **Frontend**: Next.js Fast Refresh
- **Backend**: Nodemon auto-restart
- **Python**: Uvicorn auto-reload

### Testing Changes

```bash
# Quick API test
./backend/scripts/quick-api-test.sh

# Full endpoint test
./backend/scripts/test-api-endpoints.sh

# Health check
curl http://localhost:3002/api/health/status | jq .
```

### Stopping Development

```bash
./stop-all-services.sh
```

---

## 📝 Scripts Reference

### Service Management

| Script | Purpose |
|--------|---------|
| `start-all-services.sh` | Start all services with health checks |
| `stop-all-services.sh` | Stop all services and clean up |

### Testing

| Script | Purpose |
|--------|---------|
| `backend/scripts/quick-api-test.sh` | Fast endpoint verification |
| `backend/scripts/test-api-endpoints.sh` | Comprehensive API testing |

### Health Checks

| Endpoint | Purpose |
|----------|---------|
| `/health` | Basic health check |
| `/api/health/ping` | Quick ping |
| `/api/health/status` | Comprehensive status |
| `/api/health/database` | Database health |
| `/api/health/endpoints` | API endpoints list |

---

## 🔐 Security

### Production Deployment

**Never commit:**
- `.env` files
- API keys
- Database credentials
- Stripe keys

**Always:**
- Use environment variables
- Rotate secrets regularly
- Enable rate limiting
- Monitor health endpoints
- Review logs for suspicious activity

---

## 📞 Support

For issues with automation:
- Check logs in `/tmp/kairo-*.log`
- Run health check: `curl http://localhost:3002/api/health/status`
- Restart services: `./stop-all-services.sh && ./start-all-services.sh`

For further assistance:
- **Email**: support@kairoquantum.com
- **Docs**: https://docs.kairoquantum.com
- **GitHub**: https://github.com/kairoquantum/platform

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
**Maintained By**: KAIRO QUANTUM Team
