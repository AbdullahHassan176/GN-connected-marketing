'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@repo/ui';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ArrowUpDown,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { withAuth } from '@/components/auth/withAuth';
import Link from 'next/link';

// Mock data for projects
const mockProjects = [
  {
    id: 'proj_456',
    name: 'Premium Hotels Campaign',
    description: 'Luxury hospitality marketing campaign for premium hotel chain',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-06-15',
    manager: 'Marcus Chen',
    teamSize: 8,
    budget: 125000,
    spent: 78000,
    progress: 78,
    tags: ['luxury', 'hospitality', 'premium'],
    kpis: {
      impressions: 1200000,
      clicks: 48000,
      conversions: 1200,
      revenue: 156000,
      roi: 24.8,
    },
  },
  {
    id: 'proj_789',
    name: 'Tech Startup Launch',
    description: 'Digital marketing strategy for emerging tech startup',
    status: 'planning',
    startDate: '2024-02-01',
    endDate: '2024-08-01',
    manager: 'Sarah Mitchell',
    teamSize: 5,
    budget: 75000,
    spent: 12000,
    progress: 15,
    tags: ['tech', 'startup', 'digital'],
    kpis: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      roi: 0,
    },
  },
  {
    id: 'proj_101',
    name: 'Luxury Brand Rebranding',
    description: 'Complete brand identity redesign for luxury fashion brand',
    status: 'completed',
    startDate: '2023-09-01',
    endDate: '2024-01-31',
    manager: 'Emma Rodriguez',
    teamSize: 12,
    budget: 200000,
    spent: 195000,
    progress: 100,
    tags: ['luxury', 'fashion', 'rebranding'],
    kpis: {
      impressions: 2500000,
      clicks: 125000,
      conversions: 2500,
      revenue: 450000,
      roi: 125,
    },
  },
  {
    id: 'proj_102',
    name: 'E-commerce Optimization',
    description: 'Conversion rate optimization for online retail platform',
    status: 'paused',
    startDate: '2024-01-10',
    endDate: '2024-04-10',
    manager: 'Ahmed Al-Rashid',
    teamSize: 6,
    budget: 50000,
    spent: 25000,
    progress: 45,
    tags: ['ecommerce', 'optimization', 'conversion'],
    kpis: {
      impressions: 800000,
      clicks: 32000,
      conversions: 800,
      revenue: 120000,
      roi: 140,
    },
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  planning: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  paused: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

function ProjectsPageContent() {
  const t = useTranslations('projects');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

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
          {t('create_project')}
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={t('search_projects')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {t('filter')}
              </Button>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {t('sort')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {project.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status and Progress */}
              <div className="flex items-center justify-between">
                <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                  {project.status}
                </Badge>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{project.progress}%</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Manager</span>
                  <span className="font-medium">{project.manager}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Team Size</span>
                  <span className="font-medium">{project.teamSize} members</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-medium">{formatCurrency(project.budget)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Spent</span>
                  <span className="font-medium">{formatCurrency(project.spent)}</span>
                </div>
              </div>

              {/* KPIs */}
              {project.status === 'active' && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {project.kpis.impressions.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Impressions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {project.kpis.conversions.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Conversions</div>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDate(project.startDate)}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDate(project.endDate)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/projects/${project.id}`}>
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (if no projects) */}
      {mockProjects.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">{t('no_projects')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('no_projects_description')}</p>
              <div className="mt-6">
                <Button variant="gradient">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('create_first_project')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default withAuth(ProjectsPageContent, {
  requiredRole: { scope: 'org', role: 'analyst' },
  redirectTo: '/unauthorized',
});