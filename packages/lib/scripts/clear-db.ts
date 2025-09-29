import { clearDatabase } from './seed-db';

/**
 * Clear all data from the database
 */
async function main() {
  try {
    await clearDatabase();
    console.log('🎉 Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Failed to clear database:', error);
    process.exit(1);
  }
}

main();
