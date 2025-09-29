import { AzureFunction, Context } from '@azure/functions';
import { AuthenticatedRequest } from '../middleware/auth';
import { withAuth } from '../middleware/auth';
import { requireOrgAccess } from '../middleware/rbac';
import { validateParams, validateBody, validateQuery, validateAll } from '../middleware/validation';
import { withAllMiddleware } from '../middleware/error';
import { z } from 'zod';
import { getItem, getAllItems, upsertItem } from '@repo/lib/db';
import { 
  OrgIdSchema, 
  IdSchema,
  CreateToolSchema,
  UpdateToolSchema,
  PaginationSchema,
  SortSchema,
  FilterSchema 
} from '@repo/lib/validation/api';

/**
 * GET /orgs/:orgId/tools
 * Get organization tools
 */
const getOrgToolsHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { orgId } = req.validatedParams;
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', status, category } = req.validatedQuery || {};
    
    // Get all tools for organization
    const tools = await getAllItems('tool_inventory');
    let orgTools = tools.filter((tool: any) => tool.orgId === orgId);
    
    // Apply filters
    if (status) {
      orgTools = orgTools.filter((tool: any) => tool.status === status);
    }
    if (category) {
      orgTools = orgTools.filter((tool: any) => tool.category === category);
    }
    
    // Apply sorting
    orgTools.sort((a: any, b: any) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTools = orgTools.slice(startIndex, endIndex);
    
    // Calculate pagination info
    const total = orgTools.length;
    const pages = Math.ceil(total / limit);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: paginatedTools,
        pagination: {
          page,
          limit,
          total,
          pages,
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
      validateAll(
        undefined,
        z.object({ 
          ...PaginationSchema.shape,
          ...SortSchema.shape,
          ...FilterSchema.shape,
        }),
        z.object({ orgId: OrgIdSchema })
      )(
        getOrgToolsHandler
      )
    )
  )
);

/**
 * POST /orgs/:orgId/tools
 * Create new tool
 */
const createToolHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { orgId } = req.validatedParams;
    const toolData = req.validatedBody;
    
    // Generate tool ID
    const toolId = `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create tool
    const newTool = {
      id: toolId,
      orgId,
      ...toolData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await upsertItem('tool_inventory', newTool);

    context.res = {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: newTool,
        message: 'Tool created successfully',
      },
    };
  } catch (error) {
    context.log.error('Create tool error:', error);
    throw error;
  }
};

export const createTool = withAllMiddleware(
  withAuth(
    requireOrgAccess('admin')(
      validateAll(
        CreateToolSchema,
        undefined,
        z.object({ orgId: OrgIdSchema })
      )(
        createToolHandler
      )
    )
  )
);

/**
 * GET /tools/:id
 * Get tool details
 */
const getToolHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { id } = req.validatedParams;
    
    // Get tool details
    const tools = await getAllItems('tool_inventory');
    const tool = tools.find((t: any) => t.id === id);
    
    if (!tool) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'NOT_FOUND',
          message: 'Tool not found',
        },
      };
      return;
    }

    // Check if user has access to the organization
    if (tool.orgId !== req.user?.orgId) {
      context.res = {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'FORBIDDEN',
          message: 'Access denied to tool',
        },
      };
      return;
    }

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: tool,
      },
    };
  } catch (error) {
    context.log.error('Get tool error:', error);
    throw error;
  }
};

export const getTool = withAllMiddleware(
  withAuth(
    validateParams(z.object({ id: IdSchema }))(
      getToolHandler
    )
  )
);

/**
 * PATCH /tools/:id
 * Update tool
 */
const updateToolHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { id } = req.validatedParams;
    const updateData = req.validatedBody;
    
    // Get existing tool
    const tools = await getAllItems('tool_inventory');
    const existingTool = tools.find((tool: any) => tool.id === id);
    
    if (!existingTool) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'NOT_FOUND',
          message: 'Tool not found',
        },
      };
      return;
    }

    // Check if user has access to the organization
    if (existingTool.orgId !== req.user?.orgId) {
      context.res = {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'FORBIDDEN',
          message: 'Access denied to tool',
        },
      };
      return;
    }
    
    // Update tool
    const updatedTool = {
      ...existingTool,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    await upsertItem('tool_inventory', updatedTool);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: updatedTool,
        message: 'Tool updated successfully',
      },
    };
  } catch (error) {
    context.log.error('Update tool error:', error);
    throw error;
  }
};

export const updateTool = withAllMiddleware(
  withAuth(
    validateAll(
      UpdateToolSchema,
      undefined,
      z.object({ id: IdSchema })
    )(
      updateToolHandler
    )
  )
);

/**
 * GET /orgs/:orgId/tools/summary
 * Get organization tools summary
 */
const getToolsSummaryHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { orgId } = req.validatedParams;
    
    // Get all tools for organization
    const tools = await getAllItems('tool_inventory');
    const orgTools = tools.filter((tool: any) => tool.orgId === orgId);
    
    // Calculate summary statistics
    const totalTools = orgTools.length;
    const activeTools = orgTools.filter((tool: any) => tool.status === 'active').length;
    const inactiveTools = orgTools.filter((tool: any) => tool.status === 'inactive').length;
    const maintenanceTools = orgTools.filter((tool: any) => tool.status === 'maintenance').length;
    
    // Group by category
    const categoryStats = orgTools.reduce((acc: Record<string, number>, tool: any) => {
      acc[tool.category] = (acc[tool.category] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate usage statistics
    const totalRequests = orgTools.reduce((sum: number, tool: any) => sum + (tool.usage?.totalRequests || 0), 0);
    const successfulRequests = orgTools.reduce((sum: number, tool: any) => sum + (tool.usage?.successfulRequests || 0), 0);
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;
    
    // Get most used tools
    const mostUsedTools = orgTools
      .filter((tool: any) => tool.usage?.totalRequests > 0)
      .sort((a: any, b: any) => (b.usage?.totalRequests || 0) - (a.usage?.totalRequests || 0))
      .slice(0, 5)
      .map((tool: any) => ({
        id: tool.id,
        name: tool.name,
        category: tool.category,
        requests: tool.usage?.totalRequests || 0,
        successRate: tool.usage?.totalRequests > 0 
          ? ((tool.usage?.successfulRequests || 0) / tool.usage?.totalRequests) * 100 
          : 0,
      }));

    const summary = {
      total: totalTools,
      byStatus: {
        active: activeTools,
        inactive: inactiveTools,
        maintenance: maintenanceTools,
      },
      byCategory: categoryStats,
      usage: {
        totalRequests,
        successfulRequests,
        successRate: Math.round(successRate * 100) / 100,
      },
      mostUsedTools,
      health: {
        overallHealth: totalTools > 0 ? Math.round((activeTools / totalTools) * 100) : 0,
        needsAttention: orgTools.filter((tool: any) => 
          tool.status === 'maintenance' || 
          (tool.usage?.totalRequests > 0 && (tool.usage?.successfulRequests || 0) / tool.usage?.totalRequests < 0.8)
        ).length,
      },
    };

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: summary,
      },
    };
  } catch (error) {
    context.log.error('Get tools summary error:', error);
    throw error;
  }
};

export const getToolsSummary = withAllMiddleware(
  withAuth(
    requireOrgAccess('analyst')(
      validateParams(z.object({ orgId: OrgIdSchema }))(
        getToolsSummaryHandler
      )
    )
  )
);
