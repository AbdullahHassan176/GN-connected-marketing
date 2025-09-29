'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui';
import { WeeklyAISummary } from '@/components/ai-summary/weekly-summary';
import { 
  ArrowLeft,
  Settings,
  Share,
  MoreHorizontal,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  BarChart3,
  TestTube,
  Heart,
  Kanban,
  FileText,
  CheckCircle,
  MessageSquare,
  Star,
  Activity,
  Zap,
  Download
} from 'lucide-react';
import { withAuth } from '@/components/auth/withAuth';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock data for project detail
const mockProjectData = {
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
    ctr: 4.0,
    conversionRate: 2.5,
  },
  team: [
    { id: '1', name: 'Marcus Chen', role: 'Project Manager', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg' },
    { id: '2', name: 'Emma Rodriguez', role: 'Creative Director', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg' },
    { id: '3', name: 'Sarah Mitchell', role: 'Account Director', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg' },
  ],
  recentActivity: [
    { id: '1', type: 'milestone', title: 'Campaign Launch', description: 'Successfully launched the campaign', timestamp: '2 hours ago', user: 'Marcus Chen' },
    { id: '2', type: 'approval', title: 'Creative Approved', description: 'Final creative assets approved by client', timestamp: '4 hours ago', user: 'Emma Rodriguez' },
    { id: '3', type: 'insight', title: 'Performance Insight', description: 'AI generated new performance insights', timestamp: '6 hours ago', user: 'AI Assistant' },
  ],
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  planning: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  paused: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

function ProjectDetailPageContent() {
  const t = useTranslations('projects');
  const params = useParams();
  const projectId = params.id as string;

  const handleExport = async (format: 'pdf' | 'xlsx') => {
    try {
      const response = await fetch(`/api/projects/${projectId}/export/${format}`);
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${mockProjectData.name.replace(/\s+/g, '_')}_Report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export report. Please try again.');
    }
  };

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
      month: 'long',
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
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{mockProjectData.name}</h1>
            <p className="text-gray-600 mt-1">{mockProjectData.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('xlsx')}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Project Status and Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <Badge className={statusColors[mockProjectData.status as keyof typeof statusColors]}>
                  {mockProjectData.status}
                </Badge>
              </div>
              <Target className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold">{mockProjectData.progress}%</p>
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(mockProjectData.progress)}`}
                  style={{ width: `${mockProjectData.progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget</p>
                <p className="text-2xl font-bold">{formatCurrency(mockProjectData.budget)}</p>
                <p className="text-sm text-gray-500">Spent: {formatCurrency(mockProjectData.spent)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="storyboard" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Storyboard
          </TabsTrigger>
          <TabsTrigger value="kpis" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            KPIs
          </TabsTrigger>
          <TabsTrigger value="ab-tests" className="flex items-center">
            <TestTube className="mr-2 h-4 w-4" />
            A/B Tests
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            Sentiment
          </TabsTrigger>
          <TabsTrigger value="work" className="flex items-center">
            <Kanban className="mr-2 h-4 w-4" />
            Work
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="approvals" className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            Approvals
          </TabsTrigger>
          <TabsTrigger value="room" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Room
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* AI Summary */}
          <WeeklyAISummary />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Start Date</p>
                    <p className="text-sm text-gray-900">{formatDate(mockProjectData.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">End Date</p>
                    <p className="text-sm text-gray-900">{formatDate(mockProjectData.endDate)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Manager</p>
                  <p className="text-sm text-gray-900">{mockProjectData.manager}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Size</p>
                  <p className="text-sm text-gray-900">{mockProjectData.teamSize} members</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mockProjectData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockProjectData.team.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProjectData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'milestone' && <Target className="h-5 w-5 text-green-500" />}
                      {activity.type === 'approval' && <CheckCircle className="h-5 w-5 text-blue-500" />}
                      {activity.type === 'insight' && <Zap className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KPIs Tab */}
        <TabsContent value="kpis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Impressions</CardTitle>
                <BarChart3 className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockProjectData.kpis.impressions.toLocaleString()}</div>
                <p className="text-xs text-green-600">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Clicks</CardTitle>
                <Activity className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockProjectData.kpis.clicks.toLocaleString()}</div>
                <p className="text-xs text-green-600">+8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Conversions</CardTitle>
                <Target className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockProjectData.kpis.conversions.toLocaleString()}</div>
                <p className="text-xs text-green-600">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(mockProjectData.kpis.revenue)}</div>
                <p className="text-xs text-green-600">+24% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Other tabs with placeholder content */}
        <TabsContent value="storyboard">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Storyboard</h3>
                <p className="mt-1 text-sm text-gray-500">Visual campaign storyboard will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ab-tests">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <TestTube className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">A/B Tests</h3>
                <p className="mt-1 text-sm text-gray-500">A/B test results and experiments will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Heart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Sentiment Analysis</h3>
                <p className="mt-1 text-sm text-gray-500">Brand sentiment analysis and social media insights will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Kanban className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Work Board</h3>
                <p className="mt-1 text-sm text-gray-500">Kanban board with work items and tasks will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Assets</h3>
                <p className="mt-1 text-sm text-gray-500">Project assets and files will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Approvals</h3>
                <p className="mt-1 text-sm text-gray-500">Approval requests and workflow will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="room">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Project Room</h3>
                <p className="mt-1 text-sm text-gray-500">Team collaboration and communication will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAuth(ProjectDetailPageContent, {
  requiredRole: { scope: 'project', scopeId: 'proj_456', role: 'client' },
  redirectTo: '/unauthorized',
});
