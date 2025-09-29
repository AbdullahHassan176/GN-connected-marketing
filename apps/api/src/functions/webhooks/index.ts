import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { z } from 'zod';
import { webhookService } from '../../services/webhook-service';

// Validation schemas
const CreateEndpointSchema = z.object({
  url: z.string().url(),
  secret: z.string().min(1),
  events: z.array(z.enum(['work_item.created', 'approval.requested', 'insights.updated', 'export.completed']))
});

const UpdateEndpointSchema = z.object({
  url: z.string().url().optional(),
  secret: z.string().min(1).optional(),
  events: z.array(z.enum(['work_item.created', 'approval.requested', 'insights.updated', 'export.completed'])).optional(),
  isActive: z.boolean().optional()
});

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  try {
    const { method } = req;
    const organizationId = req.headers['x-organization-id'] || 'org_123'; // Mock for now

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

    switch (method) {
      case 'GET':
        await handleGetWebhooks(context, organizationId, corsHeaders);
        break;
      case 'POST':
        await handleCreateWebhook(context, req, organizationId, corsHeaders);
        break;
      default:
        context.res = {
          status: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    context.log.error('Webhook API error:', error);
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

async function handleGetWebhooks(context: Context, organizationId: string, corsHeaders: Record<string, string>) {
  try {
    const endpoints = await webhookService.getEndpoints(organizationId);
    const events = await webhookService.getEvents(organizationId, 20);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({
        endpoints,
        events,
        summary: {
          totalEndpoints: endpoints.length,
          activeEndpoints: endpoints.filter(e => e.isActive).length,
          totalEvents: events.length,
          pendingEvents: events.filter(e => e.status === 'pending').length,
          failedEvents: events.filter(e => e.status === 'failed').length,
          deadLetterEvents: events.filter(e => e.status === 'dead_letter').length
        }
      })
    };
  } catch (error) {
    context.log.error('Error getting webhooks:', error);
    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({
        error: 'Failed to get webhooks',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
}

async function handleCreateWebhook(context: Context, req: HttpRequest, organizationId: string, corsHeaders: Record<string, string>) {
  try {
    const body = JSON.parse(req.body || '{}');
    const validatedData = CreateEndpointSchema.parse(body);

    const endpoint = await webhookService.createEndpoint(
      organizationId,
      validatedData.url,
      validatedData.secret,
      validatedData.events
    );

    context.res = {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({
        success: true,
        endpoint,
        message: 'Webhook endpoint created successfully'
      })
    };
  } catch (error) {
    context.log.error('Error creating webhook:', error);
    context.res = {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({
        error: 'Failed to create webhook',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
}

export default httpTrigger;
