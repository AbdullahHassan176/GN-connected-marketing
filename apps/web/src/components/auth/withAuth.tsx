'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
// Define types locally for now
interface AuthUser {
  id: string;
  email: string;
  name: string;
  orgId: string;
  roles: Array<{
    scope: 'org' | 'project';
    scopeId: string;
    role: 'owner' | 'admin' | 'manager' | 'analyst' | 'client';
  }>;
  status: 'active' | 'inactive' | 'suspended';
}

interface RBACRequirement {
  scope: 'org' | 'project';
  scopeId?: string;
  role: 'owner' | 'admin' | 'manager' | 'analyst' | 'client';
}

// Simple role hierarchy check
function hasRole(user: AuthUser | null, requirement: RBACRequirement): boolean {
  if (!user) return false;

  return user.roles.some((role) => {
    if (role.scope !== requirement.scope) return false;
    if (requirement.scopeId && role.scopeId !== requirement.scopeId) return false;
    
    const roleHierarchy: Record<string, number> = {
      owner: 5,
      admin: 4,
      manager: 3,
      analyst: 2,
      client: 1,
    };
    
    return roleHierarchy[role.role] >= roleHierarchy[requirement.role];
  });
}

interface WithAuthProps {
  children: ReactNode;
  requiredRole?: RBACRequirement;
  redirectTo?: string;
  fallback?: ReactNode;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    requiredRole?: RBACRequirement;
    redirectTo?: string;
    fallback?: ReactNode;
  } = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;

      if (!session) {
        router.push(options.redirectTo || '/login');
        return;
      }

      if (options.requiredRole) {
        const user = session.user as AuthUser;
        if (!hasRole(user, options.requiredRole)) {
          router.push(options.redirectTo || '/unauthorized');
          return;
        }
      }
    }, [session, status, router]);

    if (status === 'loading') {
      return options.fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (!session) {
      return null;
    }

    if (options.requiredRole) {
      const user = session.user as AuthUser;
      if (!hasRole(user, options.requiredRole)) {
        return null;
      }
    }

    return <Component {...props} />;
  };
}

// Hook for client-side auth checks
export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user as AuthUser | undefined;

  const checkRole = (requirement: RBACRequirement): boolean => {
    if (!user) return false;
    return hasRole(user, requirement);
  };

  const requireRole = (requirement: RBACRequirement, redirectTo?: string) => {
    if (!user || !checkRole(requirement)) {
      router.push(redirectTo || '/unauthorized');
      return false;
    }
    return true;
  };

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
    checkRole,
    requireRole,
  };
}
