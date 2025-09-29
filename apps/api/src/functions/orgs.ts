import { AzureFunction, Context } from '@azure/functions';
import { AuthenticatedRequest } from '../middleware/auth';
import { withAuth, withOptionalAuth } from '../middleware/auth';
import { requireOrgAccess } from '../middleware/rbac';
import { validateParams } from '../middleware/validation';
import { withAllMiddleware } from '../middleware/error';
import { z } from 'zod';
import { getItem, getAllItems } from '@repo/lib/db';
import { OrgIdSchema } from '@repo/lib/validation/api';

/**
 * GET /orgs/:orgId
 * Get organization details
 */
const getOrgHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { orgId } = req.validatedParams;
    
    // Get organization details
    const organization = await getItem('organizations', orgId, orgId);
    
    if (!organization) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'NOT_FOUND',
          message: 'Organization not found',
        },
      };
      return;
    }

    // Get organization users count
    const users = await getAllItems('users');
    const orgUsers = users.filter((user: any) => user.orgId === orgId);
    
    // Get organization projects count
    const projects = await getAllItems('projects');
    const orgProjects = projects.filter((project: any) => project.orgId === orgId);
    
    // Get organization tools count
    const tools = await getAllItems('tool_inventory');
    const orgTools = tools.filter((tool: any) => tool.orgId === orgId);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: {
          ...organization,
          stats: {
            users: orgUsers.length,
            projects: orgProjects.length,
            tools: orgTools.length,
            activeProjects: orgProjects.filter((p: any) => p.status === 'active').length,
          },
        },
      },
    };
  } catch (error) {
    context.log.error('Get organization error:', error);
    throw error;
  }
};

export const getOrg = withAllMiddleware(
  withAuth(
    requireOrgAccess('client')(
      validateParams(z.object({ orgId: OrgIdSchema }))(
        getOrgHandler
      )
    )
  )
);

/**
 * GET /orgs/:orgId/users
 * Get organization users
 */
const getOrgUsersHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { orgId } = req.validatedParams;
    
    // Get all users for organization
    const users = await getAllItems('users');
    const orgUsers = users.filter((user: any) => user.orgId === orgId);
    
    // Remove sensitive data
    const safeUsers = orgUsers.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      roles: user.roles,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: safeUsers,
        pagination: {
          page: 1,
          limit: orgUsers.length,
          total: orgUsers.length,
          pages: 1,
        },
      },
    };
  } catch (error) {
    context.log.error('Get organization users error:', error);
    throw error;
  }
};

export const getOrgUsers = withAllMiddleware(
  withAuth(
    requireOrgAccess('analyst')(
      validateParams(z.object({ orgId: OrgIdSchema }))(
        getOrgUsersHandler
      )
    )
  )
);

/**
 * GET /orgs/:orgId/tools
 * Get organization tools
 */
const getOrgToolsHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { orgId } = req.validatedParams;
    
    // Get all tools for organization
    const tools = await getAllItems('tool_inventory');
    const orgTools = tools.filter((tool: any) => tool.orgId === orgId);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: orgTools,
        pagination: {
          page: 1,
          limit: orgTools.length,
          total: orgTools.length,
          pages: 1,
        },
      },
    };
  } catch (error) {
    context.log.error('Get organization tools error:', error);
    throw error;
  }
};

export const getOrgTools = withAllMiddleware(
  withAuth(
    requireOrgAccess('analyst')(
      validateParams(z.object({ orgId: OrgIdSchema }))(
        getOrgToolsHandler
      )
    )
  )
);
