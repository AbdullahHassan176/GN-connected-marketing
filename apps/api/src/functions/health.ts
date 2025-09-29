import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { healthCheck } from '@repo/lib/db';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('Health check requested');

  try {
    // Perform health check
    const health = await healthCheck();
    
    context.res = {
      status: health.ok ? 200 : 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: {
        ok: health.ok,
        message: health.message,
        timestamp: new Date().toISOString(),
        details: health.details,
      },
    };
  } catch (error) {
    context.log.error('Health check failed:', error);
    
    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        ok: false,
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

export default httpTrigger;
