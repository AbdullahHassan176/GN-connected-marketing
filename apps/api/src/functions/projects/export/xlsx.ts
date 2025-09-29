import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import ExcelJS from 'exceljs';
import { z } from 'zod';

// Validation schema for project ID
const ProjectIdSchema = z.string().min(1);

// Mock project data for Excel generation
const mockProjectData = {
  id: 'proj_premium_hotels',
  name: 'Premium Hotels - Seasonal Campaign',
  description: 'Luxury hotel marketing campaign for the holiday season',
  status: 'active',
  startDate: '2024-01-01',
  endDate: '2024-03-31',
  manager: 'Sarah Mitchell',
  teamSize: 5,
  overview: {
    totalBudget: 150000,
    spentBudget: 95000,
    remainingBudget: 55000,
    totalRevenue: 750000,
    roi: 180
  },
  kpis: [
    { date: '2024-01-01', ctr: 2.1, roi: 150, engagement: 10.2, conversions: 1200, revenue: 45000 },
    { date: '2024-01-02', ctr: 2.3, roi: 155, engagement: 10.8, conversions: 1350, revenue: 52000 },
    { date: '2024-01-03', ctr: 2.5, roi: 160, engagement: 11.2, conversions: 1480, revenue: 58000 },
    { date: '2024-01-04', ctr: 2.8, roi: 165, engagement: 11.8, conversions: 1620, revenue: 65000 },
    { date: '2024-01-05', ctr: 3.0, roi: 170, engagement: 12.1, conversions: 1750, revenue: 72000 },
    { date: '2024-01-06', ctr: 3.2, roi: 175, engagement: 12.5, conversions: 1880, revenue: 78000 },
    { date: '2024-01-07', ctr: 3.1, roi: 178, engagement: 12.3, conversions: 1820, revenue: 75000 }
  ],
  abTests: [
    { testName: 'Email Subject Line Test', variant: 'Control', ctr: 12.3, conversionRate: 0.8, revenue: 12500, status: 'completed' },
    { testName: 'Email Subject Line Test', variant: 'Personalized', ctr: 15.2, conversionRate: 1.2, revenue: 18500, status: 'completed' },
    { testName: 'Landing Page CTA Test', variant: 'Control', ctr: 8.2, conversionRate: 3.1, revenue: 8500, status: 'running' },
    { testName: 'Landing Page CTA Test', variant: 'Urgency', ctr: 9.8, conversionRate: 3.7, revenue: 10200, status: 'running' },
    { testName: 'Landing Page CTA Test', variant: 'Benefit', ctr: 7.9, conversionRate: 2.8, revenue: 7800, status: 'running' }
  ],
  sentiment: [
    { channel: 'Google Ads', date: '2024-01-01', positive: 72, neutral: 20, negative: 8, volume: 1250 },
    { channel: 'Facebook', date: '2024-01-01', positive: 68, neutral: 22, negative: 10, volume: 980 },
    { channel: 'Instagram', date: '2024-01-01', positive: 75, neutral: 18, negative: 7, volume: 850 },
    { channel: 'LinkedIn', date: '2024-01-01', positive: 58, neutral: 30, negative: 12, volume: 420 },
    { channel: 'Twitter', date: '2024-01-01', positive: 45, neutral: 35, negative: 20, volume: 680 }
  ],
  workItems: [
    { id: 'WI-001', title: 'Campaign Strategy Document', assignee: 'Sarah Mitchell', status: 'completed', priority: 'high', dueDate: '2024-01-15' },
    { id: 'WI-002', title: 'Creative Assets Development', assignee: 'Emma Rodriguez', status: 'inProgress', priority: 'high', dueDate: '2024-02-01' },
    { id: 'WI-003', title: 'Ad Copy Variations', assignee: 'Marcus Chen', status: 'completed', priority: 'medium', dueDate: '2024-01-20' },
    { id: 'WI-004', title: 'Analytics Dashboard Setup', assignee: 'David Kim', status: 'inProgress', priority: 'medium', dueDate: '2024-01-25' },
    { id: 'WI-005', title: 'Budget Allocation Review', assignee: 'Sarah Mitchell', status: 'pending', priority: 'high', dueDate: '2024-02-05' }
  ]
};

