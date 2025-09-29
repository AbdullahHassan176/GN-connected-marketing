import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { verifyToken } from '@repo/lib/auth';

export interface AuthenticatedRequest extends HttpRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    orgId: string;
    roles: Array<{
      scope: 'org' | 'project';
      scopeId: string;
      role: 'owner' | 'admin' | 'manager' | 'analyst' | 'client';
    }>;
    status: 'active' | 'inactive' | 'suspended';
  };
}

/**
 * JWT Authentication middleware
 */
export function withAuth(handler: AzureFunction): AzureFunction {
  return async function (context: Context, req: AuthenticatedRequest): Promise<void> {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        context.res = {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Unauthorized',
            message: 'Missing or invalid authorization header',
          },
        };
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const payload = await verifyToken(token);

      if (!payload) {
        context.res = {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Unauthorized',
            message: 'Invalid or expired token',
          },
        };
        return;
      }

      // Check if user is active
      if (payload.status !== 'active') {
        context.res = {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Forbidden',
            message: 'User account is not active',
          },
        };
        return;
      }

      // Attach user to request
      req.user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        orgId: payload.orgId,
        roles: payload.roles,
        status: payload.status,
      };

      // Continue to handler
      await handler(context, req);
    } catch (error) {
      context.log.error('Auth middleware error:', error);
      
      context.res = {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'Internal Server Error',
          message: 'Authentication failed',
        },
      };
    }
  };
}

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export function withOptionalAuth(handler: AzureFunction): AzureFunction {
  return async function (context: Context, req: AuthenticatedRequest): Promise<void> {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const payload = await verifyToken(token);

        if (payload && payload.status === 'active') {
          req.user = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            orgId: payload.orgId,
            roles: payload.roles,
            status: payload.status,
          };
        }
      }

      // Continue to handler regardless of auth status
      await handler(context, req);
    } catch (error) {
      context.log.error('Optional auth middleware error:', error);
      // Continue to handler even if auth fails
      await handler(context, req);
    }
  };
}
