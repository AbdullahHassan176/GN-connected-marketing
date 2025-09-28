# Global Next - AI-Powered Marketing Portal

A comprehensive full-stack marketing consulting platform built with Next.js, Azure Functions, and Cosmos DB. This portal provides AI-driven marketing solutions for luxury hospitality and premium brands.

## 🚀 Features

### Client Dashboard
- **Personalized Welcome**: AI-generated campaign taglines and progress tracking
- **Campaign Stage Tracker**: Visual timeline from Strategy → Content → Distribution → Ads → Insights
- **AI Storyboard**: Campaign narrative as interactive chapters
- **KPI Dashboard**: CTR, ROI, engagement, sentiment, conversions with real-time charts
- **Transparency Panel**: Shows which AI tools are being used
- **Export Reports**: PDF/Excel generation for client reports

### Internal Team Dashboard
- **AI Tool Inventory**: Status, access, usage logs for all AI tools
- **Campaign Manager**: Briefs, workflows, approval processes
- **AI Task Allocation**: Smart suggestions for team workload
- **Automation Hub**: Zapier/n8n integrations
- **Productivity View**: Team performance and workload analytics

### Campaign Rooms
- **Real-time Chat**: Team collaboration with file sharing
- **AI Summaries**: Weekly automated updates
- **Approval Workflows**: Streamlined decision processes
- **Visual Journey Maps**: Touchpoint tracking

### Interactive Analytics
- **KPI Comparisons**: Actual vs forecast performance
- **Sentiment Heatmaps**: Social listening insights
- **A/B Test Visualizers**: Experiment tracking
- **AI Recommendations**: Optimization suggestions

### Brand Journey Storytelling
- **Timeline Visualization**: Brand evolution milestones
- **Narrative Chapters**: AI-drafted content with human editing
- **Consultant Notes**: Embedded insights and recommendations

## 🏗️ Architecture

### Frontend
- **Next.js 14** with App Router
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **next-intl** for internationalization (English + Arabic)
- **next-themes** for dark/light mode

### Backend
- **Azure Functions** (Node.js 20, TypeScript)
- **Azure Cosmos DB** (Core SQL API)
- **NextAuth.js** for authentication
- **Role-based Access Control** (RBAC)

### Database Schema
- **Organizations**: Multi-tenant organization management
- **Users**: Role-based user management
- **Projects**: Campaign and project tracking
- **Work Items**: Task management with Kanban boards
- **Events**: Audit logging and activity tracking
- **Assets**: File metadata and blob storage
- **Insights**: Analytics, forecasts, and recommendations
- **Messages**: Campaign room communications
- **Approvals**: Workflow management
- **Tool Inventory**: AI tool management

## 🛠️ Tech Stack

### Core Technologies
- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Azure Functions, Node.js 20
- **Database**: Azure Cosmos DB (Core SQL API)
- **Authentication**: NextAuth.js with JWT
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **Internationalization**: next-intl
- **State Management**: React Context + Hooks

### AI & Analytics
- **AI Tools**: Jasper, Midjourney, SEMRush, HubSpot AI
- **Analytics**: Real-time KPI tracking
- **Sentiment Analysis**: Social media monitoring
- **Predictive Analytics**: ROI forecasting
- **A/B Testing**: Experiment management

