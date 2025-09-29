import { CosmosClient } from '@azure/cosmos';
import { z } from 'zod';

// Environment validation
const EnvironmentSchema = z.object({
  COSMOS_DB_ENDPOINT: z.string().url(),
  COSMOS_DB_KEY: z.string().min(1),
  COSMOS_DB_DATABASE_ID: z.string().min(1)
});

const env = EnvironmentSchema.parse(process.env);

// Cosmos DB client
const client = new CosmosClient({
  endpoint: env.COSMOS_DB_ENDPOINT,
  key: env.COSMOS_DB_KEY
});

const database = client.database(env.COSMOS_DB_DATABASE_ID);

// Composite index configurations
const compositeIndexes = {
  organizations: {
    containerId: 'organizations',
    indexingPolicy: {
      automatic: true,
      indexingMode: 'consistent',
      includedPaths: [
        { path: '/*' }
      ],
      excludedPaths: [
        { path: '/"_etag"/?' }
      ],
      compositeIndexes: [
        [
          { path: '/id', order: 'ascending' },
          { path: '/createdAt', order: 'descending' }
        ],
        [
          { path: '/organizationId', order: 'ascending' },
          { path: '/createdAt', order: 'descending' }
        ]
      ]
    }
  },
  users: {
    containerId: 'users',
    indexingPolicy: {
      automatic: true,
      indexingMode: 'consistent',
      includedPaths: [
        { path: '/*' }
      ],
      excludedPaths: [
        { path: '/"_etag"/?' }
      ],
      compositeIndexes: [
        [
          { path: '/organizationId', order: 'ascending' },
          { path: '/role', order: 'ascending' },
          { path: '/createdAt', order: 'descending' }
        ],
        [
          { path: '/organizationId', order: 'ascending' },
          { path: '/email', order: 'ascending' }
        ]
      ]
    }
  },
  projects: {
    containerId: 'projects',
    indexingPolicy: {
      automatic: true,
      indexingMode: 'consistent',
      includedPaths: [
        { path: '/*' }
      ],
      excludedPaths: [
        { path: '/"_etag"/?' }
      ],
      compositeIndexes: [
        [
          { path: '/organizationId', order: 'ascending' },
          { path: '/status', order: 'ascending' },
          { path: '/createdAt', order: 'descending' }
        ],
        [
          { path: '/organizationId', order: 'ascending' },
          { path: '/name', order: 'ascending' }
        ],
        [
          { path: '/organizationId', order: 'ascending' },
          { path: '/timeline/strategy/status', order: 'ascending' },
          { path: '/createdAt', order: 'descending' }
        ]
      ]
    }
  },
  work_items: {
    containerId: 'work_items',
    indexingPolicy: {
      automatic: true,
      indexingMode: 'consistent',
      includedPaths: [
        { path: '/*' }
      ],
      excludedPaths: [
        { path: '/"_etag"/?' }
      ],
      compositeIndexes: [
        [
          { path: '/projectId', order: 'ascending' },
          { path: '/status', order: 'ascending' },
          { path: '/priority', order: 'ascending' },
          { path: '/dueDate', order: 'ascending' }
        ],
        [
          { path: '/projectId', order: 'ascending' },
          { path: '/assignee/id', order: 'ascending' },
          { path: '/status', order: 'ascending' }
        ],
        [
          { path: '/projectId', order: 'ascending' },
          { path: '/createdAt', order: 'descending' }
        ]
      ]
    }
  },
  events: {
    containerId: 'events',
    indexingPolicy: {
      automatic: true,
      indexingMode: 'consistent',
      includedPaths: [
        { path: '/*' }
      ],
      excludedPaths: [
        { path: '/"_etag"/?' }
      ],
      compositeIndexes: [
        [
          { path: '/organizationId', order: 'ascending' },
          { path: '/timestamp', order: 'descending' }
        ],
        [
          { path: '/organizationId', order: 'ascending' },
          { path: '/type', order: 'ascending' },
          { path: '/timestamp', order: 'descending' }
        ],
        [
          { path: '/projectId', order: 'ascending' },
          { path: '/timestamp', order: 'descending' }
        ]
      ]
    }
  },
  assets: {
    containerId: 'assets',
    indexingPolicy: {
      automatic: true,
      indexingMode: 'consistent',
      includedPaths: [
        { path: '/*' }
      ],
      excludedPaths: [
        { path: '/"_etag"/?' }
      ],
      compositeIndexes: [
        [
          { path: '/projectId', order: 'ascending' },
          { path: '/type', order: 'ascending' },
          { path: '/createdAt', order: 'descending' }
        ],
        [
          { path: '/projectId', order: 'ascending' },
          { path: '/uploadedBy/id', order: 'ascending' },
          { path: '/createdAt', order: 'descending' }
        ]
      ]
    }
  },
  insights: {
    containerId: 'insights',
    indexingPolicy: {
      automatic: true,
      indexingMode: 'consistent',
      includedPaths: [
        { path: '/*' }
      ],
      excludedPaths: [
        { path: '/"_etag"/?' }
      ],
      compositeIndexes: [
        [
          { path: '/projectId', order: 'ascending' },
          { path: '/type', order: 'ascending' },
          { path: '/timestamp', order: 'descending' }
        ],
        [
          { path: '/projectId', order: 'ascending' },
          { path: '/metric', order: 'ascending' },
          { path: '/timestamp', order: 'descending' }
        ]
      ]
    }
  },
  messages: {
    containerId: 'messages',
    indexingPolicy: {
      automatic: true,
      indexingMode: 'consistent',
      includedPaths: [
        { path: '/*' }
      ],
      excludedPaths: [
        { path: '/"_etag"/?' }
      ],
      compositeIndexes: [
        [
          { path: '/projectId', order: 'ascending' },
          { path: '/createdAt', order: 'descending' }
        ],
        [
          { path: '/projectId', order: 'ascending' },
          { path: '/author/id', order: 'ascending' },
          { path: '/createdAt', order: 'descending' }
        ],
        [
          { path: '/projectId', order: 'ascending' },
          { path: '/type', order: 'ascending' },
          { path: '/createdAt', order: 'descending' }
        ]
      ]
    }
  },
  approvals: {
    containerId: 'approvals',
    indexingPolicy: {
      automatic: true,
      indexingMode: 'consistent',
      includedPaths: [
        { path: '/*' }
      ],
      excludedPaths: [
        { path: '/"_etag"/?' }
      ],
      compositeIndexes: [
        [
          { path: '/projectId', order: 'ascending' },
          { path: '/status', order: 'ascending' },
          { path: '/submittedAt', order: 'descending' }
        ],
        [
          { path: '/projectId', order: 'ascending' },
          { path: '/requester/id', order: 'ascending' },
          { path: '/submittedAt', order: 'descending' }
        ],
        [
          { path: '/projectId', order: 'ascending' },
          { path: '/type', order: 'ascending' },
          { path: '/priority', order: 'ascending' }
        ]
      ]
    }
  },
  tool_inventory: {
    containerId: 'tool_inventory',
    indexingPolicy: {
      automatic: true,
      indexingMode: 'consistent',
      includedPaths: [
        { path: '/*' }
      ],
      excludedPaths: [
        { path: '/"_etag"/?' }
      ],
      compositeIndexes: [
        [
          { path: '/organizationId', order: 'ascending' },
          { path: '/status', order: 'ascending' },
          { path: '/createdAt', order: 'descending' }
        ],
        [
          { path: '/organizationId', order: 'ascending' },
          { path: '/category', order: 'ascending' },
          { path: '/name', order: 'ascending' }
        ]
      ]
    }
  }
};

