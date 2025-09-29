#!/bin/bash

# Global Next - Deployment Verification Script
# This script verifies that the deployment is working correctly

set -e

echo "🚀 Global Next - Deployment Verification"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        exit 1
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if required environment variables are set
echo "🔍 Checking environment variables..."

if [ -z "$STAGING_WEB_URL" ]; then
    STAGING_WEB_URL="https://global-next-staging.azurestaticapps.net"
    print_warning "STAGING_WEB_URL not set, using default: $STAGING_WEB_URL"
fi

if [ -z "$PRODUCTION_WEB_URL" ]; then
    PRODUCTION_WEB_URL="https://global-next-prod.azurestaticapps.net"
    print_warning "PRODUCTION_WEB_URL not set, using default: $PRODUCTION_WEB_URL"
fi

if [ -z "$STAGING_API_URL" ]; then
    STAGING_API_URL="https://global-next-api-staging.azurewebsites.net"
    print_warning "STAGING_API_URL not set, using default: $STAGING_API_URL"
fi

if [ -z "$PRODUCTION_API_URL" ]; then
    PRODUCTION_API_URL="https://global-next-api-prod.azurewebsites.net"
    print_warning "PRODUCTION_API_URL not set, using default: $PRODUCTION_API_URL"
fi

# Function to check URL health
check_url() {
    local url=$1
    local name=$2
    local expected_status=${3:-200}
    
    echo "🔍 Checking $name: $url"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    
    if [ "$response" -eq "$expected_status" ]; then
        print_status "$name is healthy (HTTP $response)" 0
    else
        print_status "$name is not healthy (HTTP $response)" 1
    fi
}

# Function to check API endpoint
check_api_endpoint() {
    local url=$1
    local name=$2
    local endpoint=$3
    
    echo "🔍 Checking $name API: $url$endpoint"
    
    response=$(curl -s -w "%{http_code}" "$url$endpoint" | tail -c 3)
    body=$(curl -s "$url$endpoint" | head -c 100)
    
    if [ "$response" -eq "200" ]; then
        print_status "$name API is healthy (HTTP $response)" 0
        echo "   Response: $body"
    else
        print_status "$name API is not healthy (HTTP $response)" 1
    fi
}

# Check staging environment
echo ""
echo "🧪 Checking Staging Environment"
echo "------------------------------"

check_url "$STAGING_WEB_URL" "Staging Web App"
check_api_endpoint "$STAGING_API_URL" "Staging" "/api/health"

# Check production environment
echo ""
echo "🏭 Checking Production Environment"
echo "----------------------------------"

check_url "$PRODUCTION_WEB_URL" "Production Web App"
check_api_endpoint "$PRODUCTION_API_URL" "Production" "/api/health"

# Check specific endpoints
echo ""
echo "🔍 Checking Specific Endpoints"
echo "------------------------------"

# Check dashboard endpoints
check_url "$STAGING_WEB_URL/dashboard" "Staging Dashboard"
check_url "$PRODUCTION_WEB_URL/dashboard" "Production Dashboard"

# Check admin endpoints
check_url "$STAGING_WEB_URL/admin" "Staging Admin"
check_url "$PRODUCTION_WEB_URL/admin" "Production Admin"

# Check API endpoints
check_api_endpoint "$STAGING_API_URL" "Staging" "/api/organizations"
check_api_endpoint "$PRODUCTION_API_URL" "Production" "/api/organizations"

# Check database seeding
echo ""
echo "🌱 Checking Database Seeding"
echo "---------------------------"

# Check if organizations exist
staging_orgs=$(curl -s "$STAGING_API_URL/api/organizations" | jq '.length' 2>/dev/null || echo "0")
production_orgs=$(curl -s "$PRODUCTION_API_URL/api/organizations" | jq '.length' 2>/dev/null || echo "0")

if [ "$staging_orgs" -gt 0 ]; then
    print_status "Staging database has $staging_orgs organizations" 0
else
    print_warning "Staging database may not be seeded properly"
fi

if [ "$production_orgs" -gt 0 ]; then
    print_status "Production database has $production_orgs organizations" 0
else
    print_warning "Production database may not be seeded properly"
fi

# Check authentication
echo ""
echo "🔐 Checking Authentication"
echo "-------------------------"

# Check if auth endpoints are accessible
check_url "$STAGING_WEB_URL/api/auth/signin" "Staging Auth"
check_url "$PRODUCTION_WEB_URL/api/auth/signin" "Production Auth"

# Check security headers
echo ""
echo "🛡️  Checking Security Headers"
echo "----------------------------"

check_security_headers() {
    local url=$1
    local name=$2
    
    echo "🔍 Checking security headers for $name: $url"
    
    headers=$(curl -s -I "$url" | grep -i "x-content-type-options\|x-frame-options\|x-xss-protection\|strict-transport-security" || echo "")
    
    if [ -n "$headers" ]; then
        print_status "$name has security headers" 0
        echo "$headers" | sed 's/^/   /'
    else
        print_warning "$name may be missing security headers"
    fi
}

check_security_headers "$STAGING_WEB_URL" "Staging"
check_security_headers "$PRODUCTION_WEB_URL" "Production"

# Final summary
echo ""
echo "📊 Deployment Verification Summary"
echo "=================================="

echo "🌐 Staging Environment:"
echo "   Web: $STAGING_WEB_URL"
echo "   API: $STAGING_API_URL"

echo ""
echo "🏭 Production Environment:"
echo "   Web: $PRODUCTION_WEB_URL"
echo "   API: $PRODUCTION_API_URL"

echo ""
echo "✅ Deployment verification complete!"
echo ""
echo "🔗 Quick Links:"
echo "   Staging Dashboard: $STAGING_WEB_URL/dashboard"
echo "   Production Dashboard: $PRODUCTION_WEB_URL/dashboard"
echo "   Staging Admin: $STAGING_WEB_URL/admin"
echo "   Production Admin: $PRODUCTION_WEB_URL/admin"
echo ""
echo "📚 Documentation:"
echo "   README: ./README.md"
echo "   Azure Setup: ./docs/azure-deployment.md"
echo "   Security: ./apps/api/SECURITY.md"
