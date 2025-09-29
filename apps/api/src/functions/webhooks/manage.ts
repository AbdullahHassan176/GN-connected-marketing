import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { z } from 'zod';
import { webhookService } from '../../services/webhook-service';

// Validation schemas
const UpdateEndpointSchema = z.object({
  url: z.string().url().optional(),
  secret: z.string().min(1).optional(),
  events: z.array(z.enum(['work_item.created', 'approval.requested', 'insights.updated', 'export.completed'])).optional(),
  isActive: z.boolean().optional()
});

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  try {
    const { method } = req;
    const endpointId = req.params.id;
    const organizationId = req.headers['x-organization-id'] || 'org_123'; // Mock for now

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
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

    switch (method) {
      case 'GET':
        await handleGetWebhook(context, endpointId, organizationId, corsHeaders);
        break;
      case 'PUT':
        await handleUpdateWebhook(context, req, endpointId, organizationId, corsHeaders);
        break;
      case 'DELETE':
        await handleDeleteWebhook(context, endpointId, organizationId, corsHeaders);
        break;
      default:
        context.res = {
          status: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    context.log.error('Webhook management error:', error);
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

async function handleGetWebhook(context: Context, endpointId: string, organizationId: string, corsHeaders: Record<string, string>) {
  try {
    const endpoints = await webhookService.getEndpoints(organizationId);
    const endpoint = endpoints.find(e => e.id === endpointId);

    if (!endpoint) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        body: JSON.stringify({ error: 'Webhook endpoint not found' })
      };
      return;
    }

    // Get recent events for this endpoint
    const events = await webhookService.getEvents(organizationId, 50);
    const endpointEvents = events.filter(event => 
      endpoint.events.includes(event.type)
    );

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({
        endpoint,
        events: endpointEvents,
        stats: {
          totalEvents: endpointEvents.length,
          deliveredEvents: endpointEvents.filter(e => e.status === 'delivered').length,
          failedEvents: endpointEvents.filter(e => e.status === 'failed').length,
          pendingEvents: endpointEvents.filter(e => e.status === 'pending').length,
          deadLetterEvents: endpointEvents.filter(e => e.status === 'dead_letter').length
        }
      })
    };
  } catch (error) {
    context.log.error('Error getting webhook:', error);
    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({
        error: 'Failed to get webhook',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
}

async function handleUpdateWebhook(context: Context, req: HttpRequest, endpointId: string, organizationId: string, corsHeaders: Record<string, string>) {
  try {
    const body = JSON.parse(req.body || '{}');
    const validatedData = UpdateEndpointSchema.parse(body);

    const updatedEndpoint = await webhookService.updateEndpoint(endpointId, validatedData);

    if (!updatedEndpoint) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        body: JSON.stringify({ error: 'Webhook endpoint not found' })
      };
      return;
    }

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({
        success: true,
        endpoint: updatedEndpoint,
        message: 'Webhook endpoint updated successfully'
      })
    };
  } catch (error) {
    context.log.error('Error updating webhook:', error);
    context.res = {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({
        error: 'Failed to update webhook',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
}

async function handleDeleteWebhook(context: Context, endpointId: string, organizationId: string, corsHeaders: Record<string, string>) {
  try {
    const deleted = await webhookService.deleteEndpoint(endpointId);

    if (!deleted) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        body: JSON.stringify({ error: 'Webhook endpoint not found' })
      };
      return;
    }

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({
        success: true,
        message: 'Webhook endpoint deleted successfully'
      })
    };
  } catch (error) {
    context.log.error('Error deleting webhook:', error);
    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      body: JSON.stringify({
        error: 'Failed to delete webhook',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
}

export default httpTrigger;
