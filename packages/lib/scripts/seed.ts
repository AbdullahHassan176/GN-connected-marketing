import { nanoid } from 'nanoid';

// Demo organizations
const organizations = [
  {
    id: 'org_123',
    name: 'Global Next Consulting',
    description: 'AI-powered marketing consulting firm',
    industry: 'Marketing & Advertising',
    website: 'https://globalnextconsulting.com',
    logoUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/logos/global-next-logo.png',
    settings: {
      timezone: 'UTC',
      currency: 'USD',
      language: 'en',
      features: {
        aiInsights: true,
        advancedAnalytics: true,
        teamCollaboration: true,
        customBranding: true,
      },
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

// Demo projects
const projects = [
  {
    id: 'proj_456',
    name: 'Premium Hotels Campaign',
    description: 'Luxury hospitality marketing campaign for premium hotel chain',
    orgId: 'org_123',
    status: 'active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-15'),
    budget: 125000,
    spent: 78000,
    teamSize: 8,
    progress: 78,
    tags: ['luxury', 'hospitality', 'premium'],
    settings: {
      notifications: true,
      reporting: 'weekly',
      collaboration: 'team',
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  {
    id: 'proj_789',
    name: 'Tech Startup Launch',
    description: 'Digital marketing strategy for emerging tech startup',
    orgId: 'org_123',
    status: 'planning',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-08-01'),
    budget: 75000,
    spent: 12000,
    teamSize: 5,
    progress: 15,
    tags: ['tech', 'startup', 'digital'],
    settings: {
      notifications: true,
      reporting: 'bi-weekly',
      collaboration: 'team',
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
  },
];

// Demo users with different roles
const users = [
  {
    id: 'user_admin',
    email: 'admin@globalnextconsulting.com',
    password: 'admin123',
    name: 'Sarah Mitchell',
    avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
    orgId: 'org_123',
    roles: [
      { scope: 'org', scopeId: 'org_123', role: 'owner' },
      { scope: 'project', scopeId: 'proj_456', role: 'admin' },
      { scope: 'project', scopeId: 'proj_789', role: 'admin' },
    ],
    status: 'active',
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'user_manager',
    email: 'manager@globalnextconsulting.com',
    password: 'manager123',
    name: 'Marcus Chen',
    avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
    orgId: 'org_123',
    roles: [
      { scope: 'org', scopeId: 'org_123', role: 'manager' },
      { scope: 'project', scopeId: 'proj_456', role: 'manager' },
      { scope: 'project', scopeId: 'proj_789', role: 'manager' },
    ],
    status: 'active',
    preferences: {
      theme: 'dark',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date(),
  },
  {
    id: 'user_analyst',
    email: 'analyst@globalnextconsulting.com',
    password: 'analyst123',
    name: 'Emma Rodriguez',
    avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
    orgId: 'org_123',
    roles: [
      { scope: 'org', scopeId: 'org_123', role: 'analyst' },
      { scope: 'project', scopeId: 'proj_456', role: 'analyst' },
      { scope: 'project', scopeId: 'proj_789', role: 'analyst' },
    ],
    status: 'active',
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: false,
        sms: false,
      },
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date(),
  },
  {
    id: 'user_client',
    email: 'ahmed@premiumhotels.com',
    password: 'client123',
    name: 'Ahmed Al-Rashid',
    avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
    orgId: 'org_123',
    roles: [
      { scope: 'org', scopeId: 'org_123', role: 'client' },
      { scope: 'project', scopeId: 'proj_456', role: 'client' },
    ],
    status: 'active',
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
];

// Demo work items
const workItems = [
  {
    id: 'work_001',
    title: 'Campaign Strategy Development',
    description: 'Develop comprehensive marketing strategy for luxury hotel chain',
    projectId: 'proj_456',
    orgId: 'org_123',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user_manager',
    tags: ['strategy', 'planning', 'luxury'],
    dueDate: new Date('2024-02-15'),
    estimatedHours: 40,
    actualHours: 25,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
  },
  {
    id: 'work_002',
    title: 'Market Research Analysis',
    description: 'Analyze market trends and competitor landscape',
    projectId: 'proj_456',
    orgId: 'org_123',
    status: 'completed',
    priority: 'medium',
    assigneeId: 'user_analyst',
    tags: ['research', 'analysis', 'market'],
    dueDate: new Date('2024-01-30'),
    estimatedHours: 20,
    actualHours: 18,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-28'),
  },
];

// Demo events
const events = [
  {
    id: 'event_001',
    title: 'Campaign Launch Meeting',
    description: 'Weekly sync on campaign progress and next steps',
    projectId: 'proj_456',
    orgId: 'org_123',
    type: 'meeting',
    startTime: new Date('2024-02-01T10:00:00Z'),
    endTime: new Date('2024-02-01T11:00:00Z'),
    attendees: ['user_admin', 'user_manager', 'user_analyst', 'user_client'],
    location: 'Virtual',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date(),
  },
];

// Demo assets
const assets = [
  {
    id: 'asset_001',
    name: 'Hotel Brand Guidelines',
    type: 'document',
    projectId: 'proj_456',
    orgId: 'org_123',
    url: 'https://storage.googleapis.com/global-next-assets/brand-guidelines.pdf',
    size: 2048576, // 2MB
    mimeType: 'application/pdf',
    tags: ['brand', 'guidelines', 'hotel'],
    uploadedBy: 'user_client',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
];

// Demo insights
const insights = [
  {
    id: 'insight_001',
    title: 'Luxury Hospitality Market Trends',
    description: 'AI-generated insights on luxury hospitality marketing trends',
    projectId: 'proj_456',
    orgId: 'org_123',
    type: 'ai_generated',
    content: {
      summary: 'Luxury hospitality sector showing 15% growth in digital engagement',
      recommendations: [
        'Focus on personalized guest experiences',
        'Leverage social media for luxury brand positioning',
        'Implement AI-driven customer service solutions',
      ],
      metrics: {
        engagement: 15,
        conversion: 8.5,
        revenue: 12.3,
      },
    },
    generatedBy: 'ai',
    confidence: 0.87,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
  },
];

// Demo messages
const messages = [
  {
    id: 'msg_001',
    content: 'Great progress on the campaign strategy! The market research insights are very valuable.',
    projectId: 'proj_456',
    orgId: 'org_123',
    senderId: 'user_client',
    type: 'text',
    attachments: [],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date(),
  },
];

// Demo approvals
const approvals = [
  {
    id: 'approval_001',
    title: 'Campaign Budget Approval',
    description: 'Approval for additional $10,000 budget allocation',
    projectId: 'proj_456',
    orgId: 'org_123',
    type: 'budget',
    status: 'pending',
    requestedBy: 'user_manager',
    requestedFor: 'user_admin',
    amount: 10000,
    currency: 'USD',
    dueDate: new Date('2024-02-05'),
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date(),
  },
];

// Demo tool inventory
const toolInventory = [
  {
    id: 'tool_001',
    name: 'AI Content Generator',
    description: 'Generate marketing content using AI',
    category: 'content',
    status: 'active',
    orgId: 'org_123',
    settings: {
      enabled: true,
      autoGenerate: true,
      quality: 'high',
    },
    usage: {
      totalRequests: 150,
      successfulRequests: 142,
      lastUsed: new Date('2024-01-30'),
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

export const seedData = {
  organizations,
  projects,
  users,
  workItems,
  events,
  assets,
  insights,
  messages,
  approvals,
  toolInventory,
};

// Export individual collections for easy access
export {
  organizations,
  projects,
  users,
  workItems,
  events,
  assets,
  insights,
  messages,
  approvals,
  toolInventory,
};