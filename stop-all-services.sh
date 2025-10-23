#!/bin/bash

# KAIRO QUANTUM - Stop All Services
# Gracefully stops all running services

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}KAIRO QUANTUM - Stopping All Services${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Function to check if a port is in use
port_in_use() {
    lsof -ti:$1 > /dev/null 2>&1
}

# Function to kill process on port
kill_port() {
    local port=$1
    local name=$2

    if port_in_use $port; then
        echo -e "${YELLOW}Stopping $name (port $port)...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1

        if ! port_in_use $port; then
            echo -e "${GREEN}✓ $name stopped${NC}"
        else
            echo -e "${RED}✗ Failed to stop $name${NC}"
        fi
    else
        echo -e "${GREEN}✓ $name not running${NC}"
    fi
}

# Stop all services
kill_port 3000 "Frontend (3000)"
kill_port 3001 "Frontend Alternative (3001)"
kill_port 3002 "Backend API (3002)"
kill_port 8000 "Python Analytics (8000)"

# Kill any remaining nodemon or uvicorn processes
echo ""
echo -e "${YELLOW}Cleaning up remaining processes...${NC}"

pkill -9 -f "nodemon" 2>/dev/null && echo -e "${GREEN}✓ Nodemon processes killed${NC}" || echo -e "${GREEN}✓ No nodemon processes${NC}"
pkill -9 -f "uvicorn" 2>/dev/null && echo -e "${GREEN}✓ Uvicorn processes killed${NC}" || echo -e "${GREEN}✓ No uvicorn processes${NC}"
pkill -9 -f "ts-node.*server.ts" 2>/dev/null && echo -e "${GREEN}✓ TypeScript server processes killed${NC}" || echo -e "${GREEN}✓ No ts-node processes${NC}"
pkill -9 -f "next dev" 2>/dev/null && echo -e "${GREEN}✓ Next.js processes killed${NC}" || echo -e "${GREEN}✓ No Next.js processes${NC}"

# Clean up log files
echo ""
echo -e "${YELLOW}Cleaning up log files...${NC}"
rm -f /tmp/kairo-backend.log /tmp/kairo-python.log /tmp/kairo-frontend.log
echo -e "${GREEN}✓ Log files cleaned${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All Services Stopped Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}To restart services, run:${NC}"
echo -e "  ./start-all-services.sh"
echo ""
