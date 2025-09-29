# Global Next - AI-Powered Marketing Portal

A comprehensive AI-driven marketing consulting platform built with Next.js 14, Azure Functions, and Azure Cosmos DB.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm 8+
- Azure CLI
- Azure subscription
- GitHub repository

### Local Development

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm run dev

# Run tests
pnpm run test

# Build all packages
pnpm run build
```

## 🏗️ Architecture

### Frontend (apps/web)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts for data visualization
- **i18n**: next-intl for English/Arabic support
- **Auth**: NextAuth.js with RBAC
- **Deployment**: Azure Static Web Apps

### Backend (apps/api)
- **Runtime**: Azure Functions (Node.js 20)
- **Database**: Azure Cosmos DB (Core SQL API)
- **Auth**: JWT with role-based access control
- **Monitoring**: OpenTelemetry + Azure Application Insights
- **Security**: Rate limiting, audit logging, input validation

### Shared Packages
- **@repo/ui**: Reusable UI components
- **@repo/lib**: Shared utilities and types
- **@repo/config**: Configuration management

## 🔧 Azure Setup

### 1. Create Azure Resources

#### Azure Cosmos DB
```bash
# Create resource group
az group create --name global-next-rg --location eastus

# Create Cosmos DB account
az cosmosdb create \
  --name global-next-cosmos \
  --resource-group global-next-rg \
  --locations regionName=eastus failoverPriority=0 isZoneRedundant=False \
  --capabilities EnableServerless \
  --default-consistency-level Session

# Create database
az cosmosdb sql database create \
  --account-name global-next-cosmos \
  --resource-group global-next-rg \
  --name global-next-db
```

#### Azure Static Web Apps
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
```

#### Azure Functions
```bash
# Create Function App
az functionapp create \
  --name global-next-api \
  --resource-group global-next-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --storage-account globalnextstorage
```

#### Azure Application Insights
```bash
# Create Application Insights
az monitor app-insights component create \
  --app global-next-insights \
  --location eastus \
  --resource-group global-next-rg
```

### 2. Configure Cosmos DB Containers

```bash
# Create containers with partition keys
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

### 3. Configure GitHub Secrets

#### Repository Secrets
```bash
# Authentication
NEXTAUTH_SECRET=your-nextauth-secret-32-chars-minimum
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# Webhook Security
WEBHOOK_SECRET=your-webhook-secret-32-chars-minimum

# Azure Static Web Apps
AZURE_STATIC_WEB_APPS_API_TOKEN_PRODUCTION=your-swa-token-prod
AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING=your-swa-token-staging

# Azure Functions
AZURE_CREDENTIALS_PRODUCTION={"clientId":"...","clientSecret":"...","subscriptionId":"...","tenantId":"..."}
AZURE_CREDENTIALS_STAGING={"clientId":"...","clientSecret":"...","subscriptionId":"...","tenantId":"..."}

# Function App Names
AZURE_FUNCTION_APP_NAME_PRODUCTION=global-next-api-prod
AZURE_FUNCTION_APP_NAME_STAGING=global-next-api-staging

# Resource Groups
AZURE_FUNCTION_RESOURCE_GROUP_PRODUCTION=global-next-rg
AZURE_FUNCTION_RESOURCE_GROUP_STAGING=global-next-rg-staging

# Publish Profiles
AZURE_FUNCTION_PUBLISH_PROFILE_PRODUCTION=your-publish-profile-prod
AZURE_FUNCTION_PUBLISH_PROFILE_STAGING=your-publish-profile-staging

