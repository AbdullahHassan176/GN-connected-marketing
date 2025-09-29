import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Global Next E2E Test Setup');
  
  // Set up test data and authentication
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the application
    await page.goto(config.projects[0].use.baseURL || 'http://localhost:3001');
    
    // Wait for the application to load
    await page.waitForLoadState('networkidle');
    
    // Check if we need to set up test data
    const needsSetup = await page.locator('text=Setup Test Data').isVisible().catch(() => false);
    
    if (needsSetup) {
      console.log('📊 Setting up test data...');
      await page.click('text=Setup Test Data');
      await page.waitForLoadState('networkidle');
    }
    
    console.log('✅ Global setup completed');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
