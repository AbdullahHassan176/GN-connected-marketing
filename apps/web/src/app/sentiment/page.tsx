'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { 
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Users,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// Mock data for sentiment analysis
const mockSentimentData = {
  overall: {
    positive: 65,
    neutral: 25,
    negative: 10,
    trend: 'up',
    change: 8.2
  },
  channels: [
    { name: 'Google Ads', positive: 72, neutral: 20, negative: 8, volume: 1250 },
    { name: 'Facebook', positive: 68, neutral: 22, negative: 10, volume: 980 },
    { name: 'Instagram', positive: 75, neutral: 18, negative: 7, volume: 850 },
    { name: 'LinkedIn', positive: 58, neutral: 30, negative: 12, volume: 420 },
    { name: 'Twitter', positive: 45, neutral: 35, negative: 20, volume: 680 }
  ],
  timeBuckets: [
    { date: '2024-01-22', positive: 68, neutral: 22, negative: 10, volume: 450 },
    { date: '2024-01-23', positive: 72, neutral: 20, negative: 8, volume: 520 },
    { date: '2024-01-24', positive: 65, neutral: 25, negative: 10, volume: 480 },
    { date: '2024-01-25', positive: 70, neutral: 22, negative: 8, volume: 550 },
    { date: '2024-01-26', positive: 75, neutral: 18, negative: 7, volume: 620 },
    { date: '2024-01-27', positive: 68, neutral: 24, negative: 8, volume: 580 },
    { date: '2024-01-28', positive: 72, neutral: 20, negative: 8, volume: 610 }
  ],
  heatmapData: [
    { channel: 'Google Ads', time: '00:00', sentiment: 0.75, volume: 45 },
    { channel: 'Google Ads', time: '06:00', sentiment: 0.68, volume: 120 },
    { channel: 'Google Ads', time: '12:00', sentiment: 0.82, volume: 180 },
    { channel: 'Google Ads', time: '18:00', sentiment: 0.78, volume: 150 },
    { channel: 'Facebook', time: '00:00', sentiment: 0.65, volume: 35 },
    { channel: 'Facebook', time: '06:00', sentiment: 0.72, volume: 95 },
    { channel: 'Facebook', time: '12:00', sentiment: 0.80, volume: 140 },
    { channel: 'Facebook', time: '18:00', sentiment: 0.75, volume: 125 },
    { channel: 'Instagram', time: '00:00', sentiment: 0.70, volume: 30 },
    { channel: 'Instagram', time: '06:00', sentiment: 0.78, volume: 80 },
    { channel: 'Instagram', time: '12:00', sentiment: 0.85, volume: 120 },
    { channel: 'Instagram', time: '18:00', sentiment: 0.82, volume: 110 },
    { channel: 'LinkedIn', time: '00:00', sentiment: 0.55, volume: 15 },
    { channel: 'LinkedIn', time: '06:00', sentiment: 0.62, volume: 40 },
    { channel: 'LinkedIn', time: '12:00', sentiment: 0.70, volume: 60 },
    { channel: 'LinkedIn', time: '18:00', sentiment: 0.68, volume: 50 },
    { channel: 'Twitter', time: '00:00', sentiment: 0.40, volume: 25 },
    { channel: 'Twitter', time: '06:00', sentiment: 0.48, volume: 55 },
    { channel: 'Twitter', time: '12:00', sentiment: 0.52, volume: 80 },
    { channel: 'Twitter', time: '18:00', sentiment: 0.45, volume: 70 }
  ],
  insights: [
    {
      type: 'positive',
      title: 'Strong Performance on Instagram',
      description: 'Instagram shows the highest positive sentiment at 75%',
      impact: 'high'
    },
    {
      type: 'negative',
      title: 'Twitter Sentiment Concerns',
      description: 'Twitter has the lowest sentiment at 45% - needs attention',
      impact: 'medium'
    },
    {
      type: 'neutral',
      title: 'LinkedIn Steady Performance',
      description: 'LinkedIn maintains consistent but moderate sentiment',
      impact: 'low'
    }
  ]
};