const createOverviewSheet = (workbook: ExcelJS.Workbook, projectData: typeof mockProjectData) => {
  const sheet = workbook.addWorksheet('Overview');
  
  // Title
  sheet.mergeCells('A1:F1');
  sheet.getCell('A1').value = projectData.name;
  sheet.getCell('A1').font = { size: 18, bold: true };
  sheet.getCell('A1').alignment = { horizontal: 'center' };
  
  // Project Details
  sheet.getCell('A3').value = 'Project Details';
  sheet.getCell('A3').font = { bold: true };
  
  const details = [
    ['Description:', projectData.description],
    ['Status:', projectData.status],
    ['Manager:', projectData.manager],
    ['Start Date:', projectData.startDate],
    ['End Date:', projectData.endDate],
    ['Team Size:', `${projectData.teamSize} members`]
  ];
  
  details.forEach(([label, value], index) => {
    sheet.getCell(`A${4 + index}`).value = label;
    sheet.getCell(`B${4 + index}`).value = value;
    sheet.getCell(`A${4 + index}`).font = { bold: true };
  });
  
  // Budget Overview
  sheet.getCell('A11').value = 'Budget Overview';
  sheet.getCell('A11').font = { bold: true };
  
  const budgetData = [
    ['Total Budget:', `$${projectData.overview.totalBudget.toLocaleString()}`],
    ['Spent Budget:', `$${projectData.overview.spentBudget.toLocaleString()}`],
    ['Remaining Budget:', `$${projectData.overview.remainingBudget.toLocaleString()}`],
    ['Total Revenue:', `$${projectData.overview.totalRevenue.toLocaleString()}`],
    ['ROI:', `${projectData.overview.roi}%`]
  ];
  
  budgetData.forEach(([label, value], index) => {
    sheet.getCell(`A${12 + index}`).value = label;
    sheet.getCell(`B${12 + index}`).value = value;
    sheet.getCell(`A${12 + index}`).font = { bold: true };
  });
  
  // Auto-fit columns
  sheet.columns.forEach(column => {
    column.width = 20;
  });
};

const createKPIsSheet = (workbook: ExcelJS.Workbook, projectData: typeof mockProjectData) => {
  const sheet = workbook.addWorksheet('KPIs');
  
  // Headers
  const headers = ['Date', 'CTR (%)', 'ROI (%)', 'Engagement (%)', 'Conversions', 'Revenue ($)'];
  headers.forEach((header, index) => {
    const cell = sheet.getCell(1, index + 1);
    cell.value = header;
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE5E7EB' }
    };
  });
  
  // Data
  projectData.kpis.forEach((kpi, rowIndex) => {
    const row = rowIndex + 2;
    sheet.getCell(row, 1).value = kpi.date;
    sheet.getCell(row, 2).value = kpi.ctr;
    sheet.getCell(row, 3).value = kpi.roi;
    sheet.getCell(row, 4).value = kpi.engagement;
    sheet.getCell(row, 5).value = kpi.conversions;
    sheet.getCell(row, 6).value = kpi.revenue;
  });
  
  // Auto-fit columns
  sheet.columns.forEach(column => {
    column.width = 15;
  });
};

const createABTestsSheet = (workbook: ExcelJS.Workbook, projectData: typeof mockProjectData) => {
  const sheet = workbook.addWorksheet('A/B Tests');
  
  // Headers
  const headers = ['Test Name', 'Variant', 'CTR (%)', 'Conversion Rate (%)', 'Revenue ($)', 'Status'];
  headers.forEach((header, index) => {
    const cell = sheet.getCell(1, index + 1);
    cell.value = header;
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE5E7EB' }
    };
  });
  
  // Data
  projectData.abTests.forEach((test, rowIndex) => {
    const row = rowIndex + 2;
    sheet.getCell(row, 1).value = test.testName;
    sheet.getCell(row, 2).value = test.variant;
    sheet.getCell(row, 3).value = test.ctr;
    sheet.getCell(row, 4).value = test.conversionRate;
    sheet.getCell(row, 5).value = test.revenue;
    sheet.getCell(row, 6).value = test.status;
  });
  
  // Auto-fit columns
  sheet.columns.forEach(column => {
    column.width = 20;
  });
};

