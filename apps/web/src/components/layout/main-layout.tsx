'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Topbar } from './topbar';
import { Sidebar } from './sidebar';
import { Breadcrumbs } from './breadcrumbs';
import { ToastProvider } from '../ui/toast';
import { LanguageSwitcher } from '../language-switcher';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentOrganization, setCurrentOrganization] = useState('org_123');
  const [currentProject, setCurrentProject] = useState('proj_456');
  const { data: session } = useSession();

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleOrganizationChange = (orgId: string) => {
    setCurrentOrganization(orgId);
    // Here you would typically update the context or state management
    console.log('Organization changed to:', orgId);
  };

  const handleProjectChange = (projectId: string) => {
    setCurrentProject(projectId);
    // Here you would typically update the context or state management
    console.log('Project changed to:', projectId);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-30">
          <Sidebar
            isCollapsed={sidebarCollapsed}
            onToggle={handleSidebarToggle}
          />
        </div>

        {/* Main Content */}
        <div className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          {/* Topbar */}
          <div className="sticky top-0 z-20">
            <Topbar
              currentOrganization={currentOrganization}
              currentProject={currentProject}
              onOrganizationChange={handleOrganizationChange}
              onProjectChange={handleProjectChange}
            />
          </div>

          {/* Page Content */}
          <main className="p-6">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumbs />
            </div>

            {/* Page Content */}
            <div className="space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
