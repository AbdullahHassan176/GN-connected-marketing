import crypto from 'crypto';
import { z } from 'zod';

// Webhook event schemas
export const WebhookEventSchema = z.object({
  id: z.string(),
  type: z.enum(['work_item.created', 'approval.requested', 'insights.updated', 'export.completed']),
  timestamp: z.string(),
  organizationId: z.string(),
  projectId: z.string().optional(),
  data: z.record(z.any()),
  retryCount: z.number().default(0),
  maxRetries: z.number().default(3),
  status: z.enum(['pending', 'delivered', 'failed', 'dead_letter']).default('pending'),
  lastAttempt: z.string().optional(),
  nextRetry: z.string().optional(),
  errorMessage: z.string().optional()
});

export type WebhookEvent = z.infer<typeof WebhookEventSchema>;

// Webhook endpoint configuration
export const WebhookEndpointSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  url: z.string().url(),
  secret: z.string(),
  events: z.array(z.enum(['work_item.created', 'approval.requested', 'insights.updated', 'export.completed'])),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastDelivery: z.string().optional(),
  deliveryCount: z.number().default(0),
  failureCount: z.number().default(0)
});

export type WebhookEndpoint = z.infer<typeof WebhookEndpointSchema>;

// Webhook delivery attempt
export const WebhookDeliverySchema = z.object({
  id: z.string(),
  eventId: z.string(),
  endpointId: z.string(),
  status: z.enum(['pending', 'delivered', 'failed']),
  attempt: z.number(),
  timestamp: z.string(),
  responseCode: z.number().optional(),
  responseBody: z.string().optional(),
  errorMessage: z.string().optional(),
  duration: z.number().optional()
});

export type WebhookDelivery = z.infer<typeof WebhookDeliverySchema>;

export class WebhookService {
  private endpoints: Map<string, WebhookEndpoint> = new Map();
  private events: Map<string, WebhookEvent> = new Map();
  private deliveries: Map<string, WebhookDelivery> = new Map();

  constructor() {
    // Initialize with some mock endpoints
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockEndpoints: WebhookEndpoint[] = [
      {
        id: 'webhook_1',
        organizationId: 'org_123',
        url: 'https://hooks.zapier.com/hooks/catch/123456/abcdef/',
        secret: 'whsec_1234567890abcdef',
        events: ['work_item.created', 'approval.requested'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deliveryCount: 0,
        failureCount: 0
      },
      {
        id: 'webhook_2',
        organizationId: 'org_123',
        url: 'https://n8n.example.com/webhook/insights',
        secret: 'whsec_fedcba0987654321',
        events: ['insights.updated', 'export.completed'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deliveryCount: 0,
        failureCount: 0
      }
    ];

    mockEndpoints.forEach(endpoint => {
      this.endpoints.set(endpoint.id, endpoint);
    });
  }

  // Generate webhook signature
  private generateSignature(payload: string, secret: string): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    return `sha256=${hmac.digest('hex')}`;
  }

  // Verify webhook signature
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = this.generateSignature(payload, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  // Create webhook event
  async createEvent(
    type: WebhookEvent['type'],
    organizationId: string,
    projectId: string | undefined,
    data: Record<string, any>
  ): Promise<WebhookEvent> {
    const event: WebhookEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date().toISOString(),
      organizationId,
      projectId,
      data,
      retryCount: 0,
      maxRetries: 3,
      status: 'pending',
      lastAttempt: undefined,
      nextRetry: undefined,
      errorMessage: undefined
    };

    this.events.set(event.id, event);
    
    // Queue for delivery
    await this.queueEventDelivery(event);
    
    return event;
  }

  // Queue event for delivery to all matching endpoints
  private async queueEventDelivery(event: WebhookEvent): Promise<void> {
    const matchingEndpoints = Array.from(this.endpoints.values()).filter(
      endpoint => 
        endpoint.organizationId === event.organizationId &&
        endpoint.isActive &&
        endpoint.events.includes(event.type)
    );

    for (const endpoint of matchingEndpoints) {
      await this.deliverEvent(event, endpoint);
    }
  }

  // Deliver event to specific endpoint
  private async deliverEvent(event: WebhookEvent, endpoint: WebhookEndpoint): Promise<void> {
    const deliveryId = `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const attempt = event.retryCount + 1;
    
    const delivery: WebhookDelivery = {
      id: deliveryId,
      eventId: event.id,
      endpointId: endpoint.id,
      status: 'pending',
      attempt,
      timestamp: new Date().toISOString(),
      responseCode: undefined,
      responseBody: undefined,
      errorMessage: undefined,
      duration: undefined
    };

    this.deliveries.set(deliveryId, delivery);

    try {
      const payload = JSON.stringify({
        id: event.id,
        type: event.type,
        timestamp: event.timestamp,
        organizationId: event.organizationId,
        projectId: event.projectId,
        data: event.data
      });

      const signature = this.generateSignature(payload, endpoint.secret);
      
      const startTime = Date.now();
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': event.type,
          'X-Webhook-Timestamp': event.timestamp,
          'User-Agent': 'GlobalNext-Webhook/1.0'
        },
        body: payload,
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      const duration = Date.now() - startTime;
      const responseBody = await response.text();

      delivery.status = response.ok ? 'delivered' : 'failed';
      delivery.responseCode = response.status;
      delivery.responseBody = responseBody;
      delivery.duration = duration;

      if (response.ok) {
        event.status = 'delivered';
        endpoint.deliveryCount++;
      } else {
        event.status = 'failed';
        event.errorMessage = `HTTP ${response.status}: ${responseBody}`;
        endpoint.failureCount++;
        
        // Schedule retry if not exceeded max retries
        if (event.retryCount < event.maxRetries) {
          await this.scheduleRetry(event);
        } else {
          event.status = 'dead_letter';
        }
      }

      event.lastAttempt = new Date().toISOString();
      endpoint.lastDelivery = new Date().toISOString();

    } catch (error) {
      const duration = Date.now() - Date.parse(delivery.timestamp);
      delivery.status = 'failed';
      delivery.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      delivery.duration = duration;

      event.status = 'failed';
      event.errorMessage = delivery.errorMessage;
      endpoint.failureCount++;

      // Schedule retry if not exceeded max retries
      if (event.retryCount < event.maxRetries) {
        await this.scheduleRetry(event);
      } else {
        event.status = 'dead_letter';
      }

      event.lastAttempt = new Date().toISOString();
    }

    this.events.set(event.id, event);
    this.endpoints.set(endpoint.id, endpoint);
    this.deliveries.set(deliveryId, delivery);
  }

  // Schedule retry with exponential backoff
  private async scheduleRetry(event: WebhookEvent): Promise<void> {
    event.retryCount++;
    const delay = Math.min(1000 * Math.pow(2, event.retryCount - 1), 300000); // Max 5 minutes
    event.nextRetry = new Date(Date.now() + delay).toISOString();
    event.status = 'pending';

    // In a real implementation, this would be queued in a job system
    setTimeout(async () => {
      const updatedEvent = this.events.get(event.id);
      if (updatedEvent && updatedEvent.status === 'pending') {
        await this.queueEventDelivery(updatedEvent);
      }
    }, delay);
  }

  // Get webhook endpoints for organization
  async getEndpoints(organizationId: string): Promise<WebhookEndpoint[]> {
    return Array.from(this.endpoints.values()).filter(
      endpoint => endpoint.organizationId === organizationId
    );
  }

  // Create webhook endpoint
  async createEndpoint(
    organizationId: string,
    url: string,
    secret: string,
    events: WebhookEvent['type'][]
  ): Promise<WebhookEndpoint> {
    const endpoint: WebhookEndpoint = {
      id: `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      organizationId,
      url,
      secret,
      events,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deliveryCount: 0,
      failureCount: 0
    };

    this.endpoints.set(endpoint.id, endpoint);
    return endpoint;
  }

