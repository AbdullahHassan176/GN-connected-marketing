import { nanoid } from 'nanoid';

// Mock data storage
const mockData: Record<string, any[]> = {};

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

/**
 * Mock Cosmos DB client for development
 */
export class MockCosmosClient {
  private containers: Map<string, any[]> = new Map();

  constructor() {
    // Initialize empty containers
    for (const containerName of Object.keys(CONTAINER_CONFIGS)) {
      this.containers.set(containerName, []);
    }
  }

  databases() {
    return {
      createIfNotExists: async (config: any) => {
        console.log(`📦 Mock: Creating database ${config.id}`);
        return { database: { id: config.id } };
      }
    };
  }

  containers() {
    return {
      createIfNotExists: async (config: any) => {
        console.log(`📦 Mock: Creating container ${config.id} with partition key ${config.partitionKey}`);
        return { container: { id: config.id } };
      }
    };
  }
}

// Mock database instance
let mockClient: MockCosmosClient | null = null;
let mockDatabase: any = null;
let mockContainers: Map<ContainerName, any> = new Map();

/**
 * Initialize mock Cosmos DB client
 */
export function initializeCosmosClient(): MockCosmosClient {
  if (mockClient) {
    return mockClient;
  }

  mockClient = new MockCosmosClient();
  return mockClient;
}

/**
 * Get or create mock database
 */
export async function getDatabase(): Promise<any> {
  if (mockDatabase) {
    return mockDatabase;
  }

  const client = initializeCosmosClient();
  
  try {
    const { database: db } = await client.databases().createIfNotExists({
      id: 'global-next-db',
    });
    
    mockDatabase = db;
    return mockDatabase;
  } catch (error) {
    console.error('Failed to get/create mock database:', error);
    throw new Error('Failed to get/create mock database');
  }
}

/**
 * Get or create mock container
 */
export async function getContainer(containerName: ContainerName): Promise<any> {
  if (mockContainers.has(containerName)) {
    return mockContainers.get(containerName)!;
  }

  const db = await getDatabase();
  const config = CONTAINER_CONFIGS[containerName];
  
  try {
    const { container } = await db.containers().createIfNotExists({
      id: containerName,
      partitionKey: config.partitionKey,
    });
    
    mockContainers.set(containerName, container);
    return container;
  } catch (error) {
    console.error(`Failed to get/create mock container ${containerName}:`, error);
    throw new Error(`Failed to get/create mock container ${containerName}`);
  }
}

/**
 * Get container by name (convenience method)
 */
export async function container(name: ContainerName): Promise<any> {
  return getContainer(name);
}

/**
 * Create all mock containers
 */
export async function createAllContainers(): Promise<void> {
  try {
    for (const [containerName, config] of Object.entries(CONTAINER_CONFIGS)) {
      console.log(`✅ Mock Container '${containerName}' created/verified with partition key ${config.partitionKey}`);
    }
  } catch (error) {
    console.error(`❌ Failed to create mock containers:`, error);
    throw error;
  }
}

/**
 * Mock health check - query one item from a container
 */
export async function healthCheck(): Promise<{ ok: boolean; message: string; details?: any }> {
  try {
    // Simulate querying organizations
    const orgData = mockData.organizations || [];
    const sampleItem = orgData[0];
    
    return {
      ok: true,
      message: 'Mock database connection successful',
      details: {
        container: 'organizations',
        itemCount: orgData.length,
        sampleItem: sampleItem ? { id: sampleItem.id, orgId: sampleItem.orgId } : null
      }
    };
  } catch (error) {
    console.error('Mock health check failed:', error);
    return {
      ok: false,
      message: 'Mock database connection failed',
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

/**
 * Mock seed data helper - insert items into container
 */
export async function seedContainer<T extends { id: string }>(
  containerName: ContainerName,
  items: T[]
): Promise<void> {
  try {
    if (!mockData[containerName]) {
      mockData[containerName] = [];
    }
    
    // Add items to mock storage
    mockData[containerName].push(...items);
    
    console.log(`✅ Mock: Seeded ${items.length} items into ${containerName}`);
  } catch (error) {
    console.error(`❌ Failed to seed mock ${containerName}:`, error);
    throw error;
  }
}

/**
 * Mock clear all data from a container
 */
export async function clearContainer(containerName: ContainerName): Promise<void> {
  try {
    const itemCount = mockData[containerName]?.length || 0;
    mockData[containerName] = [];
    
    console.log(`✅ Mock: Cleared ${itemCount} items from ${containerName}`);
  } catch (error) {
    console.error(`❌ Failed to clear mock ${containerName}:`, error);
    throw error;
  }
}

/**
 * Mock get all items from a container
 */
export async function getAllItems<T>(containerName: ContainerName): Promise<T[]> {
  try {
    return (mockData[containerName] || []) as T[];
  } catch (error) {
    console.error(`❌ Failed to get items from mock ${containerName}:`, error);
    throw error;
  }
}

/**
 * Mock query items from a container
 */
export async function queryItems<T>(
  containerName: ContainerName,
  query: string,
  parameters?: any[]
): Promise<T[]> {
  try {
    // Simple mock query implementation
    const items = mockData[containerName] || [];
    
    // For demo purposes, return all items
    // In a real implementation, you'd parse the SQL query
    return items as T[];
  } catch (error) {
    console.error(`❌ Failed to query mock ${containerName}:`, error);
    throw error;
  }
}

/**
 * Mock get item by ID and partition key
 */
export async function getItem<T>(
  containerName: ContainerName,
  id: string,
  partitionKey: string
): Promise<T | null> {
  try {
    const items = mockData[containerName] || [];
    const item = items.find((item: any) => item.id === id);
    return item as T || null;
  } catch (error) {
    console.error(`❌ Failed to get item from mock ${containerName}:`, error);
    throw error;
  }
}

/**
 * Mock upsert item (create or update)
 */
export async function upsertItem<T extends { id: string }>(
  containerName: ContainerName,
  item: T
): Promise<T> {
  try {
    if (!mockData[containerName]) {
      mockData[containerName] = [];
    }
    
    const existingIndex = mockData[containerName].findIndex((existing: any) => existing.id === item.id);
    
    if (existingIndex >= 0) {
      mockData[containerName][existingIndex] = item;
    } else {
      mockData[containerName].push(item);
    }
    
    return item;
  } catch (error) {
    console.error(`❌ Failed to upsert item in mock ${containerName}:`, error);
    throw error;
  }
}

/**
 * Mock delete item by ID and partition key
 */
export async function deleteItem(
  containerName: ContainerName,
  id: string,
  partitionKey: string
): Promise<void> {
  try {
    if (mockData[containerName]) {
      mockData[containerName] = mockData[containerName].filter((item: any) => item.id !== id);
    }
  } catch (error) {
    console.error(`❌ Failed to delete item from mock ${containerName}:`, error);
    throw error;
  }
}

// Functions are already exported above
