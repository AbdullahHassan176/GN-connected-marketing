# Global Next - Deployment Verification Script
# This script verifies that the deployment is working correctly

param(
    [string]$StagingWebUrl = "https://global-next-staging.azurestaticapps.net",
    [string]$ProductionWebUrl = "https://global-next-prod.azurestaticapps.net",
    [string]$StagingApiUrl = "https://global-next-api-staging.azurewebsites.net",
    [string]$ProductionApiUrl = "https://global-next-api-prod.azurewebsites.net"
)

Write-Host "🚀 Global Next - Deployment Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Function to print colored output
function Write-Status {
    param(
        [string]$Message,
        [bool]$Success
    )
    
    if ($Success) {
        Write-Host "✅ $Message" -ForegroundColor Green
    } else {
        Write-Host "❌ $Message" -ForegroundColor Red
        exit 1
    }
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

# Function to check URL health
function Test-Url {
    param(
        [string]$Url,
        [string]$Name,
        [int]$ExpectedStatus = 200
    )
    
    Write-Host "🔍 Checking $Name`: $Url" -ForegroundColor Blue
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Get -UseBasicParsing -TimeoutSec 30
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Status "$Name is healthy (HTTP $($response.StatusCode))" $true
        } else {
            Write-Status "$Name is not healthy (HTTP $($response.StatusCode))" $false
        }
    } catch {
        Write-Status "$Name is not accessible: $($_.Exception.Message)" $false
    }
}

# Function to check API endpoint
function Test-ApiEndpoint {
    param(
        [string]$Url,
        [string]$Name,
        [string]$Endpoint
    )
    
    Write-Host "🔍 Checking $Name API: $Url$Endpoint" -ForegroundColor Blue
    
    try {
        $response = Invoke-WebRequest -Uri "$Url$Endpoint" -Method Get -UseBasicParsing -TimeoutSec 30
        if ($response.StatusCode -eq 200) {
            Write-Status "$Name API is healthy (HTTP $($response.StatusCode))" $true
            $body = $response.Content.Substring(0, [Math]::Min(100, $response.Content.Length))
            Write-Host "   Response: $body" -ForegroundColor Gray
        } else {
            Write-Status "$Name API is not healthy (HTTP $($response.StatusCode))" $false
        }
    } catch {
        Write-Status "$Name API is not accessible: $($_.Exception.Message)" $false
    }
}

# Check staging environment
Write-Host ""
Write-Host "🧪 Checking Staging Environment" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Cyan

Test-Url -Url $StagingWebUrl -Name "Staging Web App"
Test-ApiEndpoint -Url $StagingApiUrl -Name "Staging" -Endpoint "/api/health"

# Check production environment
Write-Host ""
Write-Host "🏭 Checking Production Environment" -ForegroundColor Cyan
Write-Host "----------------------------------" -ForegroundColor Cyan

Test-Url -Url $ProductionWebUrl -Name "Production Web App"
Test-ApiEndpoint -Url $ProductionApiUrl -Name "Production" -Endpoint "/api/health"

# Check specific endpoints
Write-Host ""
Write-Host "🔍 Checking Specific Endpoints" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Cyan

# Check dashboard endpoints
Test-Url -Url "$StagingWebUrl/dashboard" -Name "Staging Dashboard"
Test-Url -Url "$ProductionWebUrl/dashboard" -Name "Production Dashboard"

# Check admin endpoints
Test-Url -Url "$StagingWebUrl/admin" -Name "Staging Admin"
Test-Url -Url "$ProductionWebUrl/admin" -Name "Production Admin"

# Check API endpoints
Test-ApiEndpoint -Url $StagingApiUrl -Name "Staging" -Endpoint "/api/organizations"
Test-ApiEndpoint -Url $ProductionApiUrl -Name "Production" -Endpoint "/api/organizations"

