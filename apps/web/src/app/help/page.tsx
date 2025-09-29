'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@repo/ui';
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  Video, 
  FileText, 
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Star,
  Clock,
  Users,
  Zap,
  BarChart3,
  Target,
  Settings,
  Shield,
  Globe
} from 'lucide-react';
import { withAuth } from '@/components/auth/withAuth';

// Mock data for help content
const mockHelpData = {
  categories: [
    {
      id: 'getting-started',
      name: 'Getting Started',
      description: 'Learn the basics of using the platform',
      icon: BookOpen,
      color: 'blue',
      articles: 12,
    },
    {
      id: 'projects',
      name: 'Projects & Campaigns',
      description: 'Manage your marketing projects and campaigns',
      icon: Target,
      color: 'green',
      articles: 18,
    },
    {
      id: 'analytics',
      name: 'Analytics & Reports',
      description: 'Understand your data and performance metrics',
      icon: BarChart3,
      color: 'purple',
      articles: 15,
    },
    {
      id: 'ai-tools',
      name: 'AI Tools & Features',
      description: 'Leverage AI-powered marketing tools',
      icon: Zap,
      color: 'orange',
      articles: 22,
    },
    {
      id: 'team-collaboration',
      name: 'Team & Collaboration',
      description: 'Work together with your team effectively',
      icon: Users,
      color: 'pink',
      articles: 8,
    },
    {
      id: 'account-settings',
      name: 'Account & Settings',
      description: 'Manage your account and preferences',
      icon: Settings,
      color: 'gray',
      articles: 10,
    },
  ],
  popularArticles: [
    {
      id: '1',
      title: 'How to create your first marketing campaign',
      description: 'Step-by-step guide to setting up your first campaign',
      category: 'getting-started',
      views: 1250,
      rating: 4.8,
      readTime: '5 min',
      featured: true,
    },
    {
      id: '2',
      title: 'Understanding campaign KPIs and metrics',
      description: 'Learn about key performance indicators and how to track them',
      category: 'analytics',
      views: 980,
      rating: 4.6,
      readTime: '8 min',
      featured: true,
    },
    {
      id: '3',
      title: 'AI content generation best practices',
      description: 'Tips for getting the best results from AI content tools',
      category: 'ai-tools',
      views: 750,
      rating: 4.9,
      readTime: '6 min',
      featured: true,
    },
    {
      id: '4',
      title: 'Setting up team permissions and roles',
      description: 'Configure access levels for your team members',
      category: 'team-collaboration',
      views: 650,
      rating: 4.7,
      readTime: '4 min',
      featured: false,
    },
    {
      id: '5',
      title: 'Integrating with external tools',
      description: 'Connect your favorite marketing tools and platforms',
      category: 'account-settings',
      views: 580,
      rating: 4.5,
      readTime: '10 min',
      featured: false,
    },
  ],
  quickActions: [
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageCircle,
      href: '/support',
      color: 'blue',
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      icon: Video,
      href: '/tutorials',
      color: 'green',
    },
    {
      title: 'Download Resources',
      description: 'Get templates and documentation',
      icon: FileText,
      href: '/resources',
      color: 'purple',
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: Users,
      href: '/community',
      color: 'orange',
    },
  ],
  faqs: [
    {
      question: 'How do I create a new project?',
      answer: 'To create a new project, go to the Projects page and click the "Create Project" button. Fill in the project details and click "Create".',
      category: 'projects',
    },
    {
      question: 'What AI tools are available?',
      answer: 'We offer AI content generation, image creation, analytics insights, and automated campaign optimization tools.',
      category: 'ai-tools',
    },
    {
      question: 'How can I invite team members?',
      answer: 'Go to Settings > Team Management and click "Invite Members". Enter their email addresses and assign roles.',
      category: 'team-collaboration',
    },
    {
      question: 'How do I export my data?',
      answer: 'You can export your data from Settings > Data & Privacy. Choose the format and date range for your export.',
      category: 'account-settings',
    },
  ],
};

const categoryColors = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  purple: 'bg-purple-100 text-purple-800',
  orange: 'bg-orange-100 text-orange-800',
  pink: 'bg-pink-100 text-pink-800',
  gray: 'bg-gray-100 text-gray-800',
};

const iconColors = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  purple: 'text-purple-500',
  orange: 'text-orange-500',
  pink: 'text-pink-500',
  gray: 'text-gray-500',
};

function HelpPageContent() {
  const t = useTranslations('help');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>
        <Button variant="outline" className="flex items-center">
          <MessageCircle className="mr-2 h-4 w-4" />
          {t('contact_support')}
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={t('search_help')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockHelpData.quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gray-100 ${iconColors[action.color as keyof typeof iconColors]}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popular Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5" />
            {t('popular_articles')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockHelpData.popularArticles.filter(article => article.featured).map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{article.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{article.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="mr-1 h-3 w-3" />
                      {article.readTime}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Star className="mr-1 h-3 w-3" />
                      {article.rating}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="mr-1 h-3 w-3" />
                      {article.views} views
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockHelpData.categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gray-100 ${iconColors[category.color as keyof typeof iconColors]}`}>
                  <category.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className={categoryColors[category.color as keyof typeof categoryColors]}>
                    {category.articles} articles
                  </Badge>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="mr-2 h-5 w-5" />
            {t('frequently_asked_questions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockHelpData.faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <MessageCircle className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('still_need_help')}</h3>
            <p className="text-gray-600 mb-6">{t('contact_support_description')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" className="flex items-center">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t('start_chat')}
              </Button>
              <Button variant="outline" className="flex items-center">
                <ExternalLink className="mr-2 h-4 w-4" />
                {t('email_support')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(HelpPageContent, {
  requiredRole: { scope: 'org', role: 'client' },
  redirectTo: '/unauthorized',
});
