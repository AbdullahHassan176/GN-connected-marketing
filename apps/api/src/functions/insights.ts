import { AzureFunction, Context } from '@azure/functions';
import { AuthenticatedRequest } from '../middleware/auth';
import { withAuth } from '../middleware/auth';
import { requireProjectAccess } from '../middleware/rbac';
import { validateParams, validateBody, validateQuery, validateAll } from '../middleware/validation';
import { withAllMiddleware } from '../middleware/error';
import { z } from 'zod';
import { getItem, getAllItems, upsertItem } from '@repo/lib/db';
import { 
  ProjectIdSchema, 
  CreateInsightSchema,
  PaginationSchema,
  SortSchema,
  FilterSchema 
} from '@repo/lib/validation/api';

/**
 * GET /projects/:projectId/insights
 * Get project insights
 */
const getProjectInsightsHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { projectId } = req.validatedParams;
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', type } = req.validatedQuery || {};
    
    // Get all insights for project
    const insights = await getAllItems('insights');
    let projectInsights = insights.filter((insight: any) => insight.projectId === projectId);
    
    // Apply filters
    if (type) {
      projectInsights = projectInsights.filter((insight: any) => insight.type === type);
    }
    
    // Apply sorting
    projectInsights.sort((a: any, b: any) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedInsights = projectInsights.slice(startIndex, endIndex);
    
    // Calculate pagination info
    const total = projectInsights.length;
    const pages = Math.ceil(total / limit);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: paginatedInsights,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      },
    };
  } catch (error) {
    context.log.error('Get project insights error:', error);
    throw error;
  }
};

export const getProjectInsights = withAllMiddleware(
  withAuth(
    requireProjectAccess('client')(
      validateAll(
        undefined,
        z.object({ 
          ...PaginationSchema.shape,
          ...SortSchema.shape,
          ...FilterSchema.shape,
        }),
        z.object({ projectId: ProjectIdSchema })
      )(
        getProjectInsightsHandler
      )
    )
  )
);

/**
 * POST /projects/:projectId/insights
 * Create new insight
 */
const createInsightHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { projectId } = req.validatedParams;
    const insightData = req.validatedBody;
    
    // Generate insight ID
    const insightId = `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create insight
    const newInsight = {
      id: insightId,
      projectId,
      ...insightData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await upsertItem('insights', newInsight);

    context.res = {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: newInsight,
        message: 'Insight created successfully',
      },
    };
  } catch (error) {
    context.log.error('Create insight error:', error);
    throw error;
  }
};

export const createInsight = withAllMiddleware(
  withAuth(
    requireProjectAccess('analyst')(
      validateAll(
        CreateInsightSchema,
        undefined,
        z.object({ projectId: ProjectIdSchema })
      )(
        createInsightHandler
      )
    )
  )
);

/**
 * GET /projects/:projectId/insights/summary
 * Get project insights summary
 */
const getInsightsSummaryHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { projectId } = req.validatedParams;
    
    // Get all insights for project
    const insights = await getAllItems('insights');
    const projectInsights = insights.filter((insight: any) => insight.projectId === projectId);
    
    // Calculate summary statistics
    const totalInsights = projectInsights.length;
    const aiGenerated = projectInsights.filter((i: any) => i.type === 'ai_generated').length;
    const manual = projectInsights.filter((i: any) => i.type === 'manual').length;
    const automated = projectInsights.filter((i: any) => i.type === 'automated').length;
    
    // Get confidence scores for AI insights
    const aiInsights = projectInsights.filter((i: any) => i.type === 'ai_generated');
    const avgConfidence = aiInsights.length > 0 
      ? aiInsights.reduce((sum: number, i: any) => sum + (i.confidence || 0), 0) / aiInsights.length 
      : 0;
    
    // Get recent insights (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const recentInsights = projectInsights.filter((i: any) => i.createdAt > thirtyDaysAgo).length;
    
    // Get top recommendations
    const allRecommendations = projectInsights
      .flatMap((i: any) => i.content?.recommendations || [])
      .reduce((acc: Record<string, number>, rec: string) => {
        acc[rec] = (acc[rec] || 0) + 1;
        return acc;
      }, {});
    
    const topRecommendations = Object.entries(allRecommendations)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([recommendation, count]) => ({ recommendation, count }));

    const summary = {
      total: totalInsights,
      byType: {
        aiGenerated: aiGenerated,
        manual: manual,
        automated: automated,
      },
      aiMetrics: {
        count: aiGenerated,
        averageConfidence: Math.round(avgConfidence * 100) / 100,
        highConfidence: aiInsights.filter((i: any) => (i.confidence || 0) > 0.8).length,
      },
      recentActivity: {
        last30Days: recentInsights,
        growthRate: totalInsights > 0 ? (recentInsights / totalInsights) * 100 : 0,
      },
      topRecommendations,
      trends: {
        mostActiveDay: getMostActiveDay(projectInsights),
        insightsPerWeek: Math.round((totalInsights / getWeeksSinceStart(projectInsights)) * 10) / 10,
      },
    };

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: summary,
      },
    };
  } catch (error) {
    context.log.error('Get insights summary error:', error);
    throw error;
  }
};

export const getInsightsSummary = withAllMiddleware(
  withAuth(
    requireProjectAccess('client')(
      validateParams(z.object({ projectId: ProjectIdSchema }))(
        getInsightsSummaryHandler
      )
    )
  )
);

// Helper functions
function getMostActiveDay(insights: any[]): string {
  const dayCounts: Record<string, number> = {};
  
  insights.forEach(insight => {
    const day = new Date(insight.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  
  return Object.entries(dayCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'Monday';
}

function getWeeksSinceStart(insights: any[]): number {
  if (insights.length === 0) return 1;
  
  const earliest = new Date(Math.min(...insights.map(i => new Date(i.createdAt).getTime())));
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - earliest.getTime());
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  
  return Math.max(1, diffWeeks);
}
