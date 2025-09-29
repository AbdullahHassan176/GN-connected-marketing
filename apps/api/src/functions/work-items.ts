import { AzureFunction, Context } from '@azure/functions';
import { AuthenticatedRequest } from '../middleware/auth';
import { withAuth } from '../middleware/auth';
import { requireProjectAccess } from '../middleware/rbac';
import { validateParams, validateBody, validateQuery, validateAll } from '../middleware/validation';
import { withAllMiddleware } from '../middleware/error';
import { z } from 'zod';
import { getItem, getAllItems, upsertItem, deleteItem } from '@repo/lib/db';
import { 
  ProjectIdSchema, 
  IdSchema,
  CreateWorkItemSchema, 
  UpdateWorkItemSchema,
  PaginationSchema,
  SortSchema,
  FilterSchema 
} from '@repo/lib/validation/api';

/**
 * GET /projects/:projectId/work-items
 * Get project work items
 */
const getProjectWorkItemsHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { projectId } = req.validatedParams;
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', status, assigneeId, priority } = req.validatedQuery || {};
    
    // Get all work items for project
    const workItems = await getAllItems('work_items');
    let projectWorkItems = workItems.filter((item: any) => item.projectId === projectId);
    
    // Apply filters
    if (status) {
      projectWorkItems = projectWorkItems.filter((item: any) => item.status === status);
    }
    if (assigneeId) {
      projectWorkItems = projectWorkItems.filter((item: any) => item.assigneeId === assigneeId);
    }
    if (priority) {
      projectWorkItems = projectWorkItems.filter((item: any) => item.priority === priority);
    }
    
    // Apply sorting
    projectWorkItems.sort((a: any, b: any) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedWorkItems = projectWorkItems.slice(startIndex, endIndex);
    
    // Calculate pagination info
    const total = projectWorkItems.length;
    const pages = Math.ceil(total / limit);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: paginatedWorkItems,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      },
    };
  } catch (error) {
    context.log.error('Get project work items error:', error);
    throw error;
  }
};

export const getProjectWorkItems = withAllMiddleware(
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
        getProjectWorkItemsHandler
      )
    )
  )
);

/**
 * POST /projects/:projectId/work-items
 * Create new work item
 */
const createWorkItemHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { projectId } = req.validatedParams;
    const workItemData = req.validatedBody;
    
    // Generate work item ID
    const workItemId = `work_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create work item
    const newWorkItem = {
      id: workItemId,
      projectId,
      ...workItemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await upsertItem('work_items', newWorkItem);

    context.res = {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: newWorkItem,
        message: 'Work item created successfully',
      },
    };
  } catch (error) {
    context.log.error('Create work item error:', error);
    throw error;
  }
};

export const createWorkItem = withAllMiddleware(
  withAuth(
    requireProjectAccess('analyst')(
      validateAll(
        CreateWorkItemSchema,
        undefined,
        z.object({ projectId: ProjectIdSchema })
      )(
        createWorkItemHandler
      )
    )
  )
);

/**
 * GET /work-items/:id
 * Get work item details
 */
const getWorkItemHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { id } = req.validatedParams;
    
    // Get work item details
    const workItems = await getAllItems('work_items');
    const workItem = workItems.find((item: any) => item.id === id);
    
    if (!workItem) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'NOT_FOUND',
          message: 'Work item not found',
        },
      };
      return;
    }

    // Check if user has access to the project
    const projects = await getAllItems('projects');
    const project = projects.find((p: any) => p.id === workItem.projectId);
    
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
          message: 'Access denied to work item',
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
        data: workItem,
      },
    };
  } catch (error) {
    context.log.error('Get work item error:', error);
    throw error;
  }
};

export const getWorkItem = withAllMiddleware(
  withAuth(
    validateParams(z.object({ id: IdSchema }))(
      getWorkItemHandler
    )
  )
);

/**
 * PATCH /work-items/:id
 * Update work item
 */
const updateWorkItemHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { id } = req.validatedParams;
    const updateData = req.validatedBody;
    
    // Get existing work item
    const workItems = await getAllItems('work_items');
    const existingWorkItem = workItems.find((item: any) => item.id === id);
    
    if (!existingWorkItem) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'NOT_FOUND',
          message: 'Work item not found',
        },
      };
      return;
    }

    // Check if user has access to the project
    const projects = await getAllItems('projects');
    const project = projects.find((p: any) => p.id === existingWorkItem.projectId);
    
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
          message: 'Access denied to work item',
        },
      };
      return;
    }
    
    // Update work item
    const updatedWorkItem = {
      ...existingWorkItem,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    await upsertItem('work_items', updatedWorkItem);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: updatedWorkItem,
        message: 'Work item updated successfully',
      },
    };
  } catch (error) {
    context.log.error('Update work item error:', error);
    throw error;
  }
};

export const updateWorkItem = withAllMiddleware(
  withAuth(
    validateAll(
      UpdateWorkItemSchema,
      undefined,
      z.object({ id: IdSchema })
    )(
      updateWorkItemHandler
    )
  )
);

/**
 * DELETE /work-items/:id
 * Delete work item
 */
const deleteWorkItemHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { id } = req.validatedParams;
    
    // Get existing work item
    const workItems = await getAllItems('work_items');
    const existingWorkItem = workItems.find((item: any) => item.id === id);
    
    if (!existingWorkItem) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'NOT_FOUND',
          message: 'Work item not found',
        },
      };
      return;
    }

    // Check if user has access to the project
    const projects = await getAllItems('projects');
    const project = projects.find((p: any) => p.id === existingWorkItem.projectId);
    
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
          message: 'Access denied to work item',
        },
      };
      return;
    }
    
    // Delete work item
    await deleteItem('work_items', id, existingWorkItem.projectId);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        message: 'Work item deleted successfully',
      },
    };
  } catch (error) {
    context.log.error('Delete work item error:', error);
    throw error;
  }
};

export const deleteWorkItem = withAllMiddleware(
  withAuth(
    validateParams(z.object({ id: IdSchema }))(
      deleteWorkItemHandler
    )
  )
);
