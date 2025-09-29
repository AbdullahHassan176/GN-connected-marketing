'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { DataTable, renderStatusBadge, renderNumber, renderDate } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { 
  Trophy,
  Target,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Filter,
  Search,
  Download,
  Plus,
  Eye,
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

// Mock data for A/B tests
const mockABTests = [
  {
    id: 'test_1',
    name: 'Email Subject Line Test',
    description: 'Testing different subject lines for newsletter campaign',
    status: 'completed',
    winner: 'variant_b',
    lift: 23.5,
    significance: 0.95,
    confidence: 'high',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-01-22T00:00:00Z',
    participants: 5000,
    variants: [
      {
        id: 'variant_a',
        name: 'Control',
        description: 'Original subject line',
        metrics: {
          openRate: 12.3,
          clickRate: 2.1,
          conversionRate: 0.8,
          revenue: 12500
        }
      },
      {
        id: 'variant_b',
        name: 'Personalized',
        description: 'Personalized subject line with name',
        metrics: {
          openRate: 15.2,
          clickRate: 2.8,
          conversionRate: 1.2,
          revenue: 18500
        }
      }
    ],
    results: {
      totalParticipants: 5000,
      totalConversions: 100,
      totalRevenue: 31000,
      duration: 7
    }
  },
  {
    id: 'test_2',
    name: 'Landing Page CTA Test',
    description: 'Testing different call-to-action buttons on landing page',
    status: 'running',
    winner: null,
    lift: 0,
    significance: 0.0,
    confidence: 'pending',
    startDate: '2024-01-25T00:00:00Z',
    endDate: '2024-02-01T00:00:00Z',
    participants: 2500,
    variants: [
      {
        id: 'variant_a',
        name: 'Control',
        description: 'Original "Sign Up" button',
        metrics: {
          clickRate: 8.2,
          conversionRate: 3.1,
          revenue: 8500
        }
      },
      {
        id: 'variant_b',
        name: 'Urgency',
        description: '"Get Started Now" button',
        metrics: {
          clickRate: 9.8,
          conversionRate: 3.7,
          revenue: 10200
        }
      },
      {
        id: 'variant_c',
        name: 'Benefit',
        description: '"Start Your Free Trial" button',
        metrics: {
          clickRate: 7.9,
          conversionRate: 2.8,
          revenue: 7800
        }
      }
    ],
    results: {
      totalParticipants: 2500,
      totalConversions: 78,
      totalRevenue: 26500,
      duration: 3
    }
  },
  {
    id: 'test_3',
    name: 'Ad Creative Test',
    description: 'Testing different ad creatives for social media campaign',
    status: 'draft',
    winner: null,
    lift: 0,
    significance: 0.0,
    confidence: 'pending',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-02-08T00:00:00Z',
    participants: 0,
    variants: [
      {
        id: 'variant_a',
        name: 'Control',
        description: 'Original ad creative',
        metrics: {
          ctr: 0,
          cpc: 0,
          conversionRate: 0,
          revenue: 0
        }
      },
      {
        id: 'variant_b',
        name: 'Video',
        description: 'Video ad creative',
        metrics: {
          ctr: 0,
          cpc: 0,
          conversionRate: 0,
          revenue: 0
        }
      }
    ],
    results: {
      totalParticipants: 0,
      totalConversions: 0,
      totalRevenue: 0,
      duration: 0
    }
  },
  {
    id: 'test_4',
    name: 'Pricing Page Test',
    description: 'Testing different pricing page layouts',
    status: 'completed',
    winner: 'variant_a',
    lift: -5.2,
    significance: 0.89,
    confidence: 'medium',
    startDate: '2024-01-08T00:00:00Z',
    endDate: '2024-01-15T00:00:00Z',
    participants: 3000,
    variants: [
      {
        id: 'variant_a',
        name: 'Control',
        description: 'Original pricing layout',
        metrics: {
          conversionRate: 4.2,
          revenue: 21000
        }
      },
      {
        id: 'variant_b',
        name: 'Simplified',
        description: 'Simplified pricing layout',
        metrics: {
          conversionRate: 4.0,
          revenue: 19900
        }
      }
    ],
    results: {
      totalParticipants: 3000,
      totalConversions: 126,
      totalRevenue: 40900,
      duration: 7
    }
  }
];

