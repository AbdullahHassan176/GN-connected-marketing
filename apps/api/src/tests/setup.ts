import { vi } from 'vitest';

// Mock Azure Functions
vi.mock('@azure/functions', () => ({
  AzureFunction: vi.fn(),
  Context: vi.fn(),
  HttpRequest: vi.fn(),
}));

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.COSMOS_ENDPOINT = 'https://test-cosmos.documents.azure.com:443/';
process.env.COSMOS_KEY = 'test-key';
process.env.COSMOS_DATABASE = 'test-db';

// Mock console methods
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
};
