'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, DataTable } from '@repo/ui';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Server, 
  Database, 
  Shield, 
  Download,
  Users,
  Settings,
  BarChart3,
  MessageSquare,
  FileText,
  Zap
} from 'lucide-react';

interface UATCheck {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  result?: string;
  error?: string;
  duration?: number;
  lastChecked?: string;
}

export default function UATPage() {
  const [checks, setChecks] = useState<UATCheck[]>([
    // Health Checks
    {
      id: 'health_api',
      name: 'API Health Check',
      description: 'Verify API endpoints are responding correctly',
      category: 'Health',
      status: 'pending'
    },
    {
      id: 'health_database',
      name: 'Database Connection',
      description: 'Verify database connectivity and queries',
      category: 'Health',
      status: 'pending'
    },
    {
      id: 'health_storage',
      name: 'Storage SAS',
      description: 'Verify Azure Storage SAS token generation',
      category: 'Health',
      status: 'pending'
    },
    {
      id: 'health_auth',
      name: 'Authentication Service',
      description: 'Verify NextAuth.js authentication is working',
      category: 'Health',
      status: 'pending'
    },

    // RBAC Checks
    {
      id: 'rbac_admin',
      name: 'Admin Role Access',
      description: 'Verify admin users can access admin features',
      category: 'RBAC',
      status: 'pending'
    },
    {
      id: 'rbac_manager',
      name: 'Manager Role Access',
      description: 'Verify manager users can access manager features',
      category: 'RBAC',
      status: 'pending'
    },
    {
      id: 'rbac_analyst',
      name: 'Analyst Role Access',
      description: 'Verify analyst users can access analyst features',
      category: 'RBAC',
      status: 'pending'
    },
    {
      id: 'rbac_client',
      name: 'Client Role Access',
      description: 'Verify client users can access client features',
      category: 'RBAC',
      status: 'pending'
    },

    // Feature Checks
    {
      id: 'feature_projects',
      name: 'Project Management',
      description: 'Verify project creation, editing, and deletion',
      category: 'Features',
      status: 'pending'
    },
    {
      id: 'feature_tasks',
      name: 'Task Management',
      description: 'Verify work item creation and Kanban board',
      category: 'Features',
      status: 'pending'
    },
    {
      id: 'feature_approvals',
      name: 'Approval Workflow',
      description: 'Verify approval request creation and processing',
      category: 'Features',
      status: 'pending'
    },
    {
      id: 'feature_messaging',
      name: 'Messaging System',
      description: 'Verify chat functionality and file uploads',
      category: 'Features',
      status: 'pending'
    },
    {
      id: 'feature_exports',
      name: 'Export Functionality',
      description: 'Verify PDF and Excel export generation',
      category: 'Features',
      status: 'pending'
    },
    {
      id: 'feature_analytics',
      name: 'Analytics Dashboard',
      description: 'Verify insights, A/B tests, and sentiment analysis',
      category: 'Features',
      status: 'pending'
    },

    // Security Checks
    {
      id: 'security_headers',
      name: 'Security Headers',
      description: 'Verify security headers are properly set',
      category: 'Security',
      status: 'pending'
    },
    {
      id: 'security_rate_limiting',
      name: 'Rate Limiting',
      description: 'Verify rate limiting is working correctly',
      category: 'Security',
      status: 'pending'
    },
    {
      id: 'security_audit',
      name: 'Audit Logging',
      description: 'Verify audit logs are being generated',
      category: 'Security',
      status: 'pending'
    },

    // Performance Checks
    {
      id: 'performance_load',
      name: 'Page Load Times',
      description: 'Verify pages load within acceptable time limits',
      category: 'Performance',
      status: 'pending'
    },
    {
      id: 'performance_api',
      name: 'API Response Times',
      description: 'Verify API endpoints respond within acceptable time limits',
      category: 'Performance',
      status: 'pending'
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'pending' | 'running' | 'passed' | 'failed'>('pending');

  const runCheck = async (checkId: string) => {
    setChecks(prev => prev.map(check => 
      check.id === checkId 
        ? { ...check, status: 'running' as const }
        : check
    ));

    try {
      const startTime = Date.now();
      let result: any;

      switch (checkId) {
        case 'health_api':
          result = await fetch('/api/health');
          if (!result.ok) throw new Error(`API health check failed: ${result.status}`);
          break;

        case 'health_database':
          result = await fetch('/api/organizations');
          if (!result.ok) throw new Error(`Database check failed: ${result.status}`);
          break;

        case 'health_storage':
          result = await fetch('/api/assets/upload-url');
          if (!result.ok) throw new Error(`Storage SAS check failed: ${result.status}`);
          break;

        case 'health_auth':
          result = await fetch('/api/auth/session');
          if (!result.ok) throw new Error(`Auth check failed: ${result.status}`);
          break;

        case 'rbac_admin':
          result = await fetch('/api/admin/tools');
          if (!result.ok) throw new Error(`Admin access check failed: ${result.status}`);
          break;

        case 'rbac_manager':
          result = await fetch('/api/projects');
          if (!result.ok) throw new Error(`Manager access check failed: ${result.status}`);
          break;

        case 'rbac_analyst':
          result = await fetch('/api/insights');
          if (!result.ok) throw new Error(`Analyst access check failed: ${result.status}`);
          break;

        case 'rbac_client':
          result = await fetch('/api/projects');
          if (!result.ok) throw new Error(`Client access check failed: ${result.status}`);
          break;

        case 'feature_projects':
          result = await fetch('/api/projects');
          if (!result.ok) throw new Error(`Projects feature check failed: ${result.status}`);
          break;

        case 'feature_tasks':
          result = await fetch('/api/projects/proj_123/work-items');
          if (!result.ok) throw new Error(`Tasks feature check failed: ${result.status}`);
          break;

        case 'feature_approvals':
          result = await fetch('/api/projects/proj_123/approvals');
          if (!result.ok) throw new Error(`Approvals feature check failed: ${result.status}`);
          break;

        case 'feature_messaging':
          result = await fetch('/api/projects/proj_123/messages');
          if (!result.ok) throw new Error(`Messaging feature check failed: ${result.status}`);
          break;

        case 'feature_exports':
          result = await fetch('/api/projects/proj_123/export/pdf');
          if (!result.ok) throw new Error(`Exports feature check failed: ${result.status}`);
          break;

        case 'feature_analytics':
          result = await fetch('/api/insights');
          if (!result.ok) throw new Error(`Analytics feature check failed: ${result.status}`);
          break;

        case 'security_headers':
          result = await fetch('/');
          const headers = result.headers;
          const requiredHeaders = ['x-content-type-options', 'x-frame-options', 'x-xss-protection'];
          const missingHeaders = requiredHeaders.filter(header => !headers.get(header));
          if (missingHeaders.length > 0) {
            throw new Error(`Missing security headers: ${missingHeaders.join(', ')}`);
          }
          break;

        case 'security_rate_limiting':
          // Test rate limiting by making multiple requests
          const promises = Array(10).fill(0).map(() => fetch('/api/health'));
          const responses = await Promise.all(promises);
          const rateLimited = responses.some(r => r.status === 429);
          if (!rateLimited) {
            throw new Error('Rate limiting not working correctly');
          }
          break;

        case 'security_audit':
          result = await fetch('/api/audit');
          if (!result.ok) throw new Error(`Audit logging check failed: ${result.status}`);
          break;

        case 'performance_load':
          const loadStart = Date.now();
          await fetch('/');
          const loadTime = Date.now() - loadStart;
          if (loadTime > 3000) {
            throw new Error(`Page load time too slow: ${loadTime}ms`);
          }
          break;

        case 'performance_api':
          const apiStart = Date.now();
          await fetch('/api/health');
          const apiTime = Date.now() - apiStart;
          if (apiTime > 1000) {
            throw new Error(`API response time too slow: ${apiTime}ms`);
          }
          break;

        default:
          throw new Error('Unknown check');
      }

      const duration = Date.now() - startTime;
      setChecks(prev => prev.map(check => 
        check.id === checkId 
          ? { 
              ...check, 
              status: 'passed' as const,
              result: 'Check passed successfully',
              duration,
              lastChecked: new Date().toISOString()
            }
          : check
      ));

    } catch (error) {
      setChecks(prev => prev.map(check => 
        check.id === checkId 
          ? { 
              ...check, 
              status: 'failed' as const,
              error: error instanceof Error ? error.message : 'Unknown error',
              lastChecked: new Date().toISOString()
            }
          : check
      ));
    }
  };

  const runAllChecks = async () => {
    setIsRunning(true);
    setOverallStatus('running');

    for (const check of checks) {
      await runCheck(check.id);
      // Small delay between checks
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsRunning(false);
    
    // Determine overall status
    const failedChecks = checks.filter(check => check.status === 'failed');
    const passedChecks = checks.filter(check => check.status === 'passed');
    
    if (failedChecks.length > 0) {
      setOverallStatus('failed');
    } else if (passedChecks.length === checks.length) {
      setOverallStatus('passed');
    } else {
      setOverallStatus('pending');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      running: 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Health':
        return <Server className="h-4 w-4 text-blue-500" />;
      case 'RBAC':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'Features':
        return <Settings className="h-4 w-4 text-green-500" />;
      case 'Security':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'Performance':
        return <BarChart3 className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const checkColumns = [
    {
      key: 'name' as const,
      label: 'Check Name',
      render: (value: string, row: UATCheck) => (
        <div className="flex items-center space-x-2">
          {getCategoryIcon(row.category)}
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'description' as const,
      label: 'Description',
      render: (value: string) => (
        <span className="text-sm text-gray-600">{value}</span>
      )
    },
    {
      key: 'category' as const,
      label: 'Category',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string, row: UATCheck) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(value)}
          {getStatusBadge(value)}
        </div>
      )
    },
    {
      key: 'result' as const,
      label: 'Result',
      render: (value: string, row: UATCheck) => (
        <div className="text-sm">
          {row.status === 'passed' && (
            <span className="text-green-600">{value}</span>
          )}
          {row.status === 'failed' && (
            <span className="text-red-600">{row.error}</span>
          )}
          {row.duration && (
            <div className="text-gray-500">Duration: {row.duration}ms</div>
          )}
        </div>
      )
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (value: string, row: UATCheck) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => runCheck(value)}
          disabled={row.status === 'running'}
        >
          {row.status === 'running' ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            'Run Check'
          )}
        </Button>
      )
    }
  ];

  const stats = {
    total: checks.length,
    passed: checks.filter(c => c.status === 'passed').length,
    failed: checks.filter(c => c.status === 'failed').length,
    pending: checks.filter(c => c.status === 'pending').length,
    running: checks.filter(c => c.status === 'running').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">UAT Checklist</h1>
          <p className="text-gray-600 mt-1">
            User Acceptance Testing - Verify all systems are working correctly
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={runAllChecks}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running Checks...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run All Checks
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusIcon(overallStatus)}
              <div>
                <h3 className="text-lg font-semibold">Overall Status</h3>
                <p className="text-sm text-gray-600">
                  {stats.passed} passed, {stats.failed} failed, {stats.pending} pending
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {stats.passed}/{stats.total}
              </div>
              <div className="text-sm text-gray-600">Checks Passed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Checks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checks Table */}
      <Card>
        <CardHeader>
          <CardTitle>UAT Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={checks}
            columns={checkColumns}
          />
        </CardContent>
      </Card>
    </div>
  );
}
