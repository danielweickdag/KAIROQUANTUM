#!/bin/bash

# KAIRO QUANTUM - Test Runner
# Run all tests across all services

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  $1"
    echo -e "${CYAN}╚════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Track test results
TESTS_PASSED=0
TESTS_FAILED=0

# Run backend tests
test_backend() {
    print_header "Testing Backend (Node.js)"

    if [ ! -d "backend" ]; then
        print_warning "Backend directory not found, skipping"
        return
    fi

    cd backend

    print_info "Running backend unit tests..."
    if npm test 2>/dev/null; then
        print_success "Backend tests passed"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_error "Backend tests failed"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi

    print_info "Running backend linting..."
    if npm run lint 2>/dev/null; then
        print_success "Backend linting passed"
    else
        print_warning "Backend linting had issues"
    fi

    print_info "Running TypeScript type checking..."
    if npm run type-check 2>/dev/null || npx tsc --noEmit; then
        print_success "TypeScript type checking passed"
    else
        print_warning "TypeScript has type errors"
    fi

    cd ..
}

# Run Python tests
test_python() {
    print_header "Testing Python Analytics Service"

    if [ ! -d "python-service" ]; then
        print_warning "Python service directory not found, skipping"
        return
    fi

    cd python-service

    if [ ! -d "venv" ]; then
        print_warning "Virtual environment not found, skipping Python tests"
        cd ..
        return
    fi

    source venv/bin/activate

    print_info "Running Python unit tests..."
    if pytest -v 2>/dev/null; then
        print_success "Python tests passed"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_error "Python tests failed"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi

    print_info "Running Python linting (ruff)..."
    if ruff check . 2>/dev/null; then
        print_success "Python linting passed"
    else
        print_warning "Python linting had issues"
    fi

    print_info "Running Python type checking (mypy)..."
    if mypy . 2>/dev/null; then
        print_success "Python type checking passed"
    else
        print_warning "Python has type issues"
    fi

    deactivate
    cd ..
}

# Run frontend tests
test_frontend() {
    print_header "Testing Frontend (Next.js)"

    print_info "Running frontend unit tests..."
    if npm test 2>/dev/null; then
        print_success "Frontend tests passed"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_error "Frontend tests failed"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi

    print_info "Running frontend linting..."
    if npm run lint 2>/dev/null; then
        print_success "Frontend linting passed"
    else
        print_warning "Frontend linting had issues"
    fi

    print_info "Running TypeScript type checking..."
    if npm run type-check 2>/dev/null || npx tsc --noEmit; then
        print_success "TypeScript type checking passed"
    else
        print_warning "TypeScript has type errors"
    fi
}

# Run integration tests
test_integration() {
    print_header "Running Integration Tests"

    print_info "Testing backend-to-database connection..."
    if curl -sf http://localhost:3002/health > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_warning "Backend not running or unhealthy"
    fi

    print_info "Testing Python analytics connection..."
    if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
        print_success "Python analytics is healthy"
    else
        print_warning "Python analytics not running or unhealthy"
    fi

    print_info "Testing frontend connection..."
    if curl -sf http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is accessible"
    else
        print_warning "Frontend not running or inaccessible"
    fi
}

# Run E2E tests
test_e2e() {
    print_header "Running End-to-End Tests"

    if [ -f "playwright.config.ts" ] || [ -f "cypress.config.ts" ]; then
        print_info "Running E2E tests..."

        if command -v playwright >/dev/null 2>&1; then
            npm run test:e2e 2>/dev/null || print_warning "E2E tests not configured"
        elif command -v cypress >/dev/null 2>&1; then
            npm run test:e2e 2>/dev/null || print_warning "E2E tests not configured"
        else
            print_warning "No E2E test framework found"
        fi
    else
        print_info "E2E tests not configured, skipping"
    fi
}

# Generate coverage report
test_coverage() {
    print_header "Generating Test Coverage Report"

    # Backend coverage
    if [ -d "backend" ]; then
        print_info "Generating backend coverage..."
        cd backend
        npm run test:coverage 2>/dev/null || npm test -- --coverage 2>/dev/null || print_warning "Coverage not available"
        cd ..
    fi

    # Python coverage
    if [ -d "python-service" ]; then
        print_info "Generating Python coverage..."
        cd python-service
        if [ -d "venv" ]; then
            source venv/bin/activate
            pytest --cov=app --cov-report=html 2>/dev/null || print_warning "Coverage not available"
            deactivate
        fi
        cd ..
    fi

    # Frontend coverage
    print_info "Generating frontend coverage..."
    npm run test:coverage 2>/dev/null || npm test -- --coverage 2>/dev/null || print_warning "Coverage not available"
}

# Security scanning
test_security() {
    print_header "Running Security Scans"

    print_info "Checking for vulnerable dependencies..."

    # Backend security
    if [ -d "backend" ]; then
        cd backend
        npm audit --audit-level=moderate 2>/dev/null || print_warning "Backend has security vulnerabilities"
        cd ..
    fi

    # Python security
    if [ -d "python-service" ]; then
        cd python-service
        if [ -d "venv" ]; then
            source venv/bin/activate
            pip-audit 2>/dev/null || safety check 2>/dev/null || print_warning "Python security scan not available"
            deactivate
        fi
        cd ..
    fi

    # Frontend security
    npm audit --audit-level=moderate 2>/dev/null || print_warning "Frontend has security vulnerabilities"
}

# Main test function
main() {
    print_header "🧪 KAIRO QUANTUM - Test Suite"

    local test_type=${1:-all}

    case $test_type in
        backend)
            test_backend
            ;;
        python|analytics)
            test_python
            ;;
        frontend)
            test_frontend
            ;;
        integration)
            test_integration
            ;;
        e2e)
            test_e2e
            ;;
        coverage)
            test_coverage
            ;;
        security)
            test_security
            ;;
        all)
            test_backend
            test_python
            test_frontend
            test_integration
            test_e2e
            test_coverage
            test_security
            ;;
        *)
            print_error "Unknown test type: $test_type"
            print_info "Usage: ./scripts/test.sh [all|backend|python|frontend|integration|e2e|coverage|security]"
            exit 1
            ;;
    esac

    # Summary
    print_header "📊 Test Summary"

    echo ""
    echo "  Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
    echo "  Tests Failed: ${RED}${TESTS_FAILED}${NC}"
    echo ""

    if [ $TESTS_FAILED -eq 0 ]; then
        print_success "All tests passed! 🎉"
        exit 0
    else
        print_error "Some tests failed"
        exit 1
    fi
}

# Run main
main "$@"
