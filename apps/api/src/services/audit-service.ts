import crypto from 'crypto';
import { z } from 'zod';

// Audit event schema
export const AuditEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  actor: z.object({
    id: z.string(),
    type: z.enum(['user', 'system', 'api']),
    name: z.string().optional(),
    email: z.string().optional(),
    ip: z.string().optional(),
    userAgent: z.string().optional()
  }),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string().optional(),
  organizationId: z.string().optional(),
  projectId: z.string().optional(),
  payload: z.record(z.any()).optional(),
  payloadHash: z.string(),
  result: z.enum(['success', 'failure', 'error']),
  errorMessage: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export type AuditEvent = z.infer<typeof AuditEventSchema>;

export class AuditService {
  private events: Map<string, AuditEvent> = new Map();

  // Generate payload hash for integrity verification
  private generatePayloadHash(payload: any): string {
    const payloadString = JSON.stringify(payload, Object.keys(payload).sort());
    return crypto.createHash('sha256').update(payloadString).digest('hex');
  }

  // Create audit event
  async createEvent(
    actor: AuditEvent['actor'],
    action: string,
    resource: string,
    resourceId?: string,
    organizationId?: string,
    projectId?: string,
    payload?: any,
    result: 'success' | 'failure' | 'error' = 'success',
    errorMessage?: string,
    metadata?: Record<string, any>
  ): Promise<AuditEvent> {
    const payloadHash = payload ? this.generatePayloadHash(payload) : '';
    
    const event: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      resource,
      resourceId,
      organizationId,
      projectId,
      payload,
      payloadHash,
      result,
      errorMessage,
      metadata
    };

    this.events.set(event.id, event);
    
    // In a real implementation, this would be sent to a logging service
    console.log('Audit Event:', JSON.stringify(event, null, 2));
    
    return event;
  }

  // Get audit events for organization
  async getEvents(
    organizationId: string,
    filters?: {
      actorId?: string;
      action?: string;
      resource?: string;
      startDate?: string;
      endDate?: string;
      result?: 'success' | 'failure' | 'error';
    },
    limit = 100
  ): Promise<AuditEvent[]> {
    let events = Array.from(this.events.values())
      .filter(event => event.organizationId === organizationId);

    if (filters) {
      if (filters.actorId) {
        events = events.filter(event => event.actor.id === filters.actorId);
      }
      if (filters.action) {
        events = events.filter(event => event.action === filters.action);
      }
      if (filters.resource) {
        events = events.filter(event => event.resource === filters.resource);
      }
      if (filters.startDate) {
        events = events.filter(event => event.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        events = events.filter(event => event.timestamp <= filters.endDate!);
      }
      if (filters.result) {
        events = events.filter(event => event.result === filters.result);
      }
    }

    return events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Get audit events for specific resource
  async getResourceEvents(
    resource: string,
    resourceId: string,
    organizationId?: string
  ): Promise<AuditEvent[]> {
    let events = Array.from(this.events.values())
      .filter(event => event.resource === resource && event.resourceId === resourceId);

    if (organizationId) {
      events = events.filter(event => event.organizationId === organizationId);
    }

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Verify payload integrity
  verifyPayloadIntegrity(event: AuditEvent, payload: any): boolean {
    const expectedHash = this.generatePayloadHash(payload);
    return event.payloadHash === expectedHash;
  }

  // Get audit statistics
  async getAuditStats(organizationId: string, days = 30): Promise<{
    totalEvents: number;
    successEvents: number;
    failureEvents: number;
    errorEvents: number;
    topActions: Array<{ action: string; count: number }>;
    topActors: Array<{ actorId: string; actorName: string; count: number }>;
    topResources: Array<{ resource: string; count: number }>;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const events = await this.getEvents(organizationId, {
      startDate: startDate.toISOString()
    });

    const totalEvents = events.length;
    const successEvents = events.filter(e => e.result === 'success').length;
    const failureEvents = events.filter(e => e.result === 'failure').length;
    const errorEvents = events.filter(e => e.result === 'error').length;

    // Top actions
    const actionCounts = events.reduce((acc, event) => {
      acc[event.action] = (acc[event.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top actors
    const actorCounts = events.reduce((acc, event) => {
      const key = `${event.actor.id}:${event.actor.name || 'Unknown'}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topActors = Object.entries(actorCounts)
      .map(([key, count]) => {
        const [actorId, actorName] = key.split(':');
        return { actorId, actorName, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top resources
    const resourceCounts = events.reduce((acc, event) => {
      acc[event.resource] = (acc[event.resource] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topResources = Object.entries(resourceCounts)
      .map(([resource, count]) => ({ resource, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEvents,
      successEvents,
      failureEvents,
      errorEvents,
      topActions,
      topActors,
      topResources
    };
  }
}

// Singleton instance
export const auditService = new AuditService();
