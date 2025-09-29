'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Bar, Legend, ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Users,
  Eye,
  MousePointer,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Activity
} from 'lucide-react';

// Mock data for insights dashboard
const mockInsightsData = {
  kpis: [
    {
      name: 'CTR',
      actual: 3.2,
      forecast: 2.8,
      confidence: 0.85,
      trend: 'up',
      change: 14.3,
      unit: '%'
    },
    {
      name: 'ROI',
      actual: 180,
      forecast: 165,
      confidence: 0.92,
      trend: 'up',
      change: 9.1,
      unit: '%'
    },
    {
      name: 'Engagement',
      actual: 12.5,
      forecast: 11.2,
      confidence: 0.78,
      trend: 'up',
      change: 11.6,
      unit: '%'
    },
    {
      name: 'Conversions',
      actual: 7500,
      forecast: 6800,
      confidence: 0.88,
      trend: 'up',
      change: 10.3,
      unit: ''
    }
  ],
  performanceData: [
    { date: '2024-01-01', actual: 2.1, forecast: 2.0, confidenceUpper: 2.3, confidenceLower: 1.7, revenue: 45000 },
    { date: '2024-01-02', actual: 2.3, forecast: 2.1, confidenceUpper: 2.5, confidenceLower: 1.8, revenue: 52000 },
    { date: '2024-01-03', actual: 2.5, forecast: 2.2, confidenceUpper: 2.7, confidenceLower: 1.9, revenue: 58000 },
    { date: '2024-01-04', actual: 2.8, forecast: 2.3, confidenceUpper: 3.0, confidenceLower: 2.0, revenue: 65000 },
    { date: '2024-01-05', actual: 3.0, forecast: 2.4, confidenceUpper: 3.2, confidenceLower: 2.1, revenue: 72000 },
    { date: '2024-01-06', actual: 3.2, forecast: 2.5, confidenceUpper: 3.4, confidenceLower: 2.2, revenue: 78000 },
    { date: '2024-01-07', actual: 3.1, forecast: 2.6, confidenceUpper: 3.3, confidenceLower: 2.3, revenue: 75000 },
    { date: '2024-01-08', actual: 3.4, forecast: 2.7, confidenceUpper: 3.6, confidenceLower: 2.4, revenue: 82000 },
    { date: '2024-01-09', actual: 3.6, forecast: 2.8, confidenceUpper: 3.8, confidenceLower: 2.5, revenue: 88000 },
    { date: '2024-01-10', actual: 3.8, forecast: 2.9, confidenceUpper: 4.0, confidenceLower: 2.6, revenue: 95000 }
  ],
  channelPerformance: [
    { channel: 'Google Ads', actual: 4.2, forecast: 3.8, confidence: 0.89, spend: 25000, conversions: 1200 },
    { channel: 'Facebook', actual: 3.1, forecast: 2.9, confidence: 0.82, spend: 18000, conversions: 950 },
    { channel: 'Instagram', actual: 2.8, forecast: 2.6, confidence: 0.76, spend: 12000, conversions: 680 },
    { channel: 'LinkedIn', actual: 1.9, forecast: 1.8, confidence: 0.71, spend: 8000, conversions: 420 },
    { channel: 'Twitter', actual: 2.2, forecast: 2.0, confidence: 0.68, spend: 6000, conversions: 380 }
  ],
  forecasts: [
    {
      metric: 'CTR',
      current: 3.2,
      forecast7d: 3.5,
      forecast30d: 3.8,
      confidence: 0.85,
      trend: 'up'
    },
    {
      metric: 'ROI',
      current: 180,
      forecast7d: 195,
      forecast30d: 210,
      confidence: 0.92,
      trend: 'up'
    },
    {
      metric: 'Engagement',
      current: 12.5,
      forecast7d: 13.2,
      forecast30d: 14.1,
      confidence: 0.78,
      trend: 'up'
    },
    {
      metric: 'Conversions',
      current: 7500,
      forecast7d: 8200,
      forecast30d: 9200,
      confidence: 0.88,
      trend: 'up'
    }
  ]
};

export default function InsightsDashboard() {
  const t = useTranslations('InsightsDashboard');
  const [selectedMetric, setSelectedMetric] = useState('CTR');
  const [timeRange, setTimeRange] = useState('30d');
  const [showConfidence, setShowConfidence] = useState(true);

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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.8) return 'Medium';
    return 'Low';
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
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('refreshData')}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {mockInsightsData.kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
              {getTrendIcon(kpi.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.actual}{kpi.unit}</div>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-sm ${getTrendColor(kpi.trend)}`}>
                  {kpi.change > 0 ? '+' : ''}{kpi.change}%
                </span>
                <Badge variant="outline" className={getConfidenceColor(kpi.confidence)}>
                  {getConfidenceLabel(kpi.confidence)}
                </Badge>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Forecast: {kpi.forecast}{kpi.unit}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              {t('performanceTrends')}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={showConfidence ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowConfidence(!showConfidence)}
              >
                {t('confidenceBands')}
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('filters')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mockInsightsData.performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                
                {/* Confidence Band */}
                {showConfidence && (
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="confidenceUpper"
                    stroke="none"
                    fill="#e0f2fe"
                    fillOpacity={0.3}
                  />
                )}
                {showConfidence && (
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="confidenceLower"
                    stroke="none"
                    fill="#ffffff"
                  />
                )}
                
                {/* Actual vs Forecast Lines */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="actual"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  name="Actual"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="forecast"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#64748b', strokeWidth: 2, r: 3 }}
                  name="Forecast"
                />
                
                {/* Revenue Bars */}
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  fill="#10b981"
                  fillOpacity={0.3}
                  name="Revenue ($)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Channel Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            {t('channelPerformance')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInsightsData.channelPerformance.map((channel, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{channel.channel}</h3>
                    <p className="text-sm text-gray-600">
                      ${channel.spend.toLocaleString()} spend • {channel.conversions} conversions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {channel.actual}%
                    </div>
                    <div className="text-xs text-gray-500">Actual CTR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-600">
                      {channel.forecast}%
                    </div>
                    <div className="text-xs text-gray-500">Forecast</div>
                  </div>
                  <div className="text-center">
                    <Badge className={getConfidenceColor(channel.confidence)}>
                      {getConfidenceLabel(channel.confidence)}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">Confidence</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            {t('forecasts')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockInsightsData.forecasts.map((forecast, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{forecast.metric}</h3>
                  {getTrendIcon(forecast.trend)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current:</span>
                    <span className="font-medium">{forecast.current}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">7d Forecast:</span>
                    <span className="font-medium text-blue-600">{forecast.forecast7d}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">30d Forecast:</span>
                    <span className="font-medium text-green-600">{forecast.forecast30d}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Confidence:</span>
                    <Badge variant="outline" className={getConfidenceColor(forecast.confidence)}>
                      {getConfidenceLabel(forecast.confidence)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            {t('keyInsights')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-green-900 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('positiveInsights')}
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>CTR is performing 14.3% above forecast with high confidence (85%)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>ROI is exceeding expectations by 9.1% across all channels</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Google Ads channel showing strongest performance with 4.2% CTR</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-yellow-900 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {t('recommendations')}
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <span>Consider increasing budget for Google Ads due to strong performance</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <span>LinkedIn channel needs optimization - CTR below forecast</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <span>Monitor confidence bands for early trend detection</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
