import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { webhookService } from '../../services/webhook-service';

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  try {
    const { method } = req;
    const endpointId = req.params.id;
    const organizationId = req.headers['x-organization-id'] || 'org_123'; // Mock for now

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Organization-ID'
    };

    // Handle preflight requests
    if (method === 'OPTIONS') {
      context.res = {
        status: 200,
        headers: corsHeaders,
        body: ''
      };
      return;
    }

    if (method !== 'POST') {
      context.res = {
        status: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
      return;
    }

    if (!endpointId) {
      context.res = {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        body: JSON.stringify({ error: 'Endpoint ID is required' })
      };
      return;
    }

    // Send test webhook
    const result = await webhookService.sendTestWebhook(endpointId);

    context.res = {
      status: result.success ? 200 : 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    context.log.error('Test webhook error:', error);
    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

export default httpTrigger;
