import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
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

  test('should display work items in Kanban board', async ({ page }) => {
    // Mock work items data
    await page.route('**/api/projects/proj_123/work-items', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'wi_001',
            title: 'Create campaign strategy',
            description: 'Develop comprehensive campaign strategy',
            status: 'todo',
            priority: 'high',
            assignee: 'test-user-123',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          },
          {
            id: 'wi_002',
            title: 'Design creative assets',
            description: 'Create visual assets for campaign',
            status: 'in_progress',
            priority: 'medium',
            assignee: 'test-user-123',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          },
          {
            id: 'wi_003',
            title: 'Review campaign performance',
            description: 'Analyze campaign metrics and performance',
            status: 'done',
            priority: 'low',
            assignee: 'test-user-123',
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          }
        ])
      });
    });

    // Navigate to Work tab
    const workTab = page.locator('[role="tab"]:has-text("Work")');
    await workTab.click();

    // Check Kanban board is visible
    await expect(page.locator('[data-testid="kanban-board"]')).toBeVisible();

    // Check columns are present
    await expect(page.locator('[data-testid="kanban-column"]:has-text("To Do")')).toBeVisible();
    await expect(page.locator('[data-testid="kanban-column"]:has-text("In Progress")')).toBeVisible();
    await expect(page.locator('[data-testid="kanban-column"]:has-text("Done")')).toBeVisible();

    // Check work items are displayed
    await expect(page.locator('[data-testid="work-item"]')).toHaveCount(3);
  });

  test('should allow creating a new work item', async ({ page }) => {
    // Mock work items API
    await page.route('**/api/projects/proj_123/work-items', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'wi_004',
            title: 'New Task',
            description: 'A new task for testing',
            status: 'todo',
            priority: 'medium',
            assignee: 'test-user-123',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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

    // Navigate to Work tab
    const workTab = page.locator('[role="tab"]:has-text("Work")');
    await workTab.click();

    // Click create work item button
    const createButton = page.locator('button:has-text("Add Task")');
    await createButton.click();

    // Fill work item form
    const titleInput = page.locator('input[name="title"]');
    const descriptionInput = page.locator('textarea[name="description"]');
    const prioritySelect = page.locator('select[name="priority"]');
    const dueDateInput = page.locator('input[name="dueDate"]');
    const submitButton = page.locator('button[type="submit"]');

    await titleInput.fill('New Task');
    await descriptionInput.fill('A new task for testing');
    await prioritySelect.selectOption('medium');
    await dueDateInput.fill(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    await submitButton.click();

    // Should show new work item
    await expect(page.locator('[data-testid="work-item"]:has-text("New Task")')).toBeVisible();
  });

  test('should allow editing work item', async ({ page }) => {
    // Mock work item data
    await page.route('**/api/projects/proj_123/work-items/wi_001', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'wi_001',
            title: 'Updated Task',
            description: 'An updated task description',
            status: 'todo',
            priority: 'high',
            assignee: 'test-user-123',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'wi_001',
            title: 'Create campaign strategy',
            description: 'Develop comprehensive campaign strategy',
            status: 'todo',
            priority: 'high',
            assignee: 'test-user-123',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          })
        });
      }
    });

    await page.route('**/api/projects/proj_123/work-items', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'wi_001',
            title: 'Create campaign strategy',
            description: 'Develop comprehensive campaign strategy',
            status: 'todo',
            priority: 'high',
            assignee: 'test-user-123',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          }
        ])
      });
    });

    // Navigate to Work tab
    const workTab = page.locator('[role="tab"]:has-text("Work")');
    await workTab.click();

    // Click edit button on work item
    const editButton = page.locator('[data-testid="work-item"] button:has-text("Edit")');
    await editButton.click();

    // Update work item
    const titleInput = page.locator('input[name="title"]');
    await titleInput.clear();
    await titleInput.fill('Updated Task');

    const descriptionInput = page.locator('textarea[name="description"]');
    await descriptionInput.clear();
    await descriptionInput.fill('An updated task description');

    // Save changes
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();

    // Should show updated work item
    await expect(page.locator('[data-testid="work-item"]:has-text("Updated Task")')).toBeVisible();
  });

  test('should allow moving work item between columns', async ({ page }) => {
    // Mock work item update
    await page.route('**/api/projects/proj_123/work-items/wi_001', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'wi_001',
            title: 'Create campaign strategy',
            description: 'Develop comprehensive campaign strategy',
            status: 'in_progress',
            priority: 'high',
            assignee: 'test-user-123',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'wi_001',
            title: 'Create campaign strategy',
            description: 'Develop comprehensive campaign strategy',
            status: 'todo',
            priority: 'high',
            assignee: 'test-user-123',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          })
        });
      }
    });

    await page.route('**/api/projects/proj_123/work-items', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'wi_001',
            title: 'Create campaign strategy',
            description: 'Develop comprehensive campaign strategy',
            status: 'todo',
            priority: 'high',
            assignee: 'test-user-123',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          }
        ])
      });
    });

    // Navigate to Work tab
    const workTab = page.locator('[role="tab"]:has-text("Work")');
    await workTab.click();

    // Drag work item from To Do to In Progress
    const workItem = page.locator('[data-testid="work-item"]:has-text("Create campaign strategy")');
    const inProgressColumn = page.locator('[data-testid="kanban-column"]:has-text("In Progress")');

    await workItem.dragTo(inProgressColumn);

    // Should update work item status
    await expect(page.locator('[data-testid="work-item"]:has-text("Create campaign strategy")')).toBeVisible();
  });

  test('should allow assigning work item to user', async ({ page }) => {
    // Mock work item update
    await page.route('**/api/projects/proj_123/work-items/wi_001', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'wi_001',
            title: 'Create campaign strategy',
            description: 'Develop comprehensive campaign strategy',
            status: 'todo',
            priority: 'high',
            assignee: 'user-456',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'wi_001',
            title: 'Create campaign strategy',
            description: 'Develop comprehensive campaign strategy',
            status: 'todo',
            priority: 'high',
            assignee: 'test-user-123',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          })
        });
      }
    });

    // Mock users data
    await page.route('**/api/users', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'test-user-123', name: 'Test User', email: 'test@example.com' },
          { id: 'user-456', name: 'Another User', email: 'another@example.com' }
        ])
      });
    });

    await page.route('**/api/projects/proj_123/work-items', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'wi_001',
            title: 'Create campaign strategy',
            description: 'Develop comprehensive campaign strategy',
            status: 'todo',
            priority: 'high',
            assignee: 'test-user-123',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          }
        ])
      });
    });

    // Navigate to Work tab
    const workTab = page.locator('[role="tab"]:has-text("Work")');
    await workTab.click();

    // Click assign button on work item
    const assignButton = page.locator('[data-testid="work-item"] button:has-text("Assign")');
    await assignButton.click();

    // Select user from dropdown
    const userSelect = page.locator('select[name="assignee"]');
    await userSelect.selectOption('user-456');

    // Save assignment
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();

    // Should show updated assignee
    await expect(page.locator('[data-testid="work-item"]:has-text("Another User")')).toBeVisible();
  });

  test('should allow filtering work items', async ({ page }) => {
    // Mock work items with different priorities
    await page.route('**/api/projects/proj_123/work-items', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'wi_001',
            title: 'High Priority Task',
            description: 'A high priority task',
            status: 'todo',
            priority: 'high',
            assignee: 'test-user-123',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          },
          {
            id: 'wi_002',
            title: 'Low Priority Task',
            description: 'A low priority task',
            status: 'todo',
            priority: 'low',
            assignee: 'test-user-123',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
          }
        ])
      });
    });

    // Navigate to Work tab
    const workTab = page.locator('[role="tab"]:has-text("Work")');
    await workTab.click();

    // Filter by high priority
    const priorityFilter = page.locator('select[name="priority"]');
    await priorityFilter.selectOption('high');

    // Should only show high priority tasks
    await expect(page.locator('[data-testid="work-item"]:has-text("High Priority Task")')).toBeVisible();
    await expect(page.locator('[data-testid="work-item"]:has-text("Low Priority Task")')).not.toBeVisible();
  });
});
