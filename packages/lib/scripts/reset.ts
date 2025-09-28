import { getContainer, CONTAINERS } from '../src/db';

async function resetDatabase() {
  console.log('🗑️ Starting database reset...');
  
  try {
    // Delete all items from each container
    const containers = Object.values(CONTAINERS);
    
    for (const containerName of containers) {
      const container = getContainer(containerName);
      
      // Get all items
      const { resources: items } = await container.items
        .query({ query: 'SELECT c.id FROM c' })
        .fetchAll();
      
      // Delete items in batches
      if (items.length > 0) {
        console.log(`Deleting ${items.length} items from ${containerName}...`);
        
        for (const item of items) {
          await container.item(item.id, item.id).delete();
        }
        
        console.log(`✅ Cleared ${containerName}`);
      } else {
        console.log(`✅ ${containerName} is already empty`);
      }
    }
    
    console.log('🎉 Database reset completed successfully!');
    console.log('💡 Run "pnpm db:seed" to populate with demo data');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  resetDatabase();
}

export { resetDatabase };
