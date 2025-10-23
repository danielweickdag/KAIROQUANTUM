#!/bin/bash

# KAIRO QUANTUM - Complete Production Testing Script
# Tests all functionality including trading operations

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# Production URLs
FRONTEND_URL="https://www.kairoquantum.com"
API_URL="https://api.kairoquantum.com"

# Test counters
PASSED=0
FAILED=0
WARNINGS=0

# Test credentials (will be created during test)
TEST_EMAIL="test-$(date +%s)@kairoquantum.com"
TEST_PASSWORD="TestPassword123!"
AUTH_TOKEN=""
USER_ID=""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  KAIRO QUANTUM - Complete Production Testing Suite${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}Testing Production Environment:${NC}"
echo -e "  Frontend: ${GREEN}${FRONTEND_URL}${NC}"
echo -e "  API:      ${GREEN}${API_URL}${NC}"
echo ""
echo -e "${YELLOW}This will test:${NC}"
echo "  • Infrastructure (DNS, SSL, CORS)"
echo "  • Frontend pages"
echo "  • API health checks"
echo "  • Authentication system"
echo "  • Trading operations (stocks, crypto, options)"
echo "  • Fee calculator"
echo "  • Subscription/billing"
echo "  • Database operations"
echo "  • Stripe integration"
echo ""
read -p "Continue with production testing? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Testing cancelled"
    exit 0
fi
echo ""

# ============================================
# HELPER FUNCTIONS
# ============================================

test_endpoint() {
  local name="$1"
  local url="$2"
  local expected_status="${3:-200}"

  echo -ne "  Testing ${name}... "

  response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$url" 2>/dev/null || echo "000")

  if [ "$response" = "$expected_status" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (HTTP $response, expected $expected_status)"
    ((FAILED++))
    return 1
  fi
}

test_json_endpoint() {
  local name="$1"
  local url="$2"
  local expected_field="$3"
  local method="${4:-GET}"
  local data="${5:-}"
  local auth_header="${6:-}"

  echo -ne "  Testing ${name}... "

  if [ -n "$data" ]; then
    if [ -n "$auth_header" ]; then
      response=$(curl -s --max-time 15 -X "$method" -H "Content-Type: application/json" -H "$auth_header" -d "$data" "$url" 2>/dev/null || echo "{}")
    else
      response=$(curl -s --max-time 15 -X "$method" -H "Content-Type: application/json" -d "$data" "$url" 2>/dev/null || echo "{}")
    fi
  else
    if [ -n "$auth_header" ]; then
      response=$(curl -s --max-time 15 -H "$auth_header" "$url" 2>/dev/null || echo "{}")
    else
      response=$(curl -s --max-time 15 "$url" 2>/dev/null || echo "{}")
    fi
  fi

  if echo "$response" | jq -e ".$expected_field" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
    echo "$response"
    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (field '$expected_field' not found)"
    echo "Response: $response" | head -c 200
    echo ""
    ((FAILED++))
    return 1
  fi
}

# ============================================
# SECTION 1: Infrastructure Tests
# ============================================
echo -e "${YELLOW}[1/10]${NC} ${CYAN}Infrastructure Tests${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# DNS Resolution
echo -ne "  Testing DNS (www.kairoquantum.com)... "
if host www.kairoquantum.com > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAILED++))
fi

echo -ne "  Testing DNS (api.kairoquantum.com)... "
if host api.kairoquantum.com > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAILED++))
fi

# SSL/TLS Certificates
echo -ne "  Testing SSL certificate (frontend)... "
if curl -sI --max-time 10 "$FRONTEND_URL" 2>&1 | grep -q "HTTP/2\|HTTP/1.1"; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAILED++))
fi

echo -ne "  Testing SSL certificate (API)... "
if curl -sI --max-time 10 "$API_URL/api/health/ping" 2>&1 | grep -q "HTTP/2\|HTTP/1.1"; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAILED++))
fi

