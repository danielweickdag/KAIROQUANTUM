#!/bin/bash

echo "🔍 DNS Propagation Monitor for api.kairoquantum.com"
echo "=================================================="
echo ""

# Function to check DNS
check_dns() {
    echo "⏰ $(date): Checking DNS resolution..."
    
    # Check current DNS resolution
    echo "📍 Current DNS resolution:"
    dig +short api.kairoquantum.com
    
    echo ""
    echo "🎯 Target should be: kairoquantum-production.up.railway.app"
    echo ""
    
    # Test the endpoint
    echo "🧪 Testing API endpoint..."
    response=$(curl -s -w "%{http_code}" https://api.kairoquantum.com/api/health/ping -o /tmp/api_response.txt)
    
    if [ "$response" = "200" ]; then
        echo "✅ SUCCESS! API is responding correctly"
        echo "📄 Response: $(cat /tmp/api_response.txt)"
        echo ""
        echo "🎉 DNS UPDATE COMPLETE! Your deployment is now live!"
        return 0
    else
        echo "❌ Still not working (HTTP $response)"
        if [ -f /tmp/api_response.txt ]; then
            echo "📄 Response: $(cat /tmp/api_response.txt)"
        fi
        echo ""
        return 1
    fi
}

# Initial check
check_dns

if [ $? -eq 0 ]; then
    exit 0
fi

echo "⏳ DNS not propagated yet. Will check every 30 seconds..."
echo "   (This can take 5-30 minutes)"
echo ""

# Monitor every 30 seconds
for i in {1..60}; do
    sleep 30
    echo "🔄 Check #$i:"
    check_dns
    
    if [ $? -eq 0 ]; then
        break
    fi
    
    echo "   Waiting 30 more seconds..."
    echo ""
done

echo "⚠️  If DNS hasn't propagated after 30 minutes, please double-check the DNS configuration."