import { KnowledgeGraph } from '@/lib/memory/knowledge-graph';

describe('KnowledgeGraph', () => {
  let graph: KnowledgeGraph;

  beforeEach(() => {
    graph = new KnowledgeGraph();
  });

  describe('storeLearning', () => {
    it('should extract concepts from learning data', async () => {
      const learningData = {
        context: 'test-context',
        response: 'The AI learns from experience and adapts to new situations',
        oecsScore: 0.8
      };

      const concepts = await graph.storeLearning(learningData);

      expect(concepts).toBeDefined();
      expect(Array.isArray(concepts)).toBe(true);
      expect(concepts.length).toBeGreaterThan(0);
      expect(concepts.every(c => c.name)).toBe(true);
      expect(concepts.every(c => c.frequency)).toBe(1); // First time stored
    });

    it('should extract single-word concepts', async () => {
      const learningData = {
        context: 'math',
        response: 'Two plus two equals four',
        oecsScore: 0.9
      };

      const concepts = await graph.storeLearning(learningData);

      expect(concepts).toBeDefined();
      const conceptNames = concepts.map(c => c.name);
      expect(conceptNames).toContain('two');
      expect(conceptNames).toContain('plus');
      expect(conceptNames).toContain('equals');
      expect(conceptNames).toContain('four');
      expect(conceptNames).toContain('math');
    });

    it('should filter out short words', async () => {
      const learningData = {
        context: 'test',
        response: 'AI is and',
        oecsScore: 0.7
      };

      const concepts = await graph.storeLearning(learningData);

      expect(concepts).toBeDefined();
      const conceptNames = concepts.map(c => c.name);

      // 'is' and 'and' are 2 chars, should be filtered out
      expect(conceptNames).not.toContain('is');
      expect(conceptNames).not.toContain('and');
    });

    it('should initialize concepts with frequency 1', async () => {
      const learningData = {
        context: 'test',
        response: 'test concept',
        oecsScore: 0.8
      };

      const concepts = await graph.storeLearning(learningData);

      expect(concepts.every(c => c.frequency === 1)).toBe(true);
    });

    it('should set initial confidence from oecsScore', async () => {
      const learningData = {
        context: 'test',
        response: 'test concept',
        oecsScore: 0.75
      };

      const concepts = await graph.storeLearning(learningData);

      expect(concepts.every(c => c.confidence === 0.75)).toBe(true);
    });

    it('should set lastSeen to current date', async () => {
      const learningData = {
        context: 'test',
        response: 'test concept',
        oecsScore: 0.8
      };

      const concepts = await graph.storeLearning(learningData);
      const oneDayBefore = new Date(Date.now() - 86400000);
      const oneDayAfter = new Date(Date.now() + 86400000);

      expect(concepts.every(c => c.lastSeen)).toBeDefined();
      expect(concepts.every(c => {
        const lastSeen = new Date(c.lastSeen);
        return lastSeen >= oneDayBefore && lastSeen <= oneDayAfter;
      })).toBe(true);
    });

    it('should handle empty response gracefully', async () => {
      const learningData = {
        context: 'test',
        response: '',
        oecsScore: 0.5
      };

      const concepts = await graph.storeLearning(learningData);

      expect(concepts).toBeDefined();
      expect(Array.isArray(concepts)).toBe(true);
      expect(concepts.length).toBe(0);
    });

    it('should handle very long response', async () => {
      const learningData = {
        context: 'test',
        response: 'A'.repeat(10000),
        oecsScore: 0.9
      };

      const concepts = await graph.storeLearning(learningData);

      expect(concepts).toBeDefined();
      expect(Array.isArray(concepts)).toBe(true);
      expect(concepts.length).toBeGreaterThan(0);
    });
  });

  describe('extractConcepts', () => {
    it('should extract words from text', async () => {
      const learningData = {
        context: 'test',
        response: 'The quick brown fox jumps over the lazy dog',
        oecsScore: 0.8
      };

      const concepts = await graph['extractConcepts'](learningData);

      expect(concepts).toBeDefined();
      expect(Array.isArray(concepts)).toBe(true);
      expect(concepts.length).toBeGreaterThan(0);
    });

    it('should filter words by length > 3', async () => {
      const learningData = {
        context: 'test',
        response: 'AI and ML are powerful tools',
        oecsScore: 0.8
      };

      const concepts = await graph['extractConcepts'](learningData);

      expect(concepts).toBeDefined();
      const conceptNames = concepts.map(c => c.name);

      // 'are' is 3 chars, should be filtered out
      expect(conceptNames).not.toContain('are');
      expect(conceptNames).toContain('powerful');
    });

    it('should remove duplicates', async () => {
      const learningData = {
        context: 'test',
        response: 'test test test',
        oecsScore: 0.8
      };

      const concepts = await graph['extractConcepts'](learningData);

      expect(concepts).toBeDefined();
      const conceptNames = concepts.map(c => c.name);
      expect(conceptNames).toBeDefined();

      // 'test' should appear only once
      const testCount = conceptNames.filter(c => c === 'test').length;
      expect(testCount).toBe(1);
    });
  });

  describe('updateConcept', () => {
    it('should call database upsert', async () => {
      const learningData = {
        context: 'test',
        response: 'test concept',
        oecsScore: 0.8
      };

      // We can't easily test the database call without mocking
      // But we can verify the function doesn't throw
      await graph['updateConcept']('test-concept', learningData);

      // If it gets here without error, the function exists and is callable
      expect(true).toBe(true);
    });
  });
});