const createSentimentSheet = (workbook: ExcelJS.Workbook, projectData: typeof mockProjectData) => {
  const sheet = workbook.addWorksheet('Sentiment');
  
  // Headers
  const headers = ['Channel', 'Date', 'Positive (%)', 'Neutral (%)', 'Negative (%)', 'Volume'];
  headers.forEach((header, index) => {
    const cell = sheet.getCell(1, index + 1);
    cell.value = header;
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE5E7EB' }
    };
  });
  
  // Data
  projectData.sentiment.forEach((sentiment, rowIndex) => {
    const row = rowIndex + 2;
    sheet.getCell(row, 1).value = sentiment.channel;
    sheet.getCell(row, 2).value = sentiment.date;
    sheet.getCell(row, 3).value = sentiment.positive;
    sheet.getCell(row, 4).value = sentiment.neutral;
    sheet.getCell(row, 5).value = sentiment.negative;
    sheet.getCell(row, 6).value = sentiment.volume;
  });
  
  // Auto-fit columns
  sheet.columns.forEach(column => {
    column.width = 15;
  });
};

const createWorkItemsSheet = (workbook: ExcelJS.Workbook, projectData: typeof mockProjectData) => {
  const sheet = workbook.addWorksheet('Work Items');
  
  // Headers
  const headers = ['ID', 'Title', 'Assignee', 'Status', 'Priority', 'Due Date'];
  headers.forEach((header, index) => {
    const cell = sheet.getCell(1, index + 1);
    cell.value = header;
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE5E7EB' }
    };
  });
  
  // Data
  projectData.workItems.forEach((item, rowIndex) => {
    const row = rowIndex + 2;
    sheet.getCell(row, 1).value = item.id;
    sheet.getCell(row, 2).value = item.title;
    sheet.getCell(row, 3).value = item.assignee;
    sheet.getCell(row, 4).value = item.status;
    sheet.getCell(row, 5).value = item.priority;
    sheet.getCell(row, 6).value = item.dueDate;
  });
  
  // Auto-fit columns
  sheet.columns.forEach(column => {
    column.width = 20;
  });
};

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  try {
    // Validate project ID
    const projectId = req.params.id;
    const validatedProjectId = ProjectIdSchema.parse(projectId);

    context.log(`Generating Excel for project: ${validatedProjectId}`);

    // Create new workbook
    const workbook = new ExcelJS.Workbook();
    
    // Set workbook properties
    workbook.creator = 'Global Next Marketing Platform';
    workbook.lastModifiedBy = 'System';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.subject = `${mockProjectData.name} - Project Report`;
    workbook.description = 'Comprehensive project analytics and insights';
    workbook.keywords = 'marketing, analytics, project, report';
    workbook.category = 'Marketing Report';

    // Create sheets
    createOverviewSheet(workbook, mockProjectData);
    createKPIsSheet(workbook, mockProjectData);
    createABTestsSheet(workbook, mockProjectData);
    createSentimentSheet(workbook, mockProjectData);
    createWorkItemsSheet(workbook, mockProjectData);

    // Generate Excel buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers
    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${mockProjectData.name.replace(/\s+/g, '_')}_Report.xlsx"`,
        'Content-Length': buffer.byteLength.toString()
      },
      body: buffer
    };

    context.log(`Excel generated successfully for project: ${validatedProjectId}`);

  } catch (error) {
    context.log.error('Error generating Excel:', error);
    
    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        error: 'Failed to generate Excel',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
};

export default httpTrigger;
