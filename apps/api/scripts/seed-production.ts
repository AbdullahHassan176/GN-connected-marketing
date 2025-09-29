import { seedDatabase } from '../src/seed';
import { validateEnvironment } from '../src/config/secrets';

async function seedProduction() {
  try {
    console.log('🌱 Seeding production database...');
    
    // Validate environment variables
    const env = validateEnvironment();
    console.log('✅ Environment variables validated');
    
    // Seed the database
    await seedDatabase();
    console.log('✅ Production database seeded successfully');
    
    console.log('🎉 Production environment ready!');
    console.log('📊 Dashboard: https://global-next-prod.azurestaticapps.net/dashboard');
    console.log('🔗 API: https://global-next-api-prod.azurewebsites.net/api/health');
    
  } catch (error) {
    console.error('❌ Failed to seed production database:', error);
    process.exit(1);
  }
}

seedProduction();
