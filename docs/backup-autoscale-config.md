# Backup & Autoscale Configuration

## Overview

This document outlines the backup and autoscale configuration for the Global Next Marketing Portal production environment.

## 🗄️ Database Backup Configuration

### Azure Cosmos DB Backup

#### Automated Backup
```bash
# Enable automated backup for Cosmos DB
az cosmosdb update \
  --name global-next-cosmos \
  --resource-group global-next-rg \
  --backup-policy-type Continuous \
  --backup-interval 15 \
  --backup-retention 7
```

#### Backup Retention Policy
- **Continuous Backup**: 7 days retention
- **Point-in-time Recovery**: 15-minute intervals
- **Cross-region Backup**: Enabled for disaster recovery
- **Backup Encryption**: Enabled with customer-managed keys

#### Backup Testing
```bash
# Test backup restoration
az cosmosdb sql database restore \
  --account-name global-next-cosmos \
  --resource-group global-next-rg \
  --database-name global-next-db \
  --restore-timestamp "2024-01-20T10:00:00Z"
```

### Application Data Backup

#### File Storage Backup
- **Azure Blob Storage**: Geo-redundant storage (GRS)
- **Backup Frequency**: Daily incremental backups
- **Retention Period**: 30 days
- **Cross-region Replication**: Enabled

#### Configuration Backup
- **Environment Variables**: Stored in Azure Key Vault
- **Application Settings**: Version controlled
- **Infrastructure**: Terraform state backup

## ⚡ Autoscale Configuration

### Azure Functions Autoscale

#### Consumption Plan Configuration
```json
{
  "functionAppScaleLimit": 200,
  "minimumInstanceCount": 1,
  "maximumInstanceCount": 10,
  "scaleOutRules": [
    {
      "metricName": "Requests",
      "metricThreshold": 100,
      "scaleOutCooldown": "00:05:00",
      "scaleInCooldown": "00:10:00"
    }
  ]
}
```

#### Autoscale Rules
- **CPU Threshold**: 70% for scale-out
- **Memory Threshold**: 80% for scale-out
- **Request Rate**: 100 requests/minute for scale-out
- **Scale-out Cooldown**: 5 minutes
- **Scale-in Cooldown**: 10 minutes

### Azure Static Web Apps Autoscale

#### Performance Tier Configuration
- **Standard Tier**: For production workloads
- **Custom Domain**: Configured with SSL
- **CDN**: Azure CDN for global distribution
- **Caching**: Aggressive caching for static assets

### Cosmos DB Autoscale

#### Request Units (RU) Configuration
```bash
# Configure autoscale for Cosmos DB
az cosmosdb sql container update \
  --account-name global-next-cosmos \
  --resource-group global-next-rg \
  --database-name global-next-db \
  --name organizations \
  --max-throughput 4000 \
  --autoscale-max-throughput 4000
```

#### RU Autoscale Settings
- **Minimum RU**: 400 per container
- **Maximum RU**: 4000 per container
- **Autoscale Increment**: 100 RU
- **Scale-up Threshold**: 80% RU utilization
- **Scale-down Threshold**: 20% RU utilization

## 📊 Performance Monitoring

### Cosmos DB Performance Metrics

#### Key Metrics to Monitor
- **Request Units (RU)**: Current and maximum consumption
- **Latency**: P50, P95, P99 response times
- **Throughput**: Requests per second
- **Storage**: Database and container size
- **Availability**: Uptime percentage

#### Performance Alerts
```json
{
  "alerts": [
    {
      "name": "High RU Consumption",
      "metric": "Request Units",
      "threshold": 80,
      "operator": "GreaterThan",
      "severity": "Warning"
    },
    {
      "name": "High Latency",
      "metric": "Latency",
      "threshold": 100,
      "operator": "GreaterThan",
      "severity": "Critical"
    }
  ]
}
```

### Application Performance Monitoring

#### Azure Application Insights Metrics
- **Response Time**: API endpoint response times
- **Throughput**: Requests per second
- **Error Rate**: Failed request percentage
- **Availability**: Application uptime
- **Dependencies**: External service calls

## 🔧 Composite Indexes

### Cosmos DB Composite Indexes

#### Organizations Container
```json
{
  "indexingPolicy": {
    "compositeIndexes": [
      {
        "path": "/organizationId",
        "order": "ascending"
      },
      {
        "path": "/createdAt",
        "order": "descending"
      }
    ]
  }
}
```

#### Projects Container
```json
{
  "indexingPolicy": {
    "compositeIndexes": [
      {
        "path": "/organizationId",
        "order": "ascending"
      },
      {
        "path": "/status",
        "order": "ascending"
      },
      {
        "path": "/createdAt",
        "order": "descending"
      }
    ]
  }
}
```

