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
  BarChart3,
  Download,
  MessageSquare,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { 
  WorkflowButton,
  CreateCampaignButton,
  ExportPDFButton,
  ExportExcelButton,
  SendMessageButton,
  ToggleAIToolButton,
  GenerateInsightsButton,
  LogoutButton
} from '@/components/workflow/WorkflowButton';

export function DashboardContentWorkflow() {
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-8">
      {/* Welcome Section with Workflow Buttons */}
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
          
          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6">
            <CreateCampaignButton 
              variant="gradient"
              size="lg"
              onSuccess={(result: any) => console.log('Campaign created:', result)}
            >
              <Plus className="w-5 h-5 mr-2" />
              New Campaign
            </CreateCampaignButton>
            
            <WorkflowButton
              workflowId="navigate_to_analytics"
              stepId="navigate_to_analytics"
              variant="outline"
              size="lg"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Analytics
            </WorkflowButton>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300">78%</div>
              <div className="text-sm text-blue-200">Campaign Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">+24%</div>
              <div className="text-sm text-blue-200">ROI Growth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-300">12</div>
              <div className="text-sm text-blue-200">Active Tools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-300">3.2k</div>
              <div className="text-sm text-blue-200">Engagements</div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Stage Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Campaign Stage Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { stage: 'Strategy', progress: 100, status: 'completed', color: 'bg-green-500' },
              { stage: 'Content', progress: 85, status: 'in_progress', color: 'bg-blue-500' },
              { stage: 'Distribution', progress: 60, status: 'in_progress', color: 'bg-yellow-500' },
              { stage: 'Ads', progress: 30, status: 'pending', color: 'bg-gray-400' },
              { stage: 'Insights', progress: 0, status: 'pending', color: 'bg-gray-400' },
            ].map((stage, index) => (
              <div key={stage.stage} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full ${stage.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {index + 1}
                  </div>
                  <span className="font-medium">{stage.stage}</span>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${stage.color}`}
                      style={{ width: `${stage.progress}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{stage.progress}%</span>
                <div className="flex space-x-2">
                  {stage.status === 'completed' && (
                    <WorkflowButton
                      workflowId="view_stage_details"
                      stepId="view_details"
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="w-4 h-4" />
                    </WorkflowButton>
                  )}
                  {stage.status === 'in_progress' && (
                    <WorkflowButton
                      workflowId="edit_stage"
                      stepId="edit_stage"
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="w-4 h-4" />
                    </WorkflowButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'CTR', value: '4.2%', change: '+0.3%', icon: MousePointer, color: 'text-blue-600' },
          { title: 'ROI', value: '340%', change: '+24%', icon: DollarSign, color: 'text-green-600' },
          { title: 'Engagement', value: '78%', change: '+12%', icon: Heart, color: 'text-pink-600' },
          { title: 'Sentiment', value: '+0.8', change: '+0.2', icon: TrendingUp, color: 'text-purple-600' },
          { title: 'Conversions', value: '1.2k', change: '+180', icon: ShoppingCart, color: 'text-orange-600' },
          { title: 'Reach', value: '45k', change: '+8k', icon: Users, color: 'text-indigo-600' },
        ].map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-green-600">{metric.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${metric.color}`}>
                  <metric.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <WorkflowButton
                  workflowId="view_metric_details"
                  stepId="view_details"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </WorkflowButton>
                <WorkflowButton
                  workflowId="export_metric"
                  stepId="export_data"
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4" />
                </WorkflowButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Tools Transparency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            AI Tools Transparency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Content Generator', status: 'active', usage: '85%', icon: PenTool },
              { name: 'Image Creator', status: 'active', usage: '62%', icon: Image },
              { name: 'SEO Optimizer', status: 'active', usage: '78%', icon: Search },
              { name: 'Analytics AI', status: 'inactive', usage: '0%', icon: BarChart3 },
              { name: 'Chat Assistant', status: 'active', usage: '45%', icon: MessageSquare },
              { name: 'Auto Scheduler', status: 'maintenance', usage: '0%', icon: Settings },
            ].map((tool) => (
              <div key={tool.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <tool.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{tool.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tool.status === 'active' ? 'bg-green-100 text-green-800' :
                    tool.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tool.status}
                  </span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Usage</span>
                    <span>{tool.usage}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: tool.usage }}
                    ></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <ToggleAIToolButton
                    toolId={tool.name.toLowerCase().replace(' ', '_')}
                    enabled={tool.status === 'active'}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  />
                  <WorkflowButton
                    workflowId="configure_tool"
                    stepId="open_settings"
                    variant="outline"
                    size="sm"
                  >
                    <Settings className="w-4 h-4" />
                  </WorkflowButton>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Campaign Performance Report</h3>
              <p className="text-sm text-gray-600 mb-4">Comprehensive analytics and insights</p>
              <div className="flex space-x-2">
                <ExportPDFButton 
                  projectId="premium_hotels_q1_2024"
                  variant="default"
                  size="sm"
                />
                <ExportExcelButton 
                  projectId="premium_hotels_q1_2024"
                  variant="outline"
                  size="sm"
                />
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">AI Insights Report</h3>
              <p className="text-sm text-gray-600 mb-4">AI-generated recommendations and analysis</p>
              <div className="flex space-x-2">
                <GenerateInsightsButton 
                  projectId="premium_hotels_q1_2024"
                  variant="default"
                  size="sm"
                />
                <WorkflowButton
                  workflowId="view_insights"
                  stepId="view_insights"
                  variant="outline"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </WorkflowButton>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <WorkflowButton
              workflowId="navigate_to_campaign_room"
              stepId="navigate_to_campaign_room"
              variant="outline"
              className="h-20 flex-col"
              context={{ campaignId: 'premium_hotels_q1_2024' }}
            >
              <MessageSquare className="w-6 h-6 mb-2" />
              Campaign Room
            </WorkflowButton>
            
            <WorkflowButton
              workflowId="navigate_to_team_dashboard"
              stepId="navigate_to_team_dashboard"
              variant="outline"
              className="h-20 flex-col"
            >
              <Users className="w-6 h-6 mb-2" />
              Team Dashboard
            </WorkflowButton>
            
            <WorkflowButton
              workflowId="schedule_meeting"
              stepId="schedule_meeting"
              variant="outline"
              className="h-20 flex-col"
            >
              <Settings className="w-6 h-6 mb-2" />
              Schedule Meeting
            </WorkflowButton>
            
            <LogoutButton 
              variant="outline"
              className="h-20 flex-col"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
