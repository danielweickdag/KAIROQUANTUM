#!/bin/bash

# KAIRO QUANTUM - Post-Deployment Setup Script
# Run this after deploying to Railway and Vercel

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  KAIRO QUANTUM - Post-Deployment Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}✗ Railway CLI not found${NC}"
    echo "Install it with: npm install -g @railway/cli"
    exit 1
fi

echo -e "${GREEN}✓ Railway CLI found${NC}"
echo ""

# ============================================
# STEP 1: Run Database Migrations
# ============================================
echo -e "${YELLOW}[1/5]${NC} ${GREEN}Running database migrations...${NC}"
echo ""

echo "This will run the following commands on Railway:"
echo "  1. npx prisma migrate deploy"
echo "  2. npx prisma generate"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running migrations..."
    railway run npx prisma migrate deploy
    echo -e "${GREEN}✓ Migrations completed${NC}"

    echo ""
    echo "Generating Prisma client..."
    railway run npx prisma generate
    echo -e "${GREEN}✓ Prisma client generated${NC}"
else
    echo "Skipped migrations"
fi

echo ""

# ============================================
# STEP 2: Seed Initial Data (Optional)
# ============================================
echo -e "${YELLOW}[2/5]${NC} ${GREEN}Seed initial data (optional)${NC}"
echo ""

if [ -f "backend/prisma/seed.ts" ]; then
    echo "Found seed file. Do you want to seed the database?"
    read -p "Seed database? (y/n) " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        railway run npx prisma db seed
        echo -e "${GREEN}✓ Database seeded${NC}"
    else
        echo "Skipped seeding"
    fi
else
    echo -e "${YELLOW}⊙ No seed file found${NC}"
fi

echo ""

# ============================================
# STEP 3: Verify Environment Variables
# ============================================
echo -e "${YELLOW}[3/5]${NC} ${GREEN}Verifying environment variables...${NC}"
echo ""

echo "Checking critical environment variables on Railway..."
railway variables | grep -E "DATABASE_URL|JWT_SECRET|STRIPE_SECRET_KEY" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Critical environment variables found${NC}"
else
    echo -e "${RED}✗ Some environment variables might be missing${NC}"
    echo "Run: railway variables"
    echo "And compare with backend/.env.production"
fi

echo ""

# ============================================
# STEP 4: Test Backend Health
# ============================================
echo -e "${YELLOW}[4/5]${NC} ${GREEN}Testing backend health...${NC}"
echo ""

# Get Railway URL
RAILWAY_URL=$(railway status 2>/dev/null | grep "URL" | awk '{print $2}')

if [ -z "$RAILWAY_URL" ]; then
    echo -e "${YELLOW}⊙ Could not determine Railway URL${NC}"
    echo "Manually test: https://api.kairoquantum.com/api/health/status"
else
    echo "Testing: $RAILWAY_URL/api/health/status"
    response=$(curl -s --max-time 10 "$RAILWAY_URL/api/health/status" 2>/dev/null || echo "{}")

    if echo "$response" | jq -e '.status' > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is healthy${NC}"
        echo "$response" | jq '.'
    else
        echo -e "${RED}✗ Backend health check failed${NC}"
        echo "Response: $response"
    fi
fi

echo ""

# ============================================
# STEP 5: Verification Checklist
# ============================================
echo -e "${YELLOW}[5/5]${NC} ${GREEN}Post-Deployment Checklist${NC}"
echo ""

echo "Please verify the following:"
echo ""
echo "  [ ] Database migrations ran successfully"
echo "  [ ] Backend is accessible at: https://api.kairoquantum.com"
echo "  [ ] Frontend is accessible at: https://www.kairoquantum.com"
echo "  [ ] Stripe webhook is configured"
echo "  [ ] Stripe products are created"
echo "  [ ] DNS records are configured"
echo "  [ ] SSL certificates are active"
echo "  [ ] Test user registration"
echo "  [ ] Test user login"
echo "  [ ] Test Stripe checkout"
echo ""

# ============================================
# Next Steps
# ============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Post-deployment setup complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Run verification script:"
echo -e "   ${GREEN}./verify-deployment.sh${NC}"
echo ""
echo "2. Create Stripe products:"
echo "   - Go to Stripe Dashboard → Products"
echo "   - Create Pro Monthly (\$49/mo)"
echo "   - Create Pro Annual (\$490/yr)"
echo "   - Create Enterprise (\$199/mo)"
echo ""
echo "3. Configure Stripe webhook:"
echo "   - URL: https://api.kairoquantum.com/api/webhooks/stripe"
echo "   - Add webhook secret to Railway"
echo "   - Redeploy: railway up"
echo ""
echo "4. Test the platform:"
echo "   - Register a new user"
echo "   - Test login"
echo "   - Test Stripe checkout"
echo ""
echo -e "${GREEN}Your platform is live at: https://www.kairoquantum.com 🚀${NC}"
echo ""