#### Work Items Container
```json
{
  "indexingPolicy": {
    "compositeIndexes": [
      {
        "path": "/projectId",
        "order": "ascending"
      },
      {
        "path": "/status",
        "order": "ascending"
      },
      {
        "path": "/priority",
        "order": "ascending"
      },
      {
        "path": "/dueDate",
        "order": "ascending"
      }
    ]
  }
}
```

#### Events Container
```json
{
  "indexingPolicy": {
    "compositeIndexes": [
      {
        "path": "/organizationId",
        "order": "ascending"
      },
      {
        "path": "/timestamp",
        "order": "descending"
      },
      {
        "path": "/type",
        "order": "ascending"
      }
    ]
  }
}
```

#### Messages Container
```json
{
  "indexingPolicy": {
    "compositeIndexes": [
      {
        "path": "/projectId",
        "order": "ascending"
      },
      {
        "path": "/createdAt",
        "order": "descending"
      },
      {
        "path": "/author.id",
        "order": "ascending"
      }
    ]
  }
}
```

### Index Performance Optimization

#### Query Performance
- **Point Queries**: Single partition key lookups
- **Range Queries**: Efficient range scans
- **Sort Queries**: Optimized sorting with composite indexes
- **Filter Queries**: Reduced RU consumption

#### Index Maintenance
- **Index Rebuild**: Automatic during maintenance windows
- **Index Monitoring**: Performance impact tracking
- **Index Optimization**: Regular performance reviews

## 🚨 Disaster Recovery

### Backup Testing Procedures

#### Monthly Backup Tests
1. **Database Restore Test**
   - Restore database to test environment
   - Verify data integrity
   - Test application functionality
   - Document test results

2. **File Storage Restore Test**
   - Restore file storage from backup
   - Verify file integrity
   - Test file access
   - Document test results

3. **Configuration Restore Test**
   - Restore configuration from backup
   - Verify application startup
   - Test functionality
   - Document test results

#### Disaster Recovery Plan
1. **RTO (Recovery Time Objective)**: 4 hours
2. **RPO (Recovery Point Objective)**: 15 minutes
3. **Recovery Procedures**: Documented and tested
4. **Communication Plan**: Stakeholder notification procedures

### Cross-Region Replication

#### Primary Region: East US
- **Cosmos DB**: Multi-region write enabled
- **Storage**: Geo-redundant storage
- **Functions**: Primary deployment
- **Static Web Apps**: Primary deployment

#### Secondary Region: West US
- **Cosmos DB**: Read replica
- **Storage**: Geo-redundant storage
- **Functions**: Standby deployment
- **Static Web Apps**: Standby deployment

## 📈 Capacity Planning

### Resource Scaling

#### Cosmos DB Scaling
- **Current Capacity**: 400 RU per container
- **Peak Capacity**: 4000 RU per container
- **Growth Projection**: 20% monthly
- **Scaling Strategy**: Autoscale with manual override

#### Function App Scaling
- **Current Instances**: 1-2 instances
- **Peak Instances**: 10 instances
- **Scaling Triggers**: CPU, Memory, Request Rate
- **Scaling Strategy**: Consumption plan with autoscale

#### Storage Scaling
- **Current Usage**: 10GB
- **Growth Projection**: 5GB monthly
- **Storage Tier**: Standard LRS
- **Scaling Strategy**: Automatic with alerts

### Cost Optimization

#### Resource Optimization
- **Right-sizing**: Regular capacity reviews
- **Reserved Capacity**: Cosmos DB reserved capacity
- **Spot Instances**: Non-critical workloads
- **Cost Monitoring**: Monthly cost reviews

#### Performance Optimization
- **Query Optimization**: Regular query performance reviews
- **Index Optimization**: Composite index tuning
- **Caching**: Application-level caching
- **CDN**: Static asset optimization

## ✅ Backup & Autoscale Sign-off

### Review Checklist
- [ ] **Backup Configuration** - Automated backups configured
- [ ] **Backup Testing** - Backup restoration tested
- [ ] **Autoscale Configuration** - Autoscale rules configured
- [ ] **Performance Monitoring** - Monitoring and alerts configured
- [ ] **Composite Indexes** - Database indexes optimized
- [ ] **Disaster Recovery** - DR procedures documented and tested
- [ ] **Capacity Planning** - Resource scaling planned
- [ ] **Cost Optimization** - Cost monitoring configured

### Sign-off
- [ ] **Backup Configuration Approved** - Backup strategy approved
- [ ] **Autoscale Configuration Approved** - Autoscale rules approved
- [ ] **Performance Optimization Approved** - Indexes and monitoring approved
- [ ] **Disaster Recovery Approved** - DR procedures approved
- [ ] **Go-Live Approval** - Infrastructure team approves go-live

---

**Infrastructure Lead:** _________________ **Date:** _________________

**Database Administrator:** _________________ **Date:** _________________

**CTO Approval:** _________________ **Date:** _________________
