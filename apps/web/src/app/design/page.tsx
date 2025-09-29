import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import { Badge } from '@repo/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@repo/ui';
import { DataTable, renderStatusBadge, renderNumber, renderDate } from '@repo/ui';
import { EmptyState, EmptyStateIcons } from '@repo/ui';
import { KPIStat, KPIStatIcons } from '@repo/ui';
import { StageTracker, createStages, CommonStages } from '@repo/ui';

export default function DesignPage() {
  // Sample data for DataTable
  const sampleData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active',
      revenue: 125000,
      date: '2024-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'inactive',
      revenue: 89000,
      date: '2024-01-10',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: 'pending',
      revenue: 156000,
      date: '2024-01-20',
    },
  ];

  const columns = [
    {
      key: 'name' as const,
      label: 'Name',
      sortable: true,
    },
    {
      key: 'email' as const,
      label: 'Email',
      sortable: true,
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => renderStatusBadge(value),
    },
    {
      key: 'revenue' as const,
      label: 'Revenue',
      render: (value: number) => renderNumber(value, { style: 'currency', currency: 'USD' }),
      align: 'right' as const,
    },
    {
      key: 'date' as const,
      label: 'Date',
      render: (value: string) => renderDate(value),
    },
  ];

  // Sample stages
  const projectStages = createStages([
    { name: 'Planning', completed: true, description: 'Define requirements', date: '2024-01-01' },
    { name: 'Development', completed: true, description: 'Build features', date: '2024-01-15' },
    { name: 'Testing', current: true, description: 'Quality assurance' },
    { name: 'Deployment', description: 'Release to production' },
  ]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-surface-50 p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-900 mb-4">
              Global Next Design System
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              A comprehensive design system with friendly, approachable components built for modern marketing platforms.
            </p>
          </div>

          {/* Color Palette */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Color Palette</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Primary Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-brand-sm bg-primary-900"></div>
                    <span className="text-sm">Primary 900</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-brand-sm bg-primary-600"></div>
                    <span className="text-sm">Primary 600</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-brand-sm bg-primary-300"></div>
                    <span className="text-sm">Primary 300</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Surface Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-brand-sm bg-surface-50"></div>
                    <span className="text-sm">Surface 50</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-brand-sm bg-surface-100"></div>
                    <span className="text-sm">Surface 100</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-brand-sm bg-surface-200"></div>
                    <span className="text-sm">Surface 200</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Accent Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-brand-sm bg-accent-teal"></div>
                    <span className="text-sm">Teal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-brand-sm bg-accent-coral"></div>
                    <span className="text-sm">Coral</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-brand-sm bg-accent-silver"></div>
                    <span className="text-sm">Silver</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Semantic Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-brand-sm bg-success-500"></div>
                    <span className="text-sm">Success</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-brand-sm bg-warning-500"></div>
                    <span className="text-sm">Warning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-brand-sm bg-error-500"></div>
                    <span className="text-sm">Error</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Buttons */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Buttons</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="default">Default</Button>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="gradient">Gradient</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="error">Error</Button>
                  <Button loading>Loading</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Badges */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Badges</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="accent">Accent</Badge>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Cards */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>This is a default card with standard styling.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">
                    Card content goes here with proper spacing and typography.
                  </p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated Card</CardTitle>
                  <CardDescription>This card has enhanced shadows for depth.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">
                    Perfect for highlighting important content.
                  </p>
                </CardContent>
              </Card>

              <Card variant="interactive">
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>This card responds to hover interactions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">
                    Great for clickable content areas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Tabs */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Tabs</h2>
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-4">
                    <p className="text-sm text-neutral-600">
                      Overview content with comprehensive information about the current state.
                    </p>
                  </TabsContent>
                  <TabsContent value="analytics" className="mt-4">
                    <p className="text-sm text-neutral-600">
                      Analytics content with charts and data visualization.
                    </p>
                  </TabsContent>
                  <TabsContent value="settings" className="mt-4">
                    <p className="text-sm text-neutral-600">
                      Settings content for configuration and preferences.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>

          {/* Tooltips */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Tooltips</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover me</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is a helpful tooltip</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Another tooltip</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tooltips provide additional context</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Data Table */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Data Table</h2>
            <DataTable
              data={sampleData}
              columns={columns}
              onSort={(key, direction) => {
                console.log('Sort:', key, direction);
              }}
            />
          </section>

          {/* Empty State */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Empty State</h2>
            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon={EmptyStateIcons.document}
                  title="No documents found"
                  description="Get started by uploading your first document to begin organizing your content."
                  action={{
                    label: "Upload Document",
                    onClick: () => console.log("Upload clicked"),
                  }}
                />
              </CardContent>
            </Card>
          </section>

          {/* KPI Stats */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">KPI Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPIStat
                title="Total Users"
                value="12,345"
                change={{ value: 12, label: "vs last month", positive: true }}
                icon={KPIStatIcons.users}
                description="Active users this month"
              />
              <KPIStat
                title="Revenue"
                value="$125,000"
                change={{ value: 8, label: "vs last month", positive: true }}
                icon={KPIStatIcons.revenue}
                description="Monthly recurring revenue"
              />
              <KPIStat
                title="Growth Rate"
                value="24%"
                change={{ value: 5, label: "vs last month", positive: true }}
                icon={KPIStatIcons.growth}
                description="Year-over-year growth"
              />
              <KPIStat
                title="Conversion"
                value="3.2%"
                change={{ value: -2, label: "vs last month", positive: false }}
                icon={KPIStatIcons.conversion}
                description="Conversion rate"
              />
            </div>
          </section>

          {/* Stage Tracker */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Stage Tracker</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Horizontal Progress</CardTitle>
                  <CardDescription>Track progress through multiple stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <StageTracker
                    stages={projectStages}
                    orientation="horizontal"
                    showConnector={true}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vertical Progress</CardTitle>
                  <CardDescription>Alternative vertical layout</CardDescription>
                </CardHeader>
                <CardContent>
                  <StageTracker
                    stages={projectStages}
                    orientation="vertical"
                    showConnector={true}
                  />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* WCAG AA Compliance */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">WCAG AA Compliance</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary-600 rounded-brand-md flex items-center justify-center">
                      <span className="text-white font-bold">AA</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Contrast Ratio: 4.5:1</h3>
                      <p className="text-sm text-neutral-600">
                        All text meets WCAG AA standards for normal text
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary-300 rounded-brand-md flex items-center justify-center">
                      <span className="text-white font-bold">AA</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Large Text: 3:1</h3>
                      <p className="text-sm text-neutral-600">
                        Large text (18px+) meets enhanced contrast requirements
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </TooltipProvider>
  );
}