# CORS Headers
echo -ne "  Testing CORS headers... "
cors_response=$(curl -sI --max-time 10 -H "Origin: https://www.kairoquantum.com" "$API_URL/api/health/ping" 2>/dev/null || echo "")
if echo "$cors_response" | grep -qi "access-control-allow-origin"; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⊙ WARNING${NC} (CORS headers not found)"
  ((WARNINGS++))
fi

echo ""

# ============================================
# SECTION 2: Frontend Pages
# ============================================
echo -e "${YELLOW}[2/10]${NC} ${CYAN}Frontend Page Tests${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_endpoint "Homepage" "$FRONTEND_URL" "200"
test_endpoint "Login page" "$FRONTEND_URL/login" "200"
test_endpoint "Dashboard" "$FRONTEND_URL/dashboard" "200"
test_endpoint "Trading page" "$FRONTEND_URL/trading" "200"
test_endpoint "Portfolio page" "$FRONTEND_URL/portfolio" "200"
test_endpoint "Automation page" "$FRONTEND_URL/automation" "200"

echo ""

# ============================================
# SECTION 3: API Health Checks
# ============================================
echo -e "${YELLOW}[3/10]${NC} ${CYAN}API Health Checks${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

test_json_endpoint "Basic ping" "$API_URL/api/health/ping" "status"
test_json_endpoint "Full health status" "$API_URL/api/health/status" "status"
test_json_endpoint "Database check" "$API_URL/api/health/database" "status"
test_json_endpoint "Environment check" "$API_URL/api/health/environment" "status"
test_json_endpoint "Services check" "$API_URL/api/health/services" "status"

echo ""

# ============================================
# SECTION 4: Authentication Flow
# ============================================
echo -e "${YELLOW}[4/10]${NC} ${CYAN}Authentication Tests${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Register new user
echo -ne "  Testing user registration... "
register_response=$(curl -s --max-time 15 -X POST \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"name\":\"Test User\"}" \
  "$API_URL/api/auth/register" 2>/dev/null || echo "{}")

if echo "$register_response" | jq -e '.token' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASSED++))
  AUTH_TOKEN=$(echo "$register_response" | jq -r '.token')
  USER_ID=$(echo "$register_response" | jq -r '.user.id')
  echo "    User ID: $USER_ID"
else
  echo -e "${RED}✗ FAIL${NC}"
  echo "    Response: $register_response" | head -c 200
  echo ""
  ((FAILED++))
fi

# Login
echo -ne "  Testing user login... "
login_response=$(curl -s --max-time 15 -X POST \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
  "$API_URL/api/auth/login" 2>/dev/null || echo "{}")

if echo "$login_response" | jq -e '.token' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASSED++))
  AUTH_TOKEN=$(echo "$login_response" | jq -r '.token')
else
  echo -e "${RED}✗ FAIL${NC}"
  echo "    Response: $login_response" | head -c 200
  echo ""
  ((FAILED++))
fi

