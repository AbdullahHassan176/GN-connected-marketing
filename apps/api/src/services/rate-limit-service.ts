import { z } from 'zod';

// Rate limit configuration schema
export const RateLimitConfigSchema = z.object({
  windowMs: z.number().default(15 * 60 * 1000), // 15 minutes
  maxRequests: z.number().default(100),
  skipSuccessfulRequests: z.boolean().default(false),
  skipFailedRequests: z.boolean().default(false),
  keyGenerator: z.function().optional(),
  onLimitReached: z.function().optional()
});

export type RateLimitConfig = z.infer<typeof RateLimitConfigSchema>;

// Rate limit entry
interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

export class RateLimitService {
  private limits: Map<string, RateLimitEntry> = new Map();
  private configs: Map<string, RateLimitConfig> = new Map();

  constructor() {
    // Initialize default configurations
    this.initializeDefaultConfigs();
    
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private initializeDefaultConfigs() {
    // Auth endpoints - stricter limits
    this.configs.set('auth', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 10, // 10 requests per 15 minutes
      skipSuccessfulRequests: false,
      skipFailedRequests: false
    });

    // Mutating endpoints - moderate limits
    this.configs.set('mutating', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 50, // 50 requests per 15 minutes
      skipSuccessfulRequests: false,
      skipFailedRequests: false
    });

    // Read-only endpoints - more lenient limits
    this.configs.set('readonly', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 200, // 200 requests per 15 minutes
      skipSuccessfulRequests: false,
      skipFailedRequests: false
    });

    // Webhook endpoints - very strict limits
    this.configs.set('webhook', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 5, // 5 requests per minute
      skipSuccessfulRequests: false,
      skipFailedRequests: false
    });
  }

  // Generate rate limit key
  private generateKey(identifier: string, type: string): string {
    return `${type}:${identifier}`;
  }

  // Check if request is allowed
  async checkRateLimit(
    identifier: string,
    type: string,
    requestInfo?: {
      ip?: string;
      userAgent?: string;
      endpoint?: string;
    }
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  }> {
    const config = this.configs.get(type);
    if (!config) {
      return {
        allowed: true,
        remaining: Infinity,
        resetTime: Date.now() + config?.windowMs || 15 * 60 * 1000
      };
    }

    const key = this.generateKey(identifier, type);
    const now = Date.now();
    const entry = this.limits.get(key);

    // Check if entry exists and is not expired
    if (entry && entry.resetTime > now) {
      if (entry.blocked) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: entry.resetTime,
          retryAfter: Math.ceil((entry.resetTime - now) / 1000)
        };
      }

      if (entry.count >= config.maxRequests) {
        // Block the entry
        entry.blocked = true;
        this.limits.set(key, entry);

        // Call onLimitReached if configured
        if (config.onLimitReached) {
          config.onLimitReached(identifier, type, requestInfo);
        }

        return {
          allowed: false,
          remaining: 0,
          resetTime: entry.resetTime,
          retryAfter: Math.ceil((entry.resetTime - now) / 1000)
        };
      }

      // Increment count
      entry.count++;
      this.limits.set(key, entry);

      return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime
      };
    }

    // Create new entry
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
      blocked: false
    };

    this.limits.set(key, newEntry);

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime
    };
  }

  // Record successful request
  async recordSuccess(identifier: string, type: string): Promise<void> {
    const config = this.configs.get(type);
    if (!config || !config.skipSuccessfulRequests) {
      return;
    }

    const key = this.generateKey(identifier, type);
    const entry = this.limits.get(key);
    
    if (entry && entry.count > 0) {
      entry.count--;
      this.limits.set(key, entry);
    }
  }

  // Record failed request
  async recordFailure(identifier: string, type: string): Promise<void> {
    const config = this.configs.get(type);
    if (!config || !config.skipFailedRequests) {
      return;
    }

    const key = this.generateKey(identifier, type);
    const entry = this.limits.get(key);
    
    if (entry && entry.count > 0) {
      entry.count--;
      this.limits.set(key, entry);
    }
  }

  // Get rate limit status
  async getRateLimitStatus(identifier: string, type: string): Promise<{
    count: number;
    remaining: number;
    resetTime: number;
    blocked: boolean;
  } | null> {
    const key = this.generateKey(identifier, type);
    const entry = this.limits.get(key);
    
    if (!entry) {
      return null;
    }

    const config = this.configs.get(type);
    if (!config) {
      return null;
    }

    return {
      count: entry.count,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetTime: entry.resetTime,
      blocked: entry.blocked
    };
  }

  // Reset rate limit for identifier
  async resetRateLimit(identifier: string, type: string): Promise<void> {
    const key = this.generateKey(identifier, type);
    this.limits.delete(key);
  }

  // Update rate limit configuration
  async updateConfig(type: string, config: RateLimitConfig): Promise<void> {
    this.configs.set(type, config);
  }

  // Clean up expired entries
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (entry.resetTime <= now) {
        this.limits.delete(key);
      }
    }
  }

  // Get all active rate limits
  async getActiveLimits(): Promise<Array<{
    key: string;
    type: string;
    identifier: string;
    count: number;
    remaining: number;
    resetTime: number;
    blocked: boolean;
  }>> {
    const now = Date.now();
    const activeLimits: Array<{
      key: string;
      type: string;
      identifier: string;
      count: number;
      remaining: number;
      resetTime: number;
      blocked: boolean;
    }> = [];

    for (const [key, entry] of this.limits.entries()) {
      if (entry.resetTime > now) {
        const [type, identifier] = key.split(':', 2);
        const config = this.configs.get(type);
        
        if (config) {
          activeLimits.push({
            key,
            type,
            identifier,
            count: entry.count,
            remaining: Math.max(0, config.maxRequests - entry.count),
            resetTime: entry.resetTime,
            blocked: entry.blocked
          });
        }
      }
    }

    return activeLimits;
  }
}

// Singleton instance
export const rateLimitService = new RateLimitService();
