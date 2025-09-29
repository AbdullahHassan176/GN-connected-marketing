import { webhookService } from './webhook-service';

export class WebhookEmitter {
  // Emit webhook when work item is created
  static async emitWorkItemCreated(
    organizationId: string,
    projectId: string,
    workItem: {
      id: string;
      title: string;
      description: string;
      assignee: string;
      priority: string;
      status: string;
      createdAt: string;
    }
  ): Promise<void> {
    try {
      await webhookService.createEvent(
        'work_item.created',
        organizationId,
        projectId,
        {
          workItem: {
            id: workItem.id,
            title: workItem.title,
            description: workItem.description,
            assignee: workItem.assignee,
            priority: workItem.priority,
            status: workItem.status,
            createdAt: workItem.createdAt
          }
        }
      );
    } catch (error) {
      console.error('Failed to emit work_item.created webhook:', error);
    }
  }

  // Emit webhook when approval is requested
  static async emitApprovalRequested(
    organizationId: string,
    projectId: string,
    approval: {
      id: string;
      type: string;
      title: string;
      description: string;
      requester: string;
      amount?: number;
      priority: string;
      dueDate: string;
      createdAt: string;
    }
  ): Promise<void> {
    try {
      await webhookService.createEvent(
        'approval.requested',
        organizationId,
        projectId,
        {
          approval: {
            id: approval.id,
            type: approval.type,
            title: approval.title,
            description: approval.description,
            requester: approval.requester,
            amount: approval.amount,
            priority: approval.priority,
            dueDate: approval.dueDate,
            createdAt: approval.createdAt
          }
        }
      );
    } catch (error) {
      console.error('Failed to emit approval.requested webhook:', error);
    }
  }

  // Emit webhook when insights are updated
  static async emitInsightsUpdated(
    organizationId: string,
    projectId: string,
    insights: {
      id: string;
      type: string;
      title: string;
      description: string;
      metrics: Record<string, any>;
      confidence: number;
      recommendations: string[];
      updatedAt: string;
    }
  ): Promise<void> {
    try {
      await webhookService.createEvent(
        'insights.updated',
        organizationId,
        projectId,
        {
          insights: {
            id: insights.id,
            type: insights.type,
            title: insights.title,
            description: insights.description,
            metrics: insights.metrics,
            confidence: insights.confidence,
            recommendations: insights.recommendations,
            updatedAt: insights.updatedAt
          }
        }
      );
    } catch (error) {
      console.error('Failed to emit insights.updated webhook:', error);
    }
  }

  // Emit webhook when export is completed
  static async emitExportCompleted(
    organizationId: string,
    projectId: string,
    exportData: {
      id: string;
      type: 'pdf' | 'xlsx';
      projectName: string;
      fileName: string;
      fileSize: number;
      downloadUrl: string;
      completedAt: string;
    }
  ): Promise<void> {
    try {
      await webhookService.createEvent(
        'export.completed',
        organizationId,
        projectId,
        {
          export: {
            id: exportData.id,
            type: exportData.type,
            projectName: exportData.projectName,
            fileName: exportData.fileName,
            fileSize: exportData.fileSize,
            downloadUrl: exportData.downloadUrl,
            completedAt: exportData.completedAt
          }
        }
      );
    } catch (error) {
      console.error('Failed to emit export.completed webhook:', error);
    }
  }
}
