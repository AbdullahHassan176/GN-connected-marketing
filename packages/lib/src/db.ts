import { CosmosClient, Database, Container } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';

// Environment variables
const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT || 'https://your-cosmos-account.documents.azure.com:443/';
const COSMOS_KEY = process.env.COSMOS_KEY || 'your-cosmos-key';
const COSMOS_DATABASE = process.env.COSMOS_DATABASE || 'global-next-db';

// Container configurations with partition keys
export const CONTAINER_CONFIGS = {
  organizations: { partitionKey: '/orgId' },
  users: { partitionKey: '/orgId' },
  projects: { partitionKey: '/orgId' },
  work_items: { partitionKey: '/projectId' },
  events: { partitionKey: '/projectId' },
  assets: { partitionKey: '/projectId' },
  insights: { partitionKey: '/projectId' },
  messages: { partitionKey: '/projectId' },
  approvals: { partitionKey: '/projectId' },
  tool_inventory: { partitionKey: '/orgId' },
} as const;

export type ContainerName = keyof typeof CONTAINER_CONFIGS;

// Cosmos DB client instance
let cosmosClient: CosmosClient | null = null;
let database: Database | null = null;
let containers: Map<ContainerName, Container> = new Map();

/**
 * Initialize Cosmos DB client
 */
export function initializeCosmosClient(): CosmosClient {
  if (cosmosClient) {
    return cosmosClient;
  }

  try {
    // Use DefaultAzureCredential for production (managed identity)
    // For development, you can use the connection string or key
    if (process.env.NODE_ENV === 'production') {
      cosmosClient = new CosmosClient({
        endpoint: COSMOS_ENDPOINT,
        aadCredentials: new DefaultAzureCredential(),
      });
    } else {
      // Development mode - use connection string or key
      cosmosClient = new CosmosClient({
        endpoint: COSMOS_ENDPOINT,
        key: COSMOS_KEY,
      });
    }

    return cosmosClient;
  } catch (error) {
    console.error('Failed to initialize Cosmos DB client:', error);
    throw new Error('Failed to initialize Cosmos DB client');
  }
}

/**
 * Get or create database
 */
export async function getDatabase(): Promise<Database> {
  if (database) {
    return database;
  }

  const client = initializeCosmosClient();
  
  try {
    const { database: db } = await client.databases.createIfNotExists({
      id: COSMOS_DATABASE,
    });
    
    database = db;
    return database;
  } catch (error) {
    console.error('Failed to get/create database:', error);
    throw new Error('Failed to get/create database');
  }
}

/**
 * Get or create container
 */
export async function getContainer(containerName: ContainerName): Promise<Container> {
  if (containers.has(containerName)) {
    return containers.get(containerName)!;
  }

  const db = await getDatabase();
  const config = CONTAINER_CONFIGS[containerName];
  
  try {
    const { container } = await db.containers.createIfNotExists({
      id: containerName,
      partitionKey: config.partitionKey,
      indexingPolicy: {
        automatic: true,
        indexingMode: 'consistent',
        includedPaths: [
          {
            path: '/*'
          }
        ],
        excludedPaths: [
          {
            path: '/"_etag"/?'
          }
        ]
      }
    });
    
    containers.set(containerName, container);
    return container;
  } catch (error) {
    console.error(`Failed to get/create container ${containerName}:`, error);
    throw new Error(`Failed to get/create container ${containerName}`);
  }
}

/**
 * Get container by name (convenience method)
 */
export async function container(name: ContainerName): Promise<Container> {
  return getContainer(name);
}

/**
 * Create all containers
 */
export async function createAllContainers(): Promise<void> {
  const db = await getDatabase();
  
  for (const [containerName, config] of Object.entries(CONTAINER_CONFIGS)) {
    try {
      await db.containers.createIfNotExists({
        id: containerName,
        partitionKey: config.partitionKey,
        indexingPolicy: {
          automatic: true,
          indexingMode: 'consistent',
          includedPaths: [
            {
              path: '/*'
            }
          ],
          excludedPaths: [
            {
              path: '/"_etag"/?'
            }
          ]
        }
      });
      
      console.log(`✅ Container '${containerName}' created/verified`);
    } catch (error) {
      console.error(`❌ Failed to create container ${containerName}:`, error);
      throw error;
    }
  }
}

