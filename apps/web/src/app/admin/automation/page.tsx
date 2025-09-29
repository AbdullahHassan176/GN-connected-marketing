'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { DataTable } from '@repo/ui';
import { Plus, Settings, Play, Pause, Trash2, ExternalLink } from 'lucide-react';

// Mock data for automation workflows
const mockAutomations = [
  {
    id: 'auto_1',
    name: 'Campaign Performance Alert',
    description: 'Sends Slack notification when campaign CTR drops below 2%',
    status: 'active',
    trigger: 'Campaign CTR < 2%',
    action: 'Send Slack notification to #marketing-alerts',
    webhook: {
      url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK/URL',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xoxb-***'
      }
    },
    lastTriggered: '2024-01-20T10:30:00Z',
    triggerCount: 15,
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'auto_2',
    name: 'Budget Exhaustion Alert',
    description: 'Notifies team when campaign budget reaches 90%',
    status: 'active',
    trigger: 'Budget Usage >= 90%',
    action: 'Send email to campaign manager',
    webhook: {
      url: 'https://api.sendgrid.com/v3/mail/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer SG.***'
      }
    },
    lastTriggered: '2024-01-19T14:15:00Z',
    triggerCount: 3,
    createdAt: '2024-01-10T11:00:00Z'
  },
  {
    id: 'auto_3',
    name: 'New Lead Notification',
    description: 'Sends notification when high-value lead is captured',
    status: 'inactive',
    trigger: 'Lead Score >= 80',
    action: 'Send Slack DM to sales team',
    webhook: {
      url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK/URL',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xoxb-***'
      }
    },
    lastTriggered: '2024-01-18T16:45:00Z',
    triggerCount: 8,
    createdAt: '2024-01-05T08:30:00Z'
  }
];

// Mock data for integrations
const mockIntegrations = [
  {
    id: 'int_1',
    name: 'Slack Integration',
    type: 'Communication',
    status: 'connected',
    description: 'Send notifications to Slack channels and DMs',
    connectedAt: '2024-01-15T09:00:00Z',
    lastUsed: '2024-01-20T10:30:00Z',
    usageCount: 45
  },
  {
    id: 'int_2',
    name: 'SendGrid Email',
    type: 'Email',
    status: 'connected',
    description: 'Send transactional and marketing emails',
    connectedAt: '2024-01-10T11:00:00Z',
    lastUsed: '2024-01-19T14:15:00Z',
    usageCount: 23
  },
  {
    id: 'int_3',
    name: 'Zapier Webhooks',
    type: 'Automation',
    status: 'disconnected',
    description: 'Connect to 5000+ apps via Zapier',
    connectedAt: '2024-01-05T08:30:00Z',
    lastUsed: '2024-01-18T16:45:00Z',
    usageCount: 12
  },
  {
    id: 'int_4',
    name: 'Google Analytics',
    type: 'Analytics',
    status: 'connected',
    description: 'Track campaign performance and user behavior',
    connectedAt: '2024-01-12T14:20:00Z',
    lastUsed: '2024-01-20T09:15:00Z',
    usageCount: 67
  }
];

// KPI data
const kpiData = {
  totalAutomations: 12,
  activeAutomations: 8,
  totalIntegrations: 6,
  connectedIntegrations: 4,
  totalTriggers: 156,
  successRate: 94.2
};

export default function AutomationPage() {
  const [selectedAutomation, setSelectedAutomation] = useState<any>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);

  const automationColumns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">{row.description}</div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'trigger',
      label: 'Trigger',
      render: (value: string) => (
        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
          {value}
        </span>
      )
    },
    {
      key: 'triggerCount',
      label: 'Triggers',
      render: (value: number) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'lastTriggered',
      label: 'Last Triggered',
      render: (value: string) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedAutomation(row)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('Toggle automation', value)}
          >
            {row.status === 'active' ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('Delete automation', value)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const integrationColumns = [
    {
      key: 'name',
      label: 'Integration',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">{row.description}</div>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'connected' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'usageCount',
      label: 'Usage',
      render: (value: number) => (
        <span className="font-medium">{value} times</span>
      )
    },
    {
      key: 'lastUsed',
      label: 'Last Used',
      render: (value: string) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedIntegration(row)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('Open integration', value)}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automation Hub</h1>
          <p className="text-gray-600">
            Manage automation workflows and integrations
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Automation
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Automations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalAutomations}</div>
            <p className="text-xs text-gray-500">
              {kpiData.activeAutomations} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.connectedIntegrations}</div>
            <p className="text-xs text-gray-500">
              of {kpiData.totalIntegrations} connected
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.successRate}%</div>
            <p className="text-xs text-gray-500">
              {kpiData.totalTriggers} total triggers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Automation Workflows */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Workflows</CardTitle>
          <CardDescription>
            Configure automated actions based on campaign events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockAutomations}
            columns={automationColumns}
          />
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect with external services and platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockIntegrations}
            columns={integrationColumns}
          />
        </CardContent>
      </Card>
    </div>
  );
}