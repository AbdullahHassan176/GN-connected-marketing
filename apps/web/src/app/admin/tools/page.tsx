'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { DataTable, renderStatusBadge, renderNumber, renderDate } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Users, 
  Activity, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Zap,
  Plus,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';

// Mock data for AI tools
const mockTools = [
  {
    id: 'tool_1',
    name: 'AI Content Generator Pro',
    category: 'Content Creation',
    status: 'active',
    seats: { total: 10, used: 7, available: 3 },
    usage: {
      totalHours: 156,
      thisWeek: 24,
      lastUsed: '2 hours ago',
      efficiency: 92
    },
    logs: [
      { timestamp: '2024-01-28T10:30:00Z', user: 'Sarah Mitchell', action: 'Content generated', duration: '15min' },
      { timestamp: '2024-01-28T09:15:00Z', user: 'Marcus Chen', action: 'Campaign optimized', duration: '8min' },
      { timestamp: '2024-01-28T08:45:00Z', user: 'Emma Rodriguez', action: 'Content generated', duration: '12min' }
    ],
    config: {
      apiKey: 'sk-***...abc123',
      endpoint: 'https://api.contentgen.ai/v1',
      rateLimit: '1000/hour',
      lastSync: '2024-01-28T10:30:00Z'
    }
  },
  {
    id: 'tool_2',
    name: 'Sentiment Analysis Engine',
    category: 'Analytics',
    status: 'active',
    seats: { total: 5, used: 3, available: 2 },
    usage: {
      totalHours: 89,
      thisWeek: 18,
      lastUsed: '1 hour ago',
      efficiency: 88
    },
    logs: [
      { timestamp: '2024-01-28T11:00:00Z', user: 'David Kim', action: 'Sentiment analyzed', duration: '3min' },
      { timestamp: '2024-01-28T10:30:00Z', user: 'Sarah Mitchell', action: 'Campaign reviewed', duration: '5min' }
    ],
    config: {
      apiKey: 'sa-***...def456',
      endpoint: 'https://api.sentiment.ai/v2',
      rateLimit: '500/hour',
      lastSync: '2024-01-28T11:00:00Z'
    }
  },
  {
    id: 'tool_3',
    name: 'Campaign Optimizer',
    category: 'Campaign Management',
    status: 'maintenance',
    seats: { total: 8, used: 5, available: 3 },
    usage: {
      totalHours: 134,
      thisWeek: 0,
      lastUsed: '2 days ago',
      efficiency: 85
    },
    logs: [
      { timestamp: '2024-01-26T14:20:00Z', user: 'Marcus Chen', action: 'Campaign optimized', duration: '20min' }
    ],
    config: {
      apiKey: 'co-***...ghi789',
      endpoint: 'https://api.optimizer.ai/v1',
      rateLimit: '200/hour',
      lastSync: '2024-01-26T14:20:00Z'
    }
  },
  {
    id: 'tool_4',
    name: 'A/B Test Manager',
    category: 'Testing',
    status: 'inactive',
    seats: { total: 6, used: 0, available: 6 },
    usage: {
      totalHours: 67,
      thisWeek: 0,
      lastUsed: '1 week ago',
      efficiency: 78
    },
    logs: [],
    config: {
      apiKey: 'ab-***...jkl012',
      endpoint: 'https://api.abtest.ai/v1',
      rateLimit: '100/hour',
      lastSync: '2024-01-21T16:45:00Z'
    }
  }
];