/**
 * Health check - query one item from a container
 */
export async function healthCheck(): Promise<{ ok: boolean; message: string; details?: any }> {
  try {
    const orgContainer = await getContainer('organizations');
    const { resources } = await orgContainer.items
      .query('SELECT TOP 1 * FROM c')
      .fetchAll();
    
    return {
      ok: true,
      message: 'Database connection successful',
      details: {
        container: 'organizations',
        itemCount: resources.length,
        sampleItem: resources[0] ? { id: resources[0].id, orgId: resources[0].orgId } : null
      }
    };
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      ok: false,
      message: 'Database connection failed',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

/**
 * Seed data helper - insert items into container
 */
export async function seedContainer<T extends { id: string }>(
  containerName: ContainerName,
  items: T[]
): Promise<void> {
  const container = await getContainer(containerName);
  
  try {
    for (const item of items) {
      await container.items.create(item);
    }
    console.log(`✅ Seeded ${items.length} items into ${containerName}`);
  } catch (error) {
    console.error(`❌ Failed to seed ${containerName}:`, error);
    throw error;
  }
}

/**
 * Clear all data from a container
 */
export async function clearContainer(containerName: ContainerName): Promise<void> {
  const container = await getContainer(containerName);
  
  try {
    const { resources } = await container.items.readAll().fetchAll();
    
    for (const item of resources) {
      await container.item(item.id, item.orgId || item.projectId).delete();
    }
    
    console.log(`✅ Cleared ${resources.length} items from ${containerName}`);
  } catch (error) {
    console.error(`❌ Failed to clear ${containerName}:`, error);
    throw error;
  }
}

/**
 * Get all items from a container
 */
export async function getAllItems<T>(containerName: ContainerName): Promise<T[]> {
  const container = await getContainer(containerName);
  
  try {
    const { resources } = await container.items.readAll().fetchAll();
    return resources as T[];
  } catch (error) {
    console.error(`❌ Failed to get items from ${containerName}:`, error);
    throw error;
  }
}

/**
 * Query items from a container
 */
export async function queryItems<T>(
  containerName: ContainerName,
  query: string,
  parameters?: any[]
): Promise<T[]> {
  const container = await getContainer(containerName);
  
  try {
    const { resources } = await container.items.query({
      query,
      parameters: parameters || []
    }).fetchAll();
    
    return resources as T[];
  } catch (error) {
    console.error(`❌ Failed to query ${containerName}:`, error);
    throw error;
  }
}

/**
 * Get item by ID and partition key
 */
export async function getItem<T>(
  containerName: ContainerName,
  id: string,
  partitionKey: string
): Promise<T | null> {
  const container = await getContainer(containerName);
  
  try {
    const { resource } = await container.item(id, partitionKey).read();
    return resource as T;
  } catch (error) {
    if (error.code === 404) {
      return null;
    }
    console.error(`❌ Failed to get item from ${containerName}:`, error);
    throw error;
  }
}

/**
 * Upsert item (create or update)
 */
export async function upsertItem<T extends { id: string }>(
  containerName: ContainerName,
  item: T
): Promise<T> {
  const container = await getContainer(containerName);
  
  try {
    const { resource } = await container.items.upsert(item);
    return resource as T;
  } catch (error) {
    console.error(`❌ Failed to upsert item in ${containerName}:`, error);
    throw error;
  }
}

/**
 * Delete item by ID and partition key
 */
export async function deleteItem(
  containerName: ContainerName,
  id: string,
  partitionKey: string
): Promise<void> {
  const container = await getContainer(containerName);
  
  try {
    await container.item(id, partitionKey).delete();
  } catch (error) {
    console.error(`❌ Failed to delete item from ${containerName}:`, error);
    throw error;
  }
}

// Functions are already exported above
