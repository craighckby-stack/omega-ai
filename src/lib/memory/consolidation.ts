import { db } from '@/lib/db';

export interface ConsolidationTask {
  concepts: string[];
  experienceData: any;
  timestamp: Date;
  priority: number;
}

export class MemoryConsolidation {
  async queueConsolidation(task: ConsolidationTask): Promise<void> {
    await db.consolidationTask.create({
      data: {
        concepts: task.concepts,
        data: task.experienceData,
        timestamp: task.timestamp,
        priority: task.priority,
        status: 'PENDING'
      }
    });

    const pendingCount = await db.consolidationTask.count({
      where: { status: 'PENDING' }
    });

    if (pendingCount >= 5) {
      await this.consolidate();
    }
  }

  async consolidate(): Promise<void> {
    console.log('🧠 Consolidating memory...');

    const tasks = await db.consolidationTask.findMany({
      where: { status: 'PENDING' },
      take: 50
    });

    for (const task of tasks) {
      await this.consolidateTask(task);
      await db.consolidationTask.update({
        where: { id: task.id },
        data: { status: 'COMPLETED' }
      });
    }

    await this.pruneWeakKnowledge();
    await this.mergeSimilarConcepts();

    console.log('✅ Consolidation complete');
  }

  private async consolidateTask(task: ConsolidationTask): Promise<void> {
    const concepts = task.concepts;

    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        await this.strengthenRelationship(concepts[i], concepts[j]);
      }
    }
  }

  private async strengthenRelationship(
    concept1: string,
    concept2: string
  ): Promise<void> {
    const conceptRecord1 = await db.concept.findUnique({
      where: { name: concept1 }
    });

    const conceptRecord2 = await db.concept.findUnique({
      where: { name: concept2 }
    });

    if (conceptRecord1 && conceptRecord2) {
      const relationships = (conceptRecord1.relationships as any) || {};
      const existingRel = relationships[concept2];

      if (existingRel) {
        existingRel.strength = Math.min(1.0, existingRel.strength + 0.02);
        await db.concept.update({
          where: { name: concept1 },
          data: { relationships }
        });
      }
    }
  }

  private async pruneWeakKnowledge(): Promise<void> {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const weakConcepts = await db.concept.findMany({
      where: {
        confidence: { lt: 0.2 },
        lastSeen: { lte: weekAgo }
      }
    });

    for (const concept of weakConcepts) {
      await db.concept.delete({ where: { id: concept.id } });
      console.log(`  🗑️ Pruned concept: ${concept.name}`);
    }
  }

  private async mergeSimilarConcepts(): Promise<void> {
    const allConcepts = await db.concept.findMany({
      take: 100
    });

    for (let i = 0; i < allConcepts.length; i++) {
      for (let j = i + 1; j < allConcepts.length; j++) {
        const similarity = this.calculateSimilarity(
          allConcepts[i],
          allConcepts[j]
        );

        if (similarity > 0.8) {
          await this.mergeConcepts(allConcepts[i], allConcepts[j]);
        }
      }
    }
  }

  private calculateSimilarity(
    concept1: any,
    concept2: any
  ): number {
    // Calculate similarity based on name and semantic tags
    const nameSimilarity = this.stringSimilarity(concept1.name, concept2.name);

    const tags1 = new Set(concept1.semanticTags || []);
    const tags2 = new Set(concept2.semanticTags || []);
    const intersection = new Set([...tags1].filter(t => tags2.has(t)));
    const union = new Set([...tags1, ...tags2]);
    const tagSimilarity = intersection.size / (union.size || 1);

    return (nameSimilarity + tagSimilarity) / 2;
  }

  private stringSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1.0;
    const longer = Math.max(str1.length, str2.length);
    const distance = this.levenshteinDistance(str1, str2);
    return 1.0 - distance / longer;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(0));

    for (let i = 0; i <= str2.length; i++) {
      for (let j = 0; j <= str1.length; j++) {
        if (i === 0) matrix[i][j] = j;
        else if (j === 0) matrix[i][j] = i;
        else {
          const cost = str1[j - 1] === str2[i - 1] ? 0 : 1;
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + cost
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }
}