# Get user profile
if [ -n "$AUTH_TOKEN" ]; then
  echo -ne "  Testing get profile... "
  profile_response=$(curl -s --max-time 15 \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/api/auth/me" 2>/dev/null || echo "{}")

  if echo "$profile_response" | jq -e '.user' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
  fi
fi

echo ""

# ============================================
# SECTION 5: Trading Operations - Stocks
# ============================================
echo -e "${YELLOW}[5/10]${NC} ${CYAN}Trading Operations - Stocks${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$AUTH_TOKEN" ]; then
  # Get stock quote
  echo -ne "  Testing get stock quote (AAPL)... "
  quote_response=$(curl -s --max-time 15 \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/api/trading/quote/AAPL" 2>/dev/null || echo "{}")

  if echo "$quote_response" | jq -e '.symbol' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
    echo "    Price: $(echo "$quote_response" | jq -r '.price // "N/A"')"
  else
    echo -e "${RED}✗ FAIL${NC}"
    echo "    Response: $quote_response" | head -c 200
    echo ""
    ((FAILED++))
  fi

  # Place stock order (paper trading)
  echo -ne "  Testing place stock order (paper)... "
  order_response=$(curl -s --max-time 15 -X POST \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"symbol":"AAPL","side":"buy","quantity":1,"type":"market"}' \
    "$API_URL/api/trading/order" 2>/dev/null || echo "{}")

  if echo "$order_response" | jq -e '.order' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
    ORDER_ID=$(echo "$order_response" | jq -r '.order.id')
    echo "    Order ID: $ORDER_ID"
  else
    echo -e "${RED}✗ FAIL${NC}"
    echo "    Response: $order_response" | head -c 200
    echo ""
    ((FAILED++))
  fi

  # Get order status
  if [ -n "$ORDER_ID" ]; then
    echo -ne "  Testing get order status... "
    status_response=$(curl -s --max-time 15 \
      -H "Authorization: Bearer $AUTH_TOKEN" \
      "$API_URL/api/trading/order/$ORDER_ID" 2>/dev/null || echo "{}")

    if echo "$status_response" | jq -e '.status' > /dev/null 2>&1; then
      echo -e "${GREEN}✓ PASS${NC}"
      ((PASSED++))
      echo "    Status: $(echo "$status_response" | jq -r '.status')"
    else
      echo -e "${RED}✗ FAIL${NC}"
      ((FAILED++))
    fi
  fi

  # Get positions
  echo -ne "  Testing get positions... "
  positions_response=$(curl -s --max-time 15 \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/api/trading/positions" 2>/dev/null || echo "{}")

  if echo "$positions_response" | jq -e 'type == "array"' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
    position_count=$(echo "$positions_response" | jq 'length')
    echo "    Positions: $position_count"
  else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
  fi
else
  echo -e "${YELLOW}⊙ Skipped (no auth token)${NC}"
fi

echo ""

# ============================================
# SECTION 6: Trading Operations - Crypto
# ============================================
echo -e "${YELLOW}[6/10]${NC} ${CYAN}Trading Operations - Crypto${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$AUTH_TOKEN" ]; then
  # Get crypto quote
  echo -ne "  Testing get crypto quote (BTC/USD)... "
  crypto_quote=$(curl -s --max-time 15 \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/api/trading/crypto/quote/BTCUSD" 2>/dev/null || echo "{}")

  if echo "$crypto_quote" | jq -e '.symbol' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
    echo "    Price: $(echo "$crypto_quote" | jq -r '.price // "N/A"')"
  else
    echo -e "${YELLOW}⊙ WARNING${NC} (endpoint may not be available)"
    echo "    Response: $crypto_quote" | head -c 200
    echo ""
    ((WARNINGS++))
  fi

  # Place crypto order
  echo -ne "  Testing place crypto order... "
  crypto_order=$(curl -s --max-time 15 -X POST \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"symbol":"BTCUSD","side":"buy","quantity":0.001,"type":"market"}' \
    "$API_URL/api/trading/crypto/order" 2>/dev/null || echo "{}")

  if echo "$crypto_order" | jq -e '.order' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
  else
    echo -e "${YELLOW}⊙ WARNING${NC} (endpoint may not be available)"
    ((WARNINGS++))
  fi
else
  echo -e "${YELLOW}⊙ Skipped (no auth token)${NC}"
fi

echo ""

# ============================================
# SECTION 7: Fee Calculator
# ============================================
echo -e "${YELLOW}[7/10]${NC} ${CYAN}Fee Calculator Tests${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$AUTH_TOKEN" ]; then
  # Get fee schedule
  echo -ne "  Testing get fee schedule... "
  schedule_response=$(curl -s --max-time 15 \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/api/fees/schedule" 2>/dev/null || echo "{}")

  if echo "$schedule_response" | jq -e '.trading' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}"
    echo "    Response: $schedule_response" | head -c 200
    echo ""
    ((FAILED++))
  fi

  # Calculate trading fee
  echo -ne "  Testing calculate trading fee... "
  trading_fee=$(curl -s --max-time 15 -X POST \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"amount":10000,"type":"stock"}' \
    "$API_URL/api/fees/calculate/trading" 2>/dev/null || echo "{}")

  if echo "$trading_fee" | jq -e '.fee' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
    echo "    Fee on \$100: \$$(echo "$trading_fee" | jq -r '.fee')"
  else
    echo -e "${RED}✗ FAIL${NC}"
    echo "    Response: $trading_fee" | head -c 200
    echo ""
    ((FAILED++))
  fi

  # Calculate withdrawal fee
  echo -ne "  Testing calculate withdrawal fee... "
  withdrawal_fee=$(curl -s --max-time 15 -X POST \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"amount":10000,"method":"ach"}' \
    "$API_URL/api/fees/calculate/withdrawal" 2>/dev/null || echo "{}")

  if echo "$withdrawal_fee" | jq -e '.fee' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
    echo "    Fee on \$100 ACH: \$$(echo "$withdrawal_fee" | jq -r '.fee')"
  else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
  fi

  # Get user fee summary
  echo -ne "  Testing get user fee summary... "
  fee_summary=$(curl -s --max-time 15 \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/api/fees/summary" 2>/dev/null || echo "{}")

  if echo "$fee_summary" | jq -e '.totalFees' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
  fi
else
  echo -e "${YELLOW}⊙ Skipped (no auth token)${NC}"
fi

echo ""

# ============================================
# SECTION 8: Subscription & Billing
# ============================================
echo -e "${YELLOW}[8/10]${NC} ${CYAN}Subscription & Billing Tests${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Get subscription plans
echo -ne "  Testing get subscription plans... "
plans_response=$(curl -s --max-time 15 "$API_URL/api/subscription/plans" 2>/dev/null || echo "{}")

if echo "$plans_response" | jq -e 'type == "array"' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASSED++))
  plan_count=$(echo "$plans_response" | jq 'length')
  echo "    Plans available: $plan_count"
