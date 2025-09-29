# 🚀 Global Next - Deployment Guide

## Overview

This document provides a comprehensive guide for deploying the Global Next Marketing Portal to Azure using CI/CD pipelines.

## 🏗️ Architecture

### Frontend (Azure Static Web Apps)
- **Framework**: Next.js 14 with App Router
- **Deployment**: Azure Static Web Apps
- **URLs**: 
  - Production: `https://global-next-prod.azurestaticapps.net`
  - Staging: `https://global-next-staging.azurestaticapps.net`

### Backend (Azure Functions)
- **Runtime**: Azure Functions (Node.js 20)
- **Database**: Azure Cosmos DB (Core SQL API)
- **URLs**:
  - Production: `https://global-next-api-prod.azurewebsites.net`
  - Staging: `https://global-next-api-staging.azurewebsites.net`

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

#### 1. Web App Deployment (`deploy-web.yml`)
- **Triggers**: Push to `main`/`develop` branches
- **Stages**:
  1. **Lint & Typecheck**: Code quality checks
  2. **Build**: Next.js production build
  3. **Deploy**: Azure Static Web Apps deployment
  4. **Seed**: Database seeding with demo data

#### 2. API Deployment (`deploy-api.yml`)
- **Triggers**: Push to `main`/`develop` branches
- **Stages**:
  1. **Lint & Typecheck**: Code quality checks
  2. **Test**: Unit tests with Vitest
  3. **Build**: TypeScript compilation
  4. **Deploy**: Azure Functions deployment
  5. **Health Check**: API endpoint verification

### Environment Matrix

| Environment | Branch | Web URL | API URL | Database |
|-------------|--------|---------|---------|----------|
| **Staging** | `develop` | `global-next-staging.azurestaticapps.net` | `global-next-api-staging.azurewebsites.net` | `global-next-db-staging` |
| **Production** | `main` | `global-next-prod.azurestaticapps.net` | `global-next-api-prod.azurewebsites.net` | `global-next-db` |

## 🚀 Quick Deployment

### Prerequisites
1. Azure CLI installed and configured
2. GitHub repository with the project
3. Azure subscription with appropriate permissions

### 1. Azure Resource Setup

```bash
# Create resource group
az group create --name global-next-rg --location eastus

# Create Cosmos DB
az cosmosdb create \
  --name global-next-cosmos \
  --resource-group global-next-rg \
  --locations regionName=eastus failoverPriority=0 isZoneRedundant=False \
  --capabilities EnableServerless \
  --default-consistency-level Session

# Create Static Web Apps
az staticwebapp create \
  --name global-next-web \
  --resource-group global-next-rg \
  --source https://github.com/your-username/global-next \
  --location eastus \
  --branch main \
  --app-location "apps/web" \
  --output-location ".next"

# Create Azure Functions
az functionapp create \
  --name global-next-api \
  --resource-group global-next-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --storage-account globalnextstorage
```

### 2. GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

#### Authentication
```
NEXTAUTH_SECRET=your-nextauth-secret-32-chars-minimum
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
WEBHOOK_SECRET=your-webhook-secret-32-chars-minimum
```

#### Azure Static Web Apps
```
AZURE_STATIC_WEB_APPS_API_TOKEN_PRODUCTION=your-swa-token-prod
AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING=your-swa-token-staging
```

#### Azure Functions
```
AZURE_CREDENTIALS_PRODUCTION={"clientId":"...","clientSecret":"...","subscriptionId":"...","tenantId":"..."}
AZURE_CREDENTIALS_STAGING={"clientId":"...","clientSecret":"...","subscriptionId":"...","tenantId":"..."}
AZURE_FUNCTION_APP_NAME_PRODUCTION=global-next-api
AZURE_FUNCTION_APP_NAME_STAGING=global-next-api-staging
AZURE_FUNCTION_RESOURCE_GROUP_PRODUCTION=global-next-rg
AZURE_FUNCTION_RESOURCE_GROUP_STAGING=global-next-rg
AZURE_FUNCTION_PUBLISH_PROFILE_PRODUCTION=your-publish-profile-prod
AZURE_FUNCTION_PUBLISH_PROFILE_STAGING=your-publish-profile-staging
AZURE_FUNCTION_URL_PRODUCTION=https://global-next-api.azurewebsites.net
AZURE_FUNCTION_URL_STAGING=https://global-next-api-staging.azurewebsites.net
```

#### Database
```
COSMOS_DB_ENDPOINT_PRODUCTION=https://global-next-cosmos.documents.azure.com:443/
COSMOS_DB_KEY_PRODUCTION=your-cosmos-key-prod
COSMOS_DB_DATABASE_ID_PRODUCTION=global-next-db
COSMOS_DB_ENDPOINT_STAGING=https://global-next-cosmos-staging.documents.azure.com:443/
COSMOS_DB_KEY_STAGING=your-cosmos-key-staging
COSMOS_DB_DATABASE_ID_STAGING=global-next-db-staging
```

