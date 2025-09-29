import { test, expect } from '@playwright/test';

test.describe('Approval Workflow', () => {
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

  test('should display approvals tab', async ({ page }) => {
    // Mock approvals data
    await page.route('**/api/projects/proj_123/approvals', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'app_001',
            type: 'budget_approval',
            title: 'Campaign Budget Approval',
            description: 'Request for additional campaign budget',
            requester: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com'
            },
            project: 'proj_123',
            amount: 50000,
            status: 'pending',
            priority: 'high',
            submittedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            attachments: ['budget_proposal.pdf'],
            comments: []
          }
        ])
      });
    });

    // Navigate to Approvals tab
    const approvalsTab = page.locator('[role="tab"]:has-text("Approvals")');
    await approvalsTab.click();

    // Check approvals table is visible
    await expect(page.locator('[data-testid="approvals-table"]')).toBeVisible();

    // Check approval request is displayed
    await expect(page.locator('[data-testid="approval-request"]:has-text("Campaign Budget Approval")')).toBeVisible();
  });

  test('should allow creating a new approval request', async ({ page }) => {
    // Mock approval creation
    await page.route('**/api/projects/proj_123/approvals', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'app_002',
            type: 'creative_approval',
            title: 'New Creative Approval',
            description: 'Request for new creative assets approval',
            requester: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com'
            },
            project: 'proj_123',
            amount: 0,
            status: 'pending',
            priority: 'medium',
            submittedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            attachments: [],
            comments: []
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    // Navigate to Approvals tab
    const approvalsTab = page.locator('[role="tab"]:has-text("Approvals")');
    await approvalsTab.click();

    // Click create approval button
    const createButton = page.locator('button:has-text("Create Approval")');
    await createButton.click();

    // Fill approval form
    const typeSelect = page.locator('select[name="type"]');
    const titleInput = page.locator('input[name="title"]');
    const descriptionInput = page.locator('textarea[name="description"]');
    const prioritySelect = page.locator('select[name="priority"]');
    const dueDateInput = page.locator('input[name="dueDate"]');
    const submitButton = page.locator('button[type="submit"]');

    await typeSelect.selectOption('creative_approval');
    await titleInput.fill('New Creative Approval');
    await descriptionInput.fill('Request for new creative assets approval');
    await prioritySelect.selectOption('medium');
    await dueDateInput.fill(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    await submitButton.click();

    // Should show new approval request
    await expect(page.locator('[data-testid="approval-request"]:has-text("New Creative Approval")')).toBeVisible();
  });

  test('should allow approving a request', async ({ page }) => {
    // Mock approval data
    await page.route('**/api/projects/proj_123/approvals/app_001', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'app_001',
            type: 'budget_approval',
            title: 'Campaign Budget Approval',
            description: 'Request for additional campaign budget',
            requester: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com'
            },
            project: 'proj_123',
            amount: 50000,
            status: 'approved',
            priority: 'high',
            submittedAt: new Date().toISOString(),
            approvedAt: new Date().toISOString(),
            approver: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com'
            },
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            attachments: ['budget_proposal.pdf'],
            comments: []
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'app_001',
            type: 'budget_approval',
            title: 'Campaign Budget Approval',
            description: 'Request for additional campaign budget',
            requester: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com'
            },
            project: 'proj_123',
            amount: 50000,
            status: 'pending',
            priority: 'high',
            submittedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            attachments: ['budget_proposal.pdf'],
            comments: []
          })
        });
      }
    });

    await page.route('**/api/projects/proj_123/approvals', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'app_001',
            type: 'budget_approval',
            title: 'Campaign Budget Approval',
            description: 'Request for additional campaign budget',
            requester: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com'
            },
            project: 'proj_123',
            amount: 50000,
            status: 'pending',
            priority: 'high',
            submittedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            attachments: ['budget_proposal.pdf'],
            comments: []
          }
        ])
      });
    });

    // Navigate to Approvals tab
    const approvalsTab = page.locator('[role="tab"]:has-text("Approvals")');
    await approvalsTab.click();

    // Click approve button on approval request
    const approveButton = page.locator('[data-testid="approval-request"] button:has-text("Approve")');
    await approveButton.click();

    // Add approval comment
    const commentInput = page.locator('textarea[name="comment"]');
    await commentInput.fill('Approved - budget looks reasonable');

    // Confirm approval
    const confirmButton = page.locator('button:has-text("Confirm Approval")');
    await confirmButton.click();

    // Should show approved status
    await expect(page.locator('[data-testid="approval-request"]:has-text("Approved")')).toBeVisible();
  });

  test('should allow rejecting a request', async ({ page }) => {
    // Mock approval rejection
    await page.route('**/api/projects/proj_123/approvals/app_001', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'app_001',
            type: 'budget_approval',
            title: 'Campaign Budget Approval',
            description: 'Request for additional campaign budget',
            requester: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com'
            },
            project: 'proj_123',
            amount: 50000,
            status: 'rejected',
            priority: 'high',
            submittedAt: new Date().toISOString(),
            rejectedAt: new Date().toISOString(),
            approver: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com'
            },
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            attachments: ['budget_proposal.pdf'],
            comments: []
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'app_001',
            type: 'budget_approval',
            title: 'Campaign Budget Approval',
            description: 'Request for additional campaign budget',
            requester: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com'
            },
            project: 'proj_123',
            amount: 50000,
            status: 'pending',
            priority: 'high',
            submittedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            attachments: ['budget_proposal.pdf'],
            comments: []
          })
        });
      }
    });

    await page.route('**/api/projects/proj_123/approvals', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'app_001',
            type: 'budget_approval',
            title: 'Campaign Budget Approval',
            description: 'Request for additional campaign budget',
            requester: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com'
            },
            project: 'proj_123',
            amount: 50000,
            status: 'pending',
            priority: 'high',
            submittedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            attachments: ['budget_proposal.pdf'],
            comments: []
          }
        ])
      });
    });

    // Navigate to Approvals tab
    const approvalsTab = page.locator('[role="tab"]:has-text("Approvals")');
    await approvalsTab.click();

    // Click reject button on approval request
    const rejectButton = page.locator('[data-testid="approval-request"] button:has-text("Reject")');
    await rejectButton.click();

    // Add rejection reason
    const reasonInput = page.locator('textarea[name="reason"]');
    await reasonInput.fill('Budget exceeds allocated amount');

    // Confirm rejection
    const confirmButton = page.locator('button:has-text("Confirm Rejection")');
    await confirmButton.click();

    // Should show rejected status
    await expect(page.locator('[data-testid="approval-request"]:has-text("Rejected")')).toBeVisible();
  });

  test('should allow adding comments to approval request', async ({ page }) => {
    // Mock comment addition
    await page.route('**/api/projects/proj_123/approvals/app_001/comments', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'comment_001',
            text: 'Need more details on budget breakdown',
            author: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com'
            },
            createdAt: new Date().toISOString()
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    await page.route('**/api/projects/proj_123/approvals/app_001', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'app_001',
          type: 'budget_approval',
          title: 'Campaign Budget Approval',
          description: 'Request for additional campaign budget',
          requester: {
            id: 'test-user-123',
            name: 'Test User',
            email: 'test@example.com'
          },
          project: 'proj_123',
          amount: 50000,
          status: 'pending',
          priority: 'high',
          submittedAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          attachments: ['budget_proposal.pdf'],
          comments: []
        })
      });
    });

    // Navigate to Approvals tab
    const approvalsTab = page.locator('[role="tab"]:has-text("Approvals")');
    await approvalsTab.click();

    // Click on approval request to view details
    const approvalRequest = page.locator('[data-testid="approval-request"]:has-text("Campaign Budget Approval")');
    await approvalRequest.click();

    // Add comment
    const commentInput = page.locator('textarea[name="comment"]');
    await commentInput.fill('Need more details on budget breakdown');

    const addCommentButton = page.locator('button:has-text("Add Comment")');
    await addCommentButton.click();

    // Should show new comment
    await expect(page.locator('[data-testid="comment"]:has-text("Need more details on budget breakdown")')).toBeVisible();
  });

  test('should allow filtering approvals by status', async ({ page }) => {
    // Mock approvals with different statuses
    await page.route('**/api/projects/proj_123/approvals', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'app_001',
            type: 'budget_approval',
            title: 'Campaign Budget Approval',
            description: 'Request for additional campaign budget',
            requester: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com'
            },
            project: 'proj_123',
            amount: 50000,
            status: 'pending',
            priority: 'high',
            submittedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            attachments: ['budget_proposal.pdf'],
            comments: []
          },
          {
            id: 'app_002',
            type: 'creative_approval',
            title: 'Creative Assets Approval',
            description: 'Request for creative assets approval',
            requester: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com'
            },
            project: 'proj_123',
            amount: 0,
            status: 'approved',
            priority: 'medium',
            submittedAt: new Date().toISOString(),
            approvedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            attachments: [],
            comments: []
          }
        ])
      });
    });

    // Navigate to Approvals tab
    const approvalsTab = page.locator('[role="tab"]:has-text("Approvals")');
    await approvalsTab.click();

    // Filter by pending status
    const statusFilter = page.locator('select[name="status"]');
    await statusFilter.selectOption('pending');

    // Should only show pending approvals
    await expect(page.locator('[data-testid="approval-request"]:has-text("Campaign Budget Approval")')).toBeVisible();
    await expect(page.locator('[data-testid="approval-request"]:has-text("Creative Assets Approval")')).not.toBeVisible();
  });
});
