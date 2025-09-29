import { test, expect } from '@playwright/test';

test.describe('Messaging and Collaboration', () => {
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

  test('should display room tab with chat interface', async ({ page }) => {
    // Mock messages data
    await page.route('**/api/projects/proj_123/messages', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'msg_001',
            text: 'Welcome to the project room!',
            author: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com',
              avatar: '/avatars/test-user.jpg'
            },
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            type: 'text'
          },
          {
            id: 'msg_002',
            text: 'Let\'s discuss the campaign strategy',
            author: {
              id: 'user-456',
              name: 'Another User',
              email: 'another@example.com',
              avatar: '/avatars/another-user.jpg'
            },
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            type: 'text'
          }
        ])
      });
    });

    // Mock participants data
    await page.route('**/api/projects/proj_123/participants', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'test-user-123',
            name: 'Test User',
            email: 'test@example.com',
            role: 'admin',
            avatar: '/avatars/test-user.jpg',
            isOnline: true
          },
          {
            id: 'user-456',
            name: 'Another User',
            email: 'another@example.com',
            role: 'manager',
            avatar: '/avatars/another-user.jpg',
            isOnline: false
          }
        ])
      });
    });

    // Navigate to Room tab
    const roomTab = page.locator('[role="tab"]:has-text("Room")');
    await roomTab.click();

    // Check chat interface is visible
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();

    // Check messages are displayed
    await expect(page.locator('[data-testid="message"]:has-text("Welcome to the project room!")')).toBeVisible();
    await expect(page.locator('[data-testid="message"]:has-text("Let\'s discuss the campaign strategy")')).toBeVisible();

    // Check participants list
    await expect(page.locator('[data-testid="participants-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="participant"]:has-text("Test User")')).toBeVisible();
    await expect(page.locator('[data-testid="participant"]:has-text("Another User")')).toBeVisible();
  });

  test('should allow sending a new message', async ({ page }) => {
    // Mock message creation
    await page.route('**/api/projects/proj_123/messages', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'msg_003',
            text: 'This is a new message',
            author: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com',
              avatar: '/avatars/test-user.jpg'
            },
            createdAt: new Date().toISOString(),
            type: 'text'
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

    // Navigate to Room tab
    const roomTab = page.locator('[role="tab"]:has-text("Room")');
    await roomTab.click();

    // Type new message
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill('This is a new message');

    // Send message
    const sendButton = page.locator('button[data-testid="send-message"]');
    await sendButton.click();

    // Should show new message
    await expect(page.locator('[data-testid="message"]:has-text("This is a new message")')).toBeVisible();
  });

  test('should allow mentioning users in messages', async ({ page }) => {
    // Mock message creation with mention
    await page.route('**/api/projects/proj_123/messages', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'msg_004',
            text: 'Hey @Another User, can you review this?',
            author: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com',
              avatar: '/avatars/test-user.jpg'
            },
            createdAt: new Date().toISOString(),
            type: 'text',
            mentions: ['user-456']
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

    // Navigate to Room tab
    const roomTab = page.locator('[role="tab"]:has-text("Room")');
    await roomTab.click();

    // Type message with mention
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill('Hey @Another User, can you review this?');

    // Send message
    const sendButton = page.locator('button[data-testid="send-message"]');
    await sendButton.click();

    // Should show message with mention
    await expect(page.locator('[data-testid="message"]:has-text("Hey @Another User, can you review this?")')).toBeVisible();
    
    // Check mention is highlighted
    await expect(page.locator('[data-testid="mention"]:has-text("@Another User")')).toBeVisible();
  });

  test('should allow uploading files to chat', async ({ page }) => {
    // Mock file upload
    await page.route('**/api/projects/proj_123/messages', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'msg_005',
            text: '',
            author: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com',
              avatar: '/avatars/test-user.jpg'
            },
            createdAt: new Date().toISOString(),
            type: 'file',
            attachments: [
              {
                id: 'att_001',
                name: 'document.pdf',
                size: 1024000,
                type: 'application/pdf',
                url: '/uploads/document.pdf'
              }
            ]
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

    // Navigate to Room tab
    const roomTab = page.locator('[role="tab"]:has-text("Room")');
    await roomTab.click();

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'document.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('PDF content')
    });

    // Should show file attachment
    await expect(page.locator('[data-testid="file-attachment"]:has-text("document.pdf")')).toBeVisible();
  });

  test('should display recent files section', async ({ page }) => {
    // Mock recent files data
    await page.route('**/api/projects/proj_123/files', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'file_001',
            name: 'campaign_brief.pdf',
            size: 2048000,
            type: 'application/pdf',
            url: '/uploads/campaign_brief.pdf',
            uploadedBy: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com'
            },
            uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'file_002',
            name: 'creative_assets.zip',
            size: 5120000,
            type: 'application/zip',
            url: '/uploads/creative_assets.zip',
            uploadedBy: {
              id: 'user-456',
              name: 'Another User',
              email: 'another@example.com'
            },
            uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ])
      });
    });

    // Navigate to Room tab
    const roomTab = page.locator('[role="tab"]:has-text("Room")');
    await roomTab.click();

    // Check recent files section
    await expect(page.locator('[data-testid="recent-files"]')).toBeVisible();
    await expect(page.locator('[data-testid="file-item"]:has-text("campaign_brief.pdf")')).toBeVisible();
    await expect(page.locator('[data-testid="file-item"]:has-text("creative_assets.zip")')).toBeVisible();
  });

  test('should allow searching messages', async ({ page }) => {
    // Mock search results
    await page.route('**/api/projects/proj_123/messages/search**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'msg_001',
            text: 'Let\'s discuss the campaign strategy',
            author: {
              id: 'user-456',
              name: 'Another User',
              email: 'another@example.com',
              avatar: '/avatars/another-user.jpg'
            },
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            type: 'text'
          }
        ])
      });
    });

    await page.route('**/api/projects/proj_123/messages', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'msg_001',
            text: 'Let\'s discuss the campaign strategy',
            author: {
              id: 'user-456',
              name: 'Another User',
              email: 'another@example.com',
              avatar: '/avatars/another-user.jpg'
            },
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            type: 'text'
          }
        ])
      });
    });

    // Navigate to Room tab
    const roomTab = page.locator('[role="tab"]:has-text("Room")');
    await roomTab.click();

    // Search for messages
    const searchInput = page.locator('[data-testid="message-search"]');
    await searchInput.fill('campaign strategy');

    // Should show search results
    await expect(page.locator('[data-testid="search-result"]:has-text("campaign strategy")')).toBeVisible();
  });

  test('should display message timestamps', async ({ page }) => {
    // Mock messages with timestamps
    await page.route('**/api/projects/proj_123/messages', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'msg_001',
            text: 'Message from 2 hours ago',
            author: {
              id: 'test-user-123',
              name: 'Test User',
              email: 'test@example.com',
              avatar: '/avatars/test-user.jpg'
            },
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            type: 'text'
          }
        ])
      });
    });

    // Navigate to Room tab
    const roomTab = page.locator('[role="tab"]:has-text("Room")');
    await roomTab.click();

    // Check message timestamp is displayed
    const message = page.locator('[data-testid="message"]:has-text("Message from 2 hours ago")');
    await expect(message).toBeVisible();
    
    // Check timestamp is visible
    await expect(page.locator('[data-testid="message-timestamp"]')).toBeVisible();
  });

  test('should handle message errors gracefully', async ({ page }) => {
    // Mock message creation error
    await page.route('**/api/projects/proj_123/messages', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Failed to send message' })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    // Navigate to Room tab
    const roomTab = page.locator('[role="tab"]:has-text("Room")');
    await roomTab.click();

    // Try to send message
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill('This message will fail');

    const sendButton = page.locator('button[data-testid="send-message"]');
    await sendButton.click();

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]:has-text("Failed to send message")')).toBeVisible();
  });
});
