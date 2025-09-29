'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, DataTable } from '@repo/ui';
import { 
  Shield, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  Download,
  Search,
  Eye
} from 'lucide-react';

// Mock audit data
const mockAuditEvents = [
  {
    id: 'audit_1',
    timestamp: '2024-01-20T14:45:00Z',
    actor: {
      id: 'user_123',
      type: 'user',
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@company.com',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    action: 'POST /api/projects',
    resource: 'project',
    resourceId: 'proj_456',
    organizationId: 'org_123',
    projectId: 'proj_456',
    result: 'success',
    payloadHash: 'a1b2c3d4e5f6...',
    metadata: {
      duration: 150,
      responseSize: 1024
    }
  },
  {
    id: 'audit_2',
    timestamp: '2024-01-20T14:30:00Z',
    actor: {
      id: 'user_456',
      type: 'user',
      name: 'Marcus Chen',
      email: 'marcus.chen@company.com',
      ip: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    action: 'PUT /api/work-items/wi_001',
    resource: 'work_item',
    resourceId: 'wi_001',
    organizationId: 'org_123',
    projectId: 'proj_456',
    result: 'success',
    payloadHash: 'b2c3d4e5f6a1...',
    metadata: {
      duration: 89,
      responseSize: 512
    }
  },
  {
    id: 'audit_3',
    timestamp: '2024-01-20T14:15:00Z',
    actor: {
      id: 'system',
      type: 'system',
      name: 'System',
      ip: '10.0.0.1',
      userAgent: 'GlobalNext-System/1.0'
    },
    action: 'POST /api/webhooks/evt_001',
    resource: 'webhook',
    resourceId: 'evt_001',
    organizationId: 'org_123',
    result: 'failure',
    errorMessage: 'HTTP 500: Internal Server Error',
    payloadHash: 'c3d4e5f6a1b2...',
    metadata: {
      duration: 5000,
      retryCount: 2
    }
  },
  {
    id: 'audit_4',
    timestamp: '2024-01-20T14:00:00Z',
    actor: {
      id: 'user_789',
      type: 'user',
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@company.com',
      ip: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    },
    action: 'DELETE /api/approvals/app_001',
    resource: 'approval',
    resourceId: 'app_001',
    organizationId: 'org_123',
    projectId: 'proj_456',
    result: 'success',
    payloadHash: 'd4e5f6a1b2c3...',
    metadata: {
      duration: 200,
      responseSize: 256
    }
  },
  {
    id: 'audit_5',
    timestamp: '2024-01-20T13:45:00Z',
    actor: {
      id: 'anonymous',
      type: 'api',
      ip: '203.0.113.1',
      userAgent: 'curl/7.68.0'
    },
    action: 'GET /api/health',
    resource: 'health_check',
    organizationId: 'org_123',
    result: 'success',
    payloadHash: 'e5f6a1b2c3d4...',
    metadata: {
      duration: 15,
      responseSize: 128
    }
  }
];

// Mock audit statistics
const mockAuditStats = {
  totalEvents: 1250,
  successEvents: 1100,
  failureEvents: 120,
  errorEvents: 30,
  topActions: [
    { action: 'GET /api/projects', count: 450 },
    { action: 'POST /api/work-items', count: 200 },
    { action: 'PUT /api/work-items', count: 150 },
    { action: 'POST /api/approvals', count: 100 },
    { action: 'GET /api/insights', count: 80 }
  ],
  topActors: [
    { actorId: 'user_123', actorName: 'Sarah Mitchell', count: 300 },
    { actorId: 'user_456', actorName: 'Marcus Chen', count: 250 },
    { actorId: 'user_789', actorName: 'Emma Rodriguez', count: 200 },
    { actorId: 'system', actorName: 'System', count: 150 },
    { actorId: 'user_101', actorName: 'David Kim', count: 100 }
  ],
  topResources: [
    { resource: 'project', count: 400 },
    { resource: 'work_item', count: 350 },
    { resource: 'approval', count: 200 },
    { resource: 'insight', count: 150 },
    { resource: 'webhook', count: 100 }
  ]
};

export default function AuditPage() {
  const t = useTranslations('AdminAudit');
  const [events, setEvents] = useState(mockAuditEvents);
  const [stats, setStats] = useState(mockAuditStats);
  const [filters, setFilters] = useState({
    actorId: '',
    action: '',
    resource: '',
    result: '',
    startDate: '',
    endDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting audit logs...');
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failure':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getResultBadge = (result: string) => {
    const variants = {
      success: 'bg-green-100 text-green-800',
      failure: 'bg-red-100 text-red-800',
      error: 'bg-orange-100 text-orange-800'
    };
    
    return (
      <Badge className={variants[result as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {result}
      </Badge>
    );
  };

  const getActorTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'system':
        return <Shield className="h-4 w-4 text-purple-500" />;
      case 'api':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const eventColumns = [
    {
      key: 'timestamp' as const,
      label: 'Timestamp',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date(value).toLocaleString()}
          </span>
        </div>
      )
    },
    {
      key: 'actor' as const,
      label: 'Actor',
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-2">
          {getActorTypeIcon(value.type)}
          <div>
            <div className="font-medium text-sm">{value.name || value.id}</div>
            <div className="text-xs text-gray-500">{value.email || value.ip}</div>
          </div>
        </div>
      )
    },
    {
      key: 'action' as const,
      label: 'Action',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="font-mono text-sm">{value}</div>
      )
    },
    {
      key: 'resource' as const,
      label: 'Resource',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{value}</span>
          {row.resourceId && (
            <span className="text-xs text-gray-500">({row.resourceId})</span>
          )}
        </div>
      )
    },
    {
      key: 'result' as const,
      label: 'Result',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-2">
          {getResultIcon(value)}
          {getResultBadge(value)}
        </div>
      )
    },
    {
      key: 'metadata' as const,
      label: 'Details',
      render: (value: any, row: any) => (
        <div className="text-sm text-gray-600">
          {value.duration && (
            <div>Duration: {value.duration}ms</div>
          )}
          {row.errorMessage && (
            <div className="text-red-600 truncate max-w-32" title={row.errorMessage}>
              {row.errorMessage}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (value: string, row: any) => (
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-1">
            Monitor system activity and security events
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{stats.successEvents}</p>
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
                <p className="text-2xl font-bold text-red-600">{stats.failureEvents}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-orange-600">{stats.errorEvents}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actor
              </label>
              <input
                type="text"
                value={filters.actorId}
                onChange={(e) => handleFilterChange('actorId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Filter by actor ID or name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action
              </label>
              <input
                type="text"
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Filter by action"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource
              </label>
              <input
                type="text"
                value={filters.resource}
                onChange={(e) => handleFilterChange('resource', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Filter by resource"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Events</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={events}
            columns={eventColumns}
          />
        </CardContent>
      </Card>
    </div>
  );
}
