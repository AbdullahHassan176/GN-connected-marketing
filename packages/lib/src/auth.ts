import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';
import { AuthUser, User } from './types';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);

export interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  avatarUrl?: string;
  orgId: string;
  roles: Array<{
    scope: 'org' | 'project';
    scopeId: string;
    role: 'owner' | 'admin' | 'manager' | 'analyst' | 'client';
  }>;
  status: 'active' | 'inactive' | 'suspended';
  iat: number;
  exp: number;
}

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify password
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Create JWT token
 */
export async function createToken(user: AuthUser): Promise<string> {
  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    orgId: user.orgId,
    roles: user.roles,
    status: user.status,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract user from JWT payload
 */
export function extractUserFromPayload(payload: JWTPayload): AuthUser {
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    avatarUrl: payload.avatarUrl,
    orgId: payload.orgId,
    roles: payload.roles,
    status: payload.status,
  };
}

/**
 * Generate secure random string
 */
export function generateSecureToken(): string {
  return nanoid(32);
}

/**
 * Generate user ID
 */
export function generateUserId(): string {
  return `user_${nanoid(16)}`;
}

/**
 * Generate organization ID
 */
export function generateOrgId(): string {
  return `org_${nanoid(16)}`;
}

/**
 * Generate project ID
 */
export function generateProjectId(): string {
  return `cmp_${nanoid(16)}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}
