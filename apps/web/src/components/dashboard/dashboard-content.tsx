'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Zap,
  MousePointer,
  DollarSign,
  Heart,
  ShoppingCart,
  Bot,
  PenTool,
  Image,
  Search,
  BarChart3
} from 'lucide-react';

export function DashboardContent() {
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-navy-900 via-navy-800 to-blue-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-blue-500/20 to-transparent rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, Ahmed!</h2>
              <p className="text-blue-200 text-lg">"Elevating Luxury Hospitality Through AI-Driven Marketing Excellence"</p>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-sm">Campaign Status</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 font-medium">Active</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300">78%</div>
              <div className="text-sm text-blue-200">Campaign Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">+24%</div>
              <div className="text-sm text-blue-200">ROI Increase</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-300">8</div>
              <div className="text-sm text-blue-200">AI Tools Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-300">12</div>
              <div className="text-sm text-blue-200">Days Remaining</div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Progress Tracker */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Campaign Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Strategy</h4>
                    <p className="text-sm text-gray-500">Complete</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Content</h4>
                    <p className="text-sm text-gray-500">Complete</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Distribution</h4>
                    <p className="text-sm text-blue-600">In Progress</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-400">Ads</h4>
                    <p className="text-sm text-gray-400">Upcoming</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-400">Insights</h4>
                    <p className="text-sm text-gray-400">Upcoming</p>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* AI Story & KPIs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI-Generated Story */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-purple-600" />
              <span>Your Brand Story</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Chapter 3: Digital Distribution</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your luxury hospitality brand is now reaching premium travelers across 12 digital touchpoints. 
                  Our AI-curated content is resonating with high-value guests, showing 34% higher engagement 
                  compared to industry benchmarks.
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>2.4M Impressions</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>18.5K Engagements</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>892 Shares</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">CTR</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-600">4.8%</div>
                <div className="text-xs text-green-600">+1.2% vs last month</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">ROI</span>
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-600">324%</div>
                <div className="text-xs text-blue-600">+24% vs target</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-700">Engagement</span>
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-purple-600">18.5K</div>
                <div className="text-xs text-purple-600">+34% vs industry</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-700">Conversions</span>
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-orange-600">847</div>
                <div className="text-xs text-orange-600">+18% vs last week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Tools Transparency */}
      <Card>
        <CardHeader>
          <CardTitle>AI Tools in Action</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <PenTool className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Jasper AI</h4>
                  <p className="text-xs text-gray-500">Copywriting</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Active</span>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Image className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Midjourney</h4>
                  <p className="text-xs text-gray-500">Visual Creation</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Active</span>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">SEMRush</h4>
                  <p className="text-xs text-gray-500">SEO Analytics</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Active</span>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">HubSpot AI</h4>
                  <p className="text-xs text-gray-500">Marketing Hub</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Processing</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
