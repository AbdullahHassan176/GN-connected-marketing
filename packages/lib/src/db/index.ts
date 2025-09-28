import { CosmosClient, Database, Container } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT!,
  key: process.env.COSMOS_KEY!,
});

export const db: Database = client.database(process.env.COSMOS_DB || 'globalnext');

export const container = (name: string): Container => db.container(name);

// Container names
export const CONTAINERS = {
  ORGANIZATIONS: 'organizations',
  USERS: 'users',
  PROJECTS: 'projects',
  WORK_ITEMS: 'work_items',
  EVENTS: 'events',
  ASSETS: 'assets',
  INSIGHTS: 'insights',
  MESSAGES: 'messages',
  APPROVALS: 'approvals',
  TOOL_INVENTORY: 'tool_inventory',
} as const;

// Helper function to get container
export const getContainer = (containerName: keyof typeof CONTAINERS): Container => {
  return container(CONTAINERS[containerName]);
};

// Database initialization
export const initializeDatabase = async () => {
  try {
    // Create database if it doesn't exist
    await db.read();
  } catch (error) {
    console.log('Database does not exist, creating...');
    await client.databases.createIfNotExists({
      id: process.env.COSMOS_DB || 'globalnext',
    });
  }

  // Create containers with partition keys
  const containers = [
    { name: CONTAINERS.ORGANIZATIONS, partitionKey: '/orgId' },
    { name: CONTAINERS.USERS, partitionKey: '/orgId' },
    { name: CONTAINERS.PROJECTS, partitionKey: '/orgId' },
    { name: CONTAINERS.WORK_ITEMS, partitionKey: '/projectId' },
    { name: CONTAINERS.EVENTS, partitionKey: '/projectId' },
    { name: CONTAINERS.ASSETS, partitionKey: '/projectId' },
    { name: CONTAINERS.INSIGHTS, partitionKey: '/projectId' },
    { name: CONTAINERS.MESSAGES, partitionKey: '/projectId' },
    { name: CONTAINERS.APPROVALS, partitionKey: '/projectId' },
    { name: CONTAINERS.TOOL_INVENTORY, partitionKey: '/orgId' },
  ];

  for (const { name, partitionKey } of containers) {
    try {
      await db.containers.createIfNotExists({
        id: name,
        partitionKey: {
          paths: [partitionKey],
        },
        indexingPolicy: {
          automatic: true,
          indexingMode: 'consistent',
          includedPaths: [
            {
              path: '/*',
            },
          ],
          excludedPaths: [
            {
              path: '/metadata/*',
            },
          ],
        },
      });
      console.log(`Container ${name} created or already exists`);
    } catch (error) {
      console.error(`Error creating container ${name}:`, error);
    }
  }
};

// Health check
export const healthCheck = async (): Promise<{ ok: boolean; error?: string }> => {
  try {
    const { resources } = await container(CONTAINERS.ORGANIZATIONS).items
      .query({
        query: 'SELECT TOP 1 c.id FROM c',
      })
      .fetchAll();
    
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
};
