# Azure Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Global Next Marketing Portal to Azure.

## Prerequisites

- Azure CLI installed and configured
- GitHub repository with the project
- Azure subscription with appropriate permissions

## 1. Azure Resource Setup

### Create Resource Group

```bash
# Create resource group
az group create \
  --name global-next-rg \
  --location eastus
```

### Create Cosmos DB Account

```bash
# Create Cosmos DB account
az cosmosdb create \
  --name global-next-cosmos \
  --resource-group global-next-rg \
  --locations regionName=eastus failoverPriority=0 isZoneRedundant=False \
  --capabilities EnableServerless \
  --default-consistency-level Session

# Get connection string
az cosmosdb keys list \
  --name global-next-cosmos \
  --resource-group global-next-rg \
  --type keys
```

### Create Cosmos DB Database and Containers

```bash
# Create database
az cosmosdb sql database create \
  --account-name global-next-cosmos \
  --resource-group global-next-rg \
  --name global-next-db

# Create containers
az cosmosdb sql container create \
  --account-name global-next-cosmos \
  --resource-group global-next-rg \
  --database-name global-next-db \
  --name organizations \
  --partition-key-path "/id" \
  --throughput 400

az cosmosdb sql container create \
  --account-name global-next-cosmos \
  --resource-group global-next-rg \
  --database-name global-next-db \
  --name users \
  --partition-key-path "/organizationId" \
  --throughput 400

az cosmosdb sql container create \
  --account-name global-next-cosmos \
  --resource-group global-next-rg \
  --database-name global-next-db \
  --name projects \
  --partition-key-path "/organizationId" \
  --throughput 400

az cosmosdb sql container create \
  --account-name global-next-cosmos \
  --resource-group global-next-rg \
  --database-name global-next-db \
  --name work_items \
  --partition-key-path "/projectId" \
  --throughput 400

az cosmosdb sql container create \
  --account-name global-next-cosmos \
  --resource-group global-next-rg \
  --database-name global-next-db \
  --name events \
  --partition-key-path "/organizationId" \
  --throughput 400

az cosmosdb sql container create \
  --account-name global-next-cosmos \
  --resource-group global-next-rg \
  --database-name global-next-db \
  --name assets \
  --partition-key-path "/projectId" \
  --throughput 400

az cosmosdb sql container create \
  --account-name global-next-cosmos \
  --resource-group global-next-rg \
  --database-name global-next-db \
  --name insights \
  --partition-key-path "/projectId" \
  --throughput 400

az cosmosdb sql container create \
  --account-name global-next-cosmos \
  --resource-group global-next-rg \
  --database-name global-next-db \
  --name messages \
  --partition-key-path "/projectId" \
  --throughput 400

az cosmosdb sql container create \
  --account-name global-next-cosmos \
  --resource-group global-next-rg \
  --database-name global-next-db \
  --name approvals \
  --partition-key-path "/projectId" \
  --throughput 400

az cosmosdb sql container create \
  --account-name global-next-cosmos \
  --resource-group global-next-rg \
  --database-name global-next-db \
  --name tool_inventory \
  --partition-key-path "/organizationId" \
  --throughput 400
```

### Create Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app global-next-insights \
  --location eastus \
  --resource-group global-next-rg

# Get connection string
az monitor app-insights component show \
  --app global-next-insights \
  --resource-group global-next-rg \
  --query connectionString
```

## 2. Static Web Apps Setup

### Create Static Web App

```bash
# Create Static Web App
az staticwebapp create \
  --name global-next-web \
  --resource-group global-next-rg \
  --source https://github.com/your-username/global-next \
  --location eastus \
  --branch main \
  --app-location "apps/web" \
  --output-location ".next"

# Get deployment token
az staticwebapp secrets list \
  --name global-next-web \
  --resource-group global-next-rg
```

### Create Staging Static Web App

```bash
# Create staging Static Web App
az staticwebapp create \
  --name global-next-web-staging \
  --resource-group global-next-rg \
  --source https://github.com/your-username/global-next \
  --location eastus \
  --branch develop \
  --app-location "apps/web" \
  --output-location ".next"

# Get staging deployment token
az staticwebapp secrets list \
  --name global-next-web-staging \
  --resource-group global-next-rg
