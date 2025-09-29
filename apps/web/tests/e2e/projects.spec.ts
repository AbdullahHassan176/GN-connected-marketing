import { test, expect } from '@playwright/test';

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated session
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

    await page.goto('/projects');
  });

  test('should display projects list page', async ({ page }) => {
    await expect(page.locator('h1:has-text("Projects")')).toBeVisible();
    await expect(page.locator('[data-testid="projects-table"]')).toBeVisible();
  });

  test('should allow creating a new project', async ({ page }) => {
    // Mock API responses
    await page.route('**/api/projects', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'proj_123',
            name: 'Test Project',
            description: 'A test project',
            organizationId: 'org_123',
            status: 'active',
            createdAt: new Date().toISOString()
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'proj_123',
              name: 'Test Project',
              description: 'A test project',
              organizationId: 'org_123',
              status: 'active',
              createdAt: new Date().toISOString()
            }
          ])
        });
      }
    });

    // Click create project button
    const createButton = page.locator('button:has-text("Create Project")');
    await createButton.click();

    // Fill project form
    const nameInput = page.locator('input[name="name"]');
    const descriptionInput = page.locator('textarea[name="description"]');
    const submitButton = page.locator('button[type="submit"]');

    await nameInput.fill('Test Project');
    await descriptionInput.fill('A test project for E2E testing');
    await submitButton.click();

    // Should redirect to project detail page
    await page.waitForURL('**/projects/proj_123');
    await expect(page.locator('h1:has-text("Test Project")')).toBeVisible();
  });

  test('should display project detail page with tabs', async ({ page }) => {
    // Mock project data
    await page.route('**/api/projects/proj_123', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'proj_123',
          name: 'Test Project',
          description: 'A test project',
          organizationId: 'org_123',
          status: 'active',
          createdAt: new Date().toISOString(),
          timeline: {
            strategy: { status: 'completed', completedAt: new Date().toISOString() },
            content: { status: 'in_progress', startedAt: new Date().toISOString() },
            distribution: { status: 'pending' },
            ads: { status: 'pending' },
            insights: { status: 'pending' }
          }
        })
      });
    });

    await page.goto('/projects/proj_123');

    // Check project header
    await expect(page.locator('h1:has-text("Test Project")')).toBeVisible();

    // Check tabs are present
    const tabs = page.locator('[role="tablist"]');
    await expect(tabs).toBeVisible();

    // Check specific tabs
    await expect(page.locator('[role="tab"]:has-text("Overview")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Storyboard")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("KPIs")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("A/B Tests")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Sentiment")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Work")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Assets")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Approvals")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Room")')).toBeVisible();
  });

  test('should allow editing project details', async ({ page }) => {
    // Mock project data
    await page.route('**/api/projects/proj_123', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'proj_123',
            name: 'Updated Project',
            description: 'An updated test project',
            organizationId: 'org_123',
            status: 'active',
            updatedAt: new Date().toISOString()
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'proj_123',
            name: 'Test Project',
            description: 'A test project',
            organizationId: 'org_123',
            status: 'active',
            createdAt: new Date().toISOString()
          })
        });
      }
    });

    await page.goto('/projects/proj_123');

    // Click edit button
    const editButton = page.locator('button:has-text("Edit")');
    await editButton.click();

    // Update project name
    const nameInput = page.locator('input[name="name"]');
    await nameInput.clear();
    await nameInput.fill('Updated Project');

    // Update description
    const descriptionInput = page.locator('textarea[name="description"]');
    await descriptionInput.clear();
    await descriptionInput.fill('An updated test project');

    // Save changes
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();

    // Should show updated name
    await expect(page.locator('h1:has-text("Updated Project")')).toBeVisible();
  });

  test('should display project KPIs', async ({ page }) => {
    // Mock KPI data
    await page.route('**/api/projects/proj_123/insights', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          kpis: {
            ctr: { value: 2.5, target: 3.0, trend: 'up' },
            roi: { value: 4.2, target: 5.0, trend: 'up' },
            engagement: { value: 15.8, target: 20.0, trend: 'down' },
            conversions: { value: 125, target: 150, trend: 'up' }
          },
          trends: [
            { date: '2024-01-01', ctr: 2.1, roi: 3.8, engagement: 18.2, conversions: 98 },
            { date: '2024-01-02', ctr: 2.3, roi: 4.0, engagement: 16.5, conversions: 112 },
            { date: '2024-01-03', ctr: 2.5, roi: 4.2, engagement: 15.8, conversions: 125 }
          ]
        })
      });
    });

    await page.goto('/projects/proj_123');

    // Click KPIs tab
    const kpisTab = page.locator('[role="tab"]:has-text("KPIs")');
    await kpisTab.click();

    // Check KPI cards are visible
    await expect(page.locator('[data-testid="kpi-card"]')).toHaveCount(4);
    
    // Check specific KPIs
    await expect(page.locator('text=CTR')).toBeVisible();
    await expect(page.locator('text=ROI')).toBeVisible();
    await expect(page.locator('text=Engagement')).toBeVisible();
    await expect(page.locator('text=Conversions')).toBeVisible();
  });

  test('should allow exporting project data', async ({ page }) => {
    // Mock export endpoints
    await page.route('**/api/projects/proj_123/export/pdf', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from('PDF content')
      });
    });

    await page.route('**/api/projects/proj_123/export/xlsx', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: Buffer.from('Excel content')
      });
    });

    await page.goto('/projects/proj_123');

    // Test PDF export
    const pdfExportButton = page.locator('button:has-text("Export PDF")');
    await pdfExportButton.click();

    // Should trigger download
    const downloadPromise = page.waitForEvent('download');
    await downloadPromise;

    // Test Excel export
    const excelExportButton = page.locator('button:has-text("Export Excel")');
    await excelExportButton.click();

    // Should trigger download
    const downloadPromise2 = page.waitForEvent('download');
    await downloadPromise2;
  });

  test('should handle project deletion', async ({ page }) => {
    // Mock delete endpoint
    await page.route('**/api/projects/proj_123', async route => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 204,
          body: ''
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'proj_123',
            name: 'Test Project',
            description: 'A test project',
            organizationId: 'org_123',
            status: 'active',
            createdAt: new Date().toISOString()
          })
        });
      }
    });

    await page.goto('/projects/proj_123');

    // Click delete button
    const deleteButton = page.locator('button:has-text("Delete")');
    await deleteButton.click();

    // Confirm deletion
    const confirmButton = page.locator('button:has-text("Confirm")');
    await confirmButton.click();

    // Should redirect to projects list
    await page.waitForURL('**/projects');
    await expect(page.locator('h1:has-text("Projects")')).toBeVisible();
  });
});