export default function AdminToolsPage() {
  const t = useTranslations('AdminTools');
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [showLogs, setShowLogs] = useState(false);

  const handleToggleStatus = async (toolId: string, newStatus: string) => {
    // In a real app, this would call the API
    console.log(`Toggling tool ${toolId} to ${newStatus}`);
    // Update the tool status in the state
    // This would trigger a re-render and update the client transparency panel
  };

  const handleRefreshUsage = async (toolId: string) => {
    // In a real app, this would call the API to refresh usage data
    console.log(`Refreshing usage for tool ${toolId}`);
  };

  const columns = [
    {
      key: 'name' as const,
      label: 'Tool Name',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className={`w-3 h-3 rounded-full ${
              row.status === 'active' ? 'bg-green-500' : 
              row.status === 'maintenance' ? 'bg-yellow-500' : 'bg-gray-400'
            }`} />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.category}</div>
          </div>
        </div>
      )
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => renderStatusBadge(value),
      sortable: true
    },
    {
      key: 'seats' as const,
      label: 'Seats',
      render: (value: any) => (
        <div className="text-sm">
          <div className="font-medium">{value.used}/{value.total}</div>
          <div className="text-gray-500">{value.available} available</div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'usage' as const,
      label: 'Usage This Week',
      render: (value: any) => (
        <div className="text-sm">
          <div className="font-medium">{value.thisWeek}h</div>
          <div className="text-gray-500">{value.efficiency}% efficiency</div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'usage' as const,
      label: 'Last Used',
      render: (value: any) => (
        <div className="text-sm text-gray-600">{value.lastUsed}</div>
      ),
      sortable: true
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedTool(row)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogs(true)}
          >
            <Activity className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRefreshUsage(row.id)}
          >
            <RefreshCw className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t('exportReport')}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('addTool')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalTools')}</CardTitle>
            <Zap className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTools.length}</div>
            <p className="text-xs text-gray-500">+2 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activeTools')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTools.filter(tool => tool.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500">75% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalSeats')}</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTools.reduce((sum, tool) => sum + tool.seats.total, 0)}
            </div>
            <p className="text-xs text-gray-500">
              {mockTools.reduce((sum, tool) => sum + tool.seats.used, 0)} in use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('weeklyUsage')}</CardTitle>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTools.reduce((sum, tool) => sum + tool.usage.thisWeek, 0)}h
            </div>
            <p className="text-xs text-gray-500">+15% vs last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Tools Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('toolsList')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('filter')}
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                {t('search')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockTools}
            columns={columns}
            onSort={(key, direction) => {
              console.log('Sort:', key, direction);
            }}
          />
        </CardContent>
      </Card>

      {/* Tool Details Modal */}
      {selectedTool && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedTool.name}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTool(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{t('currentStatus')}</h3>
                  <p className="text-sm text-gray-600">{t('statusDescription')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={selectedTool.status === 'active' ? 'success' : 'secondary'}>
                    {selectedTool.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(
                      selectedTool.id, 
                      selectedTool.status === 'active' ? 'inactive' : 'active'
                    )}
                  >
                    {selectedTool.status === 'active' ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        {t('disable')}
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {t('enable')}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Configuration */}
              <div>
                <h3 className="font-medium mb-3">{t('configuration')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('apiKey')}:</span>
                    <span className="font-mono">{selectedTool.config.apiKey}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('endpoint')}:</span>
                    <span className="font-mono">{selectedTool.config.endpoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('rateLimit')}:</span>
                    <span>{selectedTool.config.rateLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('lastSync')}:</span>
                    <span>{new Date(selectedTool.config.lastSync).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div>
                <h3 className="font-medium mb-3">{t('usageStats')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600">{t('totalHours')}</div>
                    <div className="text-lg font-semibold">{selectedTool.usage.totalHours}h</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600">{t('efficiency')}</div>
                    <div className="text-lg font-semibold">{selectedTool.usage.efficiency}%</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedTool(null)}>
                  {t('close')}
                </Button>
                <Button onClick={() => setShowLogs(true)}>
                  <Activity className="h-4 w-4 mr-2" />
                  {t('viewLogs')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}

      {/* Usage Logs Modal */}
      {showLogs && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-4xl mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('usageLogs')}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogs(false)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedTool?.logs.map((log: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{log.action}</div>
                        <div className="text-sm text-gray-600">{log.user}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()} • {log.duration}
                    </div>
                  </div>
                ))}
                {selectedTool?.logs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {t('noLogs')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  );
}
