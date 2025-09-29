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
  CreateMessageSchema,
  PaginationSchema,
  SortSchema,
  FilterSchema 
} from '@repo/lib/validation/api';

/**
 * GET /projects/:projectId/messages
 * Get project messages
 */
const getProjectMessagesHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { projectId } = req.validatedParams;
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', type } = req.validatedQuery || {};
    
    // Get all messages for project
    const messages = await getAllItems('messages');
    let projectMessages = messages.filter((message: any) => message.projectId === projectId);
    
    // Apply filters
    if (type) {
      projectMessages = projectMessages.filter((message: any) => message.type === type);
    }
    
    // Apply sorting
    projectMessages.sort((a: any, b: any) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMessages = projectMessages.slice(startIndex, endIndex);
    
    // Calculate pagination info
    const total = projectMessages.length;
    const pages = Math.ceil(total / limit);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: paginatedMessages,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      },
    };
  } catch (error) {
    context.log.error('Get project messages error:', error);
    throw error;
  }
};

export const getProjectMessages = withAllMiddleware(
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
        getProjectMessagesHandler
      )
    )
  )
);

/**
 * POST /projects/:projectId/messages
 * Create new message
 */
const createMessageHandler: AzureFunction = async function (context: Context, req: AuthenticatedRequest): Promise<void> {
  try {
    const { projectId } = req.validatedParams;
    const messageData = req.validatedBody;
    
    // Generate message ID
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create message
    const newMessage = {
      id: messageId,
      projectId,
      senderId: req.user!.id,
      ...messageData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await upsertItem('messages', newMessage);

    context.res = {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        success: true,
        data: newMessage,
        message: 'Message created successfully',
      },
    };
  } catch (error) {
    context.log.error('Create message error:', error);
    throw error;
  }
};

export const createMessage = withAllMiddleware(
  withAuth(
    requireProjectAccess('client')(
      validateAll(
        CreateMessageSchema,
        undefined,
        z.object({ projectId: ProjectIdSchema })
      )(
        createMessageHandler
      )
    )
  )
);
