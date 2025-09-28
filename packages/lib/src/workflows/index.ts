import { User } from '../types';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  action: string;
  requiredRole?: string;
  requiredPermission?: string;
  nextSteps?: string[];
  conditions?: {
    userRole?: string[];
    projectStatus?: string[];
    dataRequired?: string[];
  };
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'auth' | 'project' | 'campaign' | 'analytics' | 'admin' | 'export' | 'communication';
  steps: WorkflowStep[];
  triggers: string[];
  permissions: {
    roles: string[];
    scopes: string[];
  };
}

export interface WorkflowContext {
  user: User;
  projectId?: string;
  campaignId?: string;
  data?: Record<string, any>;
}

export interface WorkflowResult {
  success: boolean;
  message: string;
  data?: any;
  nextStep?: string;
  redirectTo?: string;
}

// Workflow execution engine
export class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map();

  registerWorkflow(workflow: Workflow) {
    this.workflows.set(workflow.id, workflow);
  }

  async executeWorkflow(
    workflowId: string,
    stepId: string,
    context: WorkflowContext
  ): Promise<WorkflowResult> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      return {
        success: false,
        message: 'Workflow not found',
      };
    }

    const step = workflow.steps.find(s => s.id === stepId);
    if (!step) {
      return {
        success: false,
        message: 'Workflow step not found',
      };
    }

    // Check permissions
    if (step.requiredRole && !context.user.roles?.some(r => r.role === step.requiredRole)) {
      return {
        success: false,
        message: 'Insufficient permissions',
      };
    }

    // Execute the action
    return await this.executeAction(step.action, context);
  }

  private async executeAction(action: string, context: WorkflowContext): Promise<WorkflowResult> {
    switch (action) {
      case 'navigate_to_dashboard':
        return {
          success: true,
          message: 'Navigating to dashboard',
          redirectTo: '/dashboard',
        };

      case 'navigate_to_campaign_room':
        return {
          success: true,
          message: 'Opening campaign room',
          redirectTo: `/campaigns/${context.campaignId}/room`,
        };

      case 'navigate_to_analytics':
        return {
          success: true,
          message: 'Opening analytics',
          redirectTo: `/analytics/${context.projectId}`,
        };

      case 'navigate_to_team_dashboard':
        return {
          success: true,
          message: 'Opening team dashboard',
          redirectTo: '/team/dashboard',
        };

      case 'export_pdf':
        return {
          success: true,
          message: 'Generating PDF export',
          data: { exportType: 'pdf', projectId: context.projectId },
        };

      case 'export_excel':
        return {
          success: true,
          message: 'Generating Excel export',
          data: { exportType: 'excel', projectId: context.projectId },
        };

      case 'create_campaign':
        return {
          success: true,
          message: 'Creating new campaign',
          redirectTo: '/campaigns/create',
        };

      case 'edit_campaign':
        return {
          success: true,
          message: 'Editing campaign',
          redirectTo: `/campaigns/${context.campaignId}/edit`,
        };

      case 'delete_campaign':
        return {
          success: true,
          message: 'Campaign deleted successfully',
          redirectTo: '/campaigns',
        };

      case 'send_message':
        return {
          success: true,
          message: 'Message sent successfully',
          data: { messageId: 'msg_' + Date.now() },
        };

      case 'schedule_meeting':
        return {
          success: true,
          message: 'Meeting scheduled successfully',
          data: { meetingId: 'meet_' + Date.now() },
        };

      case 'approve_content':
        return {
          success: true,
          message: 'Content approved successfully',
          data: { approvalId: 'app_' + Date.now() },
        };

      case 'reject_content':
        return {
          success: true,
          message: 'Content rejected',
          data: { rejectionId: 'rej_' + Date.now() },
        };

      case 'toggle_ai_tool':
        return {
          success: true,
          message: 'AI tool toggled successfully',
          data: { toolId: context.data?.toolId },
        };

      case 'update_kpis':
        return {
          success: true,
          message: 'KPIs updated successfully',
          data: { kpiId: 'kpi_' + Date.now() },
        };

      case 'generate_insights':
        return {
          success: true,
          message: 'Generating AI insights',
          data: { insightId: 'insight_' + Date.now() },
        };

      case 'switch_language':
        return {
          success: true,
          message: 'Language switched successfully',
          data: { locale: context.data?.locale },
        };

      case 'toggle_theme':
        return {
          success: true,
          message: 'Theme toggled successfully',
          data: { theme: context.data?.theme },
        };

      case 'logout':
        return {
          success: true,
          message: 'Logging out',
          redirectTo: '/login',
        };

      default:
        return {
          success: false,
          message: 'Unknown action',
        };
    }
  }

  getWorkflowsByCategory(category: string): Workflow[] {
    return Array.from(this.workflows.values()).filter(w => w.category === category);
  }

  getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }
}

