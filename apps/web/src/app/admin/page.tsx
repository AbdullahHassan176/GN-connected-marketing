'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Settings, 
  Users, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  Shield,
  Database,
  Webhook
} from 'lucide-react';

// Mock data for admin dashboard
const mockAdminData = {
  overview: {
    totalUsers: 24,
    activeUsers: 22,
    totalProjects: 12,
    activeProjects: 8,
    totalTools: 15,
    activeTools: 12,
    totalAutomations: 8,
    activeAutomations: 6
  },
  recentActivity: [
    {
      id: '1',
      type: 'tool_status_changed',
      title: 'AI Content Generator status updated',
      description: 'Tool status changed from active to maintenance',
      timestamp: '2 hours ago',
      user: 'Admin User',
      severity: 'info'
    },
    {
      id: '2',
      type: 'approval_processed',
      title: 'Budget approval processed',
      description: 'Premium Hotels campaign budget increase approved',
      timestamp: '4 hours ago',
      user: 'Admin User',
      severity: 'success'
    },
    {
      id: '3',
      type: 'automation_triggered',
      title: 'Campaign performance alert triggered',
      description: 'CTR dropped below 2% for Tech Startup campaign',
      timestamp: '6 hours ago',
      user: 'System',
      severity: 'warning'
    },
    {
      id: '4',
      type: 'user_registered',
      title: 'New user registered',
      description: 'Lisa Johnson joined as Design Lead',
      timestamp: '1 day ago',
      user: 'System',
      severity: 'info'
    }
  ],
  systemHealth: {
    database: { status: 'healthy', uptime: '99.9%' },
    api: { status: 'healthy', responseTime: '120ms' },
    tools: { status: 'warning', activeTools: 12, totalTools: 15 },
    automations: { status: 'healthy', successRate: '95%' }
  },
  quickStats: [
    {
      title: 'Pending Approvals',
      value: '3',
      change: '+1',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'blue'
    },
    {
      title: 'Active Tools',
      value: '12/15',
      change: '-1',
      changeType: 'negative',
      icon: Zap,
      color: 'green'
    },
    {
      title: 'Team Utilization',
      value: '78%',
      change: '+5%',
      changeType: 'positive',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Automation Success',
      value: '95%',
      change: '+2%',
      changeType: 'positive',
      icon: Activity,
      color: 'orange'
    }
  ]
};

export default function AdminDashboard() {
  const t = useTranslations('AdminDashboard');
  const { data: session } = useSession();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="px-3 py-1">
            <Shield className="h-4 w-4 mr-2" />
            Admin Access
          </Badge>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            {t('systemSettings')}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {mockAdminData.quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 text-${stat.color}-500`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            {t('systemHealth')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Database</div>
                <div className="text-sm text-gray-600">Uptime: {mockAdminData.systemHealth.database.uptime}</div>
              </div>
              <Badge variant="success">{mockAdminData.systemHealth.database.status}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">API</div>
                <div className="text-sm text-gray-600">Response: {mockAdminData.systemHealth.api.responseTime}</div>
              </div>
              <Badge variant="success">{mockAdminData.systemHealth.api.status}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Tools</div>
                <div className="text-sm text-gray-600">
                  {mockAdminData.systemHealth.tools.activeTools}/{mockAdminData.systemHealth.tools.totalTools} active
                </div>
              </div>
              <Badge variant="warning">{mockAdminData.systemHealth.tools.status}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Automations</div>
                <div className="text-sm text-gray-600">Success: {mockAdminData.systemHealth.automations.successRate}</div>
              </div>
              <Badge variant="success">{mockAdminData.systemHealth.automations.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                {t('recentActivity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAdminData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getSeverityIcon(activity.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {activity.timestamp}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">
                          {activity.user}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('quickActions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link href="/admin/tools">
                    <Zap className="h-4 w-4 mr-2" />
                    {t('manageTools')}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/workload">
                    <Users className="h-4 w-4 mr-2" />
                    {t('viewWorkload')}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/approvals">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t('reviewApprovals')}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/automation">
                    <Webhook className="h-4 w-4 mr-2" />
                    {t('automationHub')}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/users">
                    <Users className="h-4 w-4 mr-2" />
                    {t('manageUsers')}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {t('viewAnalytics')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Overview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('systemOverview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('totalUsers')}</span>
                  <span className="font-medium">{mockAdminData.overview.totalUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('activeProjects')}</span>
                  <span className="font-medium">{mockAdminData.overview.activeProjects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('activeTools')}</span>
                  <span className="font-medium">{mockAdminData.overview.activeTools}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('automations')}</span>
                  <span className="font-medium">{mockAdminData.overview.activeAutomations}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
