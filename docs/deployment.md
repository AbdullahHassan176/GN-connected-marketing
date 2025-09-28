# Global Next - Deployment Guide

This guide covers deploying the Global Next Marketing Portal to Azure using Azure Static Web Apps and Azure Functions.

## 🚀 Azure Deployment

### Prerequisites
- Azure subscription
- GitHub repository
- Azure CLI installed
- Domain name (optional)

### 1. Azure Resources Setup

#### Create Resource Group
```bash
# Create resource group
az group create --name globalnext-rg --location eastus
```

#### Create Cosmos DB Account
```bash
# Create Cosmos DB account
az cosmosdb create \
  --resource-group globalnext-rg \
  --name globalnext-cosmos \
  --kind GlobalDocumentDB \
  --locations regionName=eastus failoverPriority=0 isZoneRedundant=False

# Create database
az cosmosdb sql database create \
  --account-name globalnext-cosmos \
  --resource-group globalnext-rg \
  --name globalnext

# Create containers
az cosmosdb sql container create \
  --account-name globalnext-cosmos \
  --resource-group globalnext-rg \
  --database-name globalnext \
  --name organizations \
  --partition-key-path "/orgId" \
  --throughput 400
```

#### Create Storage Account (Optional)
```bash
# Create storage account for file uploads
az storage account create \
  --name globalnextstorage \
  --resource-group globalnext-rg \
  --location eastus \
  --sku Standard_LRS
```

#### Create Application Insights (Optional)
```bash
# Create Application Insights
az monitor app-insights component create \
  --app globalnext-insights \
  --location eastus \
  --resource-group globalnext-rg
```

### 2. Azure Static Web Apps Setup

#### Create Static Web App
```bash
# Create Static Web App
az staticwebapp create \
  --name globalnext-app \
  --resource-group globalnext-rg \
  --source https://github.com/your-username/global-next-marketing-portal \
  --location eastus2 \
  --branch main \
  --app-location "apps/web" \
  --api-location "apps/api" \
  --output-location ".next"
```

#### Configure Environment Variables
```bash
# Set environment variables
az staticwebapp appsettings set \
  --name globalnext-app \
  --resource-group globalnext-rg \
  --setting-names \
    COSMOS_ENDPOINT="https://globalnext-cosmos.documents.azure.com:443/" \
    COSMOS_KEY="your-cosmos-key" \
    COSMOS_DB="globalnext" \
    NEXTAUTH_SECRET="your-nextauth-secret" \
    NEXTAUTH_URL="https://globalnext-app.azurestaticapps.net" \
    OAUTH_GOOGLE_ID="your-google-client-id" \
    OAUTH_GOOGLE_SECRET="your-google-client-secret" \
    OAUTH_MICROSOFT_ID="your-microsoft-client-id" \
    OAUTH_MICROSOFT_SECRET="your-microsoft-client-secret"
```

### 3. GitHub Actions Setup

#### Create GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:
- `AZURE_STATIC_WEB_APPS_API_TOKEN`: From Azure Static Web Apps
- `COSMOS_ENDPOINT`: Your Cosmos DB endpoint
- `COSMOS_KEY`: Your Cosmos DB key
- `COSMOS_DB`: Database name (globalnext)
- `NEXTAUTH_SECRET`: Random secret key
- `NEXTAUTH_URL`: Your app URL
- `OAUTH_GOOGLE_ID`: Google OAuth client ID
- `OAUTH_GOOGLE_SECRET`: Google OAuth client secret
- `OAUTH_MICROSOFT_ID`: Microsoft OAuth client ID
- `OAUTH_MICROSOFT_SECRET`: Microsoft OAuth client secret

#### Deploy via GitHub Actions
The deployment will be automatic when you push to the main branch. The workflow will:
1. Build the application
2. Run tests
3. Deploy to Azure Static Web Apps

### 4. Database Initialization

#### Seed Production Database
```bash
# Connect to your production database
export COSMOS_ENDPOINT="https://globalnext-cosmos.documents.azure.com:443/"
export COSMOS_KEY="your-production-key"
export COSMOS_DB="globalnext"

# Run seed script
pnpm db:seed
```

## 🔧 Configuration

### OAuth Provider Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `https://globalnext-app.azurestaticapps.net/api/auth/callback/google`
4. Copy Client ID and Secret