// Predefined workflows
export const predefinedWorkflows: Workflow[] = [
  // Authentication workflows
  {
    id: 'auth_login',
    name: 'User Login',
    description: 'Authenticate user and redirect to dashboard',
    category: 'auth',
    steps: [
      {
        id: 'validate_credentials',
        name: 'Validate Credentials',
        description: 'Verify user email and password',
        action: 'validate_credentials',
      },
      {
        id: 'create_session',
        name: 'Create Session',
        description: 'Generate JWT token and session',
        action: 'create_session',
      },
      {
        id: 'redirect_dashboard',
        name: 'Redirect to Dashboard',
        description: 'Navigate to appropriate dashboard',
        action: 'navigate_to_dashboard',
      },
    ],
    triggers: ['login_form_submit'],
    permissions: {
      roles: ['owner', 'admin', 'manager', 'analyst', 'client'],
      scopes: ['org'],
    },
  },

  // Campaign workflows
  {
    id: 'campaign_create',
    name: 'Create Campaign',
    description: 'Create a new marketing campaign',
    category: 'campaign',
    steps: [
      {
        id: 'validate_campaign_data',
        name: 'Validate Campaign Data',
        description: 'Validate campaign form data',
        action: 'validate_campaign_data',
        requiredRole: 'manager',
      },
      {
        id: 'create_campaign',
        name: 'Create Campaign',
        description: 'Save campaign to database',
        action: 'create_campaign',
      },
      {
        id: 'redirect_campaign_room',
        name: 'Open Campaign Room',
        description: 'Navigate to campaign room',
        action: 'navigate_to_campaign_room',
      },
    ],
    triggers: ['create_campaign_button'],
    permissions: {
      roles: ['owner', 'admin', 'manager'],
      scopes: ['org', 'project'],
    },
  },

  // Analytics workflows
  {
    id: 'analytics_export',
    name: 'Export Analytics',
    description: 'Export analytics data in various formats',
    category: 'analytics',
    steps: [
      {
        id: 'select_export_format',
        name: 'Select Export Format',
        description: 'Choose PDF or Excel format',
        action: 'select_export_format',
      },
      {
        id: 'generate_export',
        name: 'Generate Export',
        description: 'Create export file',
        action: 'export_pdf', // or export_excel based on selection
      },
      {
        id: 'download_file',
        name: 'Download File',
        description: 'Trigger file download',
        action: 'download_file',
      },
    ],
    triggers: ['export_button'],
    permissions: {
      roles: ['owner', 'admin', 'manager', 'analyst', 'client'],
      scopes: ['org', 'project'],
    },
  },

  // Communication workflows
  {
    id: 'send_message',
    name: 'Send Message',
    description: 'Send message in campaign room',
    category: 'communication',
    steps: [
      {
        id: 'validate_message',
        name: 'Validate Message',
        description: 'Check message content and permissions',
        action: 'validate_message',
      },
      {
        id: 'send_message',
        name: 'Send Message',
        description: 'Deliver message to campaign room',
        action: 'send_message',
      },
    ],
    triggers: ['send_message_button'],
    permissions: {
      roles: ['owner', 'admin', 'manager', 'analyst', 'client'],
      scopes: ['project'],
    },
  },

  // Admin workflows
  {
    id: 'toggle_ai_tool',
    name: 'Toggle AI Tool',
    description: 'Enable or disable AI tools',
    category: 'admin',
    steps: [
      {
        id: 'check_permissions',
        name: 'Check Permissions',
        description: 'Verify admin permissions',
        action: 'check_permissions',
        requiredRole: 'admin',
      },
      {
        id: 'toggle_tool',
        name: 'Toggle Tool',
        description: 'Update tool status',
        action: 'toggle_ai_tool',
      },
    ],
    triggers: ['toggle_ai_tool_button'],
    permissions: {
      roles: ['owner', 'admin'],
      scopes: ['org'],
    },
  },
];

// Export the workflow engine instance
export const workflowEngine = new WorkflowEngine();

// Register all predefined workflows
predefinedWorkflows.forEach(workflow => {
  workflowEngine.registerWorkflow(workflow);
});
