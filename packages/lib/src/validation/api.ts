import { z } from 'zod';

// Common schemas
export const IdSchema = z.string().min(1, 'ID is required');
export const OrgIdSchema = z.string().min(1, 'Organization ID is required');
export const ProjectIdSchema = z.string().min(1, 'Project ID is required');
export const EmailSchema = z.string().email('Invalid email format');
export const DateSchema = z.string().datetime('Invalid date format');

// Organization schemas
export const OrganizationSchema = z.object({
  id: IdSchema,
  orgId: OrgIdSchema,
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  settings: z.object({
    timezone: z.string().default('UTC'),
    currency: z.string().default('USD'),
    language: z.string().default('en'),
    features: z.object({
      aiInsights: z.boolean().default(false),
      advancedAnalytics: z.boolean().default(false),
      teamCollaboration: z.boolean().default(false),
      customBranding: z.boolean().default(false),
    }).optional(),
  }).optional(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const CreateOrganizationSchema = OrganizationSchema.omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateOrganizationSchema = CreateOrganizationSchema.partial();

// User schemas
export const UserRoleSchema = z.object({
  scope: z.enum(['org', 'project']),
  scopeId: z.string().min(1),
  role: z.enum(['owner', 'admin', 'manager', 'analyst', 'client']),
});

export const UserSchema = z.object({
  id: IdSchema,
  orgId: OrgIdSchema,
  email: EmailSchema,
  name: z.string().min(1, 'Name is required'),
  avatarUrl: z.string().url().optional(),
  roles: z.array(UserRoleSchema).min(1, 'At least one role is required'),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
  preferences: z.object({
    theme: z.enum(['light', 'dark']).default('light'),
    language: z.string().default('en'),
    notifications: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(false),
      sms: z.boolean().default(false),
    }).optional(),
  }).optional(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateUserSchema = CreateUserSchema.partial();

// Project schemas
export const ProjectKPISchema = z.object({
  impressions: z.number().min(0).default(0),
  clicks: z.number().min(0).default(0),
  conversions: z.number().min(0).default(0),
  revenue: z.number().min(0).default(0),
  roi: z.number().default(0),
  ctr: z.number().min(0).max(100).default(0),
  conversionRate: z.number().min(0).max(100).default(0),
});

export const ProjectSchema = z.object({
  id: IdSchema,
  orgId: OrgIdSchema,
  projectId: ProjectIdSchema,
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.enum(['planning', 'active', 'paused', 'completed', 'cancelled']).default('planning'),
  startDate: DateSchema.optional(),
  endDate: DateSchema.optional(),
  budget: z.number().min(0).default(0),
  spent: z.number().min(0).default(0),
  teamSize: z.number().min(0).default(0),
  progress: z.number().min(0).max(100).default(0),
  tags: z.array(z.string()).default([]),
  settings: z.object({
    notifications: z.boolean().default(true),
    reporting: z.enum(['daily', 'weekly', 'bi-weekly', 'monthly']).default('weekly'),
    collaboration: z.enum(['individual', 'team', 'organization']).default('team'),
  }).optional(),
  kpis: ProjectKPISchema.optional(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  projectId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

// Work Item schemas
export const WorkItemSchema = z.object({
  id: IdSchema,
  projectId: ProjectIdSchema,
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).default('pending'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  assigneeId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  dueDate: DateSchema.optional(),
  estimatedHours: z.number().min(0).default(0),
  actualHours: z.number().min(0).default(0),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const CreateWorkItemSchema = WorkItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateWorkItemSchema = CreateWorkItemSchema.partial();

// Event schemas
export const EventSchema = z.object({
  id: IdSchema,
  projectId: ProjectIdSchema,
  title: z.string().min(1, 'Event title is required'),
  description: z.string().optional(),
  type: z.enum(['meeting', 'review', 'deadline', 'milestone', 'other']).default('meeting'),
  startTime: DateSchema,
  endTime: DateSchema,
  attendees: z.array(z.string()).default([]),
  location: z.string().optional(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const CreateEventSchema = EventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Asset schemas
export const AssetSchema = z.object({
  id: IdSchema,
  projectId: ProjectIdSchema,
  name: z.string().min(1, 'Asset name is required'),
  type: z.enum(['document', 'image', 'video', 'audio', 'other']).default('document'),
  url: z.string().url('Invalid URL format'),
  size: z.number().min(0, 'Size must be positive'),
  mimeType: z.string().min(1, 'MIME type is required'),
  tags: z.array(z.string()).default([]),
  uploadedBy: z.string().min(1, 'Uploader ID is required'),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const CreateAssetSchema = AssetSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Insight schemas
export const InsightContentSchema = z.object({
  summary: z.string().min(1, 'Summary is required'),
  recommendations: z.array(z.string()).default([]),
  metrics: z.record(z.number()).optional(),
});

export const InsightSchema = z.object({
  id: IdSchema,
  projectId: ProjectIdSchema,
  title: z.string().min(1, 'Insight title is required'),
  description: z.string().optional(),
  type: z.enum(['ai_generated', 'manual', 'automated']).default('manual'),
  content: InsightContentSchema,
  generatedBy: z.string().min(1, 'Generator ID is required'),
  confidence: z.number().min(0).max(1).optional(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const CreateInsightSchema = InsightSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Message schemas
export const MessageSchema = z.object({
  id: IdSchema,
  projectId: ProjectIdSchema,
  content: z.string().min(1, 'Message content is required'),
  senderId: z.string().min(1, 'Sender ID is required'),
  type: z.enum(['text', 'image', 'file', 'system']).default('text'),
  attachments: z.array(z.string()).default([]),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const CreateMessageSchema = MessageSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Approval schemas
export const ApprovalSchema = z.object({
  id: IdSchema,
  projectId: ProjectIdSchema,
  title: z.string().min(1, 'Approval title is required'),
  description: z.string().optional(),
  type: z.enum(['budget', 'creative', 'timeline', 'resource', 'other']).default('budget'),
  status: z.enum(['pending', 'approved', 'rejected', 'cancelled']).default('pending'),
  requestedBy: z.string().min(1, 'Requester ID is required'),
  requestedFor: z.string().min(1, 'Approver ID is required'),
  amount: z.number().min(0).default(0),
  currency: z.string().default('USD'),
  dueDate: DateSchema.optional(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const CreateApprovalSchema = ApprovalSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateApprovalSchema = CreateApprovalSchema.partial();

// Tool schemas
export const ToolSchema = z.object({
  id: IdSchema,
  orgId: OrgIdSchema,
  name: z.string().min(1, 'Tool name is required'),
  description: z.string().optional(),
  category: z.enum(['content', 'analytics', 'automation', 'communication', 'other']).default('content'),
  status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
  settings: z.record(z.any()).optional(),
  usage: z.object({
    totalRequests: z.number().min(0).default(0),
    successfulRequests: z.number().min(0).default(0),
    lastUsed: DateSchema.optional(),
  }).optional(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const CreateToolSchema = ToolSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateToolSchema = CreateToolSchema.partial();

// Query parameter schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const SortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const FilterSchema = z.object({
  status: z.string().optional(),
  type: z.string().optional(),
  assigneeId: z.string().optional(),
  tags: z.string().optional(),
  dateFrom: DateSchema.optional(),
  dateTo: DateSchema.optional(),
});

// Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }).optional(),
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
  details: z.any().optional(),
});

// Schemas are already exported above
