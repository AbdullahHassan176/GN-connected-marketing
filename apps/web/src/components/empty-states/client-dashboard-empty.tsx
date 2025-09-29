import { EmptyState, EmptyStateIcons } from '@repo/ui';
import { Button } from '@repo/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { Sparkles, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ClientDashboardEmpty() {
  const t = useTranslations('ClientDashboardEmpty');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Sparkles className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {t('welcomeTitle')}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t('welcomeDescription')}
          </p>
        </div>

        {/* Getting Started Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">{t('createProjectTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                {t('createProjectDescription')}
              </p>
              <Button asChild className="w-full">
                <Link href="/projects/new">
                  {t('createProjectButton')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">{t('exploreToolsTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                {t('exploreToolsDescription')}
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/tools">
                  {t('exploreToolsButton')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 mx-auto">
                <ArrowRight className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">{t('getHelpTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                {t('getHelpDescription')}
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/help">
                  {t('getHelpButton')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center text-2xl">{t('featuresTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{t('aiPoweredTitle')}</h3>
                <p className="text-sm text-slate-600">{t('aiPoweredDescription')}</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <ArrowRight className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{t('realTimeTitle')}</h3>
                <p className="text-sm text-slate-600">{t('realTimeDescription')}</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                  <Plus className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{t('collaborativeTitle')}</h3>
                <p className="text-sm text-slate-600">{t('collaborativeDescription')}</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4">
                  <Sparkles className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{t('insightsTitle')}</h3>
                <p className="text-sm text-slate-600">{t('insightsDescription')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            {t('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/projects/new">
                <Plus className="h-5 w-5 mr-2" />
                {t('createFirstProject')}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/help">
                <Sparkles className="h-5 w-5 mr-2" />
                {t('learnMore')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
