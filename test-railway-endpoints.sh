#!/bin/bash

# Quick Railway API Testing Script
# Tests the Railway deployment directly while DNS propagates

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# Railway URL
API_URL="https://kairoquantum-production.up.railway.app"

# Test counters
PASSED=0
FAILED=0

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  KAIRO QUANTUM - Railway API Testing${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}Testing Railway API: ${GREEN}${API_URL}${NC}"
echo ""

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local expected_status=$2
    local description=$3
    
    echo -n "Testing ${description}... "
    
    response=$(curl -s -w "%{http_code}" "${API_URL}${endpoint}" -o /tmp/response.json)
    status_code="${response: -3}"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (${status_code})"
        ((PASSED++))
        if [ -f /tmp/response.json ]; then
            echo "  Response: $(cat /tmp/response.json | head -c 100)..."
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (Expected: ${expected_status}, Got: ${status_code})"
        ((FAILED++))
        if [ -f /tmp/response.json ]; then
            echo "  Response: $(cat /tmp/response.json)"
        fi
    fi
    echo ""
}

# Test basic endpoints
echo -e "${YELLOW}=== Basic Health Checks ===${NC}"
test_endpoint "/api/health/ping" "200" "Health Ping"
test_endpoint "/api/health/status" "200" "Health Status"
test_endpoint "/api/health/database" "200" "Database Health"
test_endpoint "/api/health/endpoints" "200" "Available Endpoints"

echo -e "${YELLOW}=== Authentication Endpoints ===${NC}"
test_endpoint "/api/auth/login" "400" "Auth Login (No credentials)"

echo -e "${YELLOW}=== User Endpoints ===${NC}"
test_endpoint "/api/users" "401" "Users List (Unauthorized)"

echo -e "${YELLOW}=== Trading Endpoints ===${NC}"
test_endpoint "/api/trades" "401" "Trades (Unauthorized)"
test_endpoint "/api/live-trading/status" "401" "Live Trading Status (Unauthorized)"

echo -e "${YELLOW}=== Broker Endpoints ===${NC}"
test_endpoint "/api/brokers" "200" "Supported Brokers"

echo -e "${YELLOW}=== Subscription Endpoints ===${NC}"
test_endpoint "/api/subscription/plans" "200" "Subscription Plans"

echo -e "${YELLOW}=== Fee Endpoints ===${NC}"
test_endpoint "/api/fees/schedule" "200" "Fee Schedule"

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Test Summary:${NC}"
echo -e "  ${GREEN}Passed: ${PASSED}${NC}"
echo -e "  ${RED}Failed: ${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All Railway API tests passed!${NC}"
    echo -e "${YELLOW}✅ Backend deployment is working correctly${NC}"
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    echo "1. Wait for DNS propagation (5-30 minutes)"
    echo "2. Test api.kairoquantum.com endpoints"
    echo "3. Run full production test suite"
else
    echo -e "${RED}❌ Some tests failed. Check the Railway deployment.${NC}"
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"