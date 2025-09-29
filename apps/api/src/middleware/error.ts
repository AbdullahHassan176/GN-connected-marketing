import { AzureFunction, Context } from '@azure/functions';
import { AuthenticatedRequest } from './auth';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

/**
 * Error mapping middleware
 */
export function withErrorHandling(handler: AzureFunction): AzureFunction {
  return async function (context: Context, req: AuthenticatedRequest): Promise<void> {
    try {
      await handler(context, req);
    } catch (error) {
      context.log.error('Handler error:', error);
      
      const apiError = error as ApiError;
      const statusCode = apiError.statusCode || 500;
      const code = apiError.code || 'INTERNAL_ERROR';
      const message = apiError.message || 'An unexpected error occurred';
      
      // Set CORS headers
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };

      // Handle specific error types
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        context.res = {
          status: 400,
          headers,
          body: {
            success: false,
            error: 'INVALID_JSON',
            message: 'Invalid JSON in request body',
          },
        };
        return;
      }

      if (error instanceof TypeError && error.message.includes('Cannot read property')) {
        context.res = {
          status: 500,
          headers,
          body: {
            success: false,
            error: 'INTERNAL_ERROR',
            message: 'Internal server error',
          },
        };
        return;
      }

      // Default error response
      context.res = {
        status: statusCode,
        headers,
        body: {
          success: false,
          error: code,
          message,
          details: apiError.details,
          timestamp: new Date().toISOString(),
        },
      };
    }
  };
}

/**
 * CORS middleware
 */
export function withCors(handler: AzureFunction): AzureFunction {
  return async function (context: Context, req: AuthenticatedRequest): Promise<void> {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      context.res = {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
        body: '',
      };
      return;
    }

    // Add CORS headers to all responses
    const originalRes = context.res;
    context.res = {
      ...originalRes,
      headers: {
        ...originalRes?.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };

    await handler(context, req);
  };
}

/**
 * Logging middleware
 */
export function withLogging(handler: AzureFunction): AzureFunction {
  return async function (context: Context, req: AuthenticatedRequest): Promise<void> {
    const startTime = Date.now();
    
    context.log.info(`[${req.method}] ${req.url}`, {
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      userId: req.user?.id,
      orgId: req.user?.orgId,
    });

    await handler(context, req);

    const duration = Date.now() - startTime;
    const statusCode = context.res?.status || 200;
    
    context.log.info(`[${req.method}] ${req.url} - ${statusCode} (${duration}ms)`, {
      method: req.method,
      url: req.url,
      statusCode,
      duration,
      userId: req.user?.id,
      orgId: req.user?.orgId,
    });
  };
}

/**
 * Rate limiting middleware (basic implementation)
 */
export function withRateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return function (handler: AzureFunction): AzureFunction {
    return async function (context: Context, req: AuthenticatedRequest): Promise<void> {
      const clientId = req.user?.id || req.headers['x-forwarded-for'] || 'anonymous';
      const now = Date.now();
      
      const clientData = requests.get(clientId);
      
      if (!clientData || now > clientData.resetTime) {
        requests.set(clientId, { count: 1, resetTime: now + windowMs });
      } else if (clientData.count >= maxRequests) {
        context.res = {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Retry-After': Math.ceil((clientData.resetTime - now) / 1000).toString(),
          },
          body: {
            success: false,
            error: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests',
            retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
          },
        };
        return;
      } else {
        clientData.count++;
      }

      await handler(context, req);
    };
  };
}

/**
 * Combine all middleware
 */
export function withAllMiddleware(handler: AzureFunction): AzureFunction {
  return withErrorHandling(
    withCors(
      withLogging(
        withRateLimit()(handler)
      )
    )
  );
}
