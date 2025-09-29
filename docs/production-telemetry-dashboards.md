# Production Telemetry Dashboards

## Overview

This document outlines the production telemetry dashboards and alert rules for the Global Next Marketing Portal using Azure Application Insights.

## 📊 Dashboard Configuration

### 1. Application Performance Dashboard

#### Key Metrics
- **Response Time**: P50, P95, P99 response times
- **Throughput**: Requests per second
- **Error Rate**: Failed request percentage
- **Availability**: Application uptime percentage
- **Dependencies**: External service response times

#### Dashboard Components
```json
{
  "dashboard": {
    "name": "Application Performance",
    "widgets": [
      {
        "type": "LineChart",
        "title": "Response Time Trends",
        "query": "requests | summarize avg(duration) by bin(timestamp, 5m)",
        "timeRange": "24h"
      },
      {
        "type": "BarChart",
        "title": "Request Volume",
        "query": "requests | summarize count() by bin(timestamp, 1h)",
        "timeRange": "24h"
      },
      {
        "type": "PieChart",
        "title": "Error Distribution",
        "query": "requests | where success == false | summarize count() by resultCode",
        "timeRange": "24h"
      }
    ]
  }
}
```

### 2. Database Performance Dashboard

#### Key Metrics
- **Request Units (RU)**: Current and maximum consumption
- **Latency**: Database response times
- **Throughput**: Database requests per second
- **Storage**: Database size and growth
- **Availability**: Database uptime

#### Dashboard Components
```json
{
  "dashboard": {
    "name": "Database Performance",
    "widgets": [
      {
        "type": "LineChart",
        "title": "RU Consumption",
        "query": "customMetrics | where name == 'CosmosDB.RequestUnits' | summarize avg(value) by bin(timestamp, 5m)",
        "timeRange": "24h"
      },
      {
        "type": "LineChart",
        "title": "Database Latency",
        "query": "dependencies | where type == 'Azure Cosmos DB' | summarize avg(duration) by bin(timestamp, 5m)",
        "timeRange": "24h"
      },
      {
        "type": "BarChart",
        "title": "Database Operations",
        "query": "dependencies | where type == 'Azure Cosmos DB' | summarize count() by name",
        "timeRange": "24h"
      }
    ]
  }
}
```

### 3. Security Dashboard

#### Key Metrics
- **Authentication Events**: Login attempts and failures
- **Authorization Events**: Access control violations
- **Rate Limiting**: Rate limit violations
- **Audit Events**: Security-related events
- **Threat Detection**: Suspicious activity patterns

#### Dashboard Components
```json
{
  "dashboard": {
    "name": "Security Monitoring",
    "widgets": [
      {
        "type": "LineChart",
        "title": "Authentication Events",
        "query": "customEvents | where name == 'Authentication' | summarize count() by bin(timestamp, 1h)",
        "timeRange": "24h"
      },
      {
        "type": "BarChart",
        "title": "Failed Login Attempts",
        "query": "customEvents | where name == 'Authentication' and properties.status == 'failed' | summarize count() by properties.userId",
        "timeRange": "24h"
      },
      {
        "type": "LineChart",
        "title": "Rate Limit Violations",
        "query": "customEvents | where name == 'RateLimitExceeded' | summarize count() by bin(timestamp, 1h)",
        "timeRange": "24h"
      }
    ]
  }
}
```

### 4. Business Metrics Dashboard

#### Key Metrics
- **User Activity**: Active users and sessions
- **Feature Usage**: Feature adoption and usage
- **Business KPIs**: Revenue, conversions, engagement
- **Performance Metrics**: User experience metrics
- **Growth Metrics**: User growth and retention

#### Dashboard Components
```json
{
  "dashboard": {
    "name": "Business Metrics",
    "widgets": [
      {
        "type": "LineChart",
        "title": "Active Users",
        "query": "pageViews | summarize dcount(user_Id) by bin(timestamp, 1h)",
        "timeRange": "7d"
      },
      {
        "type": "BarChart",
        "title": "Feature Usage",
        "query": "customEvents | where name == 'FeatureUsed' | summarize count() by properties.featureName",
        "timeRange": "7d"
      },
      {
        "type": "LineChart",
        "title": "User Engagement",
        "query": "pageViews | summarize count() by bin(timestamp, 1h)",
        "timeRange": "7d"
      }
    ]
  }
}
```

