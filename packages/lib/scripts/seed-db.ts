// Try to import real Cosmos DB client, fallback to mock
let dbModule;
try {
  dbModule = require('../src/db');
} catch (error) {
  console.log('⚠️  Real Cosmos DB not available, using mock database');
  dbModule = require('../src/db-mock');
}

const { 
  createAllContainers, 
  seedContainer, 
  clearContainer, 
  healthCheck,
  CONTAINER_CONFIGS 
} = dbModule;
import { nanoid } from 'nanoid';

// Demo organizations
const organizations = [
  {
    id: 'org_123',
    orgId: 'org_123',
    name: 'Global Next Consulting',
    description: 'AI-powered marketing consulting firm specializing in luxury hospitality and premium brands',
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
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Demo users with different roles
const users = [
  {
    id: 'user_admin',
    orgId: 'org_123',
    email: 'admin@globalnextconsulting.com',
    password: 'admin123', // In production, this would be hashed
    name: 'Sarah Mitchell',
    avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
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
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user_manager',
    orgId: 'org_123',
    email: 'manager@globalnextconsulting.com',
    password: 'manager123',
    name: 'Marcus Chen',
    avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
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
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user_analyst',
    orgId: 'org_123',
    email: 'analyst@globalnextconsulting.com',
    password: 'analyst123',
    name: 'Emma Rodriguez',
    avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
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
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user_client',
    orgId: 'org_123',
    email: 'ahmed@premiumhotels.com',
    password: 'client123',
    name: 'Ahmed Al-Rashid',
    avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
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
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Demo projects
const projects = [
  {
    id: 'proj_456',
    orgId: 'org_123',
    projectId: 'proj_456',
    name: 'Premium Hotels Campaign',
    description: 'Luxury hospitality marketing campaign for premium hotel chain',
    status: 'active',
    startDate: new Date('2024-01-15').toISOString(),
    endDate: new Date('2024-06-15').toISOString(),
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
    kpis: {
      impressions: 1200000,
      clicks: 48000,
      conversions: 1200,
      revenue: 156000,
      roi: 24.8,
      ctr: 4.0,
      conversionRate: 2.5,
    },
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj_789',
    orgId: 'org_123',
    projectId: 'proj_789',
    name: 'Tech Startup Launch',
    description: 'Digital marketing strategy for emerging tech startup',
    status: 'planning',
    startDate: new Date('2024-02-01').toISOString(),
    endDate: new Date('2024-08-01').toISOString(),
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
    kpis: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      roi: 0,
      ctr: 0,
      conversionRate: 0,
    },
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Demo work items
const workItems = [
  {
    id: 'work_001',
    projectId: 'proj_456',
    title: 'Campaign Strategy Development',
    description: 'Develop comprehensive marketing strategy for luxury hotel chain',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user_manager',
    tags: ['strategy', 'planning', 'luxury'],
    dueDate: new Date('2024-02-15').toISOString(),
    estimatedHours: 40,
    actualHours: 25,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'work_002',
    projectId: 'proj_456',
    title: 'Market Research Analysis',
    description: 'Analyze market trends and competitor landscape',
    status: 'completed',
    priority: 'medium',
    assigneeId: 'user_analyst',
    tags: ['research', 'analysis', 'market'],
    dueDate: new Date('2024-01-30').toISOString(),
    estimatedHours: 20,
    actualHours: 18,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-28').toISOString(),
  },
  {
    id: 'work_003',
    projectId: 'proj_789',
    title: 'Brand Identity Design',
    description: 'Create brand identity and visual guidelines for tech startup',
    status: 'pending',
    priority: 'high',
    assigneeId: 'user_analyst',
    tags: ['design', 'brand', 'identity'],
    dueDate: new Date('2024-02-20').toISOString(),
    estimatedHours: 30,
    actualHours: 0,
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Demo events
const events = [
  {
    id: 'event_001',
    projectId: 'proj_456',
    title: 'Campaign Launch Meeting',
    description: 'Weekly sync on campaign progress and next steps',
    type: 'meeting',
    startTime: new Date('2024-02-01T10:00:00Z').toISOString(),
    endTime: new Date('2024-02-01T11:00:00Z').toISOString(),
    attendees: ['user_admin', 'user_manager', 'user_analyst', 'user_client'],
    location: 'Virtual',
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'event_002',
    projectId: 'proj_456',
    title: 'Creative Review Session',
    description: 'Review and approve creative assets for campaign',
    type: 'review',
    startTime: new Date('2024-02-05T14:00:00Z').toISOString(),
    endTime: new Date('2024-02-05T15:30:00Z').toISOString(),
    attendees: ['user_manager', 'user_analyst', 'user_client'],
    location: 'Conference Room A',
    createdAt: new Date('2024-01-28').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Demo assets
const assets = [
  {
    id: 'asset_001',
    projectId: 'proj_456',
    name: 'Hotel Brand Guidelines',
    type: 'document',
    url: 'https://storage.googleapis.com/global-next-assets/brand-guidelines.pdf',
    size: 2048576, // 2MB
    mimeType: 'application/pdf',
    tags: ['brand', 'guidelines', 'hotel'],
    uploadedBy: 'user_client',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'asset_002',
    projectId: 'proj_456',
    name: 'Campaign Creative Mockups',
    type: 'image',
    url: 'https://storage.googleapis.com/global-next-assets/creative-mockups.jpg',
    size: 5120000, // 5MB
    mimeType: 'image/jpeg',
    tags: ['creative', 'mockups', 'campaign'],
    uploadedBy: 'user_analyst',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Demo insights
const insights = [
  {
    id: 'insight_001',
    projectId: 'proj_456',
    title: 'Luxury Hospitality Market Trends',
    description: 'AI-generated insights on luxury hospitality marketing trends',
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
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'insight_002',
    projectId: 'proj_456',
    title: 'Competitor Analysis Report',
    description: 'Comprehensive analysis of competitor marketing strategies',
    type: 'manual',
    content: {
      summary: 'Key competitors are investing heavily in digital transformation',
      recommendations: [
        'Increase digital marketing budget by 20%',
        'Focus on mobile-first customer experience',
        'Implement advanced analytics for better targeting',
      ],
      metrics: {
        marketShare: 12.5,
        growthRate: 8.2,
        competitiveIndex: 7.8,
      },
    },
    generatedBy: 'user_analyst',
    confidence: 0.92,
    createdAt: new Date('2024-01-22').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Demo messages
const messages = [
  {
    id: 'msg_001',
    projectId: 'proj_456',
    content: 'Great progress on the campaign strategy! The market research insights are very valuable.',
    senderId: 'user_client',
    type: 'text',
    attachments: [],
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'msg_002',
    projectId: 'proj_456',
    content: 'The creative mockups look fantastic. Ready to move to the next phase.',
    senderId: 'user_manager',
    type: 'text',
    attachments: ['asset_002'],
    createdAt: new Date('2024-01-26').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Demo approvals
const approvals = [
  {
    id: 'approval_001',
    projectId: 'proj_456',
    title: 'Campaign Budget Approval',
    description: 'Approval for additional $10,000 budget allocation',
    type: 'budget',
    status: 'pending',
    requestedBy: 'user_manager',
    requestedFor: 'user_admin',
    amount: 10000,
    currency: 'USD',
    dueDate: new Date('2024-02-05').toISOString(),
    createdAt: new Date('2024-01-28').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'approval_002',
    projectId: 'proj_456',
    title: 'Creative Asset Approval',
    description: 'Approval for final creative assets before campaign launch',
    type: 'creative',
    status: 'approved',
    requestedBy: 'user_analyst',
    requestedFor: 'user_client',
    amount: 0,
    currency: 'USD',
    dueDate: new Date('2024-02-01').toISOString(),
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-30').toISOString(),
  },
];

// Demo tool inventory
const toolInventory = [
  {
    id: 'tool_001',
    orgId: 'org_123',
    name: 'AI Content Generator',
    description: 'Generate marketing content using AI',
    category: 'content',
    status: 'active',
    settings: {
      enabled: true,
      autoGenerate: true,
      quality: 'high',
    },
    usage: {
      totalRequests: 150,
      successfulRequests: 142,
      lastUsed: new Date('2024-01-30').toISOString(),
    },
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tool_002',
    orgId: 'org_123',
    name: 'Analytics Dashboard',
    description: 'Real-time analytics and reporting dashboard',
    category: 'analytics',
    status: 'active',
    settings: {
      enabled: true,
      autoRefresh: true,
      notifications: true,
    },
    usage: {
      totalRequests: 89,
      successfulRequests: 89,
      lastUsed: new Date('2024-01-30').toISOString(),
    },
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Seed data collections
const seedData = {
  organizations,
  users,
  projects,
  work_items: workItems,
  events,
  assets,
  insights,
  messages,
  approvals,
  tool_inventory: toolInventory,
};

/**
 * Main seed function
 */
export async function seedDatabase(): Promise<void> {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Create all containers
    console.log('📦 Creating containers...');
    await createAllContainers();
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    for (const containerName of Object.keys(CONTAINER_CONFIGS)) {
      try {
        await clearContainer(containerName as keyof typeof CONTAINER_CONFIGS);
      } catch (error) {
        console.log(`⚠️  Could not clear ${containerName} (might be empty)`);
      }
    }
    
    // Seed all containers
    console.log('🌱 Seeding data...');
    for (const [containerName, data] of Object.entries(seedData)) {
      await seedContainer(containerName as keyof typeof CONTAINER_CONFIGS, data);
    }
    
    // Verify health
    console.log('🏥 Verifying database health...');
    const health = await healthCheck();
    
    if (health.ok) {
      console.log('✅ Database seeding completed successfully!');
      console.log(`📊 Health check: ${health.message}`);
      if (health.details) {
        console.log(`📈 Sample data: ${JSON.stringify(health.details, null, 2)}`);
      }
    } else {
      console.error('❌ Health check failed:', health.message);
      throw new Error('Health check failed');
    }
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

/**
 * Clear all data
 */
export async function clearDatabase(): Promise<void> {
  console.log('🧹 Clearing all database data...');
  
  try {
    for (const containerName of Object.keys(CONTAINER_CONFIGS)) {
      await clearContainer(containerName as keyof typeof CONTAINER_CONFIGS);
    }
    
    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Failed to clear database:', error);
    throw error;
  }
}

// Export seed data for use in other scripts
export { seedData };

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}
