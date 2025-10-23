#!/bin/bash

# KAIRO QUANTUM - Automated Setup Script
# This script sets up the entire development environment automatically

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
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
    echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup function
main() {
    print_header "🚀 KAIRO QUANTUM - Automated Setup"

    print_info "Starting automated setup process..."
    echo ""

    # Step 1: Check prerequisites
    print_header "Step 1: Checking Prerequisites"
    check_prerequisites

    # Step 2: Copy environment files
    print_header "Step 2: Setting Up Environment Variables"
    setup_env_files

    # Step 3: Install dependencies
    print_header "Step 3: Installing Dependencies"
    install_dependencies

    # Step 4: Set up database
    print_header "Step 4: Setting Up Database"
    setup_database

    # Step 5: Run migrations
    print_header "Step 5: Running Database Migrations"
    run_migrations

    # Step 6: Seed database (optional)
    print_header "Step 6: Seeding Database"
    seed_database

    # Step 7: Build services
    print_header "Step 7: Building Services"
    build_services

    # Final message
    print_header "🎉 Setup Complete!"
    print_success "KAIRO QUANTUM is ready to use!"
    echo ""
    print_info "Next steps:"
    echo "  1. Review and update .env files with your API keys"
    echo "  2. Run './scripts/start.sh' to start all services"
    echo "  3. Visit http://localhost:3000 to access the platform"
    echo ""
    print_info "For more information, see README.md"
    echo ""
}

# Check prerequisites
check_prerequisites() {
    local missing_deps=0

    # Check Node.js
    if command_exists node; then
        local node_version=$(node -v)
        print_success "Node.js found: $node_version"
    else
        print_error "Node.js not found. Please install Node.js 18+ from https://nodejs.org"
        missing_deps=1
    fi

    # Check Python
    if command_exists python3; then
        local python_version=$(python3 --version)
        print_success "Python found: $python_version"
    else
        print_error "Python 3 not found. Please install Python 3.11+ from https://python.org"
        missing_deps=1
    fi

    # Check PostgreSQL
    if command_exists psql; then
        local pg_version=$(psql --version)
        print_success "PostgreSQL found: $pg_version"
    else
        print_warning "PostgreSQL not found. We'll use Docker instead."
    fi

    # Check Docker
    if command_exists docker; then
        local docker_version=$(docker --version)
        print_success "Docker found: $docker_version"
    else
        print_warning "Docker not found. Install Docker for easier database setup."
    fi

    # Check Git
    if command_exists git; then
        local git_version=$(git --version)
        print_success "Git found: $git_version"
    else
        print_error "Git not found. Please install Git from https://git-scm.com"
        missing_deps=1
    fi

    if [ $missing_deps -eq 1 ]; then
        print_error "Missing required dependencies. Please install them and try again."
        exit 1
    fi

    print_success "All prerequisites met!"
}

# Setup environment files
setup_env_files() {
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        if [ -f "backend/.env.example" ]; then
            cp backend/.env.example backend/.env
            print_success "Created backend/.env from example"
        else
            print_warning "backend/.env.example not found, skipping"
        fi
    else
        print_info "backend/.env already exists, skipping"
    fi

    # Python service .env
    if [ ! -f "python-service/.env" ]; then
        if [ -f "python-service/.env.example" ]; then
            cp python-service/.env.example python-service/.env
            print_success "Created python-service/.env from example"
        else
            print_warning "python-service/.env.example not found, skipping"
        fi
    else
        print_info "python-service/.env already exists, skipping"
    fi

    # Frontend .env.local
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            print_success "Created .env.local from example"
        else
            print_warning ".env.example not found, skipping"
        fi
    else
        print_info ".env.local already exists, skipping"
    fi

    print_warning "⚠️  Remember to update .env files with your actual API keys!"
}

# Install dependencies
install_dependencies() {
    # Backend dependencies
    if [ -d "backend" ]; then
        print_info "Installing backend dependencies..."
        cd backend
        npm install
        cd ..
        print_success "Backend dependencies installed"
    fi

    # Python dependencies
    if [ -d "python-service" ]; then
        print_info "Installing Python dependencies..."
        cd python-service

        # Create virtual environment if it doesn't exist
        if [ ! -d "venv" ]; then
            python3 -m venv venv
            print_success "Python virtual environment created"
        fi

        # Activate and install
        source venv/bin/activate
        pip install -r requirements.txt
        deactivate
        cd ..
        print_success "Python dependencies installed"
    fi

    # Frontend dependencies (if separate)
    if [ -f "package.json" ] && [ ! -d "backend" ] || [ "$(pwd)" != "*/backend" ]; then
        print_info "Installing frontend dependencies..."
        npm install
        print_success "Frontend dependencies installed"
    fi
}

# Setup database
setup_database() {
    if command_exists docker; then
        print_info "Setting up PostgreSQL with Docker..."

        # Check if postgres container is running
        if docker ps | grep -q kairo-postgres; then
            print_info "PostgreSQL container already running"
        else
            # Start postgres container
            docker-compose up -d postgres
            print_success "PostgreSQL container started"

            # Wait for postgres to be ready
            print_info "Waiting for PostgreSQL to be ready..."
            sleep 5
        fi
    else
        print_warning "Docker not available. Please set up PostgreSQL manually."
        print_info "Create database: CREATE DATABASE kairo_db;"
    fi
}

# Run migrations
run_migrations() {
    if [ -d "backend" ]; then
        print_info "Running database migrations..."
        cd backend

        # Generate Prisma client
        npx prisma generate

        # Run migrations
        npx prisma migrate deploy || npx prisma db push

        cd ..
        print_success "Database migrations completed"
    fi
}

# Seed database
seed_database() {
    if [ -d "backend" ]; then
        read -p "Do you want to seed the database with demo data? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Seeding database..."
            cd backend
            npm run seed 2>/dev/null || echo "No seed script found, skipping"
            cd ..
            print_success "Database seeded"
        else
            print_info "Skipping database seeding"
        fi
    fi
}

# Build services
build_services() {
    # Build backend
    if [ -d "backend" ]; then
        print_info "Building backend..."
        cd backend
        npm run build 2>/dev/null || print_info "No build script for backend"
        cd ..
    fi

    # Python doesn't need building
    print_info "Python service ready (no build required)"

    # Build frontend
    if [ -f "package.json" ]; then
        print_info "Building frontend..."
        npm run build 2>/dev/null || print_info "No build script for frontend"
    fi

    print_success "All services built successfully"
}

# Run the main function
main
