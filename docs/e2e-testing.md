# E2E Testing Guide

## Overview

This document provides a comprehensive guide for end-to-end testing of the Global Next Marketing Portal using Playwright.

## Test Structure

### Test Categories

1. **Authentication Tests** (`auth.spec.ts`)
   - Login flow testing
   - User session management
   - Role-based access control
   - Authentication error handling

2. **Project Management Tests** (`projects.spec.ts`)
   - Project creation and editing
   - Project detail page navigation
   - KPI dashboard functionality
   - Project export capabilities

3. **Task Management Tests** (`tasks.spec.ts`)
   - Work item creation and editing
   - Kanban board functionality
   - Task assignment and filtering
   - Drag and drop operations

4. **Approval Workflow Tests** (`approvals.spec.ts`)
   - Approval request creation
   - Approval and rejection workflows
   - Comment system functionality
   - Status filtering

5. **Messaging Tests** (`messaging.spec.ts`)
   - Chat interface functionality
   - Message sending and receiving
   - File upload capabilities
   - User mentions and notifications

6. **Export Functionality Tests** (`exports.spec.ts`)
   - PDF export generation
   - Excel export generation
   - Export error handling
   - Download verification

## Running Tests

### Local Development

```bash
# Run all tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run tests in headed mode
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# Show test report
npm run test:e2e:report
```

### CI/CD Pipeline

Tests are automatically run in the GitHub Actions workflow:

```yaml
test-e2e:
  name: E2E Tests
  runs-on: ubuntu-latest
  needs: build
  steps:
    - name: Run Playwright tests
      run: |
        cd apps/web
        pnpm run test:e2e
      env:
        PLAYWRIGHT_BASE_URL: ${{ github.ref == 'refs/heads/main' && 'https://global-next-prod.azurestaticapps.net' || 'https://global-next-staging.azurestaticapps.net' }}
```

## Test Configuration

### Playwright Config (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  }
});
```

## Test Data Management

### Mock Data Strategy

Tests use mocked API responses to ensure consistent and predictable behavior:

```typescript
// Mock authentication
await page.route('**/api/auth/session', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      user: {
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    })
  });
});
```

### Test Data Cleanup

Global setup and teardown handle test data:

```typescript
// Global setup
async function globalSetup(config: FullConfig) {
  // Set up test data and authentication
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate and set up test environment
  await page.goto(config.projects[0].use.baseURL || 'http://localhost:3001');
  await page.waitForLoadState('networkidle');
  
  await browser.close();
}
```

## Best Practices

### 1. Test Isolation

Each test should be independent and not rely on other tests:

```typescript
test.beforeEach(async ({ page }) => {
  // Set up fresh state for each test
  await page.goto('/');
  // Mock authentication
  await page.route('**/api/auth/session', async route => {
    // Mock authenticated session
  });
});
```

### 2. Reliable Selectors

Use data-testid attributes for reliable element selection:

```typescript
// Good - reliable selector
await page.locator('[data-testid="login-form"]').fill('test@example.com');

// Avoid - fragile selector
await page.locator('input[type="email"]').fill('test@example.com');
```

### 3. Wait Strategies

Use appropriate wait strategies for dynamic content:

```typescript
// Wait for network to be idle
await page.waitForLoadState('networkidle');

// Wait for specific element
await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

// Wait for navigation
await page.waitForURL('**/dashboard');
```

### 4. Error Handling

Test both success and error scenarios:

```typescript
test('should handle authentication errors gracefully', async ({ page }) => {
  // Mock authentication error
  await page.route('**/api/auth/signin', async route => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Invalid credentials' })
    });
  });

  // Test error handling
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', 'invalid@example.com');
  await page.fill('[data-testid="password-input"]', 'wrongpassword');
  await page.click('[data-testid="submit-button"]');

  // Verify error message is displayed
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
});
```

## UAT Checklist

### Automated UAT Page

The UAT page (`/uat`) provides a comprehensive checklist of system health:

1. **Health Checks**
   - API endpoint availability
   - Database connectivity
   - Storage SAS token generation
   - Authentication service status

2. **RBAC Verification**
   - Admin role access
   - Manager role access
   - Analyst role access
   - Client role access

3. **Feature Validation**
   - Project management
   - Task management
   - Approval workflows
   - Messaging system
   - Export functionality
   - Analytics dashboard

4. **Security Checks**
   - Security headers
   - Rate limiting
   - Audit logging

5. **Performance Validation**
   - Page load times
   - API response times

### Running UAT Checks

```typescript
// Individual check
const runCheck = async (checkId: string) => {
  setChecks(prev => prev.map(check => 
    check.id === checkId 
      ? { ...check, status: 'running' }
      : check
  ));

  try {
    const result = await fetch(`/api/${checkId}`);
    if (!result.ok) throw new Error(`Check failed: ${result.status}`);
    
    setChecks(prev => prev.map(check => 
      check.id === checkId 
        ? { ...check, status: 'passed', result: 'Check passed successfully' }
        : check
    ));
  } catch (error) {
    setChecks(prev => prev.map(check => 
      check.id === checkId 
        ? { ...check, status: 'failed', error: error.message }
        : check
    ));
  }
};
```

## Debugging Tests

### 1. Debug Mode

Run tests in debug mode to step through execution:

```bash
npm run test:e2e:debug
```

### 2. Screenshots and Videos

Failed tests automatically capture screenshots and videos:

```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry'
}
```

### 3. Test Reports

View detailed test reports:

```bash
npm run test:e2e:report
```

## Continuous Integration

### GitHub Actions Integration

Tests run automatically on every push and pull request:

```yaml
- name: Run Playwright tests
  run: |
    cd apps/web
    pnpm run test:e2e
  env:
    PLAYWRIGHT_BASE_URL: ${{ github.ref == 'refs/heads/main' && 'https://global-next-prod.azurestaticapps.net' || 'https://global-next-staging.azurestaticapps.net' }}

- name: Upload test results
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: apps/web/test-results/
    retention-days: 30
```

### Test Results

Test results are uploaded as artifacts and can be downloaded from the GitHub Actions interface.

## Maintenance

### Regular Updates

1. **Update Playwright**: Keep Playwright version up to date
2. **Update Test Data**: Refresh mock data regularly
3. **Review Test Coverage**: Ensure all critical paths are tested
4. **Performance Monitoring**: Monitor test execution times

### Test Maintenance

1. **Remove Obsolete Tests**: Remove tests for deprecated features
2. **Update Selectors**: Update selectors when UI changes
3. **Refactor Common Code**: Extract common test utilities
4. **Documentation**: Keep test documentation up to date

## Troubleshooting

### Common Issues

1. **Flaky Tests**: Use proper wait strategies and stable selectors
2. **Timeout Errors**: Increase timeout values for slow operations
3. **Authentication Issues**: Ensure mock authentication is properly set up
4. **Network Issues**: Use network mocking for consistent behavior

### Debug Commands

```bash
# Run specific test file
npx playwright test tests/e2e/auth.spec.ts

# Run tests in headed mode
npx playwright test --headed

# Run tests with debug mode
npx playwright test --debug

# Show test report
npx playwright show-report
```

---

**For additional support, refer to the Playwright documentation or contact the development team.**
