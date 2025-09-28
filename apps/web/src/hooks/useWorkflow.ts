'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { WorkflowContext, WorkflowResult } from '@repo/lib';

export interface UseWorkflowOptions {
  onSuccess?: (result: WorkflowResult) => void;
  onError?: (error: string) => void;
  showLoading?: boolean;
}

export function useWorkflow(options: UseWorkflowOptions = {}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeWorkflow = useCallback(async (
    workflowId: string,
    stepId: string,
    context: Partial<WorkflowContext> = {}
  ) => {
    if (!session?.user) {
      setError('User not authenticated');
      options.onError?.('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create full context
      const fullContext: WorkflowContext = {
        user: session.user as any,
        ...context,
      };

      // Simulate workflow execution (in real app, this would call the API)
      const result = await simulateWorkflowExecution(workflowId, stepId, fullContext);

      if (result.success) {
        options.onSuccess?.(result);
        
        // Handle redirects
        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
      } else {
        setError(result.message);
        options.onError?.(result.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [session, router, options]);

  return {
    executeWorkflow,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

// Simulate workflow execution (replace with actual API calls)
async function simulateWorkflowExecution(
  workflowId: string,
  stepId: string,
  context: WorkflowContext
): Promise<WorkflowResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock workflow execution based on workflow ID and step
  switch (workflowId) {
    case 'auth_login':
      return {
        success: true,
        message: 'Login successful',
        redirectTo: '/dashboard',
      };

    case 'campaign_create':
      return {
        success: true,
        message: 'Campaign created successfully',
        redirectTo: `/campaigns/${context.campaignId || 'new'}/room`,
      };

    case 'analytics_export':
      return {
        success: true,
        message: 'Export generated successfully',
        data: { downloadUrl: '/api/exports/analytics.pdf' },
      };

    case 'send_message':
      return {
        success: true,
        message: 'Message sent successfully',
        data: { messageId: 'msg_' + Date.now() },
      };

    case 'toggle_ai_tool':
      return {
        success: true,
        message: 'AI tool toggled successfully',
        data: { toolId: context.data?.toolId },
      };

    default:
      return {
        success: false,
        message: 'Unknown workflow',
      };
  }
}

// Specific workflow hooks for common actions
export function useAuthWorkflow() {
  const { executeWorkflow, isLoading, error } = useWorkflow();

  const login = useCallback((email: string, password: string) => {
    return executeWorkflow('auth_login', 'validate_credentials', {
      data: { email, password },
    });
  }, [executeWorkflow]);

  const logout = useCallback(() => {
    return executeWorkflow('auth_logout', 'logout');
  }, [executeWorkflow]);

  return { login, logout, isLoading, error };
}

export function useCampaignWorkflow() {
  const { executeWorkflow, isLoading, error } = useWorkflow();

  const createCampaign = useCallback((campaignData: any) => {
    return executeWorkflow('campaign_create', 'create_campaign', {
      data: campaignData,
    });
  }, [executeWorkflow]);

  const editCampaign = useCallback((campaignId: string, campaignData: any) => {
    return executeWorkflow('campaign_edit', 'edit_campaign', {
      campaignId,
      data: campaignData,
    });
  }, [executeWorkflow]);

  const deleteCampaign = useCallback((campaignId: string) => {
    return executeWorkflow('campaign_delete', 'delete_campaign', {
      campaignId,
    });
  }, [executeWorkflow]);

  return { createCampaign, editCampaign, deleteCampaign, isLoading, error };
}

export function useAnalyticsWorkflow() {
  const { executeWorkflow, isLoading, error } = useWorkflow();

  const exportPDF = useCallback((projectId: string) => {
    return executeWorkflow('analytics_export', 'export_pdf', {
      projectId,
    });
  }, [executeWorkflow]);

  const exportExcel = useCallback((projectId: string) => {
    return executeWorkflow('analytics_export', 'export_excel', {
      projectId,
    });
  }, [executeWorkflow]);

  const generateInsights = useCallback((projectId: string) => {
    return executeWorkflow('analytics_insights', 'generate_insights', {
      projectId,
    });
  }, [executeWorkflow]);

  return { exportPDF, exportExcel, generateInsights, isLoading, error };
}

export function useCommunicationWorkflow() {
  const { executeWorkflow, isLoading, error } = useWorkflow();

  const sendMessage = useCallback((campaignId: string, message: string) => {
    return executeWorkflow('send_message', 'send_message', {
      campaignId,
      data: { message },
    });
  }, [executeWorkflow]);

  const scheduleMeeting = useCallback((campaignId: string, meetingData: any) => {
    return executeWorkflow('schedule_meeting', 'schedule_meeting', {
      campaignId,
      data: meetingData,
    });
  }, [executeWorkflow]);

  return { sendMessage, scheduleMeeting, isLoading, error };
}

export function useAdminWorkflow() {
  const { executeWorkflow, isLoading, error } = useWorkflow();

  const toggleAITool = useCallback((toolId: string, enabled: boolean) => {
    return executeWorkflow('toggle_ai_tool', 'toggle_tool', {
      data: { toolId, enabled },
    });
  }, [executeWorkflow]);

  const updateKPIs = useCallback((projectId: string, kpiData: any) => {
    return executeWorkflow('update_kpis', 'update_kpis', {
      projectId,
      data: kpiData,
    });
  }, [executeWorkflow]);

  return { toggleAITool, updateKPIs, isLoading, error };
}
