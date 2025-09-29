import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Context } from '@azure/functions';

// Mock the database module
vi.mock('@repo/lib/db', () => ({
  healthCheck: vi.fn(),
}));

describe('Health Endpoint', () => {
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
      url: '/api/v1/health',
      headers: {},
      body: {},
    };
  });

  it('should return health status when database is healthy', async () => {
    const { healthCheck: mockHealthCheck } = await import('@repo/lib/db');
    vi.mocked(mockHealthCheck).mockResolvedValue({
      ok: true,
      message: 'Database connection successful',
      details: {
        container: 'organizations',
        itemCount: 1,
        sampleItem: { id: 'org_123', orgId: 'org_123' }
      }
    });

    // Import and call the health function
    const { default: healthCheck } = await import('../functions/health');
    await healthCheck(mockContext, mockReq);

    expect(mockContext.res).toBeDefined();
    expect(mockContext.res?.status).toBe(200);
    expect(mockContext.res?.body).toEqual({
      ok: true,
      message: 'Database connection successful',
      timestamp: expect.any(String),
      details: {
        container: 'organizations',
        itemCount: 1,
        sampleItem: { id: 'org_123', orgId: 'org_123' }
      }
    });
  });

  it('should return error when database is unhealthy', async () => {
    const { healthCheck: mockHealthCheck } = await import('@repo/lib/db');
    vi.mocked(mockHealthCheck).mockResolvedValue({
      ok: false,
      message: 'Database connection failed',
      details: { error: 'Connection timeout' }
    });

    // Import and call the health function
    const { default: healthCheck } = await import('../functions/health');
    await healthCheck(mockContext, mockReq);

    expect(mockContext.res).toBeDefined();
    expect(mockContext.res?.status).toBe(500);
    expect(mockContext.res?.body).toEqual({
      ok: false,
      message: 'Database connection failed',
      timestamp: expect.any(String),
      details: { error: 'Connection timeout' }
    });
  });

  it('should handle database errors gracefully', async () => {
    const { healthCheck: mockHealthCheck } = await import('@repo/lib/db');
    vi.mocked(mockHealthCheck).mockRejectedValue(new Error('Database error'));

    // Import and call the health function
    const { default: healthCheck } = await import('../functions/health');
    await healthCheck(mockContext, mockReq);

    expect(mockContext.res).toBeDefined();
    expect(mockContext.res?.status).toBe(500);
    expect(mockContext.res?.body).toEqual({
      ok: false,
      message: 'Health check failed',
      timestamp: expect.any(String),
      error: 'Database error'
    });
  });

  it('should include CORS headers', async () => {
    const { healthCheck: mockHealthCheck } = await import('@repo/lib/db');
    vi.mocked(mockHealthCheck).mockResolvedValue({
      ok: true,
      message: 'Database connection successful',
      details: {}
    });

    // Import and call the health function
    const { default: healthCheck } = await import('../functions/health');
    await healthCheck(mockContext, mockReq);

    expect(mockContext.res?.headers).toEqual({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
  });
});