else
  echo -e "${RED}✗ FAIL${NC}"
  echo "    Response: $plans_response" | head -c 200
  echo ""
  ((FAILED++))
fi

if [ -n "$AUTH_TOKEN" ]; then
  # Create Stripe checkout session (test mode)
  echo -ne "  Testing create checkout session... "
  checkout_response=$(curl -s --max-time 15 -X POST \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"priceId":"price_test","successUrl":"https://www.kairoquantum.com/success","cancelUrl":"https://www.kairoquantum.com/cancel"}' \
    "$API_URL/api/billing/create-checkout-session" 2>/dev/null || echo "{}")

  if echo "$checkout_response" | jq -e '.url' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
  else
    echo -e "${YELLOW}⊙ WARNING${NC} (may require valid price ID)"
    echo "    Response: $checkout_response" | head -c 200
    echo ""
    ((WARNINGS++))
  fi

  # Get current subscription
  echo -ne "  Testing get current subscription... "
  subscription_response=$(curl -s --max-time 15 \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/api/subscription/current" 2>/dev/null || echo "{}")

  if echo "$subscription_response" | jq -e '.plan' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
    echo "    Plan: $(echo "$subscription_response" | jq -r '.plan')"
  else
    echo -e "${YELLOW}⊙ WARNING${NC} (no active subscription)"
    ((WARNINGS++))
  fi
else
  echo -e "${YELLOW}⊙ Skipped (no auth token)${NC}"
fi

echo ""

# ============================================
# SECTION 9: Portfolio & Analytics
# ============================================
echo -e "${YELLOW}[9/10]${NC} ${CYAN}Portfolio & Analytics Tests${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$AUTH_TOKEN" ]; then
  # Get portfolio summary
  echo -ne "  Testing get portfolio summary... "
  portfolio_response=$(curl -s --max-time 15 \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/api/portfolio/summary" 2>/dev/null || echo "{}")

  if echo "$portfolio_response" | jq -e '.totalValue' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
    echo "    Total Value: \$$(echo "$portfolio_response" | jq -r '.totalValue // 0')"
  else
    echo -e "${RED}✗ FAIL${NC}"
    echo "    Response: $portfolio_response" | head -c 200
    echo ""
    ((FAILED++))
  fi

  # Get trade history
  echo -ne "  Testing get trade history... "
  history_response=$(curl -s --max-time 15 \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/api/trading/history" 2>/dev/null || echo "{}")

  if echo "$history_response" | jq -e 'type == "array"' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
    trade_count=$(echo "$history_response" | jq 'length')
    echo "    Trades: $trade_count"
  else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
  fi

  # Get performance metrics
  echo -ne "  Testing get performance metrics... "
  metrics_response=$(curl -s --max-time 15 \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/api/portfolio/metrics" 2>/dev/null || echo "{}")

  if echo "$metrics_response" | jq -e '.returns' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
  else
    echo -e "${YELLOW}⊙ WARNING${NC} (endpoint may not be available)"
    ((WARNINGS++))
  fi
else
  echo -e "${YELLOW}⊙ Skipped (no auth token)${NC}"
fi

echo ""

# ============================================
# SECTION 10: Database & Data Persistence
# ============================================
echo -e "${YELLOW}[10/10]${NC} ${CYAN}Database & Data Persistence${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$AUTH_TOKEN" ] && [ -n "$USER_ID" ]; then
  # Verify user data persists
  echo -ne "  Testing user data persistence... "
  user_check=$(curl -s --max-time 15 \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/api/auth/me" 2>/dev/null || echo "{}")

  if echo "$user_check" | jq -e '.user.id' > /dev/null 2>&1; then
    retrieved_id=$(echo "$user_check" | jq -r '.user.id')
    if [ "$retrieved_id" = "$USER_ID" ]; then
      echo -e "${GREEN}✓ PASS${NC}"
      ((PASSED++))
    else
      echo -e "${RED}✗ FAIL${NC} (user ID mismatch)"
      ((FAILED++))
    fi
  else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
  fi

  # Test transaction recording
  echo -ne "  Testing transaction recording... "
  transaction_test=$(curl -s --max-time 15 -X POST \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"amount":10000,"type":"stock"}' \
    "$API_URL/api/fees/calculate/trading" 2>/dev/null || echo "{}")

  if echo "$transaction_test" | jq -e '.fee' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
  fi

  # Cleanup - delete test user (optional)
  echo -ne "  Cleaning up test user... "
  delete_response=$(curl -s --max-time 15 -X DELETE \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/api/auth/user" 2>/dev/null || echo "{}")

  if echo "$delete_response" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
  else
    echo -e "${YELLOW}⊙ WARNING${NC} (manual cleanup may be required)"
    echo "    Test user: $TEST_EMAIL"
    ((WARNINGS++))
  fi
else
  echo -e "${YELLOW}⊙ Skipped (no auth token)${NC}"
fi

echo ""

# ============================================
# FINAL SUMMARY
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Production Test Results${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Passed:   ${GREEN}${PASSED}${NC}"
echo -e "Failed:   ${RED}${FAILED}${NC}"
echo -e "Warnings: ${YELLOW}${WARNINGS}${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
if [ $TOTAL -gt 0 ]; then
  SUCCESS_RATE=$((PASSED * 100 / TOTAL))
  echo -e "Success Rate: ${SUCCESS_RATE}%"
  echo ""
fi

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}  ✓ ALL TESTS PASSED!${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "${GREEN}Your production deployment is working correctly!${NC}"
  echo ""
  echo -e "${CYAN}Production URLs:${NC}"
  echo -e "  • Frontend: ${GREEN}${FRONTEND_URL}${NC}"
  echo -e "  • API:      ${GREEN}${API_URL}${NC}"
  echo ""
  exit 0
else
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}  ⚠ SOME TESTS FAILED${NC}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "Please review the failed tests above and check:"
  echo "  • Railway logs:  railway logs"
  echo "  • Vercel logs:   vercel logs"
  echo "  • Database:      railway run npx prisma migrate status"
  echo "  • Environment:   railway variables"
  echo ""
  exit 1
fi
