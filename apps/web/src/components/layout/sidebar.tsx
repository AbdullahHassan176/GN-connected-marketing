'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from '@repo/ui';
import { 
  LayoutDashboard,
  Target,
  Zap,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Users,
  FileText,
  MessageSquare,
  CheckCircle,
  Image,
  Video,
  Bot,
  Globe,
  Bell,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { withAuth } from '@/components/auth/withAuth';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['owner', 'admin', 'manager', 'analyst', 'client'],
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: Target,
    roles: ['owner', 'admin', 'manager', 'analyst', 'client'],
    badge: '8',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['owner', 'admin', 'manager', 'analyst'],
  },
  {
    name: 'Team',
    href: '/team',
    icon: Users,
    roles: ['owner', 'admin', 'manager'],
  },
  {
    name: 'Tools',
    href: '/tools',
    icon: Zap,
    roles: ['owner', 'admin', 'manager', 'analyst'],
    badge: '12',
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    roles: ['owner', 'admin', 'manager', 'analyst'],
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    roles: ['owner', 'admin', 'manager', 'analyst', 'client'],
    badge: '3',
  },
  {
    name: 'Approvals',
    href: '/approvals',
    icon: CheckCircle,
    roles: ['owner', 'admin', 'manager'],
    badge: '2',
  },
  {
    name: 'Assets',
    href: '/assets',
    icon: Image,
    roles: ['owner', 'admin', 'manager', 'analyst'],
  },
  {
    name: 'AI Assistant',
    href: '/ai',
    icon: Bot,
    roles: ['owner', 'admin', 'manager', 'analyst'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['owner', 'admin', 'manager', 'analyst', 'client'],
  },
  {
    name: 'Help',
    href: '/help',
    icon: HelpCircle,
    roles: ['owner', 'admin', 'manager', 'analyst', 'client'],
  },
];

const quickActions = [
  {
    name: 'Create Project',
    href: '/projects/new',
    icon: Target,
    color: 'blue',
  },
  {
    name: 'Generate Content',
    href: '/tools/content',
    icon: Bot,
    color: 'purple',
  },
  {
    name: 'Schedule Meeting',
    href: '/calendar',
    icon: Calendar,
    color: 'green',
  },
  {
    name: 'View Reports',
    href: '/reports',
    icon: TrendingUp,
    color: 'orange',
  },
];

const recentProjects = [
  {
    name: 'Premium Hotels Campaign',
    href: '/projects/proj_456',
    status: 'active',
    progress: 78,
  },
  {
    name: 'Tech Startup Launch',
    href: '/projects/proj_789',
    status: 'planning',
    progress: 15,
  },
  {
    name: 'Luxury Brand Rebranding',
    href: '/projects/proj_101',
    status: 'completed',
    progress: 100,
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  planning: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  paused: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

function SidebarContent({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations('sidebar');
  
  const user = session?.user as any;
  const userRole = user?.roles?.[0]?.role || 'client';

  const filteredNavigationItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GN</span>
            </div>
            <span className="font-semibold text-gray-900">Global Next</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-2"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  isCollapsed ? 'px-2' : 'px-3'
                }`}
              >
                <item.icon className={`h-4 w-4 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                >
                  <action.icon className="h-3 w-3 mr-2" />
                  {action.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Projects */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Recent Projects
          </h3>
          <div className="space-y-2">
            {recentProjects.map((project) => (
              <Link key={project.name} href={project.href}>
                <div className="p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {project.name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      statusColors[project.status as keyof typeof statusColors]
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${getProgressColor(project.progress)}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{project.progress}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={user?.avatarUrl || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg'}
            alt={user?.name}
            className="h-8 w-8 rounded-full"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const Sidebar = withAuth(SidebarContent, {
  requiredRole: { scope: 'org', role: 'client' },
  redirectTo: '/unauthorized',
});
