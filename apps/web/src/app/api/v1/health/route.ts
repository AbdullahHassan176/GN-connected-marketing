import { NextRequest, NextResponse } from 'next/server';

// Mock health check for development
export async function GET(request: NextRequest) {
  try {
    // Simulate database query
    const mockData = {
      organizations: 1,
      users: 4,
      projects: 2,
      work_items: 2,
      events: 1,
      assets: 1,
      insights: 1,
      messages: 1,
      approvals: 1,
      tool_inventory: 1,
    };

    return NextResponse.json({
      ok: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      details: {
        database: 'mock-cosmos-db',
        containers: Object.keys(mockData),
        totalItems: Object.values(mockData).reduce((sum, count) => sum + count, 0),
        sampleData: mockData,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
