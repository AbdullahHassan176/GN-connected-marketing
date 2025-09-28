import { z } from 'zod';

// Common validation schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const IdSchema = z.object({
  id: z.string().min(1),
});

export const OrgIdSchema = z.object({
  orgId: z.string().min(1),
});

export const ProjectIdSchema = z.object({
  projectId: z.string().min(1),
});

// Auth validation
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

// Organization validation
export const CreateOrganizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  domains: z.array(z.string().url('Invalid domain URL')).optional(),
  settings: z.object({
    billingPlan: z.enum(['free', 'pro', 'enterprise']).default('free'),
    locale: z.enum(['en', 'ar']).default('en'),
    rtl: z.boolean().default(false),
  }).optional(),
});

export const UpdateOrganizationSchema = CreateOrganizationSchema.partial();

// User validation
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  roles: z.array(z.object({
    scope: z.enum(['org', 'project']),
    scopeId: z.string(),
    role: z.enum(['owner', 'admin', 'manager', 'analyst', 'client']),
  })).min(1, 'User must have at least one role'),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  roles: z.array(z.object({
    scope: z.enum(['org', 'project']),
    scopeId: z.string(),
    role: z.enum(['owner', 'admin', 'manager', 'analyst', 'client']),
  })).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
});

// Project validation
export const CreateProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  clientRef: z.string().min(2, 'Client reference must be at least 2 characters'),
  stages: z.array(z.string()).min(1, 'Project must have at least one stage'),
  currentStage: z.string().min(1, 'Current stage is required'),
  timeline: z.array(z.object({
    stage: z.string(),
    from: z.string().datetime(),
    to: z.string().datetime(),
    status: z.enum(['pending', 'in_progress', 'done', 'cancelled']),
  })).optional(),
  kpis: z.object({
    ctr: z.number().min(0).max(1),
    roi: z.number().min(0),
    engagement: z.number().min(0).max(1),
    sentiment: z.number().min(-1).max(1),
    conversions: z.number().min(0),
  }).optional(),
  aiTools: z.array(z.object({
    name: z.string(),
    use: z.string(),
  })).optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

// Work Item validation
export const CreateWorkItemSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done', 'cancelled']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  assigneeId: z.string().optional(),
  labels: z.array(z.string()).default([]),
  due: z.string().datetime().optional(),
});

export const UpdateWorkItemSchema = CreateWorkItemSchema.partial();

// Message validation
export const CreateMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  messageType: z.enum(['chat', 'note', 'system']).default('chat'),
  metadata: z.record(z.any()).optional(),
});

// Approval validation
export const CreateApprovalSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
  metadata: z.record(z.any()).optional(),
});

export const UpdateApprovalSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'cancelled']),
});

// Insight validation
export const CreateInsightSchema = z.object({
  kpisTimeSeries: z.array(z.object({
    t: z.string().datetime(),
    ctr: z.number(),
    roi: z.number(),
    engagement: z.number(),
    sentiment: z.number(),
    conversions: z.number(),
  })).optional(),
  forecasts: z.object({
    roiNext30d: z.number(),
    confInt: z.tuple([z.number(), z.number()]),
  }).optional(),
  abTests: z.array(z.object({
    name: z.string(),
    winner: z.string(),
    lift: z.number(),
  })).optional(),
  sentimentHeatmap: z.array(z.object({
    channel: z.string(),
    score: z.number(),
  })).optional(),
  recommendations: z.array(z.object({
    type: z.string(),
    message: z.string(),
    rationale: z.string(),
  })).optional(),
});

// Tool Inventory validation
export const CreateToolInventorySchema = z.object({
  name: z.string().min(2, 'Tool name must be at least 2 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
  seats: z.number().min(1, 'Must have at least 1 seat'),
});

export const UpdateToolInventorySchema = CreateToolInventorySchema.partial();

// Query validation
export const ProjectQuerySchema = z.object({
  ...PaginationSchema.shape,
  status: z.enum(['active', 'inactive', 'completed']).optional(),
  stage: z.string().optional(),
  clientRef: z.string().optional(),
});

export const WorkItemQuerySchema = z.object({
  ...PaginationSchema.shape,
  status: z.enum(['todo', 'in_progress', 'review', 'done', 'cancelled']).optional(),
  assigneeId: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  labels: z.array(z.string()).optional(),
});

export const MessageQuerySchema = z.object({
  ...PaginationSchema.shape,
  messageType: z.enum(['chat', 'note', 'system']).optional(),
  userId: z.string().optional(),
});

// Export types
export type PaginationParams = z.infer<typeof PaginationSchema>;
export type LoginParams = z.infer<typeof LoginSchema>;
export type RegisterParams = z.infer<typeof RegisterSchema>;
export type CreateOrganizationParams = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganizationParams = z.infer<typeof UpdateOrganizationSchema>;
export type CreateUserParams = z.infer<typeof CreateUserSchema>;
export type UpdateUserParams = z.infer<typeof UpdateUserSchema>;
export type CreateProjectParams = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectParams = z.infer<typeof UpdateProjectSchema>;
export type CreateWorkItemParams = z.infer<typeof CreateWorkItemSchema>;
export type UpdateWorkItemParams = z.infer<typeof UpdateWorkItemSchema>;
export type CreateMessageParams = z.infer<typeof CreateMessageSchema>;
export type CreateApprovalParams = z.infer<typeof CreateApprovalSchema>;
export type UpdateApprovalParams = z.infer<typeof UpdateApprovalSchema>;
export type CreateInsightParams = z.infer<typeof CreateInsightSchema>;
export type CreateToolInventoryParams = z.infer<typeof CreateToolInventorySchema>;
export type UpdateToolInventoryParams = z.infer<typeof UpdateToolInventorySchema>;
export type ProjectQueryParams = z.infer<typeof ProjectQuerySchema>;
export type WorkItemQueryParams = z.infer<typeof WorkItemQuerySchema>;
export type MessageQueryParams = z.infer<typeof MessageQuerySchema>;
