'use client';

import { ReactNode } from 'react';
import { Button, ButtonProps } from '@repo/ui';
import { useWorkflow } from '@/hooks/useWorkflow';

export interface WorkflowButtonProps extends Omit<ButtonProps, 'onClick'> {
  workflowId: string;
  stepId: string;
  context?: Record<string, any>;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  children: ReactNode;
  loadingText?: string;
}

export function WorkflowButton({
  workflowId,
  stepId,
  context = {},
  onSuccess,
  onError,
  children,
  loadingText = 'Loading...',
  disabled,
  ...props
}: WorkflowButtonProps) {
  const { executeWorkflow, isLoading, error } = useWorkflow({
    onSuccess,
    onError,
  });

  const handleClick = () => {
    executeWorkflow(workflowId, stepId, context);
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? loadingText : children}
    </Button>
  );
}

// Pre-configured workflow buttons for common actions
export function CreateCampaignButton({ onSuccess, ...props }: Omit<WorkflowButtonProps, 'workflowId' | 'stepId'>) {
  return (
    <WorkflowButton
      workflowId="campaign_create"
      stepId="create_campaign"
      onSuccess={onSuccess}
      {...props}
    >
      Create Campaign
    </WorkflowButton>
  );
}

export function ExportPDFButton({ projectId, onSuccess, ...props }: Omit<WorkflowButtonProps, 'workflowId' | 'stepId'> & { projectId: string }) {
  return (
    <WorkflowButton
      workflowId="analytics_export"
      stepId="export_pdf"
      context={{ projectId }}
      onSuccess={onSuccess}
      {...props}
    >
      Export PDF
    </WorkflowButton>
  );
}

export function ExportExcelButton({ projectId, onSuccess, ...props }: Omit<WorkflowButtonProps, 'workflowId' | 'stepId'> & { projectId: string }) {
  return (
    <WorkflowButton
      workflowId="analytics_export"
      stepId="export_excel"
      context={{ projectId }}
      onSuccess={onSuccess}
      {...props}
    >
      Export Excel
    </WorkflowButton>
  );
}

export function SendMessageButton({ campaignId, message, onSuccess, ...props }: Omit<WorkflowButtonProps, 'workflowId' | 'stepId'> & { campaignId: string; message: string }) {
  return (
    <WorkflowButton
      workflowId="send_message"
      stepId="send_message"
      context={{ campaignId, data: { message } }}
      onSuccess={onSuccess}
      {...props}
    >
      Send Message
    </WorkflowButton>
  );
}

export function ToggleAIToolButton({ toolId, enabled, onSuccess, ...props }: Omit<WorkflowButtonProps, 'workflowId' | 'stepId'> & { toolId: string; enabled: boolean }) {
  return (
    <WorkflowButton
      workflowId="toggle_ai_tool"
      stepId="toggle_tool"
      context={{ data: { toolId, enabled } }}
      onSuccess={onSuccess}
      {...props}
    >
      {enabled ? 'Disable' : 'Enable'} AI Tool
    </WorkflowButton>
  );
}

export function GenerateInsightsButton({ projectId, onSuccess, ...props }: Omit<WorkflowButtonProps, 'workflowId' | 'stepId'> & { projectId: string }) {
  return (
    <WorkflowButton
      workflowId="analytics_insights"
      stepId="generate_insights"
      context={{ projectId }}
      onSuccess={onSuccess}
      {...props}
    >
      Generate Insights
    </WorkflowButton>
  );
}

export function LogoutButton({ onSuccess, ...props }: Omit<WorkflowButtonProps, 'workflowId' | 'stepId'>) {
  return (
    <WorkflowButton
      workflowId="auth_logout"
      stepId="logout"
      onSuccess={onSuccess}
      variant="outline"
      {...props}
    >
      Logout
    </WorkflowButton>
  );
}
