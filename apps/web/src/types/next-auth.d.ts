import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      orgId: string;
      roles: Array<{
        scope: 'org' | 'project';
        scopeId: string;
        role: 'owner' | 'admin' | 'manager' | 'analyst' | 'client';
      }>;
      status: 'active' | 'inactive' | 'suspended';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    orgId: string;
    roles: Array<{
      scope: 'org' | 'project';
      scopeId: string;
      role: 'owner' | 'admin' | 'manager' | 'analyst' | 'client';
    }>;
    status: 'active' | 'inactive' | 'suspended';
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    orgId: string;
    roles: Array<{
      scope: 'org' | 'project';
      scopeId: string;
      role: 'owner' | 'admin' | 'manager' | 'analyst' | 'client';
    }>;
    status: 'active' | 'inactive' | 'suspended';
  }
}
