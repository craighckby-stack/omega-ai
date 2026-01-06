import { NextRequest, NextResponse } from 'next/server';
import { SelfImprovementCycle } from '@/lib/learning/self-improvement';

const cycle = new SelfImprovementCycle();

export async function POST(request: NextRequest) {
  try {
    const { action, constraintLevel } = await request.json();

    switch (action) {
      case 'start-cycle':
        const result = await cycle.executeCycle();
        return NextResponse.json({
          success: true,
          cycle: result
        });

      case 'get-status':
        return NextResponse.json({
          success: true,
          currentCycle: await cycle.getConstraintLevel()
        });

      case 'set-constraint':
        if (constraintLevel) {
          cycle.setConstraintLevel(constraintLevel);
          return NextResponse.json({
            success: true,
            constraintLevel: cycle.getConstraintLevel()
          });
        }
        return NextResponse.json(
          { error: 'Constraint level required' },
          { status: 400 }
        );

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Learning API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
