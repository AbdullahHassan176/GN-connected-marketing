'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button, Badge } from '@repo/ui';
import { 
  ChevronDown, 
  Search, 
  Bell, 
  Settings, 
  User,
  Building2,
  Target,
  Globe,
  Moon,
  Sun,
  LogOut,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { LanguageSwitcher } from '../language-switcher';

// Mock data for organizations and projects
const mockOrganizations = [
  {
    id: 'org_123',
    name: 'Global Next Consulting',
    logo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
    role: 'Owner',
  },
  {
    id: 'org_456',
    name: 'Premium Hotels Group',
    logo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
    role: 'Client',
  },
];

const mockProjects = [
  {
    id: 'proj_456',
    name: 'Premium Hotels Campaign',
    organization: 'Global Next Consulting',
    status: 'active',
  },
  {
    id: 'proj_789',
    name: 'Tech Startup Launch',
    organization: 'Global Next Consulting',
    status: 'planning',
  },
  {
    id: 'proj_101',
    name: 'Luxury Brand Rebranding',
    organization: 'Global Next Consulting',
    status: 'completed',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  planning: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  paused: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

interface TopbarProps {
  currentOrganization?: string;
  currentProject?: string;
  onOrganizationChange?: (orgId: string) => void;
  onProjectChange?: (projectId: string) => void;
}

export function Topbar({ 
  currentOrganization = 'org_123', 
  currentProject = 'proj_456',
  onOrganizationChange,
  onProjectChange 
}: TopbarProps) {
  const { data: session } = useSession();
  const t = useTranslations('topbar');
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const user = session?.user as any;
  const currentOrg = mockOrganizations.find(org => org.id === currentOrganization);
  const currentProj = mockProjects.find(proj => proj.id === currentProject);

  const handleOrgSelect = (orgId: string) => {
    onOrganizationChange?.(orgId);
    setShowOrgDropdown(false);
  };

  const handleProjectSelect = (projectId: string) => {
    onProjectChange?.(projectId);
    setShowProjectDropdown(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement actual theme switching
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Organization and Project Switchers */}
        <div className="flex items-center space-x-4">
          {/* Organization Switcher */}
          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100"
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            >
              <Building2 className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-900">{currentOrg?.name}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>
            
            {showOrgDropdown && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Organizations
                  </div>
                  {mockOrganizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => handleOrgSelect(org.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 ${
                        org.id === currentOrganization ? 'bg-blue-50' : ''
                      }`}
                    >
                      <img
                        src={org.logo}
                        alt={org.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{org.name}</div>
                        <div className="text-xs text-gray-500">{org.role}</div>
                      </div>
                      {org.id === currentOrganization && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Project Switcher */}
          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100"
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            >
              <Target className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-900">{currentProj?.name}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>
            
            {showProjectDropdown && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Projects
                  </div>
                  {mockProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectSelect(project.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 ${
                        project.id === currentProject ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900">{project.name}</div>
                          <div className="text-xs text-gray-500">{project.organization}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                          {project.status}
                        </Badge>
                        {project.id === currentProject && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side - Actions and User Menu */}
        <div className="flex items-center space-x-2">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Help */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help">
              <HelpCircle className="h-4 w-4" />
            </Link>
          </Button>

          {/* Messages */}
          <Button variant="ghost" size="sm">
            <MessageSquare className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img
                src={user?.avatarUrl || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg'}
                alt={user?.name}
                className="h-6 w-6 rounded-full"
              />
              <span className="font-medium text-gray-900">{user?.name}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>
            
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <div className="font-medium text-gray-900">{user?.name}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                    <Badge variant="outline" className="mt-1">
                      {user?.roles?.[0]?.role || 'User'}
                    </Badge>
                  </div>
                  
                  <div className="py-1">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/help">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help & Support
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Globe className="mr-2 h-4 w-4" />
                      Language
                    </Button>
                  </div>
                  
                  <div className="py-1 border-t border-gray-200">
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