```

## 3. Azure Functions Setup

### Create Function App

```bash
# Create storage account
az storage account create \
  --name globalnextstorage \
  --resource-group global-next-rg \
  --location eastus \
  --sku Standard_LRS

# Create Function App
az functionapp create \
  --name global-next-api \
  --resource-group global-next-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --storage-account globalnextstorage

# Get publish profile
az functionapp deployment list-publishing-profiles \
  --name global-next-api \
  --resource-group global-next-rg
```

### Create Staging Function App

```bash
# Create staging Function App
az functionapp create \
  --name global-next-api-staging \
  --resource-group global-next-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --storage-account globalnextstorage

# Get staging publish profile
az functionapp deployment list-publishing-profiles \
  --name global-next-api-staging \
  --resource-group global-next-rg
```

## 4. GitHub Secrets Configuration

### Repository Secrets

Add the following secrets to your GitHub repository:

#### Authentication Secrets
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

#### Database Secrets
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
NEXTAUTH_URL_PRODUCTION=https://global-next-web.azurestaticapps.net
NEXTAUTH_URL_STAGING=https://global-next-web-staging.azurestaticapps.net
ALLOWED_ORIGINS_PRODUCTION=https://global-next-web.azurestaticapps.net
ALLOWED_ORIGINS_STAGING=https://global-next-web-staging.azurestaticapps.net
```

## 5. Deployment Verification

### Check Static Web Apps

```bash
# Check production
curl https://global-next-web.azurestaticapps.net

# Check staging
curl https://global-next-web-staging.azurestaticapps.net
```

### Check Azure Functions

```bash
# Check production API
curl https://global-next-api.azurewebsites.net/api/health

# Check staging API
curl https://global-next-api-staging.azurewebsites.net/api/health
```

### Check Database Connection

```bash
# Test database connection
curl https://global-next-api.azurewebsites.net/api/health
```

## 6. Monitoring Setup

### Application Insights

1. Navigate to Application Insights in Azure Portal
2. Configure custom dashboards
3. Set up alerts for errors and performance
4. Configure log analytics queries

### Static Web Apps Monitoring

1. Navigate to Static Web Apps in Azure Portal
2. Configure custom domains
3. Set up SSL certificates
4. Configure authentication providers

## 7. Troubleshooting

### Common Issues

#### Static Web Apps
- **Build failures**: Check GitHub Actions logs
- **Routing issues**: Verify `staticwebapp.config.json`
- **Authentication**: Check NextAuth configuration

#### Azure Functions
- **Deployment failures**: Check publish profile
- **Runtime errors**: Check Application Insights logs
- **Database connection**: Verify Cosmos DB credentials

#### Database
- **Connection timeouts**: Check firewall rules
- **Authentication errors**: Verify Cosmos DB keys
- **Container issues**: Check partition key configuration

### Debug Commands

```bash
# Check Function App logs
az functionapp logs tail --name global-next-api --resource-group global-next-rg

# Check Static Web App logs
az staticwebapp logs show --name global-next-web --resource-group global-next-rg

# Check Cosmos DB metrics
az cosmosdb sql database show --account-name global-next-cosmos --resource-group global-next-rg --name global-next-db
```

## 8. Security Considerations

### Network Security
- Configure Cosmos DB firewall rules
- Set up VNet integration for Functions
- Configure SSL/TLS certificates

### Access Control
- Use managed identities where possible
- Implement least privilege access
- Regular security audits

### Monitoring
- Set up security alerts
- Monitor for suspicious activity
- Regular backup verification

## 9. Cost Optimization

### Cosmos DB
- Use serverless tier for development
- Optimize partition key design
- Monitor RU consumption

### Azure Functions
- Use consumption plan for variable workloads
- Optimize cold start performance
- Monitor execution costs

### Static Web Apps
- Use free tier for development
- Optimize build performance
- Monitor bandwidth usage

## 10. Maintenance

### Regular Tasks
- Update dependencies
- Monitor performance metrics
- Review security logs
- Backup database

### Monitoring
- Set up health checks
- Configure alerts
- Regular performance reviews
- Security audits

---

For additional support, refer to the main README.md or contact the development team.
