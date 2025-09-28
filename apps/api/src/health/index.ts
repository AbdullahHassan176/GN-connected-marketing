import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { healthCheck } from '@repo/lib';

export async function getHealth(req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const result = await healthCheck();
    
    return {
      status: result.ok ? 200 : 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      jsonBody: {
        ok: result.ok,
        error: result.error,
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
      },
    };
  } catch (error: any) {
    ctx.log.error('Health check failed:', error);
    
    return {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      jsonBody: {
        ok: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

app.http('health', {
  route: 'v1/health',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: getHealth,
});
