'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { KPIStat, KPIStatIcons } from '@repo/ui';
import { StageTracker, createStages } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  Share2, 
  TrendingUp, 
  Users, 
  Heart, 
  MessageSquare, 
  Target,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';

// Mock data for the client dashboard
const mockProject = {
  id: 'proj_premium_hotels',
  name: 'Premium Hotels - Seasonal Campaign',
  client: 'Premium Hotels Group',
  logo: '/api/placeholder/120/60',
  aiTagline: 'Crafting luxury experiences that convert wanderlust into bookings',
  status: 'active',
  timeline: {
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    currentStage: 'content',
    stages: [
      { name: 'Strategy', completed: true, date: '2024-01-15', description: 'Campaign strategy defined' },
      { name: 'Content', current: true, description: 'Creating compelling content' },
      { name: 'Distribution', description: 'Multi-channel distribution' },
      { name: 'Ads', description: 'Targeted advertising campaigns' },
      { name: 'Insights', description: 'Performance analysis' }
    ]
  },
  kpis: {
    ctr: 3.2,
    roi: 340,
    engagement: 78,
    sentiment: 4.6,
    conversions: 1250,
    revenue: 125000
  },
  charts: {
    performance: [
      { month: 'Jan', ctr: 2.1, roi: 280, engagement: 65 },
      { month: 'Feb', ctr: 2.8, roi: 320, engagement: 72 },
      { month: 'Mar', ctr: 3.2, roi: 340, engagement: 78 }
    ],
    sentiment: [
      { name: 'Positive', value: 65, color: '#10b981' },
      { name: 'Neutral', value: 25, color: '#f59e0b' },
      { name: 'Negative', value: 10, color: '#ef4444' }
    ],
    channels: [
      { channel: 'Social Media', conversions: 450, revenue: 45000 },
      { channel: 'Email', conversions: 320, revenue: 32000 },
      { channel: 'Search', conversions: 280, revenue: 28000 },
      { channel: 'Display', conversions: 200, revenue: 20000 }
    ]
  },
  toolsUsed: [
    { name: 'AI Content Generator', usage: '12 hours', lastUsed: '2 hours ago' },
    { name: 'Sentiment Analyzer', usage: '8 hours', lastUsed: '1 day ago' },
    { name: 'Campaign Optimizer', usage: '6 hours', lastUsed: '3 hours ago' },
    { name: 'A/B Test Manager', usage: '4 hours', lastUsed: '5 hours ago' }
  ],
  storyboard: {
    chapters: [
      {
        id: 'ch1',
        title: 'The Arrival Experience',
        status: 'completed',
        aiDraft: 'Luxury begins the moment guests step through our doors...',
        humanNotes: 'Focus on the emotional journey of first impressions',
        assets: ['hero-image.jpg', 'welcome-video.mp4']
      },
      {
        id: 'ch2',
        title: 'Culinary Excellence',
        status: 'in-progress',
        aiDraft: 'Our Michelin-starred chefs craft experiences that...',
        humanNotes: 'Emphasize the farm-to-table philosophy',
        assets: ['chef-portrait.jpg']
      },
      {
        id: 'ch3',
        title: 'Unforgettable Moments',
        status: 'draft',
        aiDraft: 'Every stay should create memories that last a lifetime...',
        humanNotes: '',
        assets: []
      }
    ]
  }
};

export default function ClientDashboard() {
  const t = useTranslations('ClientDashboard');
  const { data: session } = useSession();

  const projectStages = createStages(mockProject.timeline.stages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Personalized Welcome Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <img 
                  src={mockProject.logo} 
                  alt={`${mockProject.client} logo`}
                  className="h-12 w-auto"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Welcome back, {session?.user?.name || 'Client'}
                </h1>
                <div className="flex items-center space-x-2 mt-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <p className="text-lg text-slate-600 italic">
                    "{mockProject.aiTagline}"
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="success" className="text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                Active Campaign
              </Badge>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stage Tracker */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Campaign Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StageTracker
              stages={projectStages}
              orientation="horizontal"
              showConnector={true}
            />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Started: {new Date(mockProject.timeline.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Expected: {new Date(mockProject.timeline.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>On track for completion</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KPIStat
            title="Click-Through Rate"
            value={`${mockProject.kpis.ctr}%`}
            change={{ value: 12, label: "vs last month", positive: true }}
            icon={KPIStatIcons.conversion}
            description="Average CTR across all channels"
          />
          <KPIStat
            title="ROI"
            value={`${mockProject.kpis.roi}%`}
            change={{ value: 8, label: "vs last month", positive: true }}
            icon={KPIStatIcons.revenue}
            description="Return on investment"
          />
          <KPIStat
            title="Engagement Rate"
            value={`${mockProject.kpis.engagement}%`}
            change={{ value: 15, label: "vs last month", positive: true }}
            icon={KPIStatIcons.engagement}
            description="Audience engagement level"
          />
          <KPIStat
            title="Sentiment Score"
            value={`${mockProject.kpis.sentiment}/5`}
            change={{ value: 0.3, label: "vs last month", positive: true }}
            icon={<Heart className="h-5 w-5" />}
            description="Brand sentiment analysis"
          />
          <KPIStat
            title="Conversions"
            value={mockProject.kpis.conversions.toLocaleString()}
            change={{ value: 18, label: "vs last month", positive: true }}
            icon={<Target className="h-5 w-5" />}
            description="Total conversions achieved"
          />
          <KPIStat
            title="Revenue Generated"
            value={`$${mockProject.kpis.revenue.toLocaleString()}`}
            change={{ value: 22, label: "vs last month", positive: true }}
            icon={KPIStatIcons.revenue}
            description="Revenue from campaign"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockProject.charts.performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="ctr" stroke="#3b82f6" strokeWidth={2} name="CTR %" />
                  <Line type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={2} name="ROI %" />
                  <Line type="monotone" dataKey="engagement" stroke="#f59e0b" strokeWidth={2} name="Engagement %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sentiment Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockProject.charts.sentiment}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockProject.charts.sentiment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Channel Performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockProject.charts.channels}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="conversions" fill="#3b82f6" name="Conversions" />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Transparency Panel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Tools Used This Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockProject.toolsUsed.map((tool, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-2">{tool.name}</h4>
                  <div className="space-y-1 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Usage:</span>
                      <span className="font-medium">{tool.usage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last used:</span>
                      <span className="font-medium">{tool.lastUsed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Storyboard View */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Campaign Storyboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockProject.storyboard.chapters.map((chapter) => (
                <div key={chapter.id} className="border border-slate-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{chapter.title}</h3>
                      <Badge 
                        variant={chapter.status === 'completed' ? 'success' : chapter.status === 'in-progress' ? 'warning' : 'secondary'}
                        className="mt-2"
                      >
                        {chapter.status === 'completed' ? 'Completed' : chapter.status === 'in-progress' ? 'In Progress' : 'Draft'}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">AI Draft</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-slate-700 italic">"{chapter.aiDraft}"</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Human Notes</h4>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        {chapter.humanNotes ? (
                          <p className="text-sm text-slate-700">"{chapter.humanNotes}"</p>
                        ) : (
                          <p className="text-sm text-slate-500 italic">No notes yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {chapter.assets.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-slate-900 mb-2">Assets</h4>
                      <div className="flex space-x-2">
                        {chapter.assets.map((asset, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle>Export & Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Download className="h-6 w-6" />
                <span>Export Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Share2 className="h-6 w-6" />
                <span>Share Dashboard</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <MessageSquare className="h-6 w-6" />
                <span>Export Storyboard</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
