import { AzureFunction, Context } from '@azure/functions';
import { AuthenticatedRequest } from './auth';
import { z } from 'zod';

/**
 * Zod validation middleware
 */
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return function (handler: AzureFunction): AzureFunction {
    return async function (context: Context, req: AuthenticatedRequest): Promise<void> {
      try {
        // Parse and validate request body
        const result = schema.safeParse(req.body);
        
        if (!result.success) {
          context.res = {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            body: {
              success: false,
              error: 'Validation Error',
              message: 'Invalid request body',
              details: result.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code,
              })),
            },
          };
          return;
        }

        // Attach validated data to request
        (req as any).validatedBody = result.data;
        await handler(context, req);
      } catch (error) {
        context.log.error('Validation middleware error:', error);
        
        context.res = {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Internal Server Error',
            message: 'Validation failed',
          },
        };
      }
    };
  };
}

/**
 * Zod validation middleware for query parameters
 */
export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return function (handler: AzureFunction): AzureFunction {
    return async function (context: Context, req: AuthenticatedRequest): Promise<void> {
      try {
        // Parse and validate query parameters
        const result = schema.safeParse(req.query);
        
        if (!result.success) {
          context.res = {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            body: {
              success: false,
              error: 'Validation Error',
              message: 'Invalid query parameters',
              details: result.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code,
              })),
            },
          };
          return;
        }

        // Attach validated data to request
        (req as any).validatedQuery = result.data;
        await handler(context, req);
      } catch (error) {
        context.log.error('Query validation middleware error:', error);
        
        context.res = {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Internal Server Error',
            message: 'Query validation failed',
          },
        };
      }
    };
  };
}

/**
 * Zod validation middleware for path parameters
 */
export function validateParams<T>(schema: z.ZodSchema<T>) {
  return function (handler: AzureFunction): AzureFunction {
    return async function (context: Context, req: AuthenticatedRequest): Promise<void> {
      try {
        // Parse and validate path parameters
        const result = schema.safeParse(req.params);
        
        if (!result.success) {
          context.res = {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            body: {
              success: false,
              error: 'Validation Error',
              message: 'Invalid path parameters',
              details: result.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code,
              })),
            },
          };
          return;
        }

        // Attach validated data to request
        (req as any).validatedParams = result.data;
        await handler(context, req);
      } catch (error) {
        context.log.error('Params validation middleware error:', error);
        
        context.res = {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Internal Server Error',
            message: 'Params validation failed',
          },
        };
      }
    };
  };
}

/**
 * Combined validation middleware for body, query, and params
 */
export function validateAll<TBody, TQuery, TParams>(
  bodySchema?: z.ZodSchema<TBody>,
  querySchema?: z.ZodSchema<TQuery>,
  paramsSchema?: z.ZodSchema<TParams>
) {
  return function (handler: AzureFunction): AzureFunction {
    return async function (context: Context, req: AuthenticatedRequest): Promise<void> {
      try {
        const errors: any[] = [];
        let validatedBody: TBody | undefined;
        let validatedQuery: TQuery | undefined;
        let validatedParams: TParams | undefined;

        // Validate body
        if (bodySchema) {
          const bodyResult = bodySchema.safeParse(req.body);
          if (!bodyResult.success) {
            errors.push(...bodyResult.error.errors.map(err => ({
              type: 'body',
              field: err.path.join('.'),
              message: err.message,
              code: err.code,
            })));
          } else {
            validatedBody = bodyResult.data;
          }
        }

        // Validate query
        if (querySchema) {
          const queryResult = querySchema.safeParse(req.query);
          if (!queryResult.success) {
            errors.push(...queryResult.error.errors.map(err => ({
              type: 'query',
              field: err.path.join('.'),
              message: err.message,
              code: err.code,
            })));
          } else {
            validatedQuery = queryResult.data;
          }
        }

        // Validate params
        if (paramsSchema) {
          const paramsResult = paramsSchema.safeParse(req.params);
          if (!paramsResult.success) {
            errors.push(...paramsResult.error.errors.map(err => ({
              type: 'params',
              field: err.path.join('.'),
              message: err.message,
              code: err.code,
            })));
          } else {
            validatedParams = paramsResult.data;
          }
        }

        // If there are validation errors, return them
        if (errors.length > 0) {
          context.res = {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            body: {
              success: false,
              error: 'Validation Error',
              message: 'Invalid request parameters',
              details: errors,
            },
          };
          return;
        }

        // Attach validated data to request
        if (validatedBody !== undefined) (req as any).validatedBody = validatedBody;
        if (validatedQuery !== undefined) (req as any).validatedQuery = validatedQuery;
        if (validatedParams !== undefined) (req as any).validatedParams = validatedParams;

        await handler(context, req);
      } catch (error) {
        context.log.error('Combined validation middleware error:', error);
        
        context.res = {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: {
            success: false,
            error: 'Internal Server Error',
            message: 'Validation failed',
          },
        };
      }
    };
  };
}
