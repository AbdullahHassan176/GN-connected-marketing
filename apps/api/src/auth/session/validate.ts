import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { verifyToken, extractUserFromPayload } from '@repo/lib';
import { getContainer, CONTAINERS } from '@repo/lib';

export async function validateSession(req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        jsonBody: {
          success: false,
          error: 'Missing or invalid authorization header',
        },
      };
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);
    
    if (!payload) {
      return {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        jsonBody: {
          success: false,
          error: 'Invalid token',
        },
      };
    }

    const user = extractUserFromPayload(payload);
    
    // Get fresh user data from database
    const { resource: userData } = await getContainer(CONTAINERS.USERS).item(user.id, user.orgId).read();
    
    if (!userData || userData.status !== 'active') {
      return {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        jsonBody: {
          success: false,
          error: 'User not found or inactive',
        },
      };
    }

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      jsonBody: {
        success: true,
        data: {
          user: userData,
        },
      },
    };

  } catch (error: any) {
    ctx.log.error('Session validation failed:', error);
    
    return {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      jsonBody: {
        success: false,
        error: 'Internal server error',
      },
    };
  }
}

app.http('validateSession', {
  route: 'v1/auth/session/validate',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: validateSession,
});
