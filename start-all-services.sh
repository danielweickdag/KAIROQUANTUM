#!/bin/bash

# KAIRO QUANTUM - Start All Services
# Automated startup script for all services

set -e

PROJECT_ROOT="/Users/blvckdlphn/projects/KAIROQUANTUM"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}KAIRO QUANTUM - Starting All Services${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Function to check if a port is in use
port_in_use() {
    lsof -ti:$1 > /dev/null 2>&1
}

# Function to kill process on port
kill_port() {
    local port=$1
    if port_in_use $port; then
        echo -e "${YELLOW}Killing process on port $port...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

# Kill any existing processes
echo -e "${YELLOW}Cleaning up existing processes...${NC}"
kill_port 3000 # Frontend
kill_port 3001 # Frontend alternative
kill_port 3002 # Backend
kill_port 8000 # Python Analytics

# Check for dependencies
echo -e "${YELLOW}Checking dependencies...${NC}"

# Check if backend node_modules exists
if [ ! -d "$PROJECT_ROOT/backend/node_modules" ]; then
    echo -e "${RED}Backend dependencies not installed!${NC}"
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd "$PROJECT_ROOT/backend" && npm install
fi

# Check if frontend node_modules exists
if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
    echo -e "${RED}Frontend dependencies not installed!${NC}"
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd "$PROJECT_ROOT" && npm install
fi

# Check if Python venv exists
if [ ! -d "$PROJECT_ROOT/venv" ]; then
    echo -e "${RED}Python virtual environment not found!${NC}"
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    cd "$PROJECT_ROOT" && python3 -m venv venv
fi

echo -e "${GREEN}✓ All dependencies checked${NC}"
echo ""

# Start Backend (Port 3002)
echo -e "${YELLOW}Starting Backend API (Port 3002)...${NC}"
cd "$PROJECT_ROOT/backend"
npm run dev > /tmp/kairo-backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to start
sleep 3

# Start Python Analytics Service (Port 8000)
echo -e "${YELLOW}Starting Python Analytics Service (Port 8000)...${NC}"
cd "$PROJECT_ROOT"
source venv/bin/activate && uvicorn main:app --reload --port 8000 > /tmp/kairo-python.log 2>&1 &
PYTHON_PID=$!
echo -e "${GREEN}✓ Python Analytics started (PID: $PYTHON_PID)${NC}"

# Wait for Python service to start
sleep 3

# Start Frontend (Port 3000)
echo -e "${YELLOW}Starting Frontend (Port 3000)...${NC}"
cd "$PROJECT_ROOT"
npm run dev > /tmp/kairo-frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

# Wait for all services to fully start
echo -e "${YELLOW}Waiting for services to initialize...${NC}"
sleep 5

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All Services Started Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Service URLs:${NC}"
echo -e "  Frontend:  ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend:   ${GREEN}http://localhost:3002${NC}"
echo -e "  Python:    ${GREEN}http://localhost:8000${NC}"
echo ""
echo -e "${YELLOW}Health Checks:${NC}"
echo -e "  Backend:   ${GREEN}http://localhost:3002/api/health/status${NC}"
echo -e "  Python:    ${GREEN}http://localhost:8000/health${NC}"
echo ""
echo -e "${YELLOW}Log Files:${NC}"
echo -e "  Backend:   /tmp/kairo-backend.log"
echo -e "  Python:    /tmp/kairo-python.log"
echo -e "  Frontend:  /tmp/kairo-frontend.log"
echo ""
echo -e "${YELLOW}Process IDs:${NC}"
echo -e "  Backend PID:  $BACKEND_PID"
echo -e "  Python PID:   $PYTHON_PID"
echo -e "  Frontend PID: $FRONTEND_PID"
echo ""
echo -e "${YELLOW}To stop all services, run:${NC}"
echo -e "  ./stop-all-services.sh"
echo ""
echo -e "${GREEN}========================================${NC}"

# Run quick health check
echo -e "${YELLOW}Running health check...${NC}"
sleep 2

if curl -s --max-time 5 http://localhost:3002/api/health/ping > /dev/null; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
fi

if curl -s --max-time 5 http://localhost:8000/health > /dev/null; then
    echo -e "${GREEN}✓ Python service is healthy${NC}"
else
    echo -e "${RED}✗ Python service health check failed${NC}"
fi

echo ""
echo -e "${GREEN}Ready to use! Open http://localhost:3000 in your browser.${NC}"
