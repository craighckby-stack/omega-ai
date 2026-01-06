import { NextRequest, NextResponse } from 'next/server';
import { AgentOrchestrator } from '@/lib/agents/orchestrator';

export async function POST(request: NextRequest) {
  try {
    const { query, domain, priority } = await request.json();

    const orchestrator = new AgentOrchestrator();
    const task = {
      id: 'task-' + Date.now(),
      domain: domain || 'General',
      query,
      priority: priority || 1,
      timestamp: Date.now()
    };

    const result = await orchestrator.executeTask(task);

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error: any) {
    console.error('Agents API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
