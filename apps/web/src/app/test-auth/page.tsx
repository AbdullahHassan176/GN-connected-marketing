'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@repo/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';

export default function TestAuthPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
            <CardDescription>
              Test the authentication system with different user roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Demo Users:</h4>
              <div className="space-y-1 text-sm text-neutral-600">
                <p><strong>Owner:</strong> admin@globalnextconsulting.com / admin123</p>
                <p><strong>Manager:</strong> manager@globalnextconsulting.com / manager123</p>
                <p><strong>Analyst:</strong> analyst@globalnextconsulting.com / analyst123</p>
                <p><strong>Client:</strong> ahmed@premiumhotels.com / client123</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="gradient" 
                className="w-full"
                onClick={() => signIn('credentials', {
                  email: 'admin@globalnextconsulting.com',
                  password: 'admin123',
                  callbackUrl: '/dashboard'
                })}
              >
                Sign in as Owner
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => signIn('credentials', {
                  email: 'manager@globalnextconsulting.com',
                  password: 'manager123',
                  callbackUrl: '/dashboard'
                })}
              >
                Sign in as Manager
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => signIn('credentials', {
                  email: 'analyst@globalnextconsulting.com',
                  password: 'analyst123',
                  callbackUrl: '/dashboard'
                })}
              >
                Sign in as Analyst
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => signIn('credentials', {
                  email: 'ahmed@premiumhotels.com',
                  password: 'client123',
                  callbackUrl: '/dashboard'
                })}
              >
                Sign in as Client
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = session.user as any;
  const userRoles = user?.roles?.map((role: any) => role.role) || [];

  return (
    <div className="min-h-screen bg-surface-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test Results</CardTitle>
            <CardDescription>
              Current session information and role-based access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">User Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Organization:</strong> {user.orgId}</p>
                  <p><strong>Status:</strong> {user.status}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Roles & Permissions</h4>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {userRoles.map((role: string) => (
                      <span key={role} className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs">
                        {role}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-neutral-600">
                    <p><strong>Highest Role:</strong> {
                      userRoles.includes('owner') ? 'Owner' : 
                      userRoles.includes('admin') ? 'Admin' : 
                      userRoles.includes('manager') ? 'Manager' : 
                      userRoles.includes('analyst') ? 'Analyst' : 'Client'
                    }</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role-based Navigation Test */}
            <div>
              <h4 className="font-medium mb-4">Available Navigation (Role-based)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className={`p-2 rounded text-sm ${userRoles.includes('client') ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-500'}`}>
                  Dashboard
                </div>
                <div className={`p-2 rounded text-sm ${userRoles.includes('analyst') ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-500'}`}>
                  Projects
                </div>
                <div className={`p-2 rounded text-sm ${userRoles.includes('analyst') ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-500'}`}>
                  Analytics
                </div>
                <div className={`p-2 rounded text-sm ${userRoles.includes('analyst') ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-500'}`}>
                  AI Tools
                </div>
                <div className={`p-2 rounded text-sm ${userRoles.includes('client') ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-500'}`}>
                  Campaign Rooms
                </div>
                <div className={`p-2 rounded text-sm ${userRoles.includes('analyst') ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-500'}`}>
                  Reports
                </div>
                <div className={`p-2 rounded text-sm ${userRoles.includes('client') ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-500'}`}>
                  Brand Journey
                </div>
                <div className={`p-2 rounded text-sm ${userRoles.includes('manager') ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-500'}`}>
                  Settings
                </div>
              </div>
            </div>

            {/* JWT Token Info */}
            <div>
              <h4 className="font-medium mb-2">JWT Token Information</h4>
              <div className="bg-neutral-100 p-4 rounded text-sm">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify({
                    userId: user.id,
                    orgId: user.orgId,
                    roles: user.roles,
                    status: user.status,
                    sessionExpires: session.expires
                  }, null, 2)}
                </pre>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <Button 
                variant="gradient"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/projects'}
              >
                Test Projects Access
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/settings'}
              >
                Test Settings Access
              </Button>
              <Button 
                variant="outline"
                onClick={() => signOut({ callbackUrl: '/test-auth' })}
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
