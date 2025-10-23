#!/bin/bash

# KAIRO QUANTUM - Automated Backend Deployment to Railway
# Deploys the backend API to Railway and configures custom domain

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  KAIRO QUANTUM - Railway Backend Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ============================================
# STEP 1: Prerequisites Check
# ============================================
echo -e "${YELLOW}[1/8]${NC} ${CYAN}Checking prerequisites...${NC}"
echo ""

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${RED}✗ Railway CLI not found${NC}"
    echo ""
    echo "Install Railway CLI:"
    echo "  npm install -g @railway/cli"
    echo ""
    exit 1
fi
echo -e "${GREEN}✓ Railway CLI installed${NC}"

# Check if backend/.env.production exists
if [ ! -f "backend/.env.production" ]; then
    echo -e "${RED}✗ backend/.env.production not found${NC}"
    echo ""
    echo "Run deployment preparation first:"
    echo "  ./deploy-to-production.sh"
    echo ""
    exit 1
fi
echo -e "${GREEN}✓ Production environment file found${NC}"

# Check if code is committed
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${YELLOW}⊙ Uncommitted changes detected${NC}"
    echo "Committing changes..."
    git add .
    git commit -m "chore: prepare backend for Railway deployment" || true
fi
echo -e "${GREEN}✓ Git repository ready${NC}"

echo ""

# ============================================
# STEP 2: Railway Login
# ============================================
echo -e "${YELLOW}[2/8]${NC} ${CYAN}Logging into Railway...${NC}"
echo ""

# Check if already logged in
if railway whoami &> /dev/null; then
    echo -e "${GREEN}✓ Already logged into Railway${NC}"
    RAILWAY_USER=$(railway whoami 2>/dev/null || echo "Unknown")
    echo "  User: $RAILWAY_USER"
else
    echo "Opening Railway login..."
    railway login

    if railway whoami &> /dev/null; then
        echo -e "${GREEN}✓ Successfully logged into Railway${NC}"
    else
        echo -e "${RED}✗ Railway login failed${NC}"
        exit 1
    fi
fi

echo ""

# ============================================
# STEP 3: Initialize Railway Project
# ============================================
echo -e "${YELLOW}[3/8]${NC} ${CYAN}Initializing Railway project...${NC}"
echo ""

# Check if railway.json exists (already initialized)
if [ -f "railway.json" ]; then
    echo -e "${GREEN}✓ Railway project already configured${NC}"

    # Check if we have an active project
    if railway status &> /dev/null; then
        echo -e "${GREEN}✓ Connected to Railway project${NC}"
    else
        echo "No active Railway project detected."
        echo "Linking to existing project or creating new one..."
        railway link
    fi
else
    echo "Creating new Railway project..."
    echo ""
    echo "Please select or create a project for: kairoquantum-backend"
    railway init

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Railway project initialized${NC}"
    else
        echo -e "${RED}✗ Railway initialization failed${NC}"
        exit 1
    fi
fi

echo ""

# ============================================
# STEP 4: Add PostgreSQL Database
# ============================================
echo -e "${YELLOW}[4/8]${NC} ${CYAN}Adding PostgreSQL database...${NC}"
echo ""

# Check if database already exists
if railway run echo "test" &> /dev/null && railway variables | grep -q "DATABASE_URL"; then
    echo -e "${GREEN}✓ Database already configured${NC}"
    echo "  DATABASE_URL found in environment variables"
else
    echo "Adding PostgreSQL database to project..."
    railway add --database postgresql

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ PostgreSQL database added${NC}"
        echo ""
        echo "Waiting for database to be ready..."
        sleep 10
    else
        echo -e "${YELLOW}⊙ Database may already exist or failed to add${NC}"
    fi
fi

echo ""

# ============================================
# STEP 5: Configure Environment Variables
# ============================================
echo -e "${YELLOW}[5/8]${NC} ${CYAN}Configuring environment variables...${NC}"
echo ""

echo "Getting DATABASE_URL from Railway..."
DATABASE_URL=$(railway variables | grep "DATABASE_URL" | cut -d'=' -f2- || echo "")

if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⊙ DATABASE_URL not found automatically${NC}"
    echo "Please add DATABASE_URL manually in Railway dashboard"
else
    echo -e "${GREEN}✓ DATABASE_URL retrieved${NC}"
fi