async function applyCompositeIndexes() {
  console.log('🚀 Starting composite index application...');
  
  try {
    for (const [containerName, config] of Object.entries(compositeIndexes)) {
      console.log(`📊 Applying composite indexes to ${containerName}...`);
      
      const container = database.container(config.containerId);
      
      // Get current container configuration
      const { resource: containerDef } = await container.read();
      
      // Update indexing policy
      const updatedContainerDef = {
        ...containerDef,
        indexingPolicy: config.indexingPolicy
      };
      
      // Apply the updated configuration
      await container.replace(updatedContainerDef);
      
      console.log(`✅ Composite indexes applied to ${containerName}`);
    }
    
    console.log('🎉 All composite indexes applied successfully!');
    
    // Verify indexes
    console.log('🔍 Verifying composite indexes...');
    for (const [containerName, config] of Object.entries(compositeIndexes)) {
      const container = database.container(config.containerId);
      const { resource: containerDef } = await container.read();
      
      console.log(`📋 ${containerName} indexing policy:`, {
        automatic: containerDef.indexingPolicy.automatic,
        indexingMode: containerDef.indexingPolicy.indexingMode,
        compositeIndexes: containerDef.indexingPolicy.compositeIndexes?.length || 0
      });
    }
    
  } catch (error) {
    console.error('❌ Error applying composite indexes:', error);
    process.exit(1);
  }
}

// Run the script
applyCompositeIndexes();
