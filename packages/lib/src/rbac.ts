import { AuthUser, RBACRequirement, RBACRole, RBACScope } from './types';

/**
 * Check if user has required role
 */
export function hasRole(
  user: AuthUser | null,
  requirement: RBACRequirement
): boolean {
  if (!user) return false;

  return user.roles.some((role) => {
    // Check scope match
    if (role.scope !== requirement.scope) return false;
    
    // Check scopeId match if specified
    if (requirement.scopeId && role.scopeId !== requirement.scopeId) return false;
    
    // Check role hierarchy
    return hasRolePermission(role.role, requirement.role);
  });
}

/**
 * Check role hierarchy permissions
 */
function hasRolePermission(userRole: RBACRole, requiredRole: RBACRole): boolean {
  const roleHierarchy: Record<RBACRole, number> = {
    owner: 5,
    admin: 4,
    manager: 3,
    analyst: 2,
    client: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Check if user can access organization
 */
export function canAccessOrg(user: AuthUser | null, orgId: string): boolean {
  if (!user) return false;
  
  return user.orgId === orgId && user.status === 'active';
}

/**
 * Check if user can access project
 */
export function canAccessProject(
  user: AuthUser | null,
  projectId: string,
  orgId: string
): boolean {
  if (!canAccessOrg(user, orgId)) return false;
  
  return hasRole(user, {
    scope: 'project',
    scopeId: projectId,
    role: 'client',
  }) || hasRole(user, {
    scope: 'org',
    role: 'analyst',
  });
}

/**
 * Check if user can manage project
 */
export function canManageProject(
  user: AuthUser | null,
  projectId: string,
  orgId: string
): boolean {
  if (!canAccessOrg(user, orgId)) return false;
  
  return hasRole(user, {
    scope: 'project',
    scopeId: projectId,
    role: 'manager',
  }) || hasRole(user, {
    scope: 'org',
    role: 'admin',
  });
}

/**
 * Check if user is admin or owner
 */
export function isAdmin(user: AuthUser | null): boolean {
  if (!user) return false;
  
  return user.roles.some(role => 
    role.role === 'admin' || role.role === 'owner'
  );
}

/**
 * Check if user is owner
 */
export function isOwner(user: AuthUser | null): boolean {
  if (!user) return false;
  
  return user.roles.some(role => role.role === 'owner');
}

/**
 * Get user's highest role in organization
 */
export function getHighestOrgRole(user: AuthUser | null): RBACRole | null {
  if (!user) return null;
  
  const orgRoles = user.roles
    .filter(role => role.scope === 'org')
    .map(role => role.role);
    
  if (orgRoles.includes('owner')) return 'owner';
  if (orgRoles.includes('admin')) return 'admin';
  if (orgRoles.includes('manager')) return 'manager';
  if (orgRoles.includes('analyst')) return 'analyst';
  
  return null;
}

/**
 * Get user's role in specific project
 */
export function getProjectRole(
  user: AuthUser | null,
  projectId: string
): RBACRole | null {
  if (!user) return null;
  
  const projectRole = user.roles.find(
    role => role.scope === 'project' && role.scopeId === projectId
  );
  
  return projectRole?.role || null;
}

/**
 * Check if user can perform action on resource
 */
export function canPerformAction(
  user: AuthUser | null,
  action: string,
  resource: string,
  resourceId?: string,
  orgId?: string
): boolean {
  if (!user) return false;
  
  // Owner can do everything
  if (isOwner(user)) return true;
  
  // Admin can do most things
  if (isAdmin(user)) {
    // Except delete organization
    if (action === 'delete' && resource === 'organization') return false;
    return true;
  }
  
  // Project-specific permissions
  if (resource === 'project' && orgId) {
    if (action === 'read') return canAccessProject(user, resourceId!, orgId);
    if (action === 'update' || action === 'delete') return canManageProject(user, resourceId!, orgId);
  }
  
  // Work item permissions
  if (resource === 'work_item' && orgId) {
    if (action === 'read') return canAccessProject(user, resourceId!, orgId);
    if (action === 'create' || action === 'update') return canManageProject(user, resourceId!, orgId);
  }
  
  // Default: require manager role for write operations
  const highestRole = getHighestOrgRole(user);
  if (action === 'read') return highestRole !== null;
  if (action === 'create' || action === 'update' || action === 'delete') {
    return highestRole === 'manager' || highestRole === 'admin' || highestRole === 'owner';
  }
  
  return false;
}
