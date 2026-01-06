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
        ethicalRiskScore: trace.ethicalRiskScore,
        riskCategory: trace.riskCategory,
        riskFactors: trace.riskFactors,
        strategy: trace.strategy,
        certaintyGain: trace.certaintyGain,
        timePenalty: trace.timePenalty,
        computationalCost: trace.computationalCost,
        ccrr: trace.ccrr,
        decision: trace.decision,
        justification: trace.justification,
        improvementPlan: trace.improvementPlan
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
