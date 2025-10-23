#!/bin/bash

# Quick API Test Script
# Fast verification of critical endpoints

BASE_URL="http://localhost:3002"
TIMEOUT=5

echo "========================================="
echo "KAIRO QUANTUM - Quick API Test"
echo "========================================="
echo ""

# Test health endpoints
echo "✓ Testing /health"
curl -s --max-time $TIMEOUT $BASE_URL/health > /dev/null && echo "  ✅ Basic health check: PASS" || echo "  ❌ Basic health check: FAIL"

echo "✓ Testing /api/health/ping"
curl -s --max-time $TIMEOUT $BASE_URL/api/health/ping > /dev/null && echo "  ✅ Health ping: PASS" || echo "  ❌ Health ping: FAIL"

echo "✓ Testing /api/health/status"
curl -s --max-time $TIMEOUT $BASE_URL/api/health/status > /dev/null && echo "  ✅ Health status: PASS" || echo "  ❌ Health status: FAIL"

echo "✓ Testing /api/health/database"
curl -s --max-time $TIMEOUT $BASE_URL/api/health/database > /dev/null && echo "  ✅ Database health: PASS" || echo "  ❌ Database health: FAIL"

echo "✓ Testing /api/health/endpoints"
curl -s --max-time $TIMEOUT $BASE_URL/api/health/endpoints > /dev/null && echo "  ✅ Endpoints list: PASS" || echo "  ❌ Endpoints list: FAIL"

echo ""
echo "✓ Testing /api/subscription/plans"
curl -s --max-time $TIMEOUT $BASE_URL/api/subscription/plans > /dev/null && echo "  ✅ Subscription plans: PASS" || echo "  ❌ Subscription plans: FAIL"

echo ""
echo "✓ Testing Python Analytics Service"
curl -s --max-time $TIMEOUT http://localhost:8000/health > /dev/null && echo "  ✅ Python service health: PASS" || echo "  ❌ Python service health: FAIL"

echo ""
echo "✓ Testing Protected Endpoints (should return 401)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT $BASE_URL/api/users/me)
[ "$STATUS" = "401" ] && echo "  ✅ Protected endpoint auth: PASS (401)" || echo "  ❌ Protected endpoint auth: FAIL (got $STATUS)"

echo ""
echo "========================================="
echo "All critical endpoints tested!"
echo "========================================="
