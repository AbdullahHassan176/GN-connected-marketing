# Security Documentation

## Overview

This document outlines the security measures implemented in the Global Next Marketing Platform API.

## Security Features

### 1. OpenTelemetry Tracing

- **Purpose**: Monitor API performance and detect anomalies
- **Implementation**: Azure Application Insights integration
- **Coverage**: All API routes with custom spans and attributes

```typescript
import { createApiSpan, addSpanAttributes } from '../telemetry/tracing';

const span = createApiSpan('operation_name', {
  'endpoint.type': 'mutating',
  'http.method': 'POST'
});
```

### 2. Audit Logging

- **Purpose**: Track all mutating actions for compliance and security
- **Implementation**: Comprehensive audit events with actor tracking
- **Features**:
  - Actor identification (user, system, API)
  - Payload integrity verification (SHA-256 hash)
  - Result tracking (success, failure, error)
  - Metadata capture (duration, response size, etc.)

```typescript
await auditService.createEvent(
  actor,
  'POST /api/projects',
  'project',
  projectId,
  organizationId,
  projectId,
  payload,
  'success'
);
```

### 3. Rate Limiting

- **Purpose**: Prevent abuse and DoS attacks
- **Implementation**: Configurable rate limits by endpoint type
- **Limits**:
  - Auth endpoints: 10 requests/15 minutes
  - Mutating endpoints: 50 requests/15 minutes
  - Read-only endpoints: 200 requests/15 minutes
  - Webhook endpoints: 5 requests/minute

```typescript
const rateLimitResult = await rateLimitService.checkRateLimit(
  clientId,
  'auth',
  { ip, userAgent, endpoint }
);
```

### 4. Input Validation

- **Purpose**: Prevent injection attacks and data corruption
- **Implementation**: Zod schemas for all inputs
- **Coverage**: Request bodies, query parameters, headers

```typescript
const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  organizationId: z.string().uuid()
});
```

### 5. Security Headers

- **Purpose**: Prevent common web vulnerabilities
- **Implementation**: Comprehensive security headers
- **Headers**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `Content-Security-Policy: default-src 'self'`

### 6. Secrets Management

- **Purpose**: Secure storage and rotation of sensitive data
- **Implementation**: Environment variables with Azure Key Vault support
- **Secrets**:
  - Database credentials
  - Authentication secrets
  - Webhook secrets
  - API keys

## Environment Variables

### Required Variables

```bash
# Database
COSMOS_DB_ENDPOINT=https://your-cosmosdb-account.documents.azure.com:443/
COSMOS_DB_KEY=your-cosmosdb-primary-key
COSMOS_DB_DATABASE_ID=global-next-db

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret-key-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# Monitoring
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=your-key;IngestionEndpoint=https://your-region.in.applicationinsights.azure.com/

# Security
WEBHOOK_SECRET=your-webhook-secret-key-minimum-32-characters
```

### Optional Variables

```bash
# Rate Limiting
RATE_LIMIT_REDIS_URL=redis://localhost:6379

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com

# Azure Key Vault
AZURE_KEY_VAULT_URL=https://your-keyvault.vault.azure.net/
AZURE_CLIENT_ID=your-azure-client-id
AZURE_CLIENT_SECRET=your-azure-client-secret
AZURE_TENANT_ID=your-azure-tenant-id
```

## Azure Key Vault Integration

### Setup

1. Create Azure Key Vault instance
2. Configure access policies or RBAC
3. Set environment variables
4. Deploy with managed identity

### Usage

```typescript
import { keyVaultService } from '../config/secrets';

// Check if Key Vault is configured
if (keyVaultService.isConfigured()) {
  const secret = await keyVaultService.getSecret('COSMOS_DB_KEY');
}
```

### Key Vault Secrets

Store the following secrets in Azure Key Vault:

- `COSMOS-DB-KEY`
- `NEXTAUTH-SECRET`
- `GOOGLE-CLIENT-SECRET`
- `MICROSOFT-CLIENT-SECRET`
- `WEBHOOK-SECRET`

## Security Best Practices

### 1. Environment Variables

- Use strong, unique secrets
- Rotate secrets regularly
- Never commit secrets to version control
- Use Azure Key Vault for production

### 2. Rate Limiting

- Monitor rate limit violations
- Adjust limits based on usage patterns
- Implement progressive penalties
- Log suspicious activity

### 3. Audit Logging

- Review audit logs regularly
- Set up alerts for suspicious activity
- Implement log retention policies
- Monitor for data integrity violations

### 4. Input Validation

- Validate all inputs at API boundaries
- Use strict type checking
- Implement length limits
- Sanitize user inputs

### 5. Security Headers

- Test security headers with security scanners
- Keep CSP policies up to date
- Monitor for header bypasses
- Implement HSTS for HTTPS

## Monitoring and Alerting

### Application Insights

- **Traces**: API performance and errors
- **Metrics**: Rate limit violations, audit events
- **Logs**: Security events and errors
- **Alerts**: Suspicious activity patterns

### Audit Logs

- **Access**: Who accessed what and when
- **Changes**: What was modified and by whom
- **Failures**: Authentication and authorization failures
- **Integrity**: Payload hash verification

### Rate Limiting

- **Violations**: Track rate limit breaches
- **Patterns**: Identify abuse patterns
- **Adjustments**: Dynamic limit adjustments
- **Blocking**: Temporary and permanent blocks

## Compliance

### Data Protection

- **Encryption**: Data encrypted in transit and at rest
- **Access Control**: Role-based access control (RBAC)
- **Audit Trail**: Complete audit trail of all actions
- **Data Retention**: Configurable retention policies

### Security Standards

- **OWASP**: OWASP Top 10 compliance
- **GDPR**: Data protection and privacy
- **SOC 2**: Security and availability controls
- **ISO 27001**: Information security management

## Incident Response

### Security Incidents

1. **Detection**: Automated monitoring and alerting
2. **Assessment**: Impact and severity evaluation
3. **Containment**: Immediate threat mitigation
4. **Investigation**: Root cause analysis
5. **Recovery**: System restoration and hardening
6. **Documentation**: Incident report and lessons learned

### Emergency Procedures

- **Rate Limit Override**: Emergency access procedures
- **Audit Log Access**: Security team access
- **Secret Rotation**: Emergency secret rotation
- **System Shutdown**: Emergency shutdown procedures

## Testing

### Security Testing

- **Penetration Testing**: Regular security assessments
- **Vulnerability Scanning**: Automated security scanning
- **Code Review**: Security-focused code reviews
- **Threat Modeling**: Regular threat model updates

### Compliance Testing

- **Audit Log Verification**: Ensure all actions are logged
- **Rate Limit Testing**: Verify rate limiting effectiveness
- **Input Validation**: Test all input validation
- **Security Headers**: Verify security header implementation

## Contact

For security-related questions or to report vulnerabilities:

- **Security Team**: security@globalnext.com
- **Incident Response**: incident@globalnext.com
- **Compliance**: compliance@globalnext.com
