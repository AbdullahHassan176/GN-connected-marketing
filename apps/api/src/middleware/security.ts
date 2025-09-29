import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { rateLimitService } from '../services/rate-limit-service';
import { auditService } from '../services/audit-service';
import { createApiSpan, addSpanAttributes, recordSpanException } from '../telemetry/tracing';

// Security headers
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.azure.com https://*.microsoft.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
};

// Rate limit configuration by endpoint type
const RATE_LIMIT_CONFIG = {
  auth: 'auth',
  mutating: 'mutating',
  readonly: 'readonly',
  webhook: 'webhook'
};

export function withSecurity<T extends any[], R>(
  operationName: string,
  endpointType: keyof typeof RATE_LIMIT_CONFIG,
  fn: (...args: T) => Promise<R>
) {
  return async (context: Context, req: HttpRequest): Promise<void> => {
    const span = createApiSpan(operationName, {
      'endpoint.type': endpointType,
      'http.method': req.method,
      'http.url': req.url
    });

    try {
      // Add security headers
      const responseHeaders = {
        ...SECURITY_HEADERS,
        'Content-Type': 'application/json'
      };

      // Get client identifier for rate limiting
      const clientId = getClientIdentifier(req);
      
      // Check rate limit
      const rateLimitResult = await rateLimitService.checkRateLimit(
        clientId,
        RATE_LIMIT_CONFIG[endpointType],
        {
          ip: getClientIP(req),
          userAgent: req.headers['user-agent'],
          endpoint: req.url
        }
      );

      if (!rateLimitResult.allowed) {
        span.setStatus({
          code: 3, // ERROR
          message: 'Rate limit exceeded'
        });
        
        addSpanAttributes({
          'rate_limit.exceeded': true,
          'rate_limit.remaining': rateLimitResult.remaining,
          'rate_limit.reset_time': rateLimitResult.resetTime
        });

        context.res = {
          status: 429,
          headers: {
            ...responseHeaders,
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
          },
          body: JSON.stringify({
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.',
            retryAfter: rateLimitResult.retryAfter
          })
        };
        return;
      }

      // Add rate limit headers to response
      responseHeaders['X-RateLimit-Limit'] = '100';
      responseHeaders['X-RateLimit-Remaining'] = rateLimitResult.remaining.toString();
      responseHeaders['X-RateLimit-Reset'] = rateLimitResult.resetTime.toString();

      // Create audit actor
      const actor = {
        id: getUserId(req) || 'anonymous',
        type: getUserId(req) ? 'user' as const : 'api' as const,
        name: getUserName(req),
        email: getUserEmail(req),
        ip: getClientIP(req),
        userAgent: req.headers['user-agent']
      };

      // Add audit attributes to span
      addSpanAttributes({
        'audit.actor_id': actor.id,
        'audit.actor_type': actor.type,
        'audit.client_ip': actor.ip || 'unknown'
      });

      // Execute the function
      const result = await fn(context, req);

      // Record successful audit event
      await auditService.createEvent(
        actor,
        `${req.method} ${operationName}`,
        'api_endpoint',
        req.url,
        getOrganizationId(req),
        getProjectId(req),
        req.body,
        'success'
      );

      // Record successful rate limit
      await rateLimitService.recordSuccess(clientId, RATE_LIMIT_CONFIG[endpointType]);

      // Set response headers
      if (context.res) {
        context.res.headers = {
          ...context.res.headers,
          ...responseHeaders
        };
      }

      span.setStatus({ code: 1, message: 'Success' }); // OK

    } catch (error) {
      // Record failed audit event
      const actor = {
        id: getUserId(req) || 'anonymous',
        type: getUserId(req) ? 'user' as const : 'api' as const,
        name: getUserName(req),
        email: getUserEmail(req),
        ip: getClientIP(req),
        userAgent: req.headers['user-agent']
      };

      await auditService.createEvent(
        actor,
        `${req.method} ${operationName}`,
        'api_endpoint',
        req.url,
        getOrganizationId(req),
        getProjectId(req),
        req.body,
        'error',
        error instanceof Error ? error.message : 'Unknown error'
      );

      // Record failed rate limit
      const clientId = getClientIdentifier(req);
      await rateLimitService.recordFailure(clientId, RATE_LIMIT_CONFIG[endpointType]);

      // Record exception in span
      recordSpanException(error as Error, {
        'error.type': 'api_error',
        'error.message': error instanceof Error ? error.message : 'Unknown error'
      });

      span.setStatus({
        code: 3, // ERROR
        message: error instanceof Error ? error.message : 'Unknown error'
      });

      // Set error response
      if (!context.res) {
        context.res = {
          status: 500,
          headers: {
            ...SECURITY_HEADERS,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            error: 'Internal server error',
            message: 'An unexpected error occurred'
          })
        };
      }

      throw error;
    } finally {
      span.end();
    }
  };
}

// Helper functions
function getClientIdentifier(req: HttpRequest): string {
  // Use user ID if available, otherwise use IP
  const userId = getUserId(req);
  if (userId) {
    return `user:${userId}`;
  }
  
  const ip = getClientIP(req);
  return `ip:${ip}`;
}

function getClientIP(req: HttpRequest): string {
  return req.headers['x-forwarded-for'] as string ||
         req.headers['x-real-ip'] as string ||
         req.connection?.remoteAddress ||
         'unknown';
}

function getUserId(req: HttpRequest): string | null {
  // Extract user ID from JWT token or session
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // In a real implementation, decode JWT token
    return 'user_123'; // Mock user ID
  }
  return null;
}

function getUserName(req: HttpRequest): string | undefined {
  // Extract user name from JWT token or session
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // In a real implementation, decode JWT token
    return 'John Doe'; // Mock user name
  }
  return undefined;
}

function getUserEmail(req: HttpRequest): string | undefined {
  // Extract user email from JWT token or session
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // In a real implementation, decode JWT token
    return 'john.doe@example.com'; // Mock user email
  }
  return undefined;
}

function getOrganizationId(req: HttpRequest): string | undefined {
  return req.headers['x-organization-id'] as string;
}

function getProjectId(req: HttpRequest): string | undefined {
  return req.headers['x-project-id'] as string;
}

// Input validation middleware
export function validateInput<T>(schema: any, data: any): T {
  try {
    return schema.parse(data);
  } catch (error) {
    throw new Error(`Input validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// CORS configuration
export const CORS_CONFIG = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Organization-ID, X-Project-ID',
  'Access-Control-Max-Age': '86400'
};

// Handle preflight requests
export function handleCORS(context: Context, req: HttpRequest): boolean {
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 200,
      headers: {
        ...CORS_CONFIG,
        ...SECURITY_HEADERS
      },
      body: ''
    };
    return true;
  }
  return false;
}
