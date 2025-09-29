'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { Progress } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';

// Mock data for workload management
const mockWorkloadData = {
  users: [
    {
      id: 'user_1',
      name: 'Sarah Mitchell',
      role: 'Senior Marketing Manager',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
      workload: {
        totalTasks: 12,
        completed: 8,
        inProgress: 3,
        overdue: 1,
        wipLimit: 5,
        utilization: 75
      },
      projects: ['Premium Hotels', 'Tech Startup', 'Luxury Brand'],
      lastActivity: '2 hours ago',
      efficiency: 92
    },
    {
      id: 'user_2',
      name: 'Marcus Chen',
      role: 'Campaign Specialist',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
      workload: {
        totalTasks: 8,
        completed: 6,
        inProgress: 2,
        overdue: 0,
        wipLimit: 4,
        utilization: 50
      },
      projects: ['Premium Hotels', 'Tech Startup'],
      lastActivity: '1 hour ago',
      efficiency: 88
    },
    {
      id: 'user_3',
      name: 'Emma Rodriguez',
      role: 'Content Creator',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
      workload: {
        totalTasks: 15,
        completed: 10,
        inProgress: 4,
        overdue: 1,
        wipLimit: 6,
        utilization: 83
      },
      projects: ['Luxury Brand', 'Premium Hotels'],
      lastActivity: '30 minutes ago',
      efficiency: 95
    },
    {
      id: 'user_4',
      name: 'David Kim',
      role: 'Analytics Specialist',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
      workload: {
        totalTasks: 6,
        completed: 4,
        inProgress: 2,
        overdue: 0,
        wipLimit: 3,
        utilization: 67
      },
      projects: ['Tech Startup'],
      lastActivity: '3 hours ago',
      efficiency: 90
    },
    {
      id: 'user_5',
      name: 'Lisa Johnson',
      role: 'Design Lead',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
      workload: {
        totalTasks: 20,
        completed: 12,
        inProgress: 6,
        overdue: 2,
        wipLimit: 8,
        utilization: 100
      },
      projects: ['Luxury Brand', 'Premium Hotels', 'Tech Startup'],
      lastActivity: '1 hour ago',
      efficiency: 85
    }
  ],
  teamStats: {
    totalUsers: 5,
    averageUtilization: 75,
    totalTasks: 61,
    completedTasks: 40,
    overdueTasks: 4,
    averageEfficiency: 90
  }
};

export default function AdminWorkloadPage() {
  const t = useTranslations('AdminWorkload');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUtilizationBgColor = (utilization: number) => {
    if (utilization >= 90) return 'bg-red-50 border-red-200';
    if (utilization >= 75) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const filteredUsers = mockWorkloadData.users.filter(user => {
    if (filterStatus === 'overloaded') return user.workload.utilization >= 90;
    if (filterStatus === 'optimal') return user.workload.utilization >= 50 && user.workload.utilization < 90;
    if (filterStatus === 'underutilized') return user.workload.utilization < 50;
    return true;
  });

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
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('refresh')}
          </Button>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            {t('scheduleReview')}
          </Button>
        </div>
      </div>

      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockWorkloadData.teamStats.totalUsers}</div>
            <p className="text-xs text-gray-500">Active team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('avgUtilization')}</CardTitle>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockWorkloadData.teamStats.averageUtilization}%</div>
            <p className="text-xs text-gray-500">Team average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalTasks')}</CardTitle>
            <Target className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockWorkloadData.teamStats.totalTasks}</div>
            <p className="text-xs text-gray-500">
              {mockWorkloadData.teamStats.completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('overdueTasks')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockWorkloadData.teamStats.overdueTasks}
            </div>
            <p className="text-xs text-gray-500">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('teamWorkload')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                {t('all')}
              </Button>
              <Button
                variant={filterStatus === 'overloaded' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('overloaded')}
              >
                {t('overloaded')}
              </Button>
              <Button
                variant={filterStatus === 'optimal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('optimal')}
              >
                {t('optimal')}
              </Button>
              <Button
                variant={filterStatus === 'underutilized' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('underutilized')}
              >
                {t('underutilized')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`p-4 rounded-lg border ${getUtilizationBgColor(user.workload.utilization)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.role}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {user.workload.inProgress}/{user.workload.wipLimit} WIP
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.workload.completed} completed
                        </span>
                        {user.workload.overdue > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {user.workload.overdue} overdue
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Utilization */}
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getUtilizationColor(user.workload.utilization)}`}>
                        {user.workload.utilization}%
                      </div>
                      <div className="text-xs text-gray-500">Utilization</div>
                    </div>

                    {/* Efficiency */}
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {user.efficiency}%
                      </div>
                      <div className="text-xs text-gray-500">Efficiency</div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-32">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>WIP</span>
                        <span>{user.workload.inProgress}/{user.workload.wipLimit}</span>
                      </div>
                      <Progress 
                        value={(user.workload.inProgress / user.workload.wipLimit) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        {t('viewDetails')}
                      </Button>
                      {user.workload.utilization >= 90 && (
                        <Button variant="outline" size="sm">
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Projects */}
                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Projects:</span>
                  {user.projects.map((project, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {project}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <CardTitle>{selectedUser.name}</CardTitle>
                    <p className="text-sm text-gray-600">{selectedUser.role}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Workload Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600">{t('totalTasks')}</div>
                  <div className="text-2xl font-semibold">{selectedUser.workload.totalTasks}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600">{t('completed')}</div>
                  <div className="text-2xl font-semibold">{selectedUser.workload.completed}</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-sm text-yellow-600">{t('inProgress')}</div>
                  <div className="text-2xl font-semibold">{selectedUser.workload.inProgress}</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-sm text-red-600">{t('overdue')}</div>
                  <div className="text-2xl font-semibold">{selectedUser.workload.overdue}</div>
                </div>
              </div>

              {/* WIP Limit */}
              <div>
                <h3 className="font-medium mb-3">{t('wipLimit')}</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{t('currentWip')}</span>
                      <span>{selectedUser.workload.inProgress}/{selectedUser.workload.wipLimit}</span>
                    </div>
                    <Progress 
                      value={(selectedUser.workload.inProgress / selectedUser.workload.wipLimit) * 100} 
                      className="h-3"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    {t('adjustLimit')}
                  </Button>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="font-medium mb-3">{t('performanceMetrics')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">{t('efficiency')}</div>
                    <div className="text-lg font-semibold">{selectedUser.efficiency}%</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">{t('utilization')}</div>
                    <div className="text-lg font-semibold">{selectedUser.workload.utilization}%</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  {t('close')}
                </Button>
                <Button>
                  {t('reassignTasks')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  );
}
