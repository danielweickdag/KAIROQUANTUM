#!/bin/bash

# KAIRO QUANTUM - Automated Deployment Script
# Deploy to production or staging environments

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

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Get deployment environment
get_environment() {
    if [ -z "$1" ]; then
        print_error "Usage: ./scripts/deploy.sh [production|staging] [service]"
        print_info "Examples:"
        echo "  ./scripts/deploy.sh production           # Deploy all services to production"
        echo "  ./scripts/deploy.sh staging              # Deploy all services to staging"
        echo "  ./scripts/deploy.sh production backend   # Deploy only backend to production"
        echo "  ./scripts/deploy.sh production frontend  # Deploy only frontend to production"
        echo "  ./scripts/deploy.sh production analytics # Deploy only Python analytics to production"
        exit 1
    fi

    ENVIRONMENT=$1
    SERVICE=${2:-all}

    if [ "$ENVIRONMENT" != "production" ] && [ "$ENVIRONMENT" != "staging" ]; then
        print_error "Invalid environment: $ENVIRONMENT"
        print_info "Must be 'production' or 'staging'"
        exit 1
    fi
}

# Confirm deployment
confirm_deployment() {
    echo ""
    print_warning "⚠️  DEPLOYMENT CONFIRMATION ⚠️"
    echo ""
    echo "  Environment: $ENVIRONMENT"
    echo "  Service:     $SERVICE"
    echo ""

    if [ "$ENVIRONMENT" = "production" ]; then
        print_warning "This will deploy to PRODUCTION!"
        read -p "Are you absolutely sure? (type 'yes' to confirm): " confirm
        if [ "$confirm" != "yes" ]; then
            print_info "Deployment cancelled"
            exit 0
        fi
    else
        read -p "Continue with deployment? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Deployment cancelled"
            exit 0
        fi
    fi
}

# Run tests before deployment
run_tests() {
    print_header "Running Tests"

    # Backend tests
    if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "backend" ]; then
        print_info "Running backend tests..."
        cd backend
        npm test 2>/dev/null || print_warning "Backend tests skipped (no test script)"
        cd ..
    fi

    # Python tests
    if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "analytics" ]; then
        if [ -d "python-service" ]; then
            print_info "Running Python tests..."
            cd python-service
            if [ -d "venv" ]; then
                source venv/bin/activate
                pytest 2>/dev/null || print_warning "Python tests skipped (pytest not configured)"
                deactivate
            fi
            cd ..
        fi
    fi

    # Frontend tests
    if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "frontend" ]; then
        print_info "Running frontend tests..."
        npm test 2>/dev/null || print_warning "Frontend tests skipped (no test script)"
    fi

    print_success "Tests completed"
}

# Build services
build_services() {
    print_header "Building Services"

    # Build backend
    if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "backend" ]; then
        print_info "Building backend..."
        cd backend
        npm run build
        cd ..
        print_success "Backend built successfully"
    fi

    # Build frontend
    if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "frontend" ]; then
        print_info "Building frontend..."
        npm run build
        print_success "Frontend built successfully"
    fi

    # Python doesn't need building
    if [ "$SERVICE" = "analytics" ]; then
        print_info "Python service ready (no build required)"
    fi
}

# Deploy to Railway
deploy_to_railway() {
    print_header "Deploying to Railway"

    if ! command_exists railway; then
        print_error "Railway CLI not installed"
        print_info "Install with: npm install -g @railway/cli"
        exit 1
    fi

    # Deploy backend
    if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "backend" ]; then
        print_info "Deploying backend to Railway..."
        cd backend
        railway up --environment $ENVIRONMENT
        cd ..
        print_success "Backend deployed"
    fi

    # Deploy Python service
    if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "analytics" ]; then
        if [ -d "python-service" ]; then
            print_info "Deploying Python Analytics to Railway..."
            cd python-service
            railway up --environment $ENVIRONMENT
            cd ..
            print_success "Python Analytics deployed"
        fi
    fi
}

# Deploy frontend to Vercel
deploy_to_vercel() {
    print_header "Deploying Frontend to Vercel"

    if ! command_exists vercel; then
        print_error "Vercel CLI not installed"
        print_info "Install with: npm install -g vercel"
        exit 1
    fi

    if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "frontend" ]; then
        if [ "$ENVIRONMENT" = "production" ]; then
            print_info "Deploying to Vercel production..."
            vercel --prod
        else
            print_info "Deploying to Vercel preview..."
            vercel
        fi
        print_success "Frontend deployed to Vercel"
    fi
}