## 🚨 Alert Rules Configuration

### 1. Critical Alerts

#### Application Down Alert
```json
{
  "alert": {
    "name": "Application Down",
    "description": "Application is not responding",
    "severity": "Critical",
    "condition": {
      "query": "requests | where timestamp > ago(5m) | summarize count()",
      "threshold": 0,
      "operator": "LessThan"
    },
    "actions": [
      {
        "type": "Email",
        "recipients": ["oncall@globalnext.com"]
      },
      {
        "type": "SMS",
        "recipients": ["+1234567890"]
      }
    ]
  }
}
```

#### High Error Rate Alert
```json
{
  "alert": {
    "name": "High Error Rate",
    "description": "Error rate is above threshold",
    "severity": "Critical",
    "condition": {
      "query": "requests | where timestamp > ago(5m) | summarize errorRate = countif(success == false) / count()",
      "threshold": 0.05,
      "operator": "GreaterThan"
    },
    "actions": [
      {
        "type": "Email",
        "recipients": ["oncall@globalnext.com"]
      }
    ]
  }
}
```

#### Database Performance Alert
```json
{
  "alert": {
    "name": "Database High Latency",
    "description": "Database response time is high",
    "severity": "Warning",
    "condition": {
      "query": "dependencies | where type == 'Azure Cosmos DB' and timestamp > ago(5m) | summarize avg(duration)",
      "threshold": 1000,
      "operator": "GreaterThan"
    },
    "actions": [
      {
        "type": "Email",
        "recipients": ["dba@globalnext.com"]
      }
    ]
  }
}
```

### 2. Warning Alerts

#### High Response Time Alert
```json
{
  "alert": {
    "name": "High Response Time",
    "description": "Application response time is high",
    "severity": "Warning",
    "condition": {
      "query": "requests | where timestamp > ago(5m) | summarize avg(duration)",
      "threshold": 2000,
      "operator": "GreaterThan"
    },
    "actions": [
      {
        "type": "Email",
        "recipients": ["devops@globalnext.com"]
      }
    ]
  }
}
```

#### High RU Consumption Alert
```json
{
  "alert": {
    "name": "High RU Consumption",
    "description": "Cosmos DB RU consumption is high",
    "severity": "Warning",
    "condition": {
      "query": "customMetrics | where name == 'CosmosDB.RequestUnits' and timestamp > ago(5m) | summarize avg(value)",
      "threshold": 3200,
      "operator": "GreaterThan"
    },
    "actions": [
      {
        "type": "Email",
        "recipients": ["dba@globalnext.com"]
      }
    ]
  }
}
```

#### Rate Limit Violations Alert
```json
{
  "alert": {
    "name": "Rate Limit Violations",
    "description": "High number of rate limit violations",
    "severity": "Warning",
    "condition": {
      "query": "customEvents | where name == 'RateLimitExceeded' and timestamp > ago(5m) | summarize count()",
      "threshold": 100,
      "operator": "GreaterThan"
    },
    "actions": [
      {
        "type": "Email",
        "recipients": ["security@globalnext.com"]
      }
    ]
  }
}
```

### 3. Information Alerts

#### User Activity Alert
```json
{
  "alert": {
    "name": "Unusual User Activity",
    "description": "Unusual pattern in user activity",
    "severity": "Information",
    "condition": {
      "query": "pageViews | where timestamp > ago(1h) | summarize count()",
      "threshold": 1000,
      "operator": "GreaterThan"
    },
    "actions": [
      {
        "type": "Email",
        "recipients": ["analytics@globalnext.com"]
      }
    ]
  }
}
```

#### Feature Usage Alert
```json
{
  "alert": {
    "name": "Feature Usage Spike",
    "description": "Unusual spike in feature usage",
    "severity": "Information",
    "condition": {
      "query": "customEvents | where name == 'FeatureUsed' and timestamp > ago(1h) | summarize count()",
      "threshold": 500,
      "operator": "GreaterThan"
    },
    "actions": [
      {
        "type": "Email",
        "recipients": ["product@globalnext.com"]
      }
    ]
  }
}
```

## 📈 Custom Metrics

### Application Metrics

