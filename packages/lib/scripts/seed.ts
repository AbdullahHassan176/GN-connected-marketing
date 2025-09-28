import { initializeDatabase, getContainer, CONTAINERS } from '../src/db';
import { generateOrgId, generateUserId, generateProjectId } from '../src/auth';
import { nanoid } from 'nanoid';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Initialize database and containers
    await initializeDatabase();
    console.log('✅ Database initialized');

    // Create demo organization
    const orgId = generateOrgId();
    const organization = {
      id: orgId,
      orgId: orgId,
      type: 'organization',
      name: 'Global Next Consulting',
      domains: ['globalnextconsulting.com'],
      settings: {
        billingPlan: 'pro' as const,
        locale: 'en' as const,
        rtl: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await getContainer(CONTAINERS.ORGANIZATIONS).items.create(organization);
    console.log('✅ Organization created');

    // Create demo users
    const adminUserId = generateUserId();
    const managerUserId = generateUserId();
    const clientUserId = generateUserId();

    const users = [
      {
        id: adminUserId,
        type: 'user',
        orgId: orgId,
        email: 'admin@globalnextconsulting.com',
        name: 'Sarah Mitchell',
        avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
        provider: 'credentials' as const,
        roles: [
          { scope: 'org' as const, scopeId: orgId, role: 'owner' as const },
        ],
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: managerUserId,
        type: 'user',
        orgId: orgId,
        email: 'manager@globalnextconsulting.com',
        name: 'Marcus Chen',
        avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
        provider: 'google' as const,
        roles: [
          { scope: 'org' as const, scopeId: orgId, role: 'manager' as const },
        ],
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: clientUserId,
        type: 'user',
        orgId: orgId,
        email: 'ahmed@premiumhotels.com',
        name: 'Ahmed Al-Rashid',
        avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
        provider: 'microsoft' as const,
        roles: [
          { scope: 'org' as const, scopeId: orgId, role: 'client' as const },
        ],
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const user of users) {
      await getContainer(CONTAINERS.USERS).items.create(user);
    }
    console.log('✅ Users created');

    // Create demo project
    const projectId = generateProjectId();
    const project = {
      id: projectId,
      type: 'project',
      orgId: orgId,
      name: 'Premium Hotels Group - Q1 2024',
      clientRef: 'Premium Hotels Group',
      stages: ['Strategy', 'Content', 'Distribution', 'Ads', 'Insights'],
      currentStage: 'Distribution',
      timeline: [
        {
          stage: 'Strategy',
          from: '2024-01-01T00:00:00Z',
          to: '2024-01-07T23:59:59Z',
          status: 'done' as const,
        },
        {
          stage: 'Content',
          from: '2024-01-08T00:00:00Z',
          to: '2024-01-14T23:59:59Z',
          status: 'done' as const,
        },
        {
          stage: 'Distribution',
          from: '2024-01-15T00:00:00Z',
          to: '2024-01-21T23:59:59Z',
          status: 'in_progress' as const,
        },
        {
          stage: 'Ads',
          from: '2024-01-22T00:00:00Z',
          to: '2024-01-28T23:59:59Z',
          status: 'pending' as const,
        },
        {
          stage: 'Insights',
          from: '2024-01-29T00:00:00Z',
          to: '2024-02-04T23:59:59Z',
          status: 'pending' as const,
        },
      ],
      kpis: {
        ctr: 0.048,
        roi: 3.24,
        engagement: 0.185,
        sentiment: 0.78,
        conversions: 847,
      },
      aiTools: [
        { name: 'Jasper AI', use: 'Copywriting' },
        { name: 'Midjourney', use: 'Visual Creation' },
        { name: 'SEMRush', use: 'SEO Analytics' },
        { name: 'HubSpot AI', use: 'Marketing Automation' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await getContainer(CONTAINERS.PROJECTS).items.create(project);
    console.log('✅ Project created');

    // Create demo work items
    const workItems = [
      {
        id: `wi_${nanoid(16)}`,
        type: 'work_item',
        orgId: orgId,
        projectId: projectId,
        title: 'Create Instagram carousel designs',
        description: 'Design luxury hotel carousel posts for Instagram feed',
        status: 'in_progress' as const,
        priority: 'high' as const,
        assigneeId: managerUserId,
        labels: ['content', 'design', 'social'],
        due: '2024-01-20T23:59:59Z',
        audit: {
          createdBy: adminUserId,
          createdAt: new Date().toISOString(),
          updates: [],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `wi_${nanoid(16)}`,
        type: 'work_item',
        orgId: orgId,
        projectId: projectId,
        title: 'Optimize Facebook ad targeting',
        description: 'Review and optimize Facebook ad audience targeting',
        status: 'todo' as const,
        priority: 'medium' as const,
        assigneeId: managerUserId,
        labels: ['ads', 'optimization'],
        due: '2024-01-25T23:59:59Z',
        audit: {
          createdBy: adminUserId,
          createdAt: new Date().toISOString(),
          updates: [],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `wi_${nanoid(16)}`,
        type: 'work_item',
        orgId: orgId,
        projectId: projectId,
        title: 'Generate weekly performance report',
        description: 'Create comprehensive performance report for client',
        status: 'done' as const,
        priority: 'high' as const,
        assigneeId: adminUserId,
        labels: ['reporting', 'analytics'],
        due: '2024-01-18T23:59:59Z',
        audit: {
          createdBy: adminUserId,
          createdAt: new Date().toISOString(),
          updates: [],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const workItem of workItems) {
      await getContainer(CONTAINERS.WORK_ITEMS).items.create(workItem);
    }
    console.log('✅ Work items created');

    // Create demo insights
    const insights = {
      id: `ins_${nanoid(16)}`,
      type: 'insight',
      orgId: orgId,
      projectId: projectId,
      kpisTimeSeries: [
        {
          t: '2024-01-01T00:00:00Z',
          ctr: 0.032,
          roi: 1.8,
          engagement: 0.12,
          sentiment: 0.65,
          conversions: 156,
        },
        {
          t: '2024-01-08T00:00:00Z',
          ctr: 0.041,
          roi: 2.4,
          engagement: 0.15,
          sentiment: 0.72,
          conversions: 289,
        },
        {
          t: '2024-01-15T00:00:00Z',
          ctr: 0.048,
          roi: 3.24,
          engagement: 0.185,
          sentiment: 0.78,
          conversions: 847,
        },
      ],
      forecasts: {
        roiNext30d: 3.8,
        confInt: [3.2, 4.4],
      },
      abTests: [
        {
          name: 'Ad Copy A vs B',
          winner: 'B',
          lift: 0.12,
        },
        {
          name: 'Instagram vs Facebook',
          winner: 'Instagram',
          lift: 0.34,
        },
      ],
      sentimentHeatmap: [
        { channel: 'instagram', score: 0.82 },
        { channel: 'facebook', score: 0.65 },
        { channel: 'youtube', score: 0.78 },
        { channel: 'email', score: 0.89 },
      ],
      recommendations: [
        {
          type: 'spend_shift',
          message: 'Increase Instagram ad budget by 25%',
          rationale: '34% higher engagement rates compared to Facebook',
        },
        {
          type: 'content_optimization',
          message: 'Test emotional vs rational messaging',
          rationale: 'A/B test shows 12% lift with emotional copy',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await getContainer(CONTAINERS.INSIGHTS).items.create(insights);
    console.log('✅ Insights created');

    // Create demo messages
    const messages = [
      {
        id: `msg_${nanoid(16)}`,
        type: 'message',
        orgId: orgId,
        projectId: projectId,
        userId: adminUserId,
        content: 'Welcome to the Premium Hotels campaign room! Let\'s make this a success.',
        messageType: 'chat' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `msg_${nanoid(16)}`,
        type: 'message',
        orgId: orgId,
        projectId: projectId,
        userId: managerUserId,
        content: 'The new Instagram carousel designs are ready for review. AI analysis shows potential 25% increase in CTR.',
        messageType: 'chat' as const,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: `msg_${nanoid(16)}`,
        type: 'message',
        orgId: orgId,
        projectId: projectId,
        userId: clientUserId,
        content: 'The results are impressive! Our board is very pleased with the 324% ROI. Could we schedule a review meeting?',
        messageType: 'chat' as const,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ];

    for (const message of messages) {
      await getContainer(CONTAINERS.MESSAGES).items.create(message);
    }
    console.log('✅ Messages created');

    // Create demo tool inventory
    const toolInventory = [
      {
        id: `tool_${nanoid(16)}`,
        type: 'tool_inventory',
        orgId: orgId,
        name: 'Jasper AI',
        category: 'Copywriting',
        status: 'active' as const,
        seats: 10,
        usedSeats: 8,
        usageLogs: [
          {
            userId: adminUserId,
            action: 'login',
            timestamp: new Date().toISOString(),
          },
          {
            userId: managerUserId,
            action: 'generate_content',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `tool_${nanoid(16)}`,
        type: 'tool_inventory',
        orgId: orgId,
        name: 'Midjourney',
        category: 'Visual Creation',
        status: 'active' as const,
        seats: 5,
        usedSeats: 3,
        usageLogs: [
          {
            userId: managerUserId,
            action: 'generate_image',
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: `tool_${nanoid(16)}`,
        type: 'tool_inventory',
        orgId: orgId,
        name: 'SEMRush',
        category: 'SEO Analytics',
        status: 'active' as const,
        seats: 3,
        usedSeats: 2,
        usageLogs: [
          {
            userId: adminUserId,
            action: 'keyword_research',
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const tool of toolInventory) {
      await getContainer(CONTAINERS.TOOL_INVENTORY).items.create(tool);
    }
    console.log('✅ Tool inventory created');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Demo Data Summary:');
    console.log(`- Organization: ${organization.name} (${orgId})`);
    console.log(`- Users: ${users.length} (admin, manager, client)`);
    console.log(`- Project: ${project.name} (${projectId})`);
    console.log(`- Work Items: ${workItems.length}`);
    console.log(`- Messages: ${messages.length}`);
    console.log(`- AI Tools: ${toolInventory.length}`);
    console.log('\n🔑 Demo Login Credentials:');
    console.log('Admin: admin@globalnextconsulting.com');
    console.log('Manager: manager@globalnextconsulting.com');
    console.log('Client: ahmed@premiumhotels.com');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
