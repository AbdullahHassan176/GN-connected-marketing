import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { withSecurity, handleCORS } from '../../middleware/security';
import { auditService } from '../../services/audit-service';
import { z } from 'zod';

// Validation schemas
const AuditFiltersSchema = z.object({
  actorId: z.string().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  result: z.enum(['success', 'failure', 'error']).optional(),
  limit: z.string().transform(Number).optional()
});

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  const operation = withSecurity(
    'get_audit_logs',
    'readonly',
    async (context: Context, req: HttpRequest) => {
      // Handle CORS
      if (handleCORS(context, req)) return;

      const organizationId = req.headers['x-organization-id'] || 'org_123'; // Mock for now
      const filters = AuditFiltersSchema.parse(req.query);

      try {
        const events = await auditService.getEvents(organizationId, filters, filters.limit || 100);
        const stats = await auditService.getAuditStats(organizationId, 30);

        context.res = {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            events,
            stats,
            pagination: {
              total: events.length,
              limit: filters.limit || 100
            }
          })
        };
      } catch (error) {
        context.log.error('Error getting audit logs:', error);
        context.res = {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            error: 'Failed to get audit logs',
            message: error instanceof Error ? error.message : 'Unknown error'
          })
        };
      }
    }
  );

  return operation(context, req);
};

export default httpTrigger;
