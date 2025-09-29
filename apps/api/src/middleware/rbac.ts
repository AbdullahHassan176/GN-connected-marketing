import { AzureFunction, Context } from '@azure/functions';
import { AuthenticatedRequest } from './auth';
import { hasRole, canAccessOrg, canAccessProject } from '@repo/lib/rbac';

/**
 * RBAC middleware for organization access
 */
export function requireOrgAccess(requiredRole: 'owner' | 'admin' | 'manager' | 'analyst' | 'client' = 'client') {
  return function (handler: AzureFunction): AzureFunction {
    return async function (context: Context, req: AuthenticatedRequest): Promise<void> {
      if (!req.user) {
        context.res = {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Unauthorized',
            message: 'Authentication required',
          },
        };
        return;
      }

      const orgId = req.params.orgId || req.query.orgId;
      
      if (!orgId) {
        context.res = {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Bad Request',
            message: 'Organization ID is required',
          },
        };
        return;
      }

      // Check if user can access organization
      if (!canAccessOrg(req.user, orgId)) {
        context.res = {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Forbidden',
            message: 'Access denied to organization',
          },
        };
        return;
      }

      // Check if user has required role
      if (!hasRole(req.user, { scope: 'org', scopeId: orgId, role: requiredRole })) {
        context.res = {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Forbidden',
            message: `Insufficient permissions. Required role: ${requiredRole}`,
          },
        };
        return;
      }

      await handler(context, req);
    };
  };
}

/**
 * RBAC middleware for project access
 */
export function requireProjectAccess(requiredRole: 'owner' | 'admin' | 'manager' | 'analyst' | 'client' = 'client') {
  return function (handler: AzureFunction): AzureFunction {
    return async function (context: Context, req: AuthenticatedRequest): Promise<void> {
      if (!req.user) {
        context.res = {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Unauthorized',
            message: 'Authentication required',
          },
        };
        return;
      }

      const projectId = req.params.projectId || req.query.projectId;
      const orgId = req.user.orgId;
      
      if (!projectId) {
        context.res = {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Bad Request',
            message: 'Project ID is required',
          },
        };
        return;
      }

      // Check if user can access project
      if (!canAccessProject(req.user, projectId, orgId)) {
        context.res = {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Forbidden',
            message: 'Access denied to project',
          },
        };
        return;
      }

      // Check if user has required role for project
      if (!hasRole(req.user, { scope: 'project', scopeId: projectId, role: requiredRole })) {
        context.res = {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Forbidden',
            message: `Insufficient permissions. Required role: ${requiredRole}`,
          },
        };
        return;
      }

      await handler(context, req);
    };
  };
}

/**
 * RBAC middleware for admin access
 */
export function requireAdminAccess(handler: AzureFunction): AzureFunction {
  return async function (context: Context, req: AuthenticatedRequest): Promise<void> {
    if (!req.user) {
      context.res = {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required',
        },
      };
      return;
    }

    // Check if user is admin or owner
    const isAdmin = req.user.roles.some(role => 
      role.role === 'admin' || role.role === 'owner'
    );

    if (!isAdmin) {
      context.res = {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'Forbidden',
          message: 'Admin access required',
        },
      };
      return;
    }

    await handler(context, req);
  };
}

/**
 * RBAC middleware for manager access
 */
export function requireManagerAccess(handler: AzureFunction): AzureFunction {
  return async function (context: Context, req: AuthenticatedRequest): Promise<void> {
    if (!req.user) {
      context.res = {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required',
        },
      };
      return;
    }

    // Check if user is manager, admin, or owner
    const isManager = req.user.roles.some(role => 
      ['manager', 'admin', 'owner'].includes(role.role)
    );

    if (!isManager) {
      context.res = {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'Forbidden',
          message: 'Manager access required',
        },
      };
      return;
    }

    await handler(context, req);
  };
}