# Check database seeding
Write-Host ""
Write-Host "🌱 Checking Database Seeding" -ForegroundColor Cyan
Write-Host "---------------------------" -ForegroundColor Cyan

try {
    $stagingOrgs = (Invoke-WebRequest -Uri "$StagingApiUrl/api/organizations" -UseBasicParsing).Content | ConvertFrom-Json
    $stagingCount = $stagingOrgs.Count
    if ($stagingCount -gt 0) {
        Write-Status "Staging database has $stagingCount organizations" $true
    } else {
        Write-Warning "Staging database may not be seeded properly"
    }
} catch {
    Write-Warning "Could not check staging database seeding"
}

try {
    $productionOrgs = (Invoke-WebRequest -Uri "$ProductionApiUrl/api/organizations" -UseBasicParsing).Content | ConvertFrom-Json
    $productionCount = $productionOrgs.Count
    if ($productionCount -gt 0) {
        Write-Status "Production database has $productionCount organizations" $true
    } else {
        Write-Warning "Production database may not be seeded properly"
    }
} catch {
    Write-Warning "Could not check production database seeding"
}

# Check authentication
Write-Host ""
Write-Host "🔐 Checking Authentication" -ForegroundColor Cyan
Write-Host "-------------------------" -ForegroundColor Cyan

Test-Url -Url "$StagingWebUrl/api/auth/signin" -Name "Staging Auth"
Test-Url -Url "$ProductionWebUrl/api/auth/signin" -Name "Production Auth"

# Check security headers
Write-Host ""
Write-Host "🛡️  Checking Security Headers" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

function Test-SecurityHeaders {
    param(
        [string]$Url,
        [string]$Name
    )
    
    Write-Host "🔍 Checking security headers for $Name`: $Url" -ForegroundColor Blue
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -TimeoutSec 30
        $securityHeaders = @(
            "X-Content-Type-Options",
            "X-Frame-Options",
            "X-XSS-Protection",
            "Strict-Transport-Security"
        )
        
        $foundHeaders = @()
        foreach ($header in $securityHeaders) {
            if ($response.Headers.ContainsKey($header)) {
                $foundHeaders += $header
            }
        }
        
        if ($foundHeaders.Count -gt 0) {
            Write-Status "$Name has security headers" $true
            foreach ($header in $foundHeaders) {
                Write-Host "   $header`: $($response.Headers[$header])" -ForegroundColor Gray
            }
        } else {
            Write-Warning "$Name may be missing security headers"
        }
    } catch {
        Write-Warning "Could not check security headers for $Name"
    }
}

Test-SecurityHeaders -Url $StagingWebUrl -Name "Staging"
Test-SecurityHeaders -Url $ProductionWebUrl -Name "Production"

# Final summary
Write-Host ""
Write-Host "📊 Deployment Verification Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

Write-Host "🌐 Staging Environment:" -ForegroundColor Green
Write-Host "   Web: $StagingWebUrl" -ForegroundColor White
Write-Host "   API: $StagingApiUrl" -ForegroundColor White

Write-Host ""
Write-Host "🏭 Production Environment:" -ForegroundColor Green
Write-Host "   Web: $ProductionWebUrl" -ForegroundColor White
Write-Host "   API: $ProductionApiUrl" -ForegroundColor White

Write-Host ""
Write-Host "✅ Deployment verification complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Quick Links:" -ForegroundColor Cyan
Write-Host "   Staging Dashboard: $StagingWebUrl/dashboard" -ForegroundColor White
Write-Host "   Production Dashboard: $ProductionWebUrl/dashboard" -ForegroundColor White
Write-Host "   Staging Admin: $StagingWebUrl/admin" -ForegroundColor White
Write-Host "   Production Admin: $ProductionWebUrl/admin" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   README: ./README.md" -ForegroundColor White
Write-Host "   Azure Setup: ./docs/azure-deployment.md" -ForegroundColor White
Write-Host "   Security: ./apps/api/SECURITY.md" -ForegroundColor White
