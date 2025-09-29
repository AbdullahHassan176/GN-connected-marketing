import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting Global Next E2E Test Teardown');
  
  // Clean up test data if needed
  console.log('✅ Global teardown completed');
}

export default globalTeardown;
