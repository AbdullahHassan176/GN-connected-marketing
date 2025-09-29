'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@repo/ui';
import { 
  Search, 
  Filter, 
  PlusCircle,
  Zap,
  BarChart3,
  Bot,
  MessageSquare,
  FileText,
  Image,
  Video,
  Settings,
  Play,
  Pause,
  MoreHorizontal,
  Star,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { withAuth } from '@/components/auth/withAuth';

// Mock data for tools
const mockTools = [
  {
    id: 'tool_001',
    name: 'AI Content Generator',
    description: 'Generate marketing content using AI',
    category: 'content',
    status: 'active',
    usage: {
      totalRequests: 150,
      successfulRequests: 142,
      lastUsed: '2024-01-30T10:30:00Z',
    },
    settings: {
      enabled: true,
      autoGenerate: true,
      quality: 'high',
    },
    icon: Bot,
    color: 'blue',
  },
  {
    id: 'tool_002',
    name: 'Analytics Dashboard',
    description: 'Real-time analytics and reporting dashboard',
    category: 'analytics',
    status: 'active',
    usage: {
      totalRequests: 89,
      successfulRequests: 89,
      lastUsed: '2024-01-30T14:15:00Z',
    },
    settings: {
      enabled: true,
      autoRefresh: true,
      notifications: true,
    },
    icon: BarChart3,
    color: 'green',
  },
  {
    id: 'tool_003',
    name: 'Social Media Manager',
    description: 'Automated social media posting and engagement',
    category: 'automation',
    status: 'inactive',
    usage: {
      totalRequests: 45,
      successfulRequests: 42,
      lastUsed: '2024-01-25T09:20:00Z',
    },
    settings: {
      enabled: false,
      autoPost: false,
      schedulePosts: true,
    },
    icon: MessageSquare,
    color: 'purple',
  },
  {
    id: 'tool_004',
    name: 'Brand Asset Manager',
    description: 'Organize and manage brand assets and files',
    category: 'content',
    status: 'active',
    usage: {
      totalRequests: 234,
      successfulRequests: 230,
      lastUsed: '2024-01-30T16:45:00Z',
    },
    settings: {
      enabled: true,
      autoSync: true,
      versionControl: true,
    },
    icon: FileText,
    color: 'orange',
  },
  {
    id: 'tool_005',
    name: 'Video Editor AI',
    description: 'AI-powered video editing and optimization',
    category: 'content',
    status: 'maintenance',
    usage: {
      totalRequests: 67,
      successfulRequests: 65,
      lastUsed: '2024-01-28T11:30:00Z',
    },
    settings: {
      enabled: true,
      autoOptimize: true,
      quality: 'high',
    },
    icon: Video,
    color: 'red',
  },
  {
    id: 'tool_006',
    name: 'Image Generator',
    description: 'Create custom images and graphics using AI',
    category: 'content',
    status: 'active',
    usage: {
      totalRequests: 189,
      successfulRequests: 185,
      lastUsed: '2024-01-30T13:20:00Z',
    },
    settings: {
      enabled: true,
      autoGenerate: true,
      style: 'professional',
    },
    icon: Image,
    color: 'pink',
  },
];

const categoryColors = {
  content: 'bg-blue-100 text-blue-800',
  analytics: 'bg-green-100 text-green-800',
  automation: 'bg-purple-100 text-purple-800',
  communication: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
};

const iconColors = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  purple: 'text-purple-500',
  orange: 'text-orange-500',
  red: 'text-red-500',
  pink: 'text-pink-500',
};

function ToolsPageContent() {
  const t = useTranslations('tools');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getSuccessRate = (total: number, successful: number) => {
    return total > 0 ? Math.round((successful / total) * 100) : 0;
  };

  const getCategoryStats = () => {
    const stats = mockTools.reduce((acc, tool) => {
      acc[tool.category] = (acc[tool.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>
        <Button variant="gradient" className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('add_tool')}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tools</p>
                <p className="text-2xl font-bold">{mockTools.length}</p>
              </div>
              <Zap className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tools</p>
                <p className="text-2xl font-bold">
                  {mockTools.filter(tool => tool.status === 'active').length}
                </p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">
                  {mockTools.reduce((sum, tool) => sum + tool.usage.totalRequests, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    mockTools.reduce((sum, tool) => sum + getSuccessRate(tool.usage.totalRequests, tool.usage.successfulRequests), 0) / mockTools.length
                  )}%
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Tools by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{category}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={t('search_tools')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {t('filter')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTools.map((tool) => (
          <Card key={tool.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100 ${iconColors[tool.color as keyof typeof iconColors]}`}>
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {tool.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status and Category */}
              <div className="flex items-center justify-between">
                <Badge className={statusColors[tool.status as keyof typeof statusColors]}>
                  {tool.status}
                </Badge>
                <Badge className={categoryColors[tool.category as keyof typeof categoryColors]}>
                  {tool.category}
                </Badge>
              </div>

              {/* Usage Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Requests</span>
                  <span className="font-medium">{tool.usage.totalRequests}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium">
                    {getSuccessRate(tool.usage.totalRequests, tool.usage.successfulRequests)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Used</span>
                  <span className="font-medium">{formatDate(tool.usage.lastUsed)}</span>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Enabled</span>
                  <span className={`font-medium ${tool.settings.enabled ? 'text-green-600' : 'text-red-600'}`}>
                    {tool.settings.enabled ? 'Yes' : 'No'}
                  </span>
                </div>
                {tool.settings.autoGenerate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Auto Generate</span>
                    <span className="font-medium text-green-600">Yes</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Settings className="mr-1 h-3 w-3" />
                    Settings
                  </Button>
                  {tool.status === 'active' ? (
                    <Button variant="ghost" size="sm" className="text-yellow-600">
                      <Pause className="mr-1 h-3 w-3" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-green-600">
                      <Play className="mr-1 h-3 w-3" />
                      Start
                    </Button>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  <BarChart3 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockTools.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Zap className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">{t('no_tools')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('no_tools_description')}</p>
              <div className="mt-6">
                <Button variant="gradient">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('add_first_tool')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default withAuth(ToolsPageContent, {
  requiredRole: { scope: 'org', role: 'analyst' },
  redirectTo: '/unauthorized',
});