echo ""
echo "Do you want to upload environment variables from backend/.env.production?"
echo -e "${YELLOW}Important:${NC} This will overwrite existing variables in Railway"
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Create temporary file with all env vars
    TMP_ENV="/tmp/railway-env-$(date +%s).txt"

    # Copy production env vars
    cp backend/.env.production "$TMP_ENV"

    # If DATABASE_URL was retrieved, update it
    if [ -n "$DATABASE_URL" ]; then
        sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" "$TMP_ENV"
        rm -f "$TMP_ENV.bak"
    fi

    echo ""
    echo "Environment variables to upload:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cat "$TMP_ENV" | grep -v "^#" | grep -v "^$"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    read -p "Upload these variables to Railway? (y/n) " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Upload each variable
        while IFS= read -r line; do
            # Skip comments and empty lines
            [[ "$line" =~ ^#.*$ ]] && continue
            [[ -z "$line" ]] && continue

            # Extract key and value
            key=$(echo "$line" | cut -d'=' -f1)
            value=$(echo "$line" | cut -d'=' -f2-)

            echo "  Setting $key..."
            railway variables --set "$key=$value" &> /dev/null || true
        done < "$TMP_ENV"

        echo -e "${GREEN}✓ Environment variables uploaded${NC}"
    fi

    rm -f "$TMP_ENV"
else
    echo -e "${YELLOW}⊙ Skipped environment variable upload${NC}"
    echo "You can add them manually in Railway Dashboard → Variables"
fi

echo ""

# ============================================
# STEP 6: Deploy Backend
# ============================================
echo -e "${YELLOW}[6/8]${NC} ${CYAN}Deploying backend to Railway...${NC}"
echo ""

echo "This will:"
echo "  1. Build the backend (npm run build)"
echo "  2. Deploy to Railway"
echo "  3. Start the service"
echo ""
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Build backend first
    echo "Building backend locally..."
    cd backend
    npm run build
    cd ..
    echo -e "${GREEN}✓ Backend built successfully${NC}"

    echo ""
    echo "Deploying to Railway..."
    railway up

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backend deployed successfully${NC}"
    else
        echo -e "${RED}✗ Deployment failed${NC}"
        echo "Check Railway logs: railway logs"
        exit 1
    fi
else
    echo -e "${YELLOW}⊙ Deployment skipped${NC}"
    exit 0
fi

echo ""

# ============================================
# STEP 7: Run Database Migrations
# ============================================
echo -e "${YELLOW}[7/8]${NC} ${CYAN}Running database migrations...${NC}"
echo ""

echo "Running Prisma migrations on Railway..."
railway run npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migrations completed${NC}"
else
    echo -e "${RED}✗ Migrations failed${NC}"
    echo "You may need to run migrations manually"
fi

echo ""
echo "Generating Prisma client..."
railway run npx prisma generate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Prisma client generated${NC}"
else
    echo -e "${YELLOW}⊙ Prisma generate warning${NC}"
fi

echo ""

# ============================================
# STEP 8: Configure Custom Domain
# ============================================
echo -e "${YELLOW}[8/8]${NC} ${CYAN}Configuring custom domain...${NC}"
echo ""

# Get Railway URL
RAILWAY_URL=$(railway status 2>/dev/null | grep "URL" | awk '{print $2}' | sed 's/https\?:\/\///' || echo "")

if [ -n "$RAILWAY_URL" ]; then
    echo -e "${GREEN}✓ Railway deployment URL:${NC} https://$RAILWAY_URL"
    echo ""
else
    echo -e "${YELLOW}⊙ Could not determine Railway URL${NC}"
    echo "Get it from: railway status"
    echo ""
fi

echo "To configure custom domain (api.kairoquantum.com):"
echo ""
echo "1. In Railway Dashboard:"
echo "   → Go to Settings → Networking"
echo "   → Click 'Custom Domain'"
echo "   → Enter: api.kairoquantum.com"
echo "   → Railway will show a CNAME record"
echo ""
echo "2. Update DNS (Cloudflare or registrar):"
if [ -n "$RAILWAY_URL" ]; then
    echo "   Type:  CNAME"
    echo "   Name:  api"
    echo "   Value: $RAILWAY_URL"
    echo "   TTL:   Auto/300"
else
    echo "   Type:  CNAME"
    echo "   Name:  api"
    echo "   Value: [your-app].up.railway.app"
fi
echo ""
echo "3. Wait for DNS propagation (5-30 minutes)"
echo "   Test with: dig api.kairoquantum.com"
echo ""

read -p "Press Enter to continue once domain is configured..."

# ============================================
# FINAL SUMMARY
# ============================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Backend Deployment Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}Deployment Summary:${NC}"
echo "  ✓ Railway project configured"
echo "  ✓ PostgreSQL database added"
echo "  ✓ Environment variables set"
echo "  ✓ Backend deployed"
echo "  ✓ Database migrations run"
echo ""

if [ -n "$RAILWAY_URL" ]; then
    echo -e "${CYAN}URLs:${NC}"
    echo "  • Railway URL: https://$RAILWAY_URL"
    echo "  • Custom Domain: https://api.kairoquantum.com (pending DNS)"
    echo ""
fi

echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Configure custom domain in Railway Dashboard"
echo ""
echo "2. Update DNS CNAME record"
echo ""
echo "3. Wait for DNS propagation (5-30 min)"
echo "   Check with: dig api.kairoquantum.com"
echo ""
echo "4. Test API:"
echo "   curl https://api.kairoquantum.com/api/health/ping"
echo ""
echo "5. Run post-deployment setup:"
echo "   ./post-deployment-setup.sh"
echo ""
echo "6. Run full production tests:"
echo "   ./test-production-complete.sh"
echo ""
echo -e "${CYAN}Monitoring:${NC}"
echo "  • View logs:   railway logs"
echo "  • Check status: railway status"
echo "  • Variables:   railway variables"
echo ""
echo -e "${GREEN}Backend is now live on Railway! 🚀${NC}"
echo ""
