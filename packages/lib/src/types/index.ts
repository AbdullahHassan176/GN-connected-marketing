import { z } from 'zod';

// Base entity schema
export const BaseEntitySchema = z.object({
  id: z.string(),
  type: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Organization types
export const OrganizationSchema = BaseEntitySchema.extend({
  type: z.literal('organization'),
  orgId: z.string(),
  name: z.string(),
  domains: z.array(z.string()),
  settings: z.object({
    billingPlan: z.enum(['free', 'pro', 'enterprise']),
    locale: z.enum(['en', 'ar']),
    rtl: z.boolean(),
  }),
});

export type Organization = z.infer<typeof OrganizationSchema>;

// User types
export const RoleSchema = z.object({
  scope: z.enum(['org', 'project']),
  scopeId: z.string(),
  role: z.enum(['owner', 'admin', 'manager', 'analyst', 'client']),
});

export const UserSchema = BaseEntitySchema.extend({
  type: z.literal('user'),
  orgId: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatarUrl: z.string().optional(),
  provider: z.enum(['credentials', 'google', 'microsoft']),
  roles: z.array(RoleSchema),
  status: z.enum(['active', 'inactive', 'suspended']),
});

export type User = z.infer<typeof UserSchema>;
export type Role = z.infer<typeof RoleSchema>;

// Project types
export const ProjectStageSchema = z.object({
  stage: z.string(),
  from: z.string().datetime(),
  to: z.string().datetime(),
  status: z.enum(['pending', 'in_progress', 'done', 'cancelled']),
});

export const KPISchema = z.object({
  ctr: z.number(),
  roi: z.number(),
  engagement: z.number(),
  sentiment: z.number(),
  conversions: z.number(),
});

export const AIToolSchema = z.object({
  name: z.string(),
  use: z.string(),
});

export const ProjectSchema = BaseEntitySchema.extend({
  type: z.literal('project'),
  orgId: z.string(),
  name: z.string(),
  clientRef: z.string(),
  stages: z.array(z.string()),
  currentStage: z.string(),
  timeline: z.array(ProjectStageSchema),
  kpis: KPISchema,
  aiTools: z.array(AIToolSchema),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectStage = z.infer<typeof ProjectStageSchema>;
export type KPIs = z.infer<typeof KPISchema>;
export type AITool = z.infer<typeof AIToolSchema>;

// Work Item types
export const WorkItemSchema = BaseEntitySchema.extend({
  type: z.literal('work_item'),
  orgId: z.string(),
  projectId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assigneeId: z.string().optional(),
  labels: z.array(z.string()),
  due: z.string().datetime().optional(),
  audit: z.object({
    createdBy: z.string(),
    createdAt: z.string().datetime(),
    updates: z.array(z.object({
      field: z.string(),
      oldValue: z.any(),
      newValue: z.any(),
      updatedBy: z.string(),
      updatedAt: z.string().datetime(),
    })),
  }),
});

export type WorkItem = z.infer<typeof WorkItemSchema>;

// Event types
export const EventSchema = BaseEntitySchema.extend({
  type: z.literal('event'),
  orgId: z.string(),
  projectId: z.string().optional(),
  userId: z.string(),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string(),
  metadata: z.record(z.any()),
});

export type Event = z.infer<typeof EventSchema>;

// Asset types
export const AssetSchema = BaseEntitySchema.extend({
  type: z.literal('asset'),
  orgId: z.string(),
  projectId: z.string(),
  name: z.string(),
  mimeType: z.string(),
  size: z.number(),
  blobUrl: z.string(),
  sasUrl: z.string().optional(),
  uploadedBy: z.string(),
});

export type Asset = z.infer<typeof AssetSchema>;

// Insight types
export const KPITimeSeriesSchema = z.object({
  t: z.string().datetime(),
  ctr: z.number(),
  roi: z.number(),
  engagement: z.number(),
  sentiment: z.number(),
  conversions: z.number(),
});

export const ForecastSchema = z.object({
  roiNext30d: z.number(),
  confInt: z.tuple([z.number(), z.number()]),
});

export const ABTestSchema = z.object({
  name: z.string(),
  winner: z.string(),
  lift: z.number(),
});

export const SentimentHeatmapSchema = z.object({
  channel: z.string(),
  score: z.number(),
});

export const RecommendationSchema = z.object({
  type: z.string(),
  message: z.string(),
  rationale: z.string(),
});

export const InsightSchema = BaseEntitySchema.extend({
  type: z.literal('insight'),
  orgId: z.string(),
  projectId: z.string(),
  kpisTimeSeries: z.array(KPITimeSeriesSchema),
  forecasts: ForecastSchema,
  abTests: z.array(ABTestSchema),
  sentimentHeatmap: z.array(SentimentHeatmapSchema),
  recommendations: z.array(RecommendationSchema),
});

export type Insight = z.infer<typeof InsightSchema>;
export type KPITimeSeries = z.infer<typeof KPITimeSeriesSchema>;
export type Forecast = z.infer<typeof ForecastSchema>;
export type ABTest = z.infer<typeof ABTestSchema>;
export type SentimentHeatmap = z.infer<typeof SentimentHeatmapSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;

// Message types
export const MessageSchema = BaseEntitySchema.extend({
  type: z.literal('message'),
  orgId: z.string(),
  projectId: z.string(),
  userId: z.string(),
  content: z.string(),
  messageType: z.enum(['chat', 'note', 'system']),
  metadata: z.record(z.any()).optional(),
});

export type Message = z.infer<typeof MessageSchema>;

// Approval types
export const ApprovalSchema = BaseEntitySchema.extend({
  type: z.literal('approval'),
  orgId: z.string(),
  projectId: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'cancelled']),
  requestedBy: z.string(),
  approvedBy: z.string().optional(),
  approvedAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

export type Approval = z.infer<typeof ApprovalSchema>;

// Tool Inventory types
export const ToolInventorySchema = BaseEntitySchema.extend({
  type: z.literal('tool_inventory'),
  orgId: z.string(),
  name: z.string(),
  category: z.string(),
  status: z.enum(['active', 'inactive', 'maintenance']),
  seats: z.number(),
  usedSeats: z.number(),
  usageLogs: z.array(z.object({
    userId: z.string(),
    action: z.string(),
    timestamp: z.string().datetime(),
  })),
});

export type ToolInventory = z.infer<typeof ToolInventorySchema>;

// API Response types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Auth types
export const AuthUserSchema = UserSchema.pick({
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  orgId: true,
  roles: true,
  status: true,
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

// RBAC types
export type RBACScope = 'org' | 'project';
export type RBACRole = 'owner' | 'admin' | 'manager' | 'analyst' | 'client';

export interface RBACRequirement {
  scope: RBACScope;
  role: RBACRole;
  scopeId?: string;
}
