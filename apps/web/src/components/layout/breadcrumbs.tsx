'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRight, Home, Target, BarChart3, Users, Zap, FileText, MessageSquare, CheckCircle, Image, Bot, Settings, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const routeIcons: Record<string, any> = {
  dashboard: Home,
  projects: Target,
  analytics: BarChart3,
  team: Users,
  tools: Zap,
  reports: FileText,
  messages: MessageSquare,
  approvals: CheckCircle,
  assets: Image,
  ai: Bot,
  settings: Settings,
  help: HelpCircle,
};

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  analytics: 'Analytics',
  team: 'Team',
  tools: 'Tools',
  reports: 'Reports',
  messages: 'Messages',
  approvals: 'Approvals',
  assets: 'Assets',
  ai: 'AI Assistant',
  settings: 'Settings',
  help: 'Help',
};

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: any;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations('breadcrumbs');

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with home
    breadcrumbs.push({
      label: t('home'),
      href: '/dashboard',
      icon: Home,
    });

    // Build breadcrumbs from path segments
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Handle dynamic routes
      if (segment.startsWith('[') && segment.endsWith(']')) {
        // Skip dynamic route segments in breadcrumbs
        return;
      }

      // Handle project detail pages
      if (segments[index - 1] === 'projects' && !isNaN(Number(segment))) {
        breadcrumbs.push({
          label: `Project ${segment}`,
          href: currentPath,
        });
        return;
      }

      // Handle settings sub-pages
      if (segments[index - 1] === 'settings' && segment !== 'settings') {
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: currentPath,
        });
        return;
      }

      // Handle other dynamic content
      if (segment === 'new') {
        breadcrumbs.push({
          label: t('create_new'),
          href: currentPath,
        });
        return;
      }

      // Regular route handling
      const routeLabel = routeLabels[segment];
      if (routeLabel) {
        breadcrumbs.push({
          label: routeLabel,
          href: currentPath,
          icon: routeIcons[segment],
        });
      } else {
        // Fallback for unknown routes
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: currentPath,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
          )}
          
          {item.href && index < breadcrumbs.length - 1 ? (
            <Link
              href={item.href}
              className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.label}</span>
            </Link>
          ) : (
            <div className="flex items-center space-x-1">
              {item.icon && <item.icon className="h-4 w-4" />}
              <span className="text-gray-900 font-medium">{item.label}</span>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
