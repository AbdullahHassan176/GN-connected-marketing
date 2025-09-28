'use client';

import { ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from '@repo/ui';
import { 
  Bell, 
  Headphones, 
  Globe, 
  BarChart3, 
  Bullhorn, 
  Bot, 
  MessageSquare, 
  FileText,
  Route,
  Settings,
  LogOut
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const t = useTranslations('navigation');

  const navigation = [
    { name: t('dashboard'), href: '/dashboard', icon: BarChart3, current: true },
    { name: t('campaigns'), href: '/campaigns', icon: Bullhorn, current: false },
    { name: t('ai_tools'), href: '/tools', icon: Bot, current: false },
    { name: t('analytics'), href: '/analytics', icon: BarChart3, current: false },
    { name: t('campaign_rooms'), href: '/rooms', icon: MessageSquare, current: false },
    { name: t('reports'), href: '/reports', icon: FileText, current: false },
    { name: t('brand_journey'), href: '/journey', icon: Route, current: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Global Next</h1>
                <p className="text-xs text-blue-200">AI Innovation at Every Step</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden md:block">{t('common.notifications')}</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-blue-200 hover:text-white">
              <Headphones className="w-4 h-4 mr-2" />
              <span className="hidden md:block">{t('common.support')}</span>
            </Button>
            <div className="flex items-center space-x-3">
              <img 
                src={session?.user?.image || '/default-avatar.png'} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-blue-200">Premium Hotels Group</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      item.current
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* AI Copilot Button */}
      <div className="fixed bottom-6 right-6">
        <Button className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110">
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
