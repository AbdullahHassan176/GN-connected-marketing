import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Badge } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';

// Mock data for AI summary
const mockSummaryData = {
  week: '2024-01-22 to 2024-01-28',
  projectId: 'proj_premium_hotels',
  projectName: 'Premium Hotels - Seasonal Campaign',
  generatedAt: '2024-01-28T18:00:00Z',
  insights: {
    performance: {
      trend: 'up',
      change: 15.2,
      description: 'Campaign performance improved significantly this week'
    },
    engagement: {
      trend: 'up',
      change: 8.7,
      description: 'User engagement increased across all channels'
    },
    team: {
      activity: 'high',
      messages: 47,
      files: 12,
      approvals: 3
    },
    risks: [
      {
        type: 'budget',
        severity: 'medium',
        description: 'Campaign budget is 78% utilized with 2 weeks remaining'
      },
      {
        type: 'timeline',
        severity: 'low',
        description: 'Content delivery is on track but requires final approval'
      }
    ],
    recommendations: [
      {
        type: 'optimization',
        priority: 'high',
        description: 'Increase ad spend on high-performing channels by 20%'
      },
      {
        type: 'content',
        priority: 'medium',
        description: 'Create additional video content for social media'
      },
      {
        type: 'team',
        priority: 'low',
        description: 'Schedule team review meeting for next week'
      }
    ]
  },
  events: [
    {
      id: 'event_1',
      type: 'milestone',
      title: 'Campaign Launch',
      description: 'Premium Hotels seasonal campaign went live',
      timestamp: '2024-01-22T09:00:00Z',
      impact: 'positive'
    },
    {
      id: 'event_2',
      type: 'performance',
      title: 'CTR Improvement',
      description: 'Click-through rate increased from 2.1% to 3.2%',
      timestamp: '2024-01-24T14:30:00Z',
      impact: 'positive'
    },
    {
      id: 'event_3',
      type: 'team',
      title: 'Team Meeting',
      description: 'Weekly campaign review meeting held',
      timestamp: '2024-01-25T10:00:00Z',
      impact: 'neutral'
    },
    {
      id: 'event_4',
      type: 'content',
      title: 'Asset Delivery',
      description: 'New creative assets delivered by Emma Rodriguez',
      timestamp: '2024-01-26T16:45:00Z',
      impact: 'positive'
    },
    {
      id: 'event_5',
      type: 'approval',
      title: 'Budget Approval',
      description: 'Additional $25,000 budget approved for campaign',
      timestamp: '2024-01-28T11:20:00Z',
      impact: 'positive'
    }
  ],
  metrics: {
    messages: 47,
    files: 12,
    approvals: 3,
    completed: 8,
    pending: 5,
    teamActivity: 92
  }
};

export function WeeklyAISummary() {
  const t = useTranslations('WeeklyAISummary');

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'performance':
        return <BarChart3 className="h-4 w-4 text-green-500" />;
      case 'team':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'content':
        return <FileText className="h-4 w-4 text-orange-500" />;
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <CardTitle>{t('title')}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {t('generatedBy')} AI
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          {t('weekOf')} {mockSummaryData.week}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Insights */}
        <div>
          <h3 className="font-medium mb-3">{t('keyInsights')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                {getTrendIcon(mockSummaryData.insights.performance.trend)}
                <span className="font-medium text-green-900">{t('performance')}</span>
              </div>
              <div className={`text-lg font-semibold ${getTrendColor(mockSummaryData.insights.performance.trend)}`}>
                +{mockSummaryData.insights.performance.change}%
              </div>
              <p className="text-sm text-green-700">
                {mockSummaryData.insights.performance.description}
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                {getTrendIcon(mockSummaryData.insights.engagement.trend)}
                <span className="font-medium text-blue-900">{t('engagement')}</span>
              </div>
              <div className={`text-lg font-semibold ${getTrendColor(mockSummaryData.insights.engagement.trend)}`}>
                +{mockSummaryData.insights.engagement.change}%
              </div>
              <p className="text-sm text-blue-700">
                {mockSummaryData.insights.engagement.description}
              </p>
            </div>
          </div>
        </div>

        {/* Team Activity */}
        <div>
          <h3 className="font-medium mb-3">{t('teamActivity')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-semibold">{mockSummaryData.metrics.messages}</div>
              <div className="text-xs text-gray-500">{t('messages')}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FileText className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-semibold">{mockSummaryData.metrics.files}</div>
              <div className="text-xs text-gray-500">{t('files')}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-lg font-semibold">{mockSummaryData.metrics.approvals}</div>
              <div className="text-xs text-gray-500">{t('approvals')}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Zap className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-lg font-semibold">{mockSummaryData.metrics.teamActivity}%</div>
              <div className="text-xs text-gray-500">{t('activity')}</div>
            </div>
          </div>
        </div>

        {/* Risks and Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Risks */}
          <div>
            <h3 className="font-medium mb-3 flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>{t('risks')}</span>
            </h3>
            <div className="space-y-2">
              {mockSummaryData.insights.risks.map((risk, index) => (
                <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{risk.type}</span>
                    <Badge className={getRiskColor(risk.severity)}>
                      {risk.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-yellow-700">{risk.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="font-medium mb-3 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span>{t('recommendations')}</span>
            </h3>
            <div className="space-y-2">
              {mockSummaryData.insights.recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{rec.type}</span>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div>
          <h3 className="font-medium mb-3">{t('recentEvents')}</h3>
          <div className="space-y-2">
            {mockSummaryData.events.map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                {getEventIcon(event.type)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">{event.title}</span>
                    <span className={`text-xs ${getImpactColor(event.impact)}`}>
                      {event.impact}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{t('generatedAt')} {new Date(mockSummaryData.generatedAt).toLocaleString()}</span>
            <span>{t('poweredBy')} AI</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
