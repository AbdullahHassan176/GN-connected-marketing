import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { chromium } from 'playwright';
import { z } from 'zod';

// Validation schema for project ID
const ProjectIdSchema = z.string().min(1);

// Mock project data for PDF generation
const mockProjectData = {
  id: 'proj_premium_hotels',
  name: 'Premium Hotels - Seasonal Campaign',
  description: 'Luxury hotel marketing campaign for the holiday season',
  status: 'active',
  startDate: '2024-01-01',
  endDate: '2024-03-31',
  manager: 'Sarah Mitchell',
  teamSize: 5,
  logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  kpis: [
    { name: 'CTR', value: 3.2, target: 2.8, unit: '%', trend: 'up' },
    { name: 'ROI', value: 180, target: 165, unit: '%', trend: 'up' },
    { name: 'Engagement', value: 12.5, target: 11.2, unit: '%', trend: 'up' },
    { name: 'Conversions', value: 7500, target: 6800, unit: '', trend: 'up' }
  ],
  timeline: [
    { stage: 'Strategy', completed: true, date: '2024-01-15', description: 'Define campaign objectives & target audience' },
    { stage: 'Content', completed: true, date: '2024-02-01', description: 'Develop creative assets & copy' },
    { stage: 'Distribution', completed: false, date: '2024-02-15', description: 'Launch across selected channels' },
    { stage: 'Ads', completed: false, date: '2024-03-01', description: 'Optimize ad spend & performance' },
    { stage: 'Insights', completed: false, date: '2024-03-31', description: 'Analyze results & generate reports' }
  ],
  storyboard: [
    {
      title: 'Campaign Kick-off & Strategy',
      status: 'completed',
      description: 'Initial AI draft for campaign objectives and target audience segmentation.',
      notes: 'Reviewed and refined target demographics. Confirmed budget allocation.'
    },
    {
      title: 'Creative Development',
      status: 'inProgress',
      description: 'AI-generated ad copy variations and visual concepts for social media.',
      notes: 'Selected top 3 ad concepts. Awaiting client feedback on visuals.'
    },
    {
      title: 'Channel Distribution Plan',
      status: 'draft',
      description: 'Proposed distribution channels and scheduling for content deployment.',
      notes: 'Need to finalize influencer partnerships before scheduling.'
    }
  ],
  team: [
    { name: 'Sarah Mitchell', role: 'Senior Marketing Manager', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg' },
    { name: 'Marcus Chen', role: 'Campaign Specialist', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg' },
    { name: 'Emma Rodriguez', role: 'Content Creator', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg' },
    { name: 'David Kim', role: 'Analytics Specialist', avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg' }
  ]
};

const generatePDFHTML = (projectData: typeof mockProjectData) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectData.name} - Project Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 20mm;
            page-break-after: always;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        .cover {
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 30px;
            background: white;
            border-radius: 12px;
            padding: 15px;
        }
        
        .cover h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
            font-weight: 700;
        }
        
        .cover p {
            font-size: 1.2rem;
            margin-bottom: 40px;
            opacity: 0.9;
        }
        
        .cover .meta {
            font-size: 1rem;
            opacity: 0.8;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section h2 {
            font-size: 1.8rem;
            margin-bottom: 20px;
            color: #2563eb;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
        }
        
        .section h3 {
            font-size: 1.4rem;
            margin-bottom: 15px;
            color: #374151;
        }
        
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .kpi-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        
        .kpi-name {
            font-size: 0.9rem;
            color: #64748b;
            margin-bottom: 5px;
        }
        
        .kpi-value {
            font-size: 2rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 5px;
        }
        
        .kpi-target {
            font-size: 0.8rem;
            color: #64748b;
        }
        
        .timeline {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .timeline-item {
            display: flex;
            align-items: center;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
        }
        
        .timeline-item.completed {
            border-left-color: #10b981;
            background: #f0fdf4;
        }
        
        .timeline-item.current {
            border-left-color: #f59e0b;
            background: #fffbeb;
        }
        
        .timeline-status {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }
        
        .timeline-item.completed .timeline-status {
            background: #10b981;
            color: white;
        }
        
        .timeline-item.current .timeline-status {
            background: #f59e0b;
            color: white;
        }
        
        .timeline-item:not(.completed):not(.current) .timeline-status {
            background: #e5e7eb;
            color: #6b7280;
        }
        
        .timeline-content {
            flex: 1;
        }
        
        .timeline-title {
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .timeline-date {
            font-size: 0.9rem;
            color: #64748b;
        }
        
        .storyboard {
            display: grid;
            gap: 20px;
        }
        
        .storyboard-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
        }
        
        .storyboard-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .storyboard-title {
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .storyboard-status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .storyboard-status.completed {
            background: #dcfce7;
            color: #166534;
        }
        
        .storyboard-status.inProgress {
            background: #fef3c7;
            color: #92400e;
        }
        
        .storyboard-status.draft {
            background: #f3f4f6;
            color: #374151;
        }
        
        .team-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        
        .team-member {
            display: flex;
            align-items: center;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
        }
        
        .team-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 15px;
        }
        
        .team-info h4 {
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .team-info p {
            font-size: 0.9rem;
            color: #64748b;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #64748b;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="page cover">
        <div class="logo">
            <img src="${projectData.logo}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;">
        </div>
        <h1>${projectData.name}</h1>
        <p>${projectData.description}</p>
        <div class="meta">
            <p>Project Manager: ${projectData.manager}</p>
            <p>Duration: ${projectData.startDate} - ${projectData.endDate}</p>
            <p>Team Size: ${projectData.teamSize} members</p>
            <p>Status: ${projectData.status}</p>
        </div>
    </div>
    
    <!-- Project Overview -->
    <div class="page">
        <div class="section">
            <h2>Project Overview</h2>
            <p>This comprehensive report provides insights into the ${projectData.name} project, including key performance indicators, project timeline, and team collaboration highlights.</p>
        </div>
        
        <div class="section">
            <h2>Key Performance Indicators</h2>
            <div class="kpi-grid">
                ${projectData.kpis.map(kpi => `
                    <div class="kpi-card">
                        <div class="kpi-name">${kpi.name}</div>
                        <div class="kpi-value">${kpi.value}${kpi.unit}</div>
                        <div class="kpi-target">Target: ${kpi.target}${kpi.unit}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2>Project Timeline</h2>
            <div class="timeline">
                ${projectData.timeline.map(item => `
                    <div class="timeline-item ${item.completed ? 'completed' : ''}">
                        <div class="timeline-status">${item.completed ? '✓' : '○'}</div>
                        <div class="timeline-content">
                            <div class="timeline-title">${item.stage}</div>
                            <div class="timeline-date">${item.date}</div>
                            <div>${item.description}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
    
    <!-- Storyboard Highlights -->
    <div class="page">
        <div class="section">
            <h2>Storyboard Highlights</h2>
            <div class="storyboard">
                ${projectData.storyboard.map(item => `
                    <div class="storyboard-item">
                        <div class="storyboard-header">
                            <div class="storyboard-title">${item.title}</div>
                            <div class="storyboard-status ${item.status}">${item.status}</div>
                        </div>
                        <p><strong>Description:</strong> ${item.description}</p>
                        <p><strong>Notes:</strong> ${item.notes}</p>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2>Team Members</h2>
            <div class="team-grid">
                ${projectData.team.map(member => `
                    <div class="team-member">
                        <img src="${member.avatar}" alt="${member.name}" class="team-avatar">
                        <div class="team-info">
                            <h4>${member.name}</h4>
                            <p>${member.role}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} | Global Next Marketing Platform</p>
        </div>
    </div>
</body>
</html>
  `;
};

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  try {
    // Validate project ID
    const projectId = req.params.id;
    const validatedProjectId = ProjectIdSchema.parse(projectId);

    context.log(`Generating PDF for project: ${validatedProjectId}`);

    // Generate HTML content
    const htmlContent = generatePDFHTML(mockProjectData);

    // Launch Playwright browser
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set content and wait for it to load
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    // Close browser
    await browser.close();

    // Set response headers
    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${mockProjectData.name.replace(/\s+/g, '_')}_Report.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      },
      body: pdfBuffer
    };

    context.log(`PDF generated successfully for project: ${validatedProjectId}`);

  } catch (error) {
    context.log.error('Error generating PDF:', error);
    
    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        error: 'Failed to generate PDF',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
};

export default httpTrigger;
