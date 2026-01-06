import { db } from '@/lib/db';

export interface ConceptNode {
  id: string;
  name: string;
  frequency: number;
  contexts: any[];
  relationships: Map<string, Relationship>;
  confidence: number;
  firstSeen: Date;
  lastSeen: Date;
  semanticTags: Set<string>;
  evidenceCount: number;
  contradictionCount: number;
}

export interface Relationship {
  targetConcept: string;
  type: RelationshipType;
  strength: number;
  evidence: any[];
}

export type RelationshipType =
  | 'IS_A'
  | 'HAS_A'
  | 'CAUSES'
  | 'PART_OF'
  | 'SIMILAR_TO'
  | 'OPPOSITE_OF'
  | 'USES'
  | 'CREATED_BY';

export interface LearningData {
  context: string;
  response: string;
  oecsScore: number;
  stage: string;
  phase: string;
}

export interface Context {
  context: string;
  oecsScore: number;
  timestamp: Date;
}

export class KnowledgeGraph {
  private concepts: Map<string, ConceptNode>;

  constructor() {
    this.concepts = new Map();
  }

  async storeLearning(learningData: LearningData): Promise<string[]> {
    const concepts = await this.extractConcepts(learningData);
    const relationships = await this.extractRelationships(concepts, learningData);

    for (const concept of concepts) {
      await this.updateConcept(concept, learningData);
    }

    for (const relation of relationships) {
      for (const [concept, rels] of Object.entries(relation)) {
        for (const rel of rels as Relationship[]) {
          await this.updateRelationship(concept, rel);
        }
      }
    }

    await this.storeExperience(concepts, relationships, learningData);

    return concepts;
  }

  private async extractConcepts(data: LearningData): Promise<string[]> {
    const text = `${data.context} ${data.response}`;
    const words = text.split(/\s+/);

    const concepts = words
      .filter(word => /^[A-Z][a-z]+$/.test(word))
      .filter(word => word.length > 3);

    return [...new Set(concepts)];
  }