  // Update webhook endpoint
  async updateEndpoint(
    endpointId: string,
    updates: Partial<Pick<WebhookEndpoint, 'url' | 'secret' | 'events' | 'isActive'>>
  ): Promise<WebhookEndpoint | null> {
    const endpoint = this.endpoints.get(endpointId);
    if (!endpoint) return null;

    const updatedEndpoint = {
      ...endpoint,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.endpoints.set(endpointId, updatedEndpoint);
    return updatedEndpoint;
  }

  // Delete webhook endpoint
  async deleteEndpoint(endpointId: string): Promise<boolean> {
    return this.endpoints.delete(endpointId);
  }

  // Get webhook events for organization
  async getEvents(organizationId: string, limit = 50): Promise<WebhookEvent[]> {
    return Array.from(this.events.values())
      .filter(event => event.organizationId === organizationId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Get webhook deliveries for event
  async getDeliveries(eventId: string): Promise<WebhookDelivery[]> {
    return Array.from(this.deliveries.values())
      .filter(delivery => delivery.eventId === eventId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Send test webhook
  async sendTestWebhook(endpointId: string): Promise<{ success: boolean; message: string }> {
    const endpoint = this.endpoints.get(endpointId);
    if (!endpoint) {
      return { success: false, message: 'Webhook endpoint not found' };
    }

    try {
      const testPayload = JSON.stringify({
        id: 'test_' + Date.now(),
        type: 'test.ping',
        timestamp: new Date().toISOString(),
        organizationId: endpoint.organizationId,
        data: {
          message: 'This is a test webhook from Global Next Marketing Platform',
          test: true
        }
      });

      const signature = this.generateSignature(testPayload, endpoint.secret);
      
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': 'test.ping',
          'X-Webhook-Timestamp': new Date().toISOString(),
          'User-Agent': 'GlobalNext-Webhook/1.0'
        },
        body: testPayload,
        signal: AbortSignal.timeout(30000)
      });

      if (response.ok) {
        return { success: true, message: 'Test webhook sent successfully' };
      } else {
        const errorBody = await response.text();
        return { 
          success: false, 
          message: `Test webhook failed: HTTP ${response.status} - ${errorBody}` 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: `Test webhook failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}

// Singleton instance
export const webhookService = new WebhookService();
