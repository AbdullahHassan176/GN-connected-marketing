'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, DataTable } from '@repo/ui';
import { 
  Plus, 
  Settings, 
  Trash2, 
  TestTube, 
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity
} from 'lucide-react';
import { WebhookDialog } from '@/components/webhooks/webhook-dialog';

// Mock data for webhook endpoints
const mockWebhookEndpoints = [
  {
    id: 'webhook_1',
    organizationId: 'org_123',
    url: 'https://hooks.zapier.com/hooks/catch/123456/abcdef/',
    secret: 'whsec_1234567890abcdef',
    events: ['work_item.created', 'approval.requested'],
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    lastDelivery: '2024-01-20T14:45:00Z',
    deliveryCount: 45,
    failureCount: 2
  },
  {
    id: 'webhook_2',
    organizationId: 'org_123',
    url: 'https://n8n.example.com/webhook/insights',
    secret: 'whsec_fedcba0987654321',
    events: ['insights.updated', 'export.completed'],
    isActive: true,
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T11:20:00Z',
    lastDelivery: '2024-01-19T16:30:00Z',
    deliveryCount: 23,
    failureCount: 1
  },
  {
    id: 'webhook_3',
    organizationId: 'org_123',
    url: 'https://slack.com/api/webhooks/1234567890/abcdef',
    secret: 'whsec_slack123456789',
    events: ['work_item.created', 'approval.requested', 'insights.updated'],
    isActive: false,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    lastDelivery: '2024-01-15T12:00:00Z',
    deliveryCount: 12,
    failureCount: 5
  }
];

// Mock data for webhook events
const mockWebhookEvents = [
  {
    id: 'evt_1',
    type: 'work_item.created',
    timestamp: '2024-01-20T14:45:00Z',
    organizationId: 'org_123',
    projectId: 'proj_456',
    status: 'delivered',
    retryCount: 0,
    data: {
      workItem: {
        id: 'WI-001',
        title: 'Campaign Strategy Document',
        assignee: 'Sarah Mitchell'
      }
    }
  },
  {
    id: 'evt_2',
    type: 'approval.requested',
    timestamp: '2024-01-20T13:30:00Z',
    organizationId: 'org_123',
    projectId: 'proj_456',
    status: 'delivered',
    retryCount: 0,
    data: {
      approval: {
        id: 'APP-001',
        type: 'Budget Approval',
        requester: 'Marcus Chen',
        amount: 50000
      }
    }
  },
  {
    id: 'evt_3',
    type: 'insights.updated',
    timestamp: '2024-01-20T12:15:00Z',
    organizationId: 'org_123',
    projectId: 'proj_456',
    status: 'failed',
    retryCount: 2,
    errorMessage: 'HTTP 500: Internal Server Error',
    data: {
      insights: {
        id: 'INS-001',
        type: 'Performance Analysis',
        confidence: 0.85
      }
    }
  },
  {
    id: 'evt_4',
    type: 'export.completed',
    timestamp: '2024-01-20T11:00:00Z',
    organizationId: 'org_123',
    projectId: 'proj_456',
    status: 'delivered',
    retryCount: 0,
    data: {
      export: {
        id: 'EXP-001',
        type: 'pdf',
        fileName: 'Campaign_Report.pdf',
        fileSize: 2048576
      }
    }
  }
];

export default function WebhooksPage() {
  const t = useTranslations('AdminWebhooks');
  const [endpoints, setEndpoints] = useState(mockWebhookEndpoints);
  const [events, setEvents] = useState(mockWebhookEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTestWebhook = async (endpointId: string) => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success/failure
      const success = Math.random() > 0.3; // 70% success rate
      setTestResult({
        success,
        message: success 
          ? 'Test webhook sent successfully to Zapier'
          : 'Test webhook failed: Connection timeout'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Test webhook failed: Network error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWebhook = (endpointId: string) => {
    setEndpoints(prev => prev.filter(endpoint => endpoint.id !== endpointId));
  };

  const handleToggleActive = (endpointId: string) => {
    setEndpoints(prev => prev.map(endpoint => 
      endpoint.id === endpointId 
        ? { ...endpoint, isActive: !endpoint.isActive }
        : endpoint
    ));
  };

  const handleSaveWebhook = (webhook: any) => {
    setEndpoints(prev => [...prev, webhook]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'dead_letter':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      dead_letter: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const endpointColumns = [
    {
      key: 'url' as const,
      label: 'Webhook URL',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-2">
          <ExternalLink className="h-4 w-4 text-gray-400" />
          <span className="font-mono text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'events' as const,
      label: 'Events',
      render: (value: string[], row: any) => (
        <div className="flex flex-wrap gap-1">
          {value.map(event => (
            <Badge key={event} variant="outline" className="text-xs">
              {event.replace('.', ' ')}
            </Badge>
          ))}
        </div>
      )
    },
    {
      key: 'isActive' as const,
      label: 'Status',
      render: (value: boolean, row: any) => (
        <Badge className={value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'deliveryCount' as const,
      label: 'Deliveries',
      sortable: true,
      render: (value: number, row: any) => (
        <div className="text-center">
          <div className="font-semibold text-green-600">{value}</div>
          <div className="text-xs text-red-600">{row.failureCount} failed</div>
        </div>
      )
    },
    {
      key: 'lastDelivery' as const,
      label: 'Last Delivery',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="text-sm text-gray-600">
          {value ? new Date(value).toLocaleString() : 'Never'}
        </div>
      )
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTestWebhook(value)}
            disabled={isLoading}
          >
            <TestTube className="h-4 w-4 mr-1" />
            Test
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleActive(value)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteWebhook(value)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const eventColumns = [
    {
      key: 'type' as const,
      label: 'Event Type',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(row.status)}
          <span className="font-medium">{value.replace('.', ' ')}</span>
        </div>
      )
    },
    {
      key: 'timestamp' as const,
      label: 'Timestamp',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleString()}
        </div>
      )
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string, row: any) => getStatusBadge(value)
    },
    {
      key: 'retryCount' as const,
      label: 'Retries',
      render: (value: number, row: any) => (
        <div className="text-center">
          <span className="font-semibold">{value}</span>
          {row.errorMessage && (
            <div className="text-xs text-red-600 mt-1 truncate max-w-32" title={row.errorMessage}>
              {row.errorMessage}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'data' as const,
      label: 'Data',
      render: (value: any, row: any) => (
        <div className="text-sm text-gray-600 max-w-48 truncate">
          {JSON.stringify(value).substring(0, 50)}...
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webhook Management</h1>
          <p className="text-gray-600 mt-1">
            Manage external integrations and webhook endpoints
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Webhook
        </Button>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className={`p-4 rounded-md ${
          testResult.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className={`flex items-center ${
            testResult.success ? 'text-green-800' : 'text-red-800'
          }`}>
            {testResult.success ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
            {testResult.message}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Endpoints</p>
                <p className="text-2xl font-bold text-gray-900">{endpoints.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Endpoints</p>
                <p className="text-2xl font-bold text-green-600">
                  {endpoints.filter(e => e.isActive).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Events</p>
                <p className="text-2xl font-bold text-red-600">
                  {events.filter(e => e.status === 'failed').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Webhook Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={endpoints}
            columns={endpointColumns}
          />
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Webhook Events</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={events}
            columns={eventColumns}
          />
        </CardContent>
      </Card>

      {/* Webhook Dialog */}
      <WebhookDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveWebhook}
      />
    </div>
  );
}