export default function SentimentDashboard() {
  const t = useTranslations('SentimentDashboard');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('sentiment');

  const getSentimentColor = (value: number) => {
    if (value >= 0.7) return 'bg-green-500';
    if (value >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSentimentTextColor = (value: number) => {
    if (value >= 0.7) return 'text-green-600';
    if (value >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentLabel = (value: number) => {
    if (value >= 0.7) return 'Positive';
    if (value >= 0.5) return 'Neutral';
    return 'Negative';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  const filteredHeatmapData = mockSentimentData.heatmapData.filter(item => {
    if (selectedChannel === 'all') return true;
    return item.channel === selectedChannel;
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
            <Download className="h-4 w-4 mr-2" />
            {t('exportReport')}
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('refreshData')}
          </Button>
        </div>
      </div>

      {/* Overall Sentiment */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('positiveSentiment')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockSentimentData.overall.positive}%</div>
            <p className="text-xs text-gray-500">Positive feedback</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('neutralSentiment')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mockSentimentData.overall.neutral}%</div>
            <p className="text-xs text-gray-500">Neutral feedback</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('negativeSentiment')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mockSentimentData.overall.negative}%</div>
            <p className="text-xs text-gray-500">Negative feedback</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('sentimentTrend')}</CardTitle>
            {getTrendIcon(mockSentimentData.overall.trend)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getTrendColor(mockSentimentData.overall.trend)}`}>
              +{mockSentimentData.overall.change}%
            </div>
            <p className="text-xs text-gray-500">vs last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('sentimentAnalysis')}</CardTitle>
            <div className="flex items-center space-x-2">
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">{t('allChannels')}</option>
                {mockSentimentData.channels.map((channel) => (
                  <option key={channel.name} value={channel.name}>
                    {channel.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="24h">{t('last24Hours')}</option>
                <option value="7d">{t('last7Days')}</option>
                <option value="30d">{t('last30Days')}</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('moreFilters')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Channel Performance */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">{t('channelPerformance')}</h3>
            <div className="space-y-3">
              {mockSentimentData.channels.map((channel) => (
                <div key={channel.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{channel.name}</h4>
                      <p className="text-sm text-gray-600">{channel.volume} mentions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getSentimentTextColor(channel.positive / 100)}`}>
                        {channel.positive}%
                      </div>
                      <div className="text-xs text-gray-500">Positive</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-600">
                        {channel.neutral}%
                      </div>
                      <div className="text-xs text-gray-500">Neutral</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">
                        {channel.negative}%
                      </div>
                      <div className="text-xs text-gray-500">Negative</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap */}
          <div>
            <h3 className="font-medium mb-3">{t('sentimentHeatmap')}</h3>
            <div className="grid grid-cols-5 gap-2">
              {/* Header */}
              <div className="text-sm font-medium text-gray-600 text-center py-2">Channel</div>
              <div className="text-sm font-medium text-gray-600 text-center py-2">00:00</div>
              <div className="text-sm font-medium text-gray-600 text-center py-2">06:00</div>
              <div className="text-sm font-medium text-gray-600 text-center py-2">12:00</div>
              <div className="text-sm font-medium text-gray-600 text-center py-2">18:00</div>
              
              {/* Data Rows */}
              {['Google Ads', 'Facebook', 'Instagram', 'LinkedIn', 'Twitter'].map((channel) => (
                <div key={channel} className="contents">
                  <div className="text-sm font-medium text-gray-900 py-2">{channel}</div>
                  {['00:00', '06:00', '12:00', '18:00'].map((time) => {
                    const data = filteredHeatmapData.find(d => d.channel === channel && d.time === time);
                    const sentiment = data?.sentiment || 0;
                    const volume = data?.volume || 0;
                    return (
                      <div
                        key={`${channel}-${time}`}
                        className={`${getSentimentColor(sentiment)} text-white text-center py-2 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                        title={`Sentiment: ${(sentiment * 100).toFixed(1)}%, Volume: ${volume}`}
                      >
                        <div className="text-xs font-medium">{(sentiment * 100).toFixed(0)}%</div>
                        <div className="text-xs opacity-75">{volume}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Series */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            {t('sentimentOverTime')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSentimentData.timeBuckets.map((bucket) => (
              <div key={bucket.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(bucket.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {bucket.volume} mentions
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {bucket.positive}%
                    </div>
                    <div className="text-xs text-gray-500">Positive</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-yellow-600">
                      {bucket.neutral}%
                    </div>
                    <div className="text-xs text-gray-500">Neutral</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">
                      {bucket.negative}%
                    </div>
                    <div className="text-xs text-gray-500">Negative</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            {t('insights')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockSentimentData.insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {insight.type === 'positive' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {insight.type === 'negative' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  {insight.type === 'neutral' && <Activity className="h-4 w-4 text-yellow-500" />}
                  <h3 className="font-medium text-gray-900">{insight.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                <Badge className={getImpactColor(insight.impact)}>
                  {insight.impact} impact
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
