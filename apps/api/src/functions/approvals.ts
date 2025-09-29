import { AzureFunction, Context } from '@azure/functions';
import { AuthenticatedRequest } from '../middleware/auth';
import { withAuth } from '../middleware/auth';
import { requireProjectAccess } from '../middleware/rbac';
import { validateParams, validateBody, validateQuery, validateAll } from '../middleware/validation';
import { withAllMiddleware } from '../middleware/error';
import { z } from 'zod';
import { getItem, getAllItems, upsertItem } from '@repo/lib/db';
import { 
  ProjectIdSchema, 
  CreateApprovalSchema,
  UpdateApprovalSchema,
  PaginationSchema,
  SortSchema,
  FilterSchema 
} from '@repo/lib/validation/api';

/**
 * GET /projects/:projectId/approvals
 * Get project approvals
 */
const getProjectApprovalsHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { projectId } = req.validatedParams;
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', status, type } = req.validatedQuery || {};
    
    // Get all approvals for project
    const approvals = await getAllItems('approvals');
    let projectApprovals = approvals.filter((approval: any) => approval.projectId === projectId);
    
    // Apply filters
    if (status) {
      projectApprovals = projectApprovals.filter((approval: any) => approval.status === status);
    }
    if (type) {
      projectApprovals = projectApprovals.filter((approval: any) => approval.type === type);
    }
    
    // Apply sorting
    projectApprovals.sort((a: any, b: any) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApprovals = projectApprovals.slice(startIndex, endIndex);
    
    // Calculate pagination info
    const total = projectApprovals.length;
    const pages = Math.ceil(total / limit);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: paginatedApprovals,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      },
    };
  } catch (error) {
    context.log.error('Get project approvals error:', error);
    throw error;
  }
};

export const getProjectApprovals = withAllMiddleware(
  withAuth(
    requireProjectAccess('client')(
      validateAll(
        undefined,
        z.object({ 
          ...PaginationSchema.shape,
          ...SortSchema.shape,
          ...FilterSchema.shape,
        }),
        z.object({ projectId: ProjectIdSchema })
      )(
        getProjectApprovalsHandler
      )
    )
  )
);

/**
 * POST /projects/:projectId/approvals
 * Create new approval request
 */
const createApprovalHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { projectId } = req.validatedParams;
    const approvalData = req.validatedBody;
    
    // Generate approval ID
    const approvalId = `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create approval
    const newApproval = {
      id: approvalId,
      projectId,
      requestedBy: req.user!.id,
      ...approvalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await upsertItem('approvals', newApproval);

    context.res = {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: newApproval,
        message: 'Approval request created successfully',
      },
    };
  } catch (error) {
    context.log.error('Create approval error:', error);
    throw error;
  }
};

export const createApproval = withAllMiddleware(
  withAuth(
    requireProjectAccess('manager')(
      validateAll(
        CreateApprovalSchema,
        undefined,
        z.object({ projectId: ProjectIdSchema })
      )(
        createApprovalHandler
      )
    )
  )
);

/**
 * PATCH /approvals/:id
 * Update approval (approve/reject)
 */
const updateApprovalHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { id } = req.validatedParams;
    const updateData = req.validatedBody;
    
    // Get existing approval
    const approvals = await getAllItems('approvals');
    const existingApproval = approvals.find((approval: any) => approval.id === id);
    
    if (!existingApproval) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'NOT_FOUND',
          message: 'Approval not found',
        },
      };
      return;
    }

    // Check if user has access to the project
    const projects = await getAllItems('projects');
    const project = projects.find((p: any) => p.id === existingApproval.projectId);
    
    if (!project || project.orgId !== req.user?.orgId) {
      context.res = {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'FORBIDDEN',
          message: 'Access denied to approval',
        },
      };
      return;
    }
    
    // Update approval
    const updatedApproval = {
      ...existingApproval,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    await upsertItem('approvals', updatedApproval);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: updatedApproval,
        message: 'Approval updated successfully',
      },
    };
  } catch (error) {
    context.log.error('Update approval error:', error);
    throw error;
  }
};

export const updateApproval = withAllMiddleware(
  withAuth(
    validateAll(
      UpdateApprovalSchema,
      undefined,
      z.object({ id: z.string() })
    )(
      updateApprovalHandler
    )
  )
);
