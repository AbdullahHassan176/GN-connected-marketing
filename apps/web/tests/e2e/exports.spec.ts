import { test, expect } from '@playwright/test';

test.describe('Export Functionality', () => {
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

    await page.goto('/projects/proj_123');
  });

  test('should display export buttons on project page', async ({ page }) => {
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

    // Check export buttons are visible
    await expect(page.locator('button:has-text("Export PDF")')).toBeVisible();
    await expect(page.locator('button:has-text("Export Excel")')).toBeVisible();
  });

  test('should allow exporting project as PDF', async ({ page }) => {
    // Mock PDF export endpoint
    await page.route('**/api/projects/proj_123/export/pdf', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from('PDF content for test project'),
        headers: {
          'Content-Disposition': 'attachment; filename="Test_Project_Report.pdf"'
        }
      });
    });

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
          createdAt: new Date().toISOString()
        })
      });
    });

    await page.goto('/projects/proj_123');

    // Click PDF export button
    const pdfExportButton = page.locator('button:has-text("Export PDF")');
    
    // Set up download handling
    const downloadPromise = page.waitForEvent('download');
    await pdfExportButton.click();
    
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toBe('Test_Project_Report.pdf');
  });

  test('should allow exporting project as Excel', async ({ page }) => {
    // Mock Excel export endpoint
    await page.route('**/api/projects/proj_123/export/xlsx', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: Buffer.from('Excel content for test project'),
        headers: {
          'Content-Disposition': 'attachment; filename="Test_Project_Report.xlsx"'
        }
      });
    });

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
          createdAt: new Date().toISOString()
        })
      });
    });

    await page.goto('/projects/proj_123');

    // Click Excel export button
    const excelExportButton = page.locator('button:has-text("Export Excel")');
    
    // Set up download handling
    const downloadPromise = page.waitForEvent('download');
    await excelExportButton.click();
    
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toBe('Test_Project_Report.xlsx');
  });

  test('should handle export errors gracefully', async ({ page }) => {
    // Mock export error
    await page.route('**/api/projects/proj_123/export/pdf', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Export failed' })
      });
    });

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
          createdAt: new Date().toISOString()
        })
      });
    });

    await page.goto('/projects/proj_123');

    // Click PDF export button
    const pdfExportButton = page.locator('button:has-text("Export PDF")');
    await pdfExportButton.click();

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]:has-text("Export failed")')).toBeVisible();
  });

  test('should show export progress indicator', async ({ page }) => {
    // Mock slow export endpoint
    await page.route('**/api/projects/proj_123/export/pdf', async route => {
      // Simulate slow response
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from('PDF content'),
        headers: {
          'Content-Disposition': 'attachment; filename="Test_Project_Report.pdf"'
        }
      });
    });

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
          createdAt: new Date().toISOString()
        })
      });
    });

    await page.goto('/projects/proj_123');

    // Click PDF export button
    const pdfExportButton = page.locator('button:has-text("Export PDF")');
    await pdfExportButton.click();

    // Should show loading indicator
    await expect(page.locator('[data-testid="export-loading"]')).toBeVisible();
  });

  test('should allow exporting from insights page', async ({ page }) => {
    // Mock insights data
    await page.route('**/api/insights', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          performance: {
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

    // Mock insights export
    await page.route('**/api/insights/export/pdf', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from('Insights PDF content'),
        headers: {
          'Content-Disposition': 'attachment; filename="Insights_Report.pdf"'
        }
      });
    });

    await page.goto('/insights');

    // Check export button is visible
    await expect(page.locator('button:has-text("Export PDF")')).toBeVisible();

    // Click export button
    const exportButton = page.locator('button:has-text("Export PDF")');
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('Insights_Report.pdf');
  });

  test('should allow exporting from A/B tests page', async ({ page }) => {
    // Mock A/B tests data
    await page.route('**/api/ab-tests', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'ab_001',
            name: 'Email Subject Line Test',
            description: 'Testing different email subject lines',
            status: 'running',
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            variants: [
              {
                id: 'var_001',
                name: 'Control',
                description: 'Original subject line',
                traffic: 50,
                metrics: {
                  openRate: 25.5,
                  clickRate: 3.2,
                  conversionRate: 1.8
                }
              },
              {
                id: 'var_002',
                name: 'Variant A',
                description: 'New subject line A',
                traffic: 50,
                metrics: {
                  openRate: 28.1,
                  clickRate: 3.8,
                  conversionRate: 2.1
                }
              }
            ]
          }
        ])
      });
    });

    // Mock A/B tests export
    await page.route('**/api/ab-tests/export/xlsx', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: Buffer.from('A/B Tests Excel content'),
        headers: {
          'Content-Disposition': 'attachment; filename="AB_Tests_Report.xlsx"'
        }
      });
    });

    await page.goto('/ab-tests');

    // Check export button is visible
    await expect(page.locator('button:has-text("Export Excel")')).toBeVisible();

    // Click export button
    const exportButton = page.locator('button:has-text("Export Excel")');
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('AB_Tests_Report.xlsx');
  });

  test('should allow exporting from sentiment page', async ({ page }) => {
    // Mock sentiment data
    await page.route('**/api/sentiment', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          overall: {
            positive: 65.2,
            neutral: 28.1,
            negative: 6.7
          },
          trends: [
            { date: '2024-01-01', positive: 62.1, neutral: 30.2, negative: 7.7 },
            { date: '2024-01-02', positive: 64.5, neutral: 28.8, negative: 6.7 },
            { date: '2024-01-03', positive: 65.2, neutral: 28.1, negative: 6.7 }
          ],
          channels: {
            social: { positive: 68.1, neutral: 25.3, negative: 6.6 },
            email: { positive: 62.8, neutral: 30.1, negative: 7.1 },
            website: { positive: 65.5, neutral: 28.9, negative: 5.6 }
          }
        })
      });
    });

    // Mock sentiment export
    await page.route('**/api/sentiment/export/pdf', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from('Sentiment PDF content'),
        headers: {
          'Content-Disposition': 'attachment; filename="Sentiment_Report.pdf"'
        }
      });
    });

    await page.goto('/sentiment');

    // Check export button is visible
    await expect(page.locator('button:has-text("Export PDF")')).toBeVisible();

    // Click export button
    const exportButton = page.locator('button:has-text("Export PDF")');
    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('Sentiment_Report.pdf');
  });

  test('should handle concurrent export requests', async ({ page }) => {
    // Mock export endpoints
    await page.route('**/api/projects/proj_123/export/pdf', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from('PDF content'),
        headers: {
          'Content-Disposition': 'attachment; filename="Test_Project_Report.pdf"'
        }
      });
    });

    await page.route('**/api/projects/proj_123/export/xlsx', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: Buffer.from('Excel content'),
        headers: {
          'Content-Disposition': 'attachment; filename="Test_Project_Report.xlsx"'
        }
      });
    });

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
          createdAt: new Date().toISOString()
        })
      });
    });

    await page.goto('/projects/proj_123');

    // Start both exports
    const pdfExportButton = page.locator('button:has-text("Export PDF")');
    const excelExportButton = page.locator('button:has-text("Export Excel")');

    const pdfDownloadPromise = page.waitForEvent('download');
    const excelDownloadPromise = page.waitForEvent('download');

    await pdfExportButton.click();
    await excelExportButton.click();

    // Wait for both downloads
    const pdfDownload = await pdfDownloadPromise;
    const excelDownload = await excelDownloadPromise;

    // Verify both downloads
    expect(pdfDownload.suggestedFilename()).toBe('Test_Project_Report.pdf');
    expect(excelDownload.suggestedFilename()).toBe('Test_Project_Report.xlsx');
  });
});