# Function URLs
AZURE_FUNCTION_URL_PRODUCTION=https://global-next-api-prod.azurewebsites.net
AZURE_FUNCTION_URL_STAGING=https://global-next-api-staging.azurewebsites.net
```

#### Environment-Specific Secrets

**Production:**
```bash
COSMOS_DB_ENDPOINT_PRODUCTION=https://global-next-cosmos.documents.azure.com:443/
COSMOS_DB_KEY_PRODUCTION=your-cosmos-key-prod
COSMOS_DB_DATABASE_ID_PRODUCTION=global-next-db
NEXTAUTH_URL_PRODUCTION=https://global-next-prod.azurestaticapps.net
APPLICATIONINSIGHTS_CONNECTION_STRING_PRODUCTION=InstrumentationKey=...;IngestionEndpoint=...
ALLOWED_ORIGINS_PRODUCTION=https://global-next-prod.azurestaticapps.net
```

**Staging:**
```bash
COSMOS_DB_ENDPOINT_STAGING=https://global-next-cosmos-staging.documents.azure.com:443/
COSMOS_DB_KEY_STAGING=your-cosmos-key-staging
COSMOS_DB_DATABASE_ID_STAGING=global-next-db-staging
NEXTAUTH_URL_STAGING=https://global-next-staging.azurestaticapps.net
APPLICATIONINSIGHTS_CONNECTION_STRING_STAGING=InstrumentationKey=...;IngestionEndpoint=...
ALLOWED_ORIGINS_STAGING=https://global-next-staging.azurestaticapps.net
```

### 4. Static Web Apps Configuration

The `staticwebapp.config.json` file configures:
- **Routes**: Role-based access control
- **Navigation**: SPA fallback routing
- **MIME Types**: Proper content type handling
- **Security Headers**: CSP, HSTS, XSS protection
- **Error Pages**: Custom 401, 403, 404 pages

### 5. Azure Functions Configuration

The `host.json` file configures:
- **Timeout**: 5-minute function timeout
- **Retry Policy**: Exponential backoff
- **Health Monitoring**: Automatic health checks
- **Throttling**: Request rate limiting

## 🚀 Deployment

### Automatic Deployment

The CI/CD pipeline automatically deploys on push to:
- **`main` branch**: Production deployment
- **`develop` branch**: Staging deployment

### Manual Deployment

```bash
# Deploy web app
cd apps/web
npm run build
az staticwebapp deploy --name global-next-web --source .next

# Deploy API
cd apps/api
npm run build
func azure functionapp publish global-next-api
```

## 🔐 Security

### Authentication
- **NextAuth.js**: JWT-based authentication
- **OAuth Providers**: Google, Microsoft
- **RBAC**: Role-based access control
- **Session Management**: Secure session handling

### Security Features
- **Rate Limiting**: Endpoint-specific limits
- **Input Validation**: Zod schema validation
- **Audit Logging**: Comprehensive activity tracking
- **Security Headers**: CSP, HSTS, XSS protection
- **Secrets Management**: Azure Key Vault integration

### Environment Variables
See `apps/api/SECURITY.md` for complete security documentation.

## 📊 Monitoring

### Application Insights
- **Traces**: OpenTelemetry distributed tracing
- **Metrics**: Performance and error tracking
- **Logs**: Structured logging with correlation
- **Alerts**: Automated alerting for issues

### Audit Logs
- **Activity Tracking**: All user actions logged
- **Integrity Verification**: Payload hash validation
- **Compliance**: GDPR and SOC 2 compliance
- **Retention**: Configurable log retention

## 🌐 Internationalization

### Supported Languages
- **English**: Default language
- **Arabic**: RTL support with layout mirroring

### Features
- **Language Switcher**: Dynamic language switching
- **RTL Support**: Complete right-to-left layout
- **Cultural Adaptation**: Arabic-appropriate design
- **Translation Management**: Comprehensive translation system

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Vitest for API testing
- **Integration Tests**: End-to-end API testing
- **Type Safety**: TypeScript strict mode
- **Linting**: ESLint and Prettier

### Running Tests
```bash
# Run all tests
pnpm run test

# Run tests with coverage
pnpm run test:coverage

# Run linting
pnpm run lint

# Run type checking
pnpm run typecheck
```

## 📁 Project Structure

```
global-next/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # Azure Functions backend
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── lib/                 # Shared utilities
│   └── config/              # Configuration management
├── .github/
│   └── workflows/           # GitHub Actions CI/CD
└── docs/                    # Documentation
```

## 🔧 Development

### Local Setup
```bash
# Clone repository
git clone https://github.com/your-username/global-next.git
cd global-next

# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Start development servers
pnpm run dev
```

### Environment Variables
- **API**: See `apps/api/.env.example`
- **Web**: See `apps/web/.env.example`

## 📚 Documentation

- **API Documentation**: `/api/docs` (Swagger/OpenAPI)
- **Security Guide**: `apps/api/SECURITY.md`
- **Deployment Guide**: This README
- **Architecture**: `docs/architecture.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues**: GitHub Issues
- **Documentation**: Project Wiki
- **Security**: security@globalnext.com
- **General**: support@globalnext.com

## 🎯 Roadmap

- [ ] Advanced AI features
- [ ] Real-time collaboration
- [ ] Mobile applications
- [ ] Enterprise features
- [ ] Third-party integrations

---

**Built with ❤️ by the Global Next Team**