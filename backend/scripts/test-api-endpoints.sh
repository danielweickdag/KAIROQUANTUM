#!/bin/bash

# KAIRO QUANTUM - API Endpoint Testing Script
# Tests all critical API endpoints to ensure they're working correctly

set -e

BASE_URL="http://localhost:3002"
PYTHON_URL="http://localhost:8000"

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Function to test an endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local description=$4
    local body=$5
    local token=$6

    echo -n "Testing ${description}... "

    if [ "$method" == "GET" ]; then
        if [ -n "$token" ]; then
            response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $token" "${BASE_URL}${endpoint}")
        else
            response=$(curl -s -w "\n%{http_code}" "${BASE_URL}${endpoint}")
        fi
    elif [ "$method" == "POST" ]; then
        if [ -n "$token" ]; then
            response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d "$body" "${BASE_URL}${endpoint}")
        else
            response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$body" "${BASE_URL}${endpoint}")
        fi
    fi

    status_code=$(echo "$response" | tail -n1)

    if [ "$status_code" == "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $status_code)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected $expected_status, got $status_code)"
        ((FAILED++))
    fi
}

# Function to test Python service endpoint
test_python_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local description=$4

    echo -n "Testing ${description}... "

    response=$(curl -s -w "\n%{http_code}" "${PYTHON_URL}${endpoint}")
    status_code=$(echo "$response" | tail -n1)

    if [ "$status_code" == "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $status_code)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected $expected_status, got $status_code)"
        ((FAILED++))
    fi
}

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}KAIRO QUANTUM API ENDPOINT TEST SUITE${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Test Health Endpoints (no auth required)
echo -e "${YELLOW}Testing Health Endpoints...${NC}"
test_endpoint "GET" "/health" "200" "Basic health check"
test_endpoint "GET" "/api/health/ping" "200" "Health ping endpoint"
test_endpoint "GET" "/api/health/status" "200" "Comprehensive health status"
test_endpoint "GET" "/api/health/database" "200" "Database health check"
test_endpoint "GET" "/api/health/endpoints" "200" "API endpoints list"
echo ""

# Test Python Analytics Service
echo -e "${YELLOW}Testing Python Analytics Service...${NC}"
test_python_endpoint "GET" "/health" "200" "Python service health check"
test_python_endpoint "GET" "/docs" "200" "Python service API docs"
echo ""

# Test Authentication Endpoints
echo -e "${YELLOW}Testing Authentication Endpoints...${NC}"
test_endpoint "POST" "/api/auth/login" "400" "Login (without credentials)" '{}'
test_endpoint "POST" "/api/auth/register" "400" "Register (without data)" '{}'
echo ""

# Test Protected Endpoints (should fail without auth)
echo -e "${YELLOW}Testing Protected Endpoints (without auth)...${NC}"
test_endpoint "GET" "/api/users/me" "401" "Get current user (no auth)"
test_endpoint "GET" "/api/portfolios" "401" "Get portfolios (no auth)"
test_endpoint "GET" "/api/trades" "401" "Get trades (no auth)"
echo ""

# Test Fee Calculator Endpoints (need auth)
echo -e "${YELLOW}Testing Fee Calculator Endpoints (without auth)...${NC}"
test_endpoint "POST" "/api/fees/calculate/trading" "401" "Calculate trading fee (no auth)" '{"amount": 1000, "assetType": "stock"}'
test_endpoint "POST" "/api/fees/calculate/withdrawal" "401" "Calculate withdrawal fee (no auth)" '{"amount": 1000, "method": "ach"}'
test_endpoint "GET" "/api/fees/schedule" "401" "Get fee schedule (no auth)"
echo ""

# Test Subscription Endpoints
echo -e "${YELLOW}Testing Subscription Endpoints...${NC}"
test_endpoint "GET" "/api/subscription/plans" "200" "Get subscription plans"
echo ""

# Test Market Endpoints (public)
echo -e "${YELLOW}Testing Market Endpoints...${NC}"
test_endpoint "GET" "/api/market" "200" "Get market data"
echo ""

# Summary
echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}TEST SUMMARY${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Total: $((PASSED + FAILED))${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
fi
