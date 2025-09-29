import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Extend NextRequest to include nextauth token
declare module 'next/server' {
  interface NextRequest {
    nextauth: {
      token: any;
    };
  }
}

// Define protected routes and their required roles
const protectedRoutes = {
  '/dashboard': { scope: 'org', role: 'client' },
  '/projects': { scope: 'org', role: 'analyst' },
  '/settings': { scope: 'org', role: 'manager' },
  '/admin': { scope: 'org', role: 'admin' },
  '/analytics': { scope: 'org', role: 'analyst' },
  '/campaigns': { scope: 'org', role: 'analyst' },
  '/tools': { scope: 'org', role: 'analyst' },
  '/rooms': { scope: 'org', role: 'client' },
  '/reports': { scope: 'org', role: 'analyst' },
  '/journey': { scope: 'org', role: 'client' },
} as const;

export default withAuth(
  function middleware(req: NextRequest) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Check if the route requires authentication
    const routeConfig = Object.entries(protectedRoutes).find(([route]) => 
      pathname.startsWith(route)
    );

    if (routeConfig) {
      const [route, requiredRole] = routeConfig;
      
      // Check if user has required role
      if (token?.roles) {
        const hasRequiredRole = token.roles.some((role: any) => {
          if (role.scope !== requiredRole.scope) return false;
          // For now, we'll skip scopeId check since the simplified role structure doesn't include it
          // if (requiredRole.scopeId && role.scopeId !== requiredRole.scopeId) return false;
          
          // Check role hierarchy
          const roleHierarchy: Record<string, number> = {
            owner: 5,
            admin: 4,
            manager: 3,
            analyst: 2,
            client: 1,
          };
          
          return roleHierarchy[role.role] >= roleHierarchy[requiredRole.role];
        });

        if (!hasRequiredRole) {
          return NextResponse.redirect(new URL('/unauthorized', req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Allow access to public routes
        const publicRoutes = ['/login', '/register', '/', '/design', '/unauthorized'];
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};