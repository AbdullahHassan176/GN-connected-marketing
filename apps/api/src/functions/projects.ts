import { AzureFunction, Context } from '@azure/functions';
import { AuthenticatedRequest } from '../middleware/auth';
import { withAuth } from '../middleware/auth';
import { requireOrgAccess, requireProjectAccess } from '../middleware/rbac';
import { validateParams, validateBody, validateQuery, validateAll } from '../middleware/validation';
import { withAllMiddleware } from '../middleware/error';
import { z } from 'zod';
import { getItem, getAllItems, upsertItem, queryItems } from '@repo/lib/db';
import { 
  OrgIdSchema, 
  ProjectIdSchema, 
  CreateProjectSchema, 
  UpdateProjectSchema,
  PaginationSchema,
  SortSchema,
  FilterSchema 
} from '@repo/lib/validation/api';

/**
 * GET /orgs/:orgId/projects
 * Get organization projects
 */
const getOrgProjectsHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { orgId } = req.validatedParams;
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', status, type } = req.validatedQuery || {};
    
    // Get all projects for organization
    const projects = await getAllItems('projects');
    let orgProjects = projects.filter((project: any) => project.orgId === orgId);
    
    // Apply filters
    if (status) {
      orgProjects = orgProjects.filter((p: any) => p.status === status);
    }
    if (type) {
      orgProjects = orgProjects.filter((p: any) => p.tags?.includes(type));
    }
    
    // Apply sorting
    orgProjects.sort((a: any, b: any) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = orgProjects.slice(startIndex, endIndex);
    
    // Calculate pagination info
    const total = orgProjects.length;
    const pages = Math.ceil(total / limit);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: paginatedProjects,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      },
    };
  } catch (error) {
    context.log.error('Get organization projects error:', error);
    throw error;
  }
};

export const getOrgProjects = withAllMiddleware(
  withAuth(
    requireOrgAccess('client')(
      validateAll(
        undefined,
        z.object({ 
          ...PaginationSchema.shape,
          ...SortSchema.shape,
          ...FilterSchema.shape,
        }),
        z.object({ orgId: OrgIdSchema })
      )(
        getOrgProjectsHandler
      )
    )
  )
);

/**
 * POST /orgs/:orgId/projects
 * Create new project
 */
const createProjectHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { orgId } = req.validatedParams;
    const projectData = req.validatedBody;
    
    // Generate project ID
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create project
    const newProject = {
      id: projectId,
      projectId,
      orgId,
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await upsertItem('projects', newProject);

    context.res = {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: newProject,
        message: 'Project created successfully',
      },
    };
  } catch (error) {
    context.log.error('Create project error:', error);
    throw error;
  }
};

export const createProject = withAllMiddleware(
  withAuth(
    requireOrgAccess('manager')(
      validateAll(
        CreateProjectSchema,
        undefined,
        z.object({ orgId: OrgIdSchema })
      )(
        createProjectHandler
      )
    )
  )
);

/**
 * GET /projects/:projectId
 * Get project details
 */
const getProjectHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { projectId } = req.validatedParams;
    
    // Get project details
    const project = await getItem('projects', projectId, projectId);
    
    if (!project) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'NOT_FOUND',
          message: 'Project not found',
        },
      };
      return;
    }

    // Get project work items count
    const workItems = await getAllItems('work_items');
    const projectWorkItems = workItems.filter((item: any) => item.projectId === projectId);
    
    // Get project events count
    const events = await getAllItems('events');
    const projectEvents = events.filter((event: any) => event.projectId === projectId);
    
    // Get project assets count
    const assets = await getAllItems('assets');
    const projectAssets = assets.filter((asset: any) => asset.projectId === projectId);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: {
          ...project,
          stats: {
            workItems: projectWorkItems.length,
            events: projectEvents.length,
            assets: projectAssets.length,
            completedWorkItems: projectWorkItems.filter((item: any) => item.status === 'completed').length,
          },
        },
      },
    };
  } catch (error) {
    context.log.error('Get project error:', error);
    throw error;
  }
};

export const getProject = withAllMiddleware(
  withAuth(
    requireProjectAccess('client')(
      validateParams(z.object({ projectId: ProjectIdSchema }))(
        getProjectHandler
      )
    )
  )
);

/**
 * PATCH /projects/:projectId
 * Update project
 */
const updateProjectHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { projectId } = req.validatedParams;
    const updateData = req.validatedBody;
    
    // Get existing project
    const existingProject = await getItem('projects', projectId, projectId);
    
    if (!existingProject) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'NOT_FOUND',
          message: 'Project not found',
        },
      };
      return;
    }
    
    // Update project
    const updatedProject = {
      ...existingProject,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    await upsertItem('projects', updatedProject);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: updatedProject,
        message: 'Project updated successfully',
      },
    };
  } catch (error) {
    context.log.error('Update project error:', error);
    throw error;
  }
};

export const updateProject = withAllMiddleware(
  withAuth(
    requireProjectAccess('manager')(
      validateAll(
        UpdateProjectSchema,
        undefined,
        z.object({ projectId: ProjectIdSchema })
      )(
        updateProjectHandler
      )
    )
  )
);

/**
 * GET /projects/:projectId/kpis
 * Get project KPIs
 */
const getProjectKPIsHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { projectId } = req.validatedParams;
    
    // Get project
    const project = await getItem('projects', projectId, projectId);
    
    if (!project) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          success: false,
          error: 'NOT_FOUND',
          message: 'Project not found',
        },
      };
      return;
    }

    // Calculate additional KPI metrics
    const workItems = await getAllItems('work_items');
    const projectWorkItems = workItems.filter((item: any) => item.projectId === projectId);
    
    const totalEstimatedHours = projectWorkItems.reduce((sum: number, item: any) => sum + (item.estimatedHours || 0), 0);
    const totalActualHours = projectWorkItems.reduce((sum: number, item: any) => sum + (item.actualHours || 0), 0);
    const completedWorkItems = projectWorkItems.filter((item: any) => item.status === 'completed').length;
    
    const kpis = {
      ...project.kpis,
      workItems: {
        total: projectWorkItems.length,
        completed: completedWorkItems,
        completionRate: projectWorkItems.length > 0 ? (completedWorkItems / projectWorkItems.length) * 100 : 0,
      },
      timeTracking: {
        estimatedHours: totalEstimatedHours,
        actualHours: totalActualHours,
        efficiency: totalEstimatedHours > 0 ? (totalActualHours / totalEstimatedHours) * 100 : 0,
      },
      budget: {
        allocated: project.budget || 0,
        spent: project.spent || 0,
        remaining: (project.budget || 0) - (project.spent || 0),
        utilizationRate: project.budget > 0 ? ((project.spent || 0) / project.budget) * 100 : 0,
      },
      progress: {
        overall: project.progress || 0,
        timeline: project.startDate && project.endDate ? {
          startDate: project.startDate,
          endDate: project.endDate,
          daysRemaining: Math.max(0, Math.ceil((new Date(project.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
        } : null,
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
        data: kpis,
      },
    };
  } catch (error) {
    context.log.error('Get project KPIs error:', error);
    throw error;
  }
};

export const getProjectKPIs = withAllMiddleware(
  withAuth(
    requireProjectAccess('client')(
      validateParams(z.object({ projectId: ProjectIdSchema }))(
        getProjectKPIsHandler
      )
    )
  )
);
