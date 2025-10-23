#!/bin/bash

# KAIRO QUANTUM - Stop All Services
# This script gracefully stops all running services

set -e

# Colors for output
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

# Kill process on port
kill_port() {
    local port=$1
    local service=$2
    local pid=$(lsof -ti:$port 2>/dev/null)

    if [ ! -z "$pid" ]; then
        print_info "Stopping $service on port $port (PID: $pid)"
        kill -15 $pid 2>/dev/null || kill -9 $pid 2>/dev/null
        sleep 1
        print_success "$service stopped"
    else
        print_info "$service not running on port $port"
    fi
}

# Main stop function
main() {
    print_header "🛑 KAIRO QUANTUM - Stopping All Services"

    # Stop Frontend (port 3000)
    print_info "Stopping Frontend..."
    kill_port 3000 "Frontend"

    # Stop Backend API (port 3002)
    print_info "Stopping Backend API..."
    kill_port 3002 "Backend API"

    # Stop Python Analytics (port 8000)
    print_info "Stopping Python Analytics..."
    kill_port 8000 "Python Analytics"

    # Stop Docker containers if running
    if command -v docker >/dev/null 2>&1; then
        print_info "Stopping Docker containers..."

        # Stop Python container
        if docker ps | grep -q kairo-python-analytics; then
            docker stop kairo-python-analytics
            print_success "Python Analytics container stopped"
        fi

        # Stop PostgreSQL container (optional - ask user)
        if docker ps | grep -q kairo-postgres; then
            read -p "Stop PostgreSQL container? (y/N) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                docker stop kairo-postgres
                print_success "PostgreSQL container stopped"
            else
                print_info "PostgreSQL container left running"
            fi
        fi
    fi

    print_header "✅ All Services Stopped"
    echo ""
    print_success "KAIRO QUANTUM services have been stopped"
    echo ""
    print_info "To start services again:"
    echo "  ./scripts/start.sh"
    echo ""
}

# Run main
main
