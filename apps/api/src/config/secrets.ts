import { z } from 'zod';

// Environment variables schema
export const EnvironmentSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('7071'),
  
  // Database
  COSMOS_DB_ENDPOINT: z.string().url(),
  COSMOS_DB_KEY: z.string().min(1),
  COSMOS_DB_DATABASE_ID: z.string().min(1),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  MICROSOFT_CLIENT_ID: z.string().min(1),
  MICROSOFT_CLIENT_SECRET: z.string().min(1),
  
  // Azure Application Insights
  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().min(1),
  
  // Webhook secrets
  WEBHOOK_SECRET: z.string().min(32),
  
  // Rate limiting
  RATE_LIMIT_REDIS_URL: z.string().url().optional(),
  
  // CORS
  ALLOWED_ORIGINS: z.string().optional(),
  
  // Azure Key Vault (optional)
  AZURE_KEY_VAULT_URL: z.string().url().optional(),
  AZURE_CLIENT_ID: z.string().min(1).optional(),
  AZURE_CLIENT_SECRET: z.string().min(1).optional(),
  AZURE_TENANT_ID: z.string().min(1).optional()
});

export type Environment = z.infer<typeof EnvironmentSchema>;

// Validate environment variables
export function validateEnvironment(): Environment {
  try {
    return EnvironmentSchema.parse(process.env);
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error('Invalid environment configuration');
  }
}

// Secrets configuration
export const SECRETS_CONFIG = {
  // Database secrets
  database: {
    endpoint: process.env.COSMOS_DB_ENDPOINT,
    key: process.env.COSMOS_DB_KEY,
    databaseId: process.env.COSMOS_DB_DATABASE_ID
  },
  
  // Authentication secrets
  auth: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    microsoftClientId: process.env.MICROSOFT_CLIENT_ID,
    microsoftClientSecret: process.env.MICROSOFT_CLIENT_SECRET
  },
  
  // Monitoring secrets
  monitoring: {
    appInsightsConnectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
  },
  
  // Webhook secrets
  webhooks: {
    secret: process.env.WEBHOOK_SECRET
  },
  
  // Azure Key Vault secrets (optional)
  azure: {
    keyVaultUrl: process.env.AZURE_KEY_VAULT_URL,
    clientId: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    tenantId: process.env.AZURE_TENANT_ID
  }
};

// Azure Key Vault integration (optional)
export class KeyVaultService {
  private keyVaultUrl: string;
  private clientId: string;
  private clientSecret: string;
  private tenantId: string;

  constructor() {
    this.keyVaultUrl = process.env.AZURE_KEY_VAULT_URL || '';
    this.clientId = process.env.AZURE_CLIENT_ID || '';
    this.clientSecret = process.env.AZURE_CLIENT_SECRET || '';
    this.tenantId = process.env.AZURE_TENANT_ID || '';
  }

  // Check if Key Vault is configured
  isConfigured(): boolean {
    return !!(this.keyVaultUrl && this.clientId && this.clientSecret && this.tenantId);
  }

  // Get secret from Key Vault
  async getSecret(secretName: string): Promise<string | null> {
    if (!this.isConfigured()) {
      console.warn('Azure Key Vault not configured, using environment variables');
      return process.env[secretName] || null;
    }

    try {
      // In a real implementation, use Azure Key Vault SDK
      // const { DefaultAzureCredential } = require('@azure/identity');
      // const { SecretClient } = require('@azure/keyvault-secrets');
      
      // const credential = new DefaultAzureCredential();
      // const client = new SecretClient(this.keyVaultUrl, credential);
      // const secret = await client.getSecret(secretName);
      // return secret.value;
      
      console.log(`Would fetch secret ${secretName} from Key Vault`);
      return process.env[secretName] || null;
    } catch (error) {
      console.error(`Failed to fetch secret ${secretName} from Key Vault:`, error);
      return null;
    }
  }

  // Set secret in Key Vault
  async setSecret(secretName: string, secretValue: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Azure Key Vault not configured, cannot set secret');
      return false;
    }

    try {
      // In a real implementation, use Azure Key Vault SDK
      console.log(`Would set secret ${secretName} in Key Vault`);
      return true;
    } catch (error) {
      console.error(`Failed to set secret ${secretName} in Key Vault:`, error);
      return false;
    }
  }
}

// Singleton instance
export const keyVaultService = new KeyVaultService();

// Get secret with fallback
export async function getSecret(secretName: string, fallback?: string): Promise<string> {
  const secret = await keyVaultService.getSecret(secretName);
  if (secret) {
    return secret;
  }
  
  if (fallback) {
    return fallback;
  }
  
  throw new Error(`Secret ${secretName} not found`);
}

// Validate all required secrets
export function validateSecrets(): void {
  const requiredSecrets = [
    'COSMOS_DB_ENDPOINT',
    'COSMOS_DB_KEY',
    'COSMOS_DB_DATABASE_ID',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'MICROSOFT_CLIENT_ID',
    'MICROSOFT_CLIENT_SECRET',
    'APPLICATIONINSIGHTS_CONNECTION_STRING',
    'WEBHOOK_SECRET'
  ];

  const missingSecrets = requiredSecrets.filter(secret => !process.env[secret]);
  
  if (missingSecrets.length > 0) {
    throw new Error(`Missing required secrets: ${missingSecrets.join(', ')}`);
  }
}
