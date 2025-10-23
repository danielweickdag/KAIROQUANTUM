#!/bin/bash

# KAIRO QUANTUM - Start All Services
# This script starts all services in the correct order with health checks

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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
    echo -e "${CYAN}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  $1"
    echo -e "${CYAN}╚════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_service() {
    echo -e "${CYAN}🚀 $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Wait for service to be ready
wait_for_service() {
    local service_name=$1
    local url=$2
    local max_attempts=30
    local attempt=1

    print_info "Waiting for $service_name to be ready..."

    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi

        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done

    print_error "$service_name failed to start within ${max_attempts} attempts"
    return 1
}

# Check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)

    if [ ! -z "$pid" ]; then
        print_warning "Killing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null || true
        sleep 1
    fi
}

# Main start function
main() {
    print_header "🚀 KAIRO QUANTUM - Starting All Services"

    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
        print_error "Please run this script from the KAIROQUANTUM root directory"
        exit 1
    fi

    # Step 1: Start PostgreSQL
    print_header "Step 1: Starting PostgreSQL Database"
    start_database

    # Step 2: Start Python Analytics Service
    print_header "Step 2: Starting Python Analytics Service"
    start_python_service

    # Step 3: Start Node.js Backend API
    print_header "Step 3: Starting Node.js Backend API"
    start_backend_api

    # Step 4: Start Next.js Frontend
    print_header "Step 4: Starting Next.js Frontend"
    start_frontend

    # Final status
    print_header "🎉 All Services Started Successfully!"

    echo ""
    print_success "KAIRO QUANTUM is now running!"
    echo ""
    print_info "Service URLs:"
    echo "  📱 Frontend:        http://localhost:3000"
    echo "  🔧 Backend API:     http://localhost:3002"
    echo "  📊 Analytics API:   http://localhost:8000"
    echo "  📚 Analytics Docs:  http://localhost:8000/docs"
    echo "  🗄️  PostgreSQL:      localhost:5432"
    echo ""
    print_info "To view logs:"
    echo "  • Backend:   tail -f backend/logs/all.log"
    echo "  • Python:    docker logs -f kairo-python-analytics"
    echo "  • Postgres:  docker logs -f kairo-postgres"
    echo ""
    print_info "To stop all services:"
    echo "  ./scripts/stop.sh"
    echo ""
}

# Start PostgreSQL
start_database() {
    if command_exists docker; then
        # Check if container is already running
        if docker ps | grep -q kairo-postgres; then
            print_info "PostgreSQL container already running"
        else
            # Check if container exists but is stopped
            if docker ps -a | grep -q kairo-postgres; then
                print_info "Starting existing PostgreSQL container..."
                docker start kairo-postgres
            else
                print_info "Creating and starting PostgreSQL container..."
                docker-compose up -d postgres 2>/dev/null || \
                docker run -d \
                    --name kairo-postgres \
                    -e POSTGRES_DB=kairo_db \
                    -e POSTGRES_USER=postgres \
                    -e POSTGRES_PASSWORD=postgres \
                    -p 5432:5432 \
                    -v kairo_postgres_data:/var/lib/postgresql/data \
                    postgres:15-alpine
            fi

            # Wait for PostgreSQL to be ready
            print_info "Waiting for PostgreSQL to be ready..."
            sleep 5
        fi

        print_success "PostgreSQL is running on port 5432"
    else
        print_warning "Docker not found. Make sure PostgreSQL is running manually."
    fi
}

# Start Python Analytics Service
start_python_service() {
    if [ ! -d "python-service" ]; then
        print_warning "python-service directory not found, skipping"
        return
    fi

    cd python-service

    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_warning "Virtual environment not found. Run ./scripts/setup.sh first"
        cd ..
        return
    fi

    # Check if port 8000 is in use
    if check_port 8000; then
        print_warning "Port 8000 is already in use"
        read -p "Kill the process and restart? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kill_port 8000
        else
            print_info "Skipping Python service"
            cd ..
            return
        fi
    fi

    # Start using Docker or virtualenv
    if command_exists docker && [ -f "Dockerfile" ]; then
        print_info "Starting Python service with Docker..."

        # Build image if it doesn't exist
        if ! docker images | grep -q kairo-python-analytics; then
            print_info "Building Docker image..."
            docker build -t kairo-python-analytics .
        fi

        # Stop existing container if running
        docker stop kairo-python-analytics 2>/dev/null || true
        docker rm kairo-python-analytics 2>/dev/null || true

        # Start container
        docker run -d \
            --name kairo-python-analytics \
            --env-file .env \
            -p 8000:8000 \
            --network host \
            kairo-python-analytics

        print_service "Python Analytics Service started in Docker"
    else
        print_info "Starting Python service with virtualenv..."
        source venv/bin/activate
        nohup uvicorn main:app --host 0.0.0.0 --port 8000 > /tmp/kairo-python.log 2>&1 &
        deactivate
        print_service "Python Analytics Service started (PID: $!)"
    fi

    cd ..

    # Wait for service to be ready
    wait_for_service "Python Analytics" "http://localhost:8000/health" || print_warning "Python service may not be fully ready"
}

# Start Node.js Backend API
start_backend_api() {
    if [ ! -d "backend" ]; then
        print_error "backend directory not found"
        exit 1
    fi

    cd backend

    # Check if port 3002 is in use
    if check_port 3002; then
        print_warning "Port 3002 is already in use"
        read -p "Kill the process and restart? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kill_port 3002
        else
            print_info "Skipping Backend API"
            cd ..
            return
        fi
    fi

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules not found. Run ./scripts/setup.sh first"
        cd ..
        return
    fi

    # Create logs directory
    mkdir -p logs

    # Start backend in development mode
    print_info "Starting Backend API..."
    nohup npm run dev > logs/backend.log 2>&1 &
    local pid=$!

    print_service "Backend API started (PID: $pid)"

    cd ..

    # Wait for service to be ready
    wait_for_service "Backend API" "http://localhost:3002/health" || print_warning "Backend API may not be fully ready"
}

# Start Next.js Frontend
start_frontend() {
    # Check if port 3000 is in use
    if check_port 3000; then
        print_warning "Port 3000 is already in use"
        read -p "Kill the process and restart? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kill_port 3000
        else
            print_info "Skipping Frontend"
            return
        fi
    fi

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules not found. Run ./scripts/setup.sh first"
        return
    fi

    # Start frontend in development mode
    print_info "Starting Frontend..."
    nohup npm run dev > /tmp/kairo-frontend.log 2>&1 &
    local pid=$!

    print_service "Frontend started (PID: $pid)"

    # Wait for service to be ready
    wait_for_service "Frontend" "http://localhost:3000" || print_warning "Frontend may not be fully ready"
}

# Run the main function
main
