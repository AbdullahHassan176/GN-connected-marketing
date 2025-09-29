import { seedDatabase } from '../src/seed';
import { validateEnvironment } from '../src/config/secrets';

async function seedStaging() {
  try {
    console.log('🌱 Seeding staging database...');
    
    // Validate environment variables
    const env = validateEnvironment();
    console.log('✅ Environment variables validated');
    
    // Seed the database
    await seedDatabase();
    console.log('✅ Staging database seeded successfully');
    
    console.log('🎉 Staging environment ready!');
    console.log('📊 Dashboard: https://global-next-staging.azurestaticapps.net/dashboard');
    console.log('🔗 API: https://global-next-api-staging.azurewebsites.net/api/health');
    
  } catch (error) {
    console.error('❌ Failed to seed staging database:', error);
    process.exit(1);
  }
}

seedStaging();
