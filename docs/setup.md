# Global Next - Setup Guide

This guide will help you set up the Global Next Marketing Portal for local development and production deployment.

## 📋 Prerequisites

### Required Software
- **Node.js 18+**: [Download here](https://nodejs.org/)
- **pnpm**: Package manager (install with `npm install -g pnpm`)
- **Git**: Version control
- **Azure CLI**: For Azure services management

### Azure Services
- **Azure Cosmos DB**: Database service
- **Azure Static Web Apps**: Hosting platform
- **Azure Functions**: Serverless API
- **Azure Blob Storage**: File storage (optional)
- **Application Insights**: Monitoring (optional)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd global-next-marketing-portal

# Install dependencies
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env.local

# Edit environment variables
nano .env.local
```

### 3. Database Setup

#### Option A: Azure Cosmos DB (Production)
1. Create Azure Cosmos DB account
2. Create database: `globalnext`
3. Create containers with partition keys (see schema below)
4. Get connection string and keys

#### Option B: Cosmos DB Emulator (Local Development)
```bash
# Install Cosmos DB Emulator
# Download from: https://aka.ms/cosmosdb-emulator

# Start emulator
# Default endpoint: https://localhost:8081
# Default key: C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVqH8jWj4Q8b8+7U1rQ===
```

### 4. Initialize Database

```bash
# Seed with demo data
pnpm db:seed

# Reset database (if needed)
pnpm db:reset
```

### 5. Start Development

```bash
# Start all services
pnpm dev

# Or start individually
pnpm --filter @repo/web dev    # Frontend: http://localhost:3000
pnpm --filter @repo/api dev    # API: http://localhost:7071
```

## 🔧 Detailed Setup

### Environment Variables

#### Required Variables
```bash
# Database
COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOS_KEY=your-primary-key
COSMOS_DB=globalnext

# Authentication
NEXTAUTH_SECRET=your-secret-key-32-chars-minimum
NEXTAUTH_URL=http://localhost:3000
```

#### OAuth Providers (Optional)
```bash
# Google OAuth
OAUTH_GOOGLE_ID=your-google-client-id
OAUTH_GOOGLE_SECRET=your-google-client-secret

# Microsoft OAuth
OAUTH_MICROSOFT_ID=your-microsoft-client-id
OAUTH_MICROSOFT_SECRET=your-microsoft-client-secret
```

#### Azure Services (Optional)
```bash
# Application Insights
APPINSIGHTS_CONNECTION_STRING=your-connection-string

# Blob Storage
BLOB_ACCOUNT_NAME=your-storage-account
BLOB_SAS_URL=your-sas-url
```

### Database Schema

#### Cosmos DB Containers

| Container | Partition Key | Purpose |
|-----------|---------------|---------|
| `organizations` | `/orgId` | Multi-tenant organizations |
| `users` | `/orgId` | User management |
| `projects` | `/orgId` | Campaigns and projects |
| `work_items` | `/projectId` | Task management |
| `events` | `/projectId` | Audit logging |
| `assets` | `/projectId` | File metadata |
| `insights` | `/projectId` | Analytics data |
| `messages` | `/projectId` | Campaign communications |
| `approvals` | `/projectId` | Workflow management |
| `tool_inventory` | `/orgId` | AI tools management |

#### Indexing Policy
```json
{
  "indexingMode": "consistent",
  "automatic": true,
  "includedPaths": [
    {
      "path": "/*"
    }
  ],
  "excludedPaths": [
    {
      "path": "/metadata/*"
    }
  ]
}
```

### OAuth Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.azurestaticapps.net/api/auth/callback/google`

#### Microsoft OAuth
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to Azure Active Directory
3. App registrations → New registration
4. Configure redirect URIs:
   - `http://localhost:3000/api/auth/callback/microsoft`
   - `https://your-domain.azurestaticapps.net/api/auth/callback/microsoft`

## 🏗️ Development Workflow

### Project Structure
```
global-next-marketing-portal/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                # Azure Functions API
├── packages/
│   ├── lib/                # Shared utilities
│   ├── ui/                 # UI components
│   └── config/             # Shared configs
├── docs/                   # Documentation
└── .github/workflows/      # CI/CD
```

### Available Scripts

```bash
# Development
pnpm dev                    # Start all services
pnpm build                  # Build all packages
pnpm test                   # Run tests
pnpm lint                   # Lint code
pnpm type-check            # TypeScript checking

# Database
pnpm db:seed               # Seed demo data
pnpm db:reset              # Reset database

# Individual packages
pnpm --filter @repo/web dev
pnpm --filter @repo/api dev
pnpm --filter @repo/lib build
```

### Code Organization

#### Frontend (apps/web)
- **Pages**: Next.js App Router pages
- **Components**: Reusable UI components
- **Lib**: Client-side utilities
- **Types**: TypeScript definitions
- **Messages**: Internationalization files

#### Backend (apps/api)
- **Functions**: Azure Functions handlers
- **Middleware**: Authentication, validation
- **Types**: API type definitions
- **Utils**: Server-side utilities

#### Shared (packages/)
- **lib**: Database, auth, validation
- **ui**: shadcn/ui components
- **config**: ESLint, TypeScript, Tailwind

## 🧪 Testing

### Running Tests
```bash
# Unit tests
pnpm test

# E2E tests (with Playwright)
pnpm test:e2e

# Type checking
pnpm type-check

# Linting
pnpm lint
```

### Test Data
The seed script creates:
- Demo organization: "Global Next Consulting"
- Users: admin, manager, client
- Sample project: "Premium Hotels Group - Q1 2024"
- Work items, messages, insights
- AI tools inventory

## 🐛 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check Cosmos DB connection
curl http://localhost:7071/api/v1/health

# Verify environment variables
echo $COSMOS_ENDPOINT
echo $COSMOS_KEY
```

#### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check OAuth provider configuration
- Ensure redirect URIs are correct

#### Build Issues
```bash
# Clear caches
pnpm clean
rm -rf node_modules
pnpm install

# Check TypeScript
pnpm type-check
```

#### Port Conflicts
```bash
# Check if ports are in use
lsof -i :3000  # Frontend
lsof -i :7071  # API

# Kill processes if needed
kill -9 <PID>
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* pnpm dev

# Azure Functions debug
func start --verbose
```

## 📚 Additional Resources

### Documentation
- [API Reference](./api.md)
- [Deployment Guide](./deployment.md)
- [Troubleshooting](./troubleshooting.md)

### External Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

### Support
- Create an issue for bugs
- Use discussions for questions
- Contact the development team

---

**Happy coding! 🚀**