export default function ABTestsDashboard() {
  const t = useTranslations('ABTestsDashboard');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTests = mockABTests.filter(test => {
    if (filterStatus === 'all') return true;
    return test.status === filterStatus;
  });

  const sortedTests = [...filteredTests].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const paginatedTests = sortedTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedTests.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getLiftColor = (lift: number) => {
    if (lift > 0) return 'text-green-600';
    if (lift < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getLiftIcon = (lift: number) => {
    if (lift > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (lift < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Target className="h-4 w-4 text-gray-500" />;
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
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t('exportReport')}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('createTest')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalTests')}</CardTitle>
            <Target className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockABTests.length}</div>
            <p className="text-xs text-gray-500">All tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('runningTests')}</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockABTests.filter(t => t.status === 'running').length}
            </div>
            <p className="text-xs text-gray-500">Active tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('completedTests')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockABTests.filter(t => t.status === 'completed').length}
            </div>
            <p className="text-xs text-gray-500">Finished tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('avgLift')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockABTests
                .filter(t => t.status === 'completed')
                .reduce((sum, t) => sum + t.lift, 0) / 
                mockABTests.filter(t => t.status === 'completed').length || 0}%
            </div>
            <p className="text-xs text-gray-500">Average lift</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('testsList')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                {t('all')}
              </Button>
              <Button
                variant={filterStatus === 'running' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('running')}
              >
                {t('running')}
              </Button>
              <Button
                variant={filterStatus === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('completed')}
              >
                {t('completed')}
              </Button>
              <Button
                variant={filterStatus === 'draft' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('draft')}
              >
                {t('draft')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedTests.map((test) => (
              <div
                key={test.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {test.name}
                      </h3>
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      {test.winner && (
                        <Badge className="text-yellow-600 bg-yellow-100">
                          <Trophy className="h-3 w-3 mr-1" />
                          Winner: {test.winner}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{test.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">{t('participants')}:</span>
                        <span className="ml-1 font-medium">{test.participants.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">{t('duration')}:</span>
                        <span className="ml-1 font-medium">{test.results.duration} days</span>
                      </div>
                      <div>
                        <span className="text-gray-500">{t('lift')}:</span>
                        <span className={`ml-1 font-medium ${getLiftColor(test.lift)}`}>
                          {test.lift > 0 ? '+' : ''}{test.lift}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">{t('significance')}:</span>
                        <span className="ml-1 font-medium">{(test.significance * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTest(test)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Variants Summary */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {test.variants.map((variant) => (
                    <div key={variant.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{variant.name}</h4>
                        {test.winner === variant.id && (
                          <Trophy className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{variant.description}</p>
                      <div className="space-y-1 text-xs">
                        {'openRate' in variant.metrics && variant.metrics.openRate && (
                          <div className="flex justify-between">
                            <span>Open Rate:</span>
                            <span className="font-medium">{variant.metrics.openRate}%</span>
                          </div>
                        )}
                        {'clickRate' in variant.metrics && variant.metrics.clickRate && (
                          <div className="flex justify-between">
                            <span>Click Rate:</span>
                            <span className="font-medium">{variant.metrics.clickRate}%</span>
                          </div>
                        )}
                        {'conversionRate' in variant.metrics && variant.metrics.conversionRate && (
                          <div className="flex justify-between">
                            <span>Conversion:</span>
                            <span className="font-medium">{variant.metrics.conversionRate}%</span>
                          </div>
                        )}
                        {'revenue' in variant.metrics && variant.metrics.revenue && (
                          <div className="flex justify-between">
                            <span>Revenue:</span>
                            <span className="font-medium">${variant.metrics.revenue.toLocaleString()}</span>
                          </div>
                        )}
                        {'ctr' in variant.metrics && variant.metrics.ctr && (
                          <div className="flex justify-between">
                            <span>CTR:</span>
                            <span className="font-medium">{variant.metrics.ctr}%</span>
                          </div>
                        )}
                        {'cpc' in variant.metrics && variant.metrics.cpc && (
                          <div className="flex justify-between">
                            <span>CPC:</span>
                            <span className="font-medium">${variant.metrics.cpc}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedTests.length)} of {sortedTests.length} tests
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Details Modal */}
      {selectedTest && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedTest.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{selectedTest.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTest(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">{t('status')}</div>
                  <Badge className={getStatusColor(selectedTest.status)}>
                    {selectedTest.status}
                  </Badge>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">{t('participants')}</div>
                  <div className="text-lg font-semibold">{selectedTest.participants.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">{t('lift')}</div>
                  <div className={`text-lg font-semibold ${getLiftColor(selectedTest.lift)}`}>
                    {selectedTest.lift > 0 ? '+' : ''}{selectedTest.lift}%
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">{t('significance')}</div>
                  <div className="text-lg font-semibold">{(selectedTest.significance * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* Variants Comparison */}
              <div>
                <h3 className="font-medium mb-3">{t('variantsComparison')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedTest.variants.map((variant: any) => (
                    <div key={variant.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{variant.name}</h4>
                        {selectedTest.winner === variant.id && (
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{variant.description}</p>
                      <div className="space-y-2">
                        {Object.entries(variant.metrics).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600">{key}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedTest(null)}>
                  {t('close')}
                </Button>
                <Button>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {t('viewDetails')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  );
}