### DevOps & Deployment
- **CI/CD**: GitHub Actions
- **Hosting**: Azure Static Web Apps
- **Database**: Azure Cosmos DB
- **Monitoring**: Application Insights
- **File Storage**: Azure Blob Storage

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Azure Cosmos DB account
- Azure Functions Core Tools (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd global-next-marketing-portal
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Initialize the database**
   ```bash
   pnpm db:seed
   ```

5. **Start development servers**
   ```bash
   pnpm dev
   ```

This will start:
- Frontend: http://localhost:3000
- API: http://localhost:7071

### Environment Variables

#### Required
- `COSMOS_ENDPOINT`: Azure Cosmos DB endpoint
- `COSMOS_KEY`: Cosmos DB primary key
- `COSMOS_DB`: Database name (default: globalnext)
- `NEXTAUTH_SECRET`: Secret key for JWT signing
- `NEXTAUTH_URL`: Application URL

#### Optional (OAuth)
- `OAUTH_GOOGLE_ID`: Google OAuth client ID
- `OAUTH_GOOGLE_SECRET`: Google OAuth client secret
- `OAUTH_MICROSOFT_ID`: Microsoft OAuth client ID
- `OAUTH_MICROSOFT_SECRET`: Microsoft OAuth client secret

#### Azure Services
- `APPINSIGHTS_CONNECTION_STRING`: Application Insights
- `BLOB_ACCOUNT_NAME`: Azure Blob Storage account
- `BLOB_SAS_URL`: Blob Storage SAS URL

## 📊 Database Setup

### Cosmos DB Configuration

1. **Create Cosmos DB Account**
   - Choose Core (SQL) API
   - Select appropriate region
   - Configure throughput (start with autoscale)

2. **Create Database**
   ```sql
   Database: globalnext
   ```

3. **Create Containers**
   ```sql
   -- Organizations (partition key: /orgId)
   -- Users (partition key: /orgId)
   -- Projects (partition key: /orgId)
   -- Work Items (partition key: /projectId)
   -- Events (partition key: /projectId)
   -- Assets (partition key: /projectId)
   -- Insights (partition key: /projectId)
   -- Messages (partition key: /projectId)
   -- Approvals (partition key: /projectId)
   -- Tool Inventory (partition key: /orgId)
   ```

4. **Seed Demo Data**
   ```bash
   pnpm db:seed
   ```

## 🔐 Authentication & RBAC

### User Roles
- **Owner**: Full system access
- **Admin**: Organization management
- **Manager**: Project and team management
- **Analyst**: Data analysis and reporting
- **Client**: Read-only access to assigned projects

### Role Permissions
- **Organization Level**: Manage users, settings, billing
- **Project Level**: Campaign management, team collaboration
- **Resource Level**: Specific asset and data access

## 🌐 Internationalization

### Supported Languages
- **English** (en): Default language
- **Arabic** (ar): RTL support with proper text direction

### Adding New Languages
1. Create translation files in `apps/web/src/messages/`
2. Update `apps/web/src/i18n.ts`
3. Add language selector in UI

## 📈 Analytics & Monitoring

### Application Insights
- Performance monitoring
- Error tracking
- User analytics
- Custom telemetry

### Health Checks
- Database connectivity
- API endpoint status
- Service dependencies

## 🚀 Deployment

### Azure Static Web Apps
1. **Connect GitHub repository**
2. **Configure build settings**
   - App location: `apps/web`
   - API location: `apps/api`
   - Output location: `.next`

3. **Set environment variables**
   - Add all required environment variables
   - Configure OAuth providers
   - Set up Cosmos DB connection

### CI/CD Pipeline
- **Build**: TypeScript compilation, linting, testing
- **Test**: Unit tests, integration tests
- **Deploy**: Automatic deployment to Azure
- **Monitor**: Health checks and performance monitoring

## 🧪 Testing

### Running Tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Type checking
pnpm type-check

# Linting
pnpm lint
```

### Test Coverage
- Unit tests for utilities and components
- Integration tests for API endpoints
- E2E tests for critical user flows

## 📚 API Documentation

### Base URL
- Development: `http://localhost:7071/api/v1`
- Production: `https://your-app.azurestaticapps.net/api/v1`

### Authentication
All API requests require a valid JWT token:
```bash
Authorization: Bearer <jwt-token>
```

### Endpoints
- `GET /health` - Health check
- `POST /auth/session/validate` - Validate session
- `GET /orgs/:orgId` - Get organization
- `GET /orgs/:orgId/projects` - List projects
- `GET /projects/:projectId` - Get project details
- `GET /projects/:projectId/kpis` - Get KPI data
- `GET /projects/:projectId/insights` - Get analytics insights
- `GET /projects/:projectId/work-items` - Get work items
- `GET /projects/:projectId/messages` - Get messages
- `GET /orgs/:orgId/tools` - Get AI tools inventory

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits for changelog

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

### Documentation
- [Setup Guide](./docs/setup.md)
- [API Reference](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Troubleshooting](./docs/troubleshooting.md)

### Getting Help
- Create an issue for bugs
- Use discussions for questions
- Contact the development team

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core platform setup
- ✅ Authentication & RBAC
- ✅ Basic dashboard functionality
- ✅ Campaign management
- ✅ AI tools integration

### Phase 2 (Next)
- 🔄 Advanced analytics
- 🔄 AI Copilot integration
- 🔄 ROI Predictor
- 🔄 Marketplace for AI tools
- 🔄 Mobile application

### Phase 3 (Future)
- 📋 Tokenized rewards system
- 📋 Advanced automation
- 📋 Machine learning models
- 📋 Global expansion features

---

**Built with ❤️ by the Global Next team**