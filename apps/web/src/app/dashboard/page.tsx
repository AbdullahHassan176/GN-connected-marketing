'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@repo/ui';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { withAuth } from '@/components/auth/withAuth';
import { ClientDashboardEmpty } from '@/components/empty-states/client-dashboard-empty';
import Link from 'next/link';

// Mock data for dashboard
const mockDashboardData = {
  overview: {
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 3,
    totalRevenue: 1250000,
    monthlyGrowth: 15.2,
    teamMembers: 24,
    clientSatisfaction: 4.8,
  },
  recentActivity: [
    {
      id: '1',
      type: 'project_completed',
      title: 'Luxury Hotel Campaign Completed',
      description: 'Premium Hotels campaign has been successfully completed',
      timestamp: '2 hours ago',
      user: 'Sarah Mitchell',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
    },
    {
      id: '2',
      type: 'approval_required',
      title: 'Budget Approval Needed',
      description: 'Tech Startup campaign requires budget approval',
      timestamp: '4 hours ago',
      user: 'Marcus Chen',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
    },
    {
      id: '3',
      type: 'insight_generated',
      title: 'AI Insight Generated',
      description: 'New market trend analysis available for review',
      timestamp: '6 hours ago',
      user: 'Emma Rodriguez',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
    },
  ],
  kpis: [
    {
      title: 'Active Projects',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: Target,
    },
    {
      title: 'Monthly Revenue',
      value: '$125K',
      change: '+15.2%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Client Satisfaction',
      value: '4.8/5',
      change: '+0.3',
      changeType: 'positive',
      icon: Star,
    },
    {
      title: 'Team Productivity',
      value: '92%',
      change: '+5%',
      changeType: 'positive',
      icon: Activity,
    },
  ],
  upcomingDeadlines: [
    {
      id: '1',
      title: 'Campaign Launch',
      project: 'Premium Hotels',
      dueDate: '2024-02-15',
      priority: 'high',
      assignee: 'Marcus Chen',
    },
    {
      id: '2',
      title: 'Creative Review',
      project: 'Tech Startup',
      dueDate: '2024-02-18',
      priority: 'medium',
      assignee: 'Emma Rodriguez',
    },
    {
      id: '3',
      title: 'Budget Approval',
      project: 'Luxury Brand',
      dueDate: '2024-02-20',
      priority: 'high',
      assignee: 'Sarah Mitchell',
    },
  ],
  quickActions: [
    {
      title: 'Create Project',
      description: 'Start a new marketing campaign',
      icon: Target,
      href: '/projects/new',
      color: 'blue',
    },
    {
      title: 'Generate Insight',
      description: 'Get AI-powered market analysis',
      icon: Zap,
      href: '/tools/insights',
      color: 'purple',
    },
    {
      title: 'Schedule Meeting',
      description: 'Plan team collaboration',
      icon: Calendar,
      href: '/calendar',
      color: 'green',
    },
    {
      title: 'View Reports',
      description: 'Access analytics dashboard',
      icon: BarChart3,
      href: '/analytics',
      color: 'orange',
    },
  ],
};

function DashboardPageContent() {
  const { data: session } = useSession();
  const t = useTranslations('dashboard');
  
  const user = session?.user as any;
  const userRole = user?.roles?.[0]?.role || 'client';
  const isAdmin = userRole === 'admin' || userRole === 'owner';
  const isManager = userRole === 'manager' || isAdmin;
  const isClient = userRole === 'client';

  // For client users, show the enhanced client dashboard
  if (isClient) {
    // Check if client has projects - for demo purposes, we'll show the client dashboard
    // In a real app, you'd check if the user has any projects
    const hasProjects = true; // Mock: client has projects
    
    if (!hasProjects) {
      return <ClientDashboardEmpty />;
    }
    
    // Redirect to client dashboard
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting to Client Dashboard...</h1>
          <Link href="/dashboard/client">
            <Button size="lg">
              View Your Client Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getRoleBasedWelcome = () => {
    switch (userRole) {
      case 'owner':
        return 'Welcome back, Owner! Here\'s your executive overview.';
      case 'admin':
        return 'Welcome back, Admin! Here\'s your management dashboard.';
      case 'manager':
        return 'Welcome back, Manager! Here\'s your team overview.';
      case 'analyst':
        return 'Welcome back, Analyst! Here\'s your data insights.';
      case 'client':
        return 'Welcome back! Here\'s your project overview.';
      default:
        return 'Welcome to your dashboard!';
    }
  };

  const getRoleBasedActions = () => {
    if (userRole === 'client') {
      return mockDashboardData.quickActions.filter(action => 
        action.href !== '/projects/new' && action.href !== '/tools/insights'
      );
    }
    return mockDashboardData.quickActions;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{getRoleBasedWelcome()}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="px-3 py-1">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </Badge>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date().toLocaleDateString()}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockDashboardData.kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs ${
                kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                {t('recent_activity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <img
                        src={activity.avatar}
                        alt={activity.user}
                        className="h-8 w-8 rounded-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {activity.type === 'project_completed' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {activity.type === 'approval_required' && (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      {activity.type === 'insight_generated' && (
                        <Zap className="h-5 w-5 text-purple-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Deadlines */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                {t('upcoming_deadlines')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDashboardData.upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {deadline.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {deadline.project} • {deadline.assignee}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={deadline.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {deadline.priority}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(deadline.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      {isManager && (
        <Card>
          <CardHeader>
            <CardTitle>{t('quick_actions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getRoleBasedActions().map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2"
                >
                  <action.icon className={`h-6 w-6 text-${action.color}-500`} />
                  <div className="text-left">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default withAuth(DashboardPageContent, {
  requiredRole: { scope: 'org', role: 'client' },
  redirectTo: '/unauthorized',
});