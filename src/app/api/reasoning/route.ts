import { NextRequest, NextResponse } from 'next/server';
import { TriLoopReasoning } from '@/lib/reasoning/tri-loop';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { query, context } = await request.json();

    const reasoning = new TriLoopReasoning();
    const trace = await reasoning.reason(query, context || {
      sessionId: 'session-' + Date.now(),
      timestamp: Date.now()
    });

    await db.reasoningTrace.create({
      data: {
        queryId: trace.queryId,
        userId: context?.userId || null,
        ethicalRiskScore: trace.ethicalRiskScore,
        riskCategory: trace.riskCategory,
        riskFactors: JSON.stringify(trace.riskFactors),
        strategy: trace.strategy,
        certaintyGain: trace.certaintyGain,
        timePenalty: trace.timePenalty,
        computationalCost: trace.computationalCost,
        ccrr: trace.ccrr,
        decision: trace.decision,
        justification: JSON.stringify(trace.justification),
        improvementPlan: trace.improvementPlan ? JSON.stringify(trace.improvementPlan) : null,
      }
    });

    return NextResponse.json({
      success: true,
      trace
    });
  } catch (error: any) {
    console.error('Reasoning API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