#### Microsoft OAuth
1. Go to [Azure Portal](https://portal.azure.com/)
2. Azure Active Directory → App registrations
3. New registration
4. Configure redirect URIs:
   - `https://globalnext-app.azurestaticapps.net/api/auth/callback/microsoft`
5. Copy Application ID and Secret

### Custom Domain (Optional)

#### Add Custom Domain
```bash
# Add custom domain to Static Web App
az staticwebapp hostname set \
  --name globalnext-app \
  --resource-group globalnext-rg \
  --hostname your-domain.com
```

#### Configure DNS
Add a CNAME record pointing to your Static Web App:
```
your-domain.com → globalnext-app.azurestaticapps.net
```

## 📊 Monitoring and Analytics

### Application Insights Setup
1. Enable Application Insights in Azure Portal
2. Configure custom events and metrics
3. Set up alerts for errors and performance issues

### Health Monitoring
```bash
# Check application health
curl https://globalnext-app.azurestaticapps.net/api/v1/health

# Expected response
{
  "ok": true,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Performance Monitoring
- Monitor API response times
- Track database query performance
- Monitor user engagement metrics
- Set up alerts for critical issues

## 🔒 Security Configuration

### HTTPS and SSL
- Azure Static Web Apps provides automatic HTTPS
- Custom domains get free SSL certificates
- API endpoints are automatically secured

### Authentication Security
- JWT tokens with 7-day expiration
- Secure session management
- OAuth provider integration
- Role-based access control

### Database Security
- Cosmos DB firewall rules
- Network access restrictions
- Encryption at rest and in transit
- Regular security updates

## 🚀 Production Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] OAuth providers set up
- [ ] Database seeded with initial data
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificates valid
- [ ] Monitoring and alerts configured

### Post-Deployment
- [ ] Health check endpoint responding
- [ ] Authentication working
- [ ] Database connectivity verified
- [ ] File uploads working (if using Blob Storage)
- [ ] Performance monitoring active
- [ ] Error tracking configured

### Testing Production
```bash
# Test authentication
curl -X POST https://globalnext-app.azurestaticapps.net/api/v1/auth/session/validate \
  -H "Authorization: Bearer <jwt-token>"

# Test database connectivity
curl https://globalnext-app.azurestaticapps.net/api/v1/health

# Test API endpoints
curl https://globalnext-app.azurestaticapps.net/api/v1/orgs/org_123
```

## 🔄 CI/CD Pipeline

### Automatic Deployment
The GitHub Actions workflow automatically:
1. Builds the application
2. Runs tests and linting
3. Deploys to Azure Static Web Apps
4. Updates environment variables

### Manual Deployment
```bash
# Deploy manually using Azure CLI
az staticwebapp deploy \
  --name globalnext-app \
  --resource-group globalnext-rg \
  --source-location "apps/web" \
  --api-location "apps/api"
```

### Rollback Strategy
- Keep previous deployments in Azure
- Use feature flags for gradual rollouts
- Monitor error rates and performance
- Quick rollback via Azure Portal

## 📈 Scaling and Performance

### Auto-scaling
- Azure Static Web Apps auto-scales
- Cosmos DB scales based on demand
- Functions scale automatically

### Performance Optimization
- Enable CDN for static assets
- Optimize database queries
- Use caching strategies
- Monitor and optimize bundle sizes

### Cost Optimization
- Use Cosmos DB autoscale
- Optimize Function execution time
- Monitor and adjust resource allocation
- Use reserved capacity for predictable workloads

## 🆘 Troubleshooting

### Common Issues

#### Deployment Failures
- Check GitHub Actions logs
- Verify environment variables
- Ensure all dependencies are installed
- Check Azure resource quotas

#### Database Issues
- Verify Cosmos DB connection string
- Check firewall rules
- Monitor database performance
- Review error logs

#### Authentication Issues
- Verify OAuth provider configuration
- Check redirect URIs
- Ensure NEXTAUTH_SECRET is set
- Review JWT token configuration

### Debug Commands
```bash
# Check deployment status
az staticwebapp show --name globalnext-app --resource-group globalnext-rg

# View logs
az staticwebapp logs show --name globalnext-app --resource-group globalnext-rg

# Check environment variables
az staticwebapp appsettings list --name globalnext-app --resource-group globalnext-rg
```

## 📚 Additional Resources

### Azure Documentation
- [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/)

### Monitoring Tools
- [Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- [Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/)

### Support
- Azure Support Portal
- GitHub Issues
- Development team contact

---

**Deployment complete! 🎉**