#### Performance Metrics
```typescript
// Response time tracking
telemetryClient.trackMetric({
  name: 'ResponseTime',
  value: responseTime,
  properties: {
    endpoint: '/api/projects',
    method: 'GET',
    statusCode: 200
  }
});

// Throughput tracking
telemetryClient.trackMetric({
  name: 'Throughput',
  value: requestsPerSecond,
  properties: {
    endpoint: '/api/projects',
    timeWindow: '1m'
  }
});
```

#### Business Metrics
```typescript
// User activity tracking
telemetryClient.trackEvent({
  name: 'UserActivity',
  properties: {
    userId: 'user_123',
    action: 'login',
    timestamp: new Date().toISOString()
  }
});

// Feature usage tracking
telemetryClient.trackEvent({
  name: 'FeatureUsed',
  properties: {
    userId: 'user_123',
    featureName: 'project_creation',
    projectId: 'proj_456'
  }
});
```

#### Security Metrics
```typescript
// Authentication tracking
telemetryClient.trackEvent({
  name: 'Authentication',
  properties: {
    userId: 'user_123',
    status: 'success',
    method: 'oauth',
    provider: 'google'
  }
});

// Rate limiting tracking
telemetryClient.trackEvent({
  name: 'RateLimitExceeded',
  properties: {
    userId: 'user_123',
    endpoint: '/api/projects',
    limit: 100,
    current: 150
  }
});
```

### Database Metrics

#### Cosmos DB Metrics
```typescript
// RU consumption tracking
telemetryClient.trackMetric({
  name: 'CosmosDB.RequestUnits',
  value: ruConsumption,
  properties: {
    container: 'projects',
    operation: 'query',
    partitionKey: 'org_123'
  }
});

// Query performance tracking
telemetryClient.trackDependency({
  name: 'CosmosDB Query',
  data: 'SELECT * FROM projects WHERE organizationId = @orgId',
  duration: queryDuration,
  success: true,
  properties: {
    container: 'projects',
    queryType: 'select',
    resultCount: 25
  }
});
```

## 🔧 Dashboard Implementation

### Azure Application Insights Configuration

#### Custom Dashboard Creation
```bash
# Create custom dashboard
az monitor dashboard create \
  --name "Global Next Production Dashboard" \
  --resource-group global-next-rg \
  --dashboard-file dashboard.json
```

#### Alert Rule Creation
```bash
# Create alert rule
az monitor metrics alert create \
  --name "High Error Rate Alert" \
  --resource-group global-next-rg \
  --scopes "/subscriptions/{subscription-id}/resourceGroups/global-next-rg/providers/Microsoft.Insights/components/global-next-insights" \
  --condition "avg requests/success == false > 0.05" \
  --description "Alert when error rate exceeds 5%" \
  --severity 1
```

### Dashboard Access Control

#### Role-Based Access
- **Admin**: Full access to all dashboards
- **DevOps**: Access to performance and infrastructure dashboards
- **Security**: Access to security and audit dashboards
- **Business**: Access to business metrics dashboards

#### Dashboard Sharing
- **Internal Teams**: Direct access to relevant dashboards
- **External Stakeholders**: Read-only access to business metrics
- **Auditors**: Access to security and compliance dashboards

## ✅ Telemetry Configuration Sign-off

### Review Checklist
- [ ] **Dashboard Configuration** - All dashboards configured and tested
- [ ] **Alert Rules** - Critical, warning, and information alerts configured
- [ ] **Custom Metrics** - Application and business metrics implemented
- [ ] **Access Control** - Role-based access configured
- [ ] **Alert Testing** - All alerts tested and verified
- [ ] **Dashboard Performance** - Dashboards load within acceptable time
- [ ] **Data Retention** - Appropriate data retention configured
- [ ] **Cost Optimization** - Telemetry costs optimized

### Sign-off
- [ ] **Telemetry Configuration Approved** - All dashboards and alerts approved
- [ ] **Alert Testing Completed** - All alerts tested and working
- [ ] **Access Control Approved** - Role-based access configured
- [ ] **Go-Live Approval** - Monitoring team approves go-live

---

**Monitoring Lead:** _________________ **Date:** _________________

**DevOps Lead:** _________________ **Date:** _________________

**CTO Approval:** _________________ **Date:** _________________