#### Application Insights
```
APPLICATIONINSIGHTS_CONNECTION_STRING_PRODUCTION=InstrumentationKey=...;IngestionEndpoint=...
APPLICATIONINSIGHTS_CONNECTION_STRING_STAGING=InstrumentationKey=...;IngestionEndpoint=...
```

#### URLs and CORS
```
NEXTAUTH_URL_PRODUCTION=https://global-next-prod.azurestaticapps.net
NEXTAUTH_URL_STAGING=https://global-next-staging.azurestaticapps.net
ALLOWED_ORIGINS_PRODUCTION=https://global-next-prod.azurestaticapps.net
ALLOWED_ORIGINS_STAGING=https://global-next-staging.azurestaticapps.net
```

### 3. Deploy

Simply push to the appropriate branch:

```bash
# Deploy to staging
git checkout develop
git push origin develop

# Deploy to production
git checkout main
git push origin main
```

## 🔍 Verification

### Automated Verification
The CI/CD pipeline includes automated health checks and verification steps.

### Manual Verification
Use the provided verification scripts:

```bash
# PowerShell (Windows)
.\scripts\verify-deployment.ps1

# Bash (Linux/macOS)
./scripts/verify-deployment.sh
```

### Manual Checks

#### 1. Web App Health
```bash
# Staging
curl https://global-next-staging.azurestaticapps.net

# Production
curl https://global-next-prod.azurestaticapps.net
```

#### 2. API Health
```bash
# Staging
curl https://global-next-api-staging.azurewebsites.net/api/health

# Production
curl https://global-next-api-prod.azurewebsites.net/api/health
```

#### 3. Dashboard Access
- **Staging Dashboard**: https://global-next-staging.azurestaticapps.net/dashboard
- **Production Dashboard**: https://global-next-prod.azurestaticapps.net/dashboard

#### 4. Admin Panel
- **Staging Admin**: https://global-next-staging.azurestaticapps.net/admin
- **Production Admin**: https://global-next-prod.azurestaticapps.net/admin

## 🛡️ Security

### Security Headers
The application includes comprehensive security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy: default-src 'self'`

### Authentication
- **NextAuth.js**: JWT-based authentication
- **OAuth Providers**: Google, Microsoft
- **RBAC**: Role-based access control

### Monitoring
- **Application Insights**: Performance and error tracking
- **Audit Logging**: Comprehensive activity tracking
- **Rate Limiting**: Endpoint-specific limits

## 📊 Monitoring

### Application Insights
- **Traces**: OpenTelemetry distributed tracing
- **Metrics**: Performance and error tracking
- **Logs**: Structured logging with correlation
- **Alerts**: Automated alerting for issues

### Health Checks
- **API Health**: `/api/health` endpoint
- **Database Health**: Cosmos DB connection monitoring
- **Authentication**: NextAuth.js health checks

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Failures
- **Cause**: TypeScript errors, missing dependencies
- **Solution**: Check GitHub Actions logs, fix TypeScript errors

#### 2. Deployment Failures
- **Cause**: Invalid credentials, resource not found
- **Solution**: Verify Azure credentials, check resource names

#### 3. Database Connection Issues
- **Cause**: Invalid Cosmos DB credentials, firewall rules
- **Solution**: Verify database credentials, check firewall settings

#### 4. Authentication Issues
- **Cause**: Invalid OAuth credentials, NextAuth configuration
- **Solution**: Verify OAuth provider settings, check NextAuth configuration

### Debug Commands

```bash
# Check Function App logs
az functionapp logs tail --name global-next-api --resource-group global-next-rg

# Check Static Web App logs
az staticwebapp logs show --name global-next-web --resource-group global-next-rg

# Check Cosmos DB metrics
az cosmosdb sql database show --account-name global-next-cosmos --resource-group global-next-rg --name global-next-db
```

## 📚 Documentation

- **Main README**: `./README.md`
- **Azure Setup**: `./docs/azure-deployment.md`
- **Security Guide**: `./apps/api/SECURITY.md`
- **API Documentation**: `/api/docs` (Swagger/OpenAPI)

## 🎯 Next Steps

1. **Set up monitoring**: Configure Application Insights dashboards
2. **Configure alerts**: Set up automated alerting for issues
3. **Performance optimization**: Monitor and optimize performance
4. **Security hardening**: Regular security audits and updates
5. **Backup strategy**: Implement database backup and recovery

## 🆘 Support

- **Issues**: GitHub Issues
- **Documentation**: Project Wiki
- **Security**: security@globalnext.com
- **General**: support@globalnext.com

---

**Built with ❤️ by the Global Next Team**
