import { AzureFunction, Context, HttpRequest } from '@azure/functions';

/**
 * API v1 Index endpoint
 * Lists all available routes and provides API documentation
 */
const apiIndexHandler: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const routes = {
    organizations: {
      'GET /orgs/:orgId': {
        description: 'Get organization details',
        method: 'GET',
        path: '/orgs/:orgId',
        parameters: {
          orgId: { type: 'string', required: true, description: 'Organization ID' }
        },
        authentication: 'Bearer token required',
        authorization: 'Client role or higher',
        response: 'Organization object with stats'
      },
      'GET /orgs/:orgId/users': {
        description: 'Get organization users',
        method: 'GET',
        path: '/orgs/:orgId/users',
        parameters: {
          orgId: { type: 'string', required: true, description: 'Organization ID' }
        },
        authentication: 'Bearer token required',
        authorization: 'Analyst role or higher',
        response: 'Array of user objects'
      },
      'GET /orgs/:orgId/tools': {
        description: 'Get organization tools',
        method: 'GET',
        path: '/orgs/:orgId/tools',
        parameters: {
          orgId: { type: 'string', required: true, description: 'Organization ID' },
          page: { type: 'number', required: false, description: 'Page number (default: 1)' },
          limit: { type: 'number', required: false, description: 'Items per page (default: 20)' },
          status: { type: 'string', required: false, description: 'Filter by status' },
          category: { type: 'string', required: false, description: 'Filter by category' }
        },
        authentication: 'Bearer token required',
        authorization: 'Analyst role or higher',
        response: 'Paginated array of tool objects'
      },
      'GET /orgs/:orgId/tools/summary': {
        description: 'Get organization tools summary',
        method: 'GET',
        path: '/orgs/:orgId/tools/summary',
        parameters: {
          orgId: { type: 'string', required: true, description: 'Organization ID' }
        },
        authentication: 'Bearer token required',
        authorization: 'Analyst role or higher',
        response: 'Tools summary statistics'
      }
    },
    projects: {
      'GET /orgs/:orgId/projects': {
        description: 'Get organization projects',
        method: 'GET',
        path: '/orgs/:orgId/projects',
        parameters: {
          orgId: { type: 'string', required: true, description: 'Organization ID' },
          page: { type: 'number', required: false, description: 'Page number (default: 1)' },
          limit: { type: 'number', required: false, description: 'Items per page (default: 20)' },
          status: { type: 'string', required: false, description: 'Filter by status' },
          type: { type: 'string', required: false, description: 'Filter by type' }
        },
        authentication: 'Bearer token required',
        authorization: 'Client role or higher',
        response: 'Paginated array of project objects'
      },
      'POST /orgs/:orgId/projects': {
        description: 'Create new project',
        method: 'POST',
        path: '/orgs/:orgId/projects',
        parameters: {
          orgId: { type: 'string', required: true, description: 'Organization ID' }
        },
        body: 'CreateProjectSchema',
        authentication: 'Bearer token required',
        authorization: 'Manager role or higher',
        response: 'Created project object'
      },
      'GET /projects/:projectId': {
        description: 'Get project details',
        method: 'GET',
        path: '/projects/:projectId',
        parameters: {
          projectId: { type: 'string', required: true, description: 'Project ID' }
        },
        authentication: 'Bearer token required',
        authorization: 'Client role or higher',
        response: 'Project object with stats'
      },
      'PATCH /projects/:projectId': {
        description: 'Update project',
        method: 'PATCH',
        path: '/projects/:projectId',
        parameters: {
          projectId: { type: 'string', required: true, description: 'Project ID' }
        },
        body: 'UpdateProjectSchema',
        authentication: 'Bearer token required',
        authorization: 'Manager role or higher',
        response: 'Updated project object'
      },
      'GET /projects/:projectId/kpis': {
        description: 'Get project KPIs',
        method: 'GET',
        path: '/projects/:projectId/kpis',
        parameters: {
          projectId: { type: 'string', required: true, description: 'Project ID' }
        },
        authentication: 'Bearer token required',
        authorization: 'Client role or higher',
        response: 'Project KPIs and metrics'
      }
    },
    workItems: {
      'GET /projects/:projectId/work-items': {
        description: 'Get project work items',
        method: 'GET',
        path: '/projects/:projectId/work-items',
        parameters: {
          projectId: { type: 'string', required: true, description: 'Project ID' },
          page: { type: 'number', required: false, description: 'Page number (default: 1)' },
          limit: { type: 'number', required: false, description: 'Items per page (default: 20)' },
          status: { type: 'string', required: false, description: 'Filter by status' },
          assigneeId: { type: 'string', required: false, description: 'Filter by assignee' },
          priority: { type: 'string', required: false, description: 'Filter by priority' }
        },
        authentication: 'Bearer token required',
        authorization: 'Client role or higher',
        response: 'Paginated array of work item objects'
      },
      'POST /projects/:projectId/work-items': {
        description: 'Create new work item',
        method: 'POST',
        path: '/projects/:projectId/work-items',
        parameters: {
          projectId: { type: 'string', required: true, description: 'Project ID' }
        },
        body: 'CreateWorkItemSchema',
        authentication: 'Bearer token required',
        authorization: 'Analyst role or higher',
        response: 'Created work item object'
      },
      'GET /work-items/:id': {
        description: 'Get work item details',
        method: 'GET',
        path: '/work-items/:id',
        parameters: {
          id: { type: 'string', required: true, description: 'Work item ID' }
        },
        authentication: 'Bearer token required',
        authorization: 'Client role or higher',
        response: 'Work item object'
      },
      'PATCH /work-items/:id': {
        description: 'Update work item',
        method: 'PATCH',
        path: '/work-items/:id',
        parameters: {
          id: { type: 'string', required: true, description: 'Work item ID' }
        },
        body: 'UpdateWorkItemSchema',
        authentication: 'Bearer token required',
        authorization: 'Client role or higher',
        response: 'Updated work item object'
      },
      'DELETE /work-items/:id': {
        description: 'Delete work item',
        method: 'DELETE',
        path: '/work-items/:id',
        parameters: {
          id: { type: 'string', required: true, description: 'Work item ID' }
        },
        authentication: 'Bearer token required',
        authorization: 'Client role or higher',
        response: 'Success message'
      }
    },
    insights: {
      'GET /projects/:projectId/insights': {
        description: 'Get project insights',
        method: 'GET',
        path: '/projects/:projectId/insights',
        parameters: {
          projectId: { type: 'string', required: true, description: 'Project ID' },
          page: { type: 'number', required: false, description: 'Page number (default: 1)' },
          limit: { type: 'number', required: false, description: 'Items per page (default: 20)' },
          type: { type: 'string', required: false, description: 'Filter by type' }
        },
        authentication: 'Bearer token required',
        authorization: 'Client role or higher',
        response: 'Paginated array of insight objects'
      },
      'POST /projects/:projectId/insights': {
        description: 'Create new insight',
        method: 'POST',
        path: '/projects/:projectId/insights',
        parameters: {
          projectId: { type: 'string', required: true, description: 'Project ID' }
        },
        body: 'CreateInsightSchema',
        authentication: 'Bearer token required',
        authorization: 'Analyst role or higher',
        response: 'Created insight object'
      },
      'GET /projects/:projectId/insights/summary': {
        description: 'Get project insights summary',
        method: 'GET',
        path: '/projects/:projectId/insights/summary',
        parameters: {
          projectId: { type: 'string', required: true, description: 'Project ID' }
        },
        authentication: 'Bearer token required',
        authorization: 'Client role or higher',
        response: 'Insights summary statistics'
      }
    },
    messages: {
      'GET /projects/:projectId/messages': {
        description: 'Get project messages',
        method: 'GET',
        path: '/projects/:projectId/messages',
        parameters: {
          projectId: { type: 'string', required: true, description: 'Project ID' },
          page: { type: 'number', required: false, description: 'Page number (default: 1)' },
          limit: { type: 'number', required: false, description: 'Items per page (default: 20)' },
          type: { type: 'string', required: false, description: 'Filter by type' }
        },
        authentication: 'Bearer token required',
        authorization: 'Client role or higher',
        response: 'Paginated array of message objects'
      },
      'POST /projects/:projectId/messages': {
        description: 'Create new message',
        method: 'POST',
        path: '/projects/:projectId/messages',
        parameters: {
          projectId: { type: 'string', required: true, description: 'Project ID' }
        },
        body: 'CreateMessageSchema',
        authentication: 'Bearer token required',
        authorization: 'Client role or higher',
        response: 'Created message object'
      }
    },
    approvals: {
      'GET /projects/:projectId/approvals': {
        description: 'Get project approvals',
        method: 'GET',
        path: '/projects/:projectId/approvals',
        parameters: {
          projectId: { type: 'string', required: true, description: 'Project ID' },
          page: { type: 'number', required: false, description: 'Page number (default: 1)' },
          limit: { type: 'number', required: false, description: 'Items per page (default: 20)' },
          status: { type: 'string', required: false, description: 'Filter by status' },
          type: { type: 'string', required: false, description: 'Filter by type' }
        },
        authentication: 'Bearer token required',
        authorization: 'Client role or higher',
        response: 'Paginated array of approval objects'
      },
      'POST /projects/:projectId/approvals': {
        description: 'Create new approval request',
        method: 'POST',
        path: '/projects/:projectId/approvals',
        parameters: {
          projectId: { type: 'string', required: true, description: 'Project ID' }
        },
        body: 'CreateApprovalSchema',
        authentication: 'Bearer token required',
        authorization: 'Manager role or higher',
        response: 'Created approval object'
      },
      'PATCH /approvals/:id': {
        description: 'Update approval (approve/reject)',
        method: 'PATCH',
        path: '/approvals/:id',
        parameters: {
          id: { type: 'string', required: true, description: 'Approval ID' }
        },
        body: 'UpdateApprovalSchema',
        authentication: 'Bearer token required',
        authorization: 'Client role or higher',
        response: 'Updated approval object'
      }
    },
    system: {
      'GET /v1/health': {
        description: 'Health check endpoint',
        method: 'GET',
        path: '/v1/health',
        parameters: {},
        authentication: 'None required',
        authorization: 'None required',
        response: 'Health status object'
      },
      'GET /v1': {
        description: 'API index endpoint',
        method: 'GET',
        path: '/v1',
        parameters: {},
        authentication: 'None required',
        authorization: 'None required',
        response: 'API documentation object'
      }
    }
  };

  const apiInfo = {
    name: 'Global Next Marketing Portal API',
    version: '1.0.0',
    description: 'AI-Powered Marketing Consulting Portal API',
    baseUrl: process.env.AZURE_FUNCTIONS_ENDPOINT || 'http://localhost:7071',
    authentication: {
      type: 'Bearer Token',
      description: 'JWT token required for most endpoints',
      header: 'Authorization: Bearer <token>'
    },
    authorization: {
      description: 'Role-based access control (RBAC)',
      roles: ['owner', 'admin', 'manager', 'analyst', 'client'],
      scopes: ['org', 'project']
    },
    validation: {
      description: 'Zod schema validation for all requests',
      body: 'JSON schema validation',
      query: 'Query parameter validation',
      params: 'Path parameter validation'
    },
    errorHandling: {
      description: 'Consistent error responses',
      format: {
        success: 'boolean',
        error: 'string',
        message: 'string',
        details: 'object (optional)'
      }
    },
    cors: {
      enabled: true,
      origins: ['*'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization']
    },
    routes
  };

  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: {
      success: true,
      data: apiInfo,
      message: 'Global Next Marketing Portal API v1.0.0',
    },
  };
};

export const apiIndex = apiIndexHandler;
