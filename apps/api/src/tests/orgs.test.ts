import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Context } from '@azure/functions';

// Mock the database module
vi.mock('@repo/lib/db', () => ({
  getItem: vi.fn(),
  getAllItems: vi.fn(),
}));

// Mock the middleware
vi.mock('../middleware/auth', () => ({
  withAuth: (handler: any) => handler,
}));

vi.mock('../middleware/rbac', () => ({
  requireOrgAccess: (role: string) => (handler: any) => handler,
}));

vi.mock('../middleware/validation', () => ({
  validateParams: (schema: any) => (handler: any) => handler,
}));

vi.mock('../middleware/error', () => ({
  withAllMiddleware: (handler: any) => handler,
}));

describe('Organization Endpoint', () => {
  let mockContext: Context;
  let mockReq: any;

  beforeEach(() => {
    mockContext = {
      log: vi.fn().mockImplementation((message: string) => {
        console.log(message);
      }),
    } as any;
    
    // Add error method to log
    mockContext.log.error = vi.fn().mockImplementation((message: string, error: any) => {
      console.error(message, error);
    });

    mockReq = {
      method: 'GET',
      url: '/api/orgs/org_123',
      headers: {},
      body: {},
      params: { orgId: 'org_123' },
      validatedParams: { orgId: 'org_123' },
      user: {
        id: 'user_123',
        email: 'test@example.com',
        name: 'Test User',
        orgId: 'org_123',
        roles: [{ scope: 'org', scopeId: 'org_123', role: 'client' }],
        status: 'active'
      }
    };
  });

  it('should return organization details with stats', async () => {
    const { getItem, getAllItems } = await import('@repo/lib/db');
    
    const mockOrganization = {
      id: 'org_123',
      orgId: 'org_123',
      name: 'Test Organization',
      description: 'Test Description',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };

    const mockUsers = [
      { id: 'user_1', orgId: 'org_123' },
      { id: 'user_2', orgId: 'org_123' }
    ];

    const mockProjects = [
      { id: 'proj_1', orgId: 'org_123', status: 'active' },
      { id: 'proj_2', orgId: 'org_123', status: 'planning' }
    ];

    const mockTools = [
      { id: 'tool_1', orgId: 'org_123' }
    ];

    vi.mocked(getItem).mockResolvedValue(mockOrganization);
    vi.mocked(getAllItems)
      .mockResolvedValueOnce(mockUsers)
      .mockResolvedValueOnce(mockProjects)
      .mockResolvedValueOnce(mockTools);

    // Import and call the getOrg function
    const { getOrg } = await import('../functions/orgs');
    await getOrg(mockContext, mockReq);

    expect(mockContext.res).toBeDefined();
    expect(mockContext.res?.status).toBe(200);
    expect(mockContext.res?.body).toEqual({
      success: true,
      data: {
        ...mockOrganization,
        stats: {
          users: 2,
          projects: 2,
          tools: 1,
          activeProjects: 1
        }
      }
    });
  });

  it('should return 404 when organization not found', async () => {
    const { getItem } = await import('@repo/lib/db');
    vi.mocked(getItem).mockResolvedValue(null);

    // Import and call the getOrg function
    const { getOrg } = await import('../functions/orgs');
    await getOrg(mockContext, mockReq);

    expect(mockContext.res).toBeDefined();
    expect(mockContext.res?.status).toBe(404);
    expect(mockContext.res?.body).toEqual({
      success: false,
      error: 'NOT_FOUND',
      message: 'Organization not found'
    });
  });

  it('should throw error when database fails', async () => {
    const { getItem } = await import('@repo/lib/db');
    vi.mocked(getItem).mockRejectedValue(new Error('Database error'));

    // Import and call the getOrg function
    const { getOrg } = await import('../functions/orgs');
    
    // The function should throw the error
    await expect(getOrg(mockContext, mockReq)).rejects.toThrow('Database error');
  });

  it('should include CORS headers', async () => {
    const { getItem, getAllItems } = await import('@repo/lib/db');
    
    const mockOrganization = {
      id: 'org_123',
      orgId: 'org_123',
      name: 'Test Organization'
    };

    vi.mocked(getItem).mockResolvedValue(mockOrganization);
    vi.mocked(getAllItems).mockResolvedValue([]);

    // Import and call the getOrg function
    const { getOrg } = await import('../functions/orgs');
    await getOrg(mockContext, mockReq);

    expect(mockContext.res?.headers).toEqual({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
  });

  it('should calculate stats correctly', async () => {
    const { getItem, getAllItems } = await import('@repo/lib/db');
    
    const mockOrganization = {
      id: 'org_123',
      orgId: 'org_123',
      name: 'Test Organization'
    };

    const mockUsers = [
      { id: 'user_1', orgId: 'org_123' },
      { id: 'user_2', orgId: 'org_123' },
      { id: 'user_3', orgId: 'org_456' } // Different org
    ];

    const mockProjects = [
      { id: 'proj_1', orgId: 'org_123', status: 'active' },
      { id: 'proj_2', orgId: 'org_123', status: 'active' },
      { id: 'proj_3', orgId: 'org_123', status: 'planning' }
    ];

    const mockTools = [
      { id: 'tool_1', orgId: 'org_123' },
      { id: 'tool_2', orgId: 'org_123' }
    ];

    vi.mocked(getItem).mockResolvedValue(mockOrganization);
    vi.mocked(getAllItems)
      .mockResolvedValueOnce(mockUsers)
      .mockResolvedValueOnce(mockProjects)
      .mockResolvedValueOnce(mockTools);

    // Import and call the getOrg function
    const { getOrg } = await import('../functions/orgs');
    await getOrg(mockContext, mockReq);

    expect(mockContext.res?.body.data.stats).toEqual({
      users: 2, // Only users from org_123
      projects: 3, // All projects from org_123
      tools: 2, // All tools from org_123
      activeProjects: 2 // Only active projects
    });
  });
});