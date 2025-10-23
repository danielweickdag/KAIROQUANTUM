#!/bin/bash

# KAIRO QUANTUM - Deployment Verification Script
# Tests all critical endpoints after deployment

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
FRONTEND_URL="${FRONTEND_URL:-https://www.kairoquantum.com}"
API_URL="${API_URL:-https://api.kairoquantum.com}"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  KAIRO QUANTUM - Deployment Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Testing deployment at:"
echo -e "  Frontend: ${GREEN}${FRONTEND_URL}${NC}"
echo -e "  API:      ${GREEN}${API_URL}${NC}"
echo ""

PASSED=0
FAILED=0

# Test function
test_endpoint() {
  local name="$1"
  local url="$2"
  local expected_status="${3:-200}"

  echo -ne "Testing ${name}... "

  response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")

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

# Test JSON endpoint
test_json_endpoint() {
  local name="$1"
  local url="$2"
  local expected_field="$3"

  echo -ne "Testing ${name}... "

  response=$(curl -s --max-time 10 "$url" 2>/dev/null || echo "{}")

  if echo "$response" | jq -e ".$expected_field" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (field '$expected_field' not found)"
    ((FAILED++))
    return 1
  fi
}

echo -e "${YELLOW}[1/5]${NC} Frontend Tests"
echo "─────────────────────────────"
test_endpoint "Homepage" "$FRONTEND_URL" "200"
test_endpoint "Login page" "$FRONTEND_URL/login" "200"
test_endpoint "Dashboard" "$FRONTEND_URL/dashboard" "200"
echo ""

echo -e "${YELLOW}[2/5]${NC} API Health Checks"
echo "─────────────────────────────"
test_json_endpoint "Basic health" "$API_URL/api/health/ping" "status"
test_json_endpoint "Full health status" "$API_URL/api/health/status" "status"
test_json_endpoint "Database check" "$API_URL/api/health/database" "status"
test_json_endpoint "Environment check" "$API_URL/api/health/environment" "status"
echo ""

echo -e "${YELLOW}[3/5]${NC} API Endpoints"
echo "─────────────────────────────"
test_endpoint "Auth endpoints" "$API_URL/api/auth/health" "200"
test_endpoint "Fee calculator" "$API_URL/api/fees/schedule" "401"  # Expects 401 without auth
echo ""

echo -e "${YELLOW}[4/5]${NC} SSL/TLS Tests"
echo "─────────────────────────────"
echo -ne "Testing SSL certificate (frontend)... "
if curl -sI --max-time 10 "$FRONTEND_URL" | grep -q "HTTP/2\|HTTP/1.1"; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAILED++))
fi

echo -ne "Testing SSL certificate (API)... "
if curl -sI --max-time 10 "$API_URL/api/health/ping" | grep -q "HTTP/2\|HTTP/1.1"; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAILED++))
fi
echo ""

echo -e "${YELLOW}[5/5]${NC} DNS Resolution"
echo "─────────────────────────────"
echo -ne "Testing DNS (www.kairoquantum.com)... "
if host www.kairoquantum.com > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAILED++))
fi

echo -ne "Testing DNS (api.kairoquantum.com)... "
if host api.kairoquantum.com > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASSED++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAILED++))
fi
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Test Results${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Passed: ${GREEN}${PASSED}${NC}"
echo -e "Failed: ${RED}${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  echo -e "${GREEN}Your deployment is working correctly.${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠ Some tests failed.${NC}"
  echo -e "Check the logs and fix the issues."
  exit 1
fi
