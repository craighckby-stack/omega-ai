import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [totalConcepts, totalExperiences, reasoningTraces, encryptedPackets] =
      await Promise.all([
        db.concept.count(),
        db.experience.count(),
        db.reasoningTrace.count(),
        db.encryptedPacket.count(),
      ]);

    const status = {
      consciousness: 'ACTIVE',
      reasoning: 'ACTIVE',
      memory: 'ACTIVE',
      agents: 'ACTIVE',
      security: 'ACTIVE',
      learning: 'IDLE',
    };

    return NextResponse.json({
      totalConcepts,
      totalExperiences,
      activeAgents: 17,
      currentCycle: 0,
      encryptedPackets,
      reasoningTraces,
      status,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