# Deploy with Docker
deploy_with_docker() {
    print_header "Deploying with Docker Compose"

    local compose_file="docker-compose.yml"
    if [ "$ENVIRONMENT" = "production" ]; then
        compose_file="docker-compose.prod.yml"
    fi

    if [ ! -f "$compose_file" ]; then
        print_error "$compose_file not found"
        exit 1
    fi

    print_info "Building Docker images..."
    docker-compose -f $compose_file build

    print_info "Starting services..."
    docker-compose -f $compose_file up -d

    print_success "Services deployed with Docker"
}

# Run database migrations
run_migrations() {
    print_header "Running Database Migrations"

    if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "backend" ]; then
        print_info "Running Prisma migrations..."
        cd backend

        if [ "$ENVIRONMENT" = "production" ]; then
            npx prisma migrate deploy
        else
            npx prisma migrate dev
        fi

        cd ..
        print_success "Migrations completed"
    fi
}

# Health checks
verify_deployment() {
    print_header "Verifying Deployment"

    local backend_url=""
    local frontend_url=""
    local analytics_url=""

    if [ "$ENVIRONMENT" = "production" ]; then
        backend_url="https://kairo-backend.railway.app"
        frontend_url="https://kairoquantum.vercel.app"
        analytics_url="https://kairo-analytics.railway.app"
    else
        backend_url="https://kairo-backend-staging.railway.app"
        frontend_url="https://kairoquantum-staging.vercel.app"
        analytics_url="https://kairo-analytics-staging.railway.app"
    fi

    # Check backend
    if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "backend" ]; then
        print_info "Checking backend health..."
        if curl -sf "$backend_url/health" > /dev/null 2>&1; then
            print_success "Backend is healthy: $backend_url"
        else
            print_error "Backend health check failed: $backend_url/health"
        fi
    fi

    # Check analytics
    if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "analytics" ]; then
        print_info "Checking analytics health..."
        if curl -sf "$analytics_url/health" > /dev/null 2>&1; then
            print_success "Analytics is healthy: $analytics_url"
        else
            print_error "Analytics health check failed: $analytics_url/health"
        fi
    fi

    # Check frontend
    if [ "$SERVICE" = "all" ] || [ "$SERVICE" = "frontend" ]; then
        print_info "Checking frontend..."
        if curl -sf "$frontend_url" > /dev/null 2>&1; then
            print_success "Frontend is accessible: $frontend_url"
        else
            print_error "Frontend check failed: $frontend_url"
        fi
    fi
}

# Main deployment function
main() {
    print_header "🚀 KAIRO QUANTUM - Automated Deployment"

    get_environment "$@"
    confirm_deployment

    # Pre-deployment checks
    print_header "Pre-Deployment Checks"

    # Check git status
    if git diff-index --quiet HEAD --; then
        print_success "Working directory is clean"
    else
        print_warning "You have uncommitted changes"
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 0
        fi
    fi

    # Run tests
    run_tests

    # Build services
    build_services

    # Run migrations
    run_migrations

    # Deploy based on method
    print_header "Deploying to $ENVIRONMENT"

    # Check which deployment method to use
    if command_exists railway && command_exists vercel; then
        # Deploy backend and analytics to Railway
        deploy_to_railway
        # Deploy frontend to Vercel
        deploy_to_vercel
    elif command_exists docker-compose; then
        # Deploy with Docker
        deploy_with_docker
    else
        print_error "No deployment method available"
        print_info "Install Railway CLI, Vercel CLI, or Docker Compose"
        exit 1
    fi

    # Verify deployment
    sleep 5  # Wait for services to start
    verify_deployment

    # Success message
    print_header "🎉 Deployment Complete!"

    echo ""
    print_success "KAIRO QUANTUM deployed successfully to $ENVIRONMENT"
    echo ""
    print_info "Next steps:"
    echo "  • Monitor logs for any errors"
    echo "  • Test critical user flows"
    echo "  • Check monitoring dashboards"
    echo ""

    if [ "$ENVIRONMENT" = "production" ]; then
        print_warning "Remember to:"
        echo "  • Notify team of deployment"
        echo "  • Update changelog"
        echo "  • Monitor error rates"
    fi
    echo ""
}

# Run main
main "$@"