  private async extractRelationships(
    concepts: string[],
    data: LearningData
  ): Promise<Record<string, Relationship[]>> {
    const text = `${data.context} ${data.response}`;
    const relationships: Record<string, Relationship[]> = {};

    const relationPatterns: Record<string, string[]> = {
      'IS_A': ['is a', 'is an', 'is', 'are'],
      'HAS_A': ['has', 'have', 'contains', 'includes'],
      'CAUSES': ['causes', 'leads to', 'results in', 'produces'],
      'PART_OF': ['part of', 'component of', 'element of'],
      'SIMILAR_TO': ['like', 'similar to', 'analogous to', 'resembles'],
      'OPPOSITE_OF': ['opposite of', 'contrary to', 'unlike', 'different from'],
      'USES': ['uses', 'utilizes', 'employs', 'applies'],
      'CREATED_BY': ['created by', 'made by', 'developed by']
    };

    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        const concept1 = concepts[i];
        const concept2 = concepts[j];
        const concept1Pos = text.toLowerCase().indexOf(concept1.toLowerCase());
        const concept2Pos = text.toLowerCase().indexOf(concept2.toLowerCase());

        if (concept1Pos !== -1 && concept2Pos !== -1) {
          const distance = Math.abs(concept1Pos - concept2Pos);
          if (distance < 100) {
            const betweenText = text.toLowerCase().substring(
              Math.min(concept1Pos, concept2Pos),
              Math.max(concept1Pos, concept2Pos)
            );

            for (const [relType, patterns] of Object.entries(relationPatterns)) {
              for (const pattern of patterns) {
                if (betweenText.includes(pattern)) {
                  if (!relationships[concept1]) relationships[concept1] = [];
                  if (!relationships[concept2]) relationships[concept2] = [];

                  const relationship1: Relationship = {
                    targetConcept: concept2,
                    type: relType as RelationshipType,
                    strength: 0.1,
                    evidence: [betweenText]
                  };

                  const relationship2: Relationship = {
                    targetConcept: concept1,
                    type: relType as RelationshipType,
                    strength: 0.1,
                    evidence: [betweenText]
                  };

                  relationships[concept1].push(relationship1);
                  relationships[concept2].push(relationship2);
                }
              }
            }
          }
        }
      }
    }

    return relationships;
  }

  private async updateConcept(
    concept: string,
    data: LearningData
  ): Promise<void> {
    let conceptNode = this.concepts.get(concept);

    if (!conceptNode) {
      conceptNode = {
        id: concept,
        name: concept,
        frequency: 0,
        contexts: [],
        relationships: new Map(),
        confidence: 0.0,
        firstSeen: new Date(),
        lastSeen: new Date(),
        semanticTags: new Set(),
        evidenceCount: 0,
        contradictionCount: 0
      };
      this.concepts.set(concept, conceptNode);
    }

    conceptNode.frequency++;
    conceptNode.lastSeen = new Date();

    const context: Context = {
      context: data.context,
      oecsScore: data.oecsScore,
      timestamp: new Date()
    };

    conceptNode.contexts.push(context);

    if (conceptNode.contexts.length > 20) {
      conceptNode.contexts = conceptNode.contexts.slice(-20);
    }

    conceptNode.confidence = 0.9 * conceptNode.confidence + 0.1 * data.oecsScore;

    const tags = this.extractSemanticTags(concept, data);
    tags.forEach(tag => conceptNode.semanticTags.add(tag));

    await db.concept.upsert({
      where: { name: concept },
      update: {
        frequency: conceptNode.frequency,
        lastSeen: conceptNode.lastSeen,
        confidence: conceptNode.confidence,
        semanticTags: Array.from(conceptNode.semanticTags)
      },
      create: {
        name: concept,
        frequency: conceptNode.frequency,
        confidence: conceptNode.confidence,
        semanticTags: Array.from(conceptNode.semanticTags)
      }
    });
  }

  private async updateRelationship(
    concept: string,
    relationship: Relationship
  ): Promise<void> {
    await db.concept.update({
      where: { name: concept },
      data: {
        relationships: {
          [relationship.targetConcept]: relationship
        }
      }
    });
  }

  private async storeExperience(
    concepts: string[],
    relationships: Record<string, Relationship[]>,
    data: LearningData
  ): Promise<void> {
    await db.experience.create({
      data: {
        concepts,
        relationships,
        metadata: {
          stage: data.stage,
          phase: data.phase,
          oecsScore: data.oecsScore,
          success: true
        },
        rawContext: data.context
      }
    });
  }

  private extractSemanticTags(
    concept: string,
    data: LearningData
  ): Set<string> {
    const tags = new Set<string>();
    const context = data.context.toLowerCase();
    const response = data.response.toLowerCase();

    const domainKeywords: Record<string, string[]> = {
      'science': ['science', 'scientific', 'physics', 'chemistry', 'biology', 'experiment'],
      'technology': ['technology', 'tech', 'computer', 'software', 'hardware', 'digital'],
      'philosophy': ['philosophy', 'philosophical', 'ethics', 'morality', 'existential'],
      'mathematics': ['math', 'mathematical', 'calculate', 'equation', 'formula'],
      'arts': ['art', 'creative', 'design', 'aesthetic', 'beauty', 'expression'],
      'ethics': ['ethical', 'moral', 'right', 'wrong', 'good', 'evil', 'value'],
      'logic': ['logic', 'logical', 'reasoning', 'argument', 'deduction', 'inference'],
      'psychology': ['psychology', 'mind', 'consciousness', 'behavior', 'cognitive']
    };

    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      if (keywords.some(kw => context.includes(kw) || response.includes(kw))) {
        tags.add(domain);
      }
    }

    return tags;
  }
}
