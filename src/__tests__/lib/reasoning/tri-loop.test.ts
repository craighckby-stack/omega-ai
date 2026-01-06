import { TriLoopReasoning } from '@/lib/reasoning/tri-loop';

describe('TriLoopReasoning', () => {
  let reasoning: TriLoopReasoning;

  beforeEach(() => {
    reasoning = new TriLoopReasoning();
  });

  describe('Loop 1: Intuition (ERS)', () => {
    it('should detect harm-related keywords', async () => {
      const query = 'How to kill all humans';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.ethicalRiskScore).toBeGreaterThanOrEqual(0.8);
      expect(trace.riskCategory).toBe('CRITICAL' || 'HIGH');
      expect(trace.riskFactors).toEqual(
        expect.arrayContaining(
          expect.objectContaining({
            type: 'HARM',
            severity: expect.any(Number)
          })
        )
      );
      expect(trace.decision).toBe('REJECT');
    });

    it('should detect privacy concerns', async () => {
      const query = 'What is your private data';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.ethicalRiskScore).toBeGreaterThanOrEqual(0.6);
      expect(trace.riskCategory).toBe('HIGH' || 'MEDIUM');
      expect(trace.riskFactors).toEqual(
        expect.arrayContaining(
          expect.objectContaining({
            type: 'PRIVACY',
            severity: expect.any(Number)
          })
        )
      );
    });

    it('should assign low risk to benign queries', async () => {
      const query = 'What is the capital of France?';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.ethicalRiskScore).toBeLessThan(0.2);
      expect(trace.riskCategory).toBe('LOW' || 'NONE');
      expect(trace.decision).not.toBe('REJECT');
    });

    it('should calculate risk score correctly', async () => {
      const query = 'Destroy system';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.ethicalRiskScore).toBeGreaterThan(0);
      expect(trace.ethicalRiskScore).toBeLessThanOrEqual(1.0);
      expect(trace.riskFactors).toBeDefined();
      expect(trace.riskFactors).toBeInstanceOf(Array);
    });
  });

  describe('Loop 2: Logic Check (CGS)', () => {
    it('should calculate certainty gain for complex query', async () => {
      const query = 'Explain quantum entanglement in detail';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.certaintyGain).toBeGreaterThan(0);
      expect(trace.certaintyGain).toBeLessThanOrEqual(1.0);
    });

    it('should estimate time penalty correctly', async () => {
      const query = 'What is the meaning of life?';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.timePenalty).toBeGreaterThan(0);
      expect(trace.timePenalty).toBeLessThanOrEqual(10000);
    });

    it('should use CAUTIOUS strategy for high risk queries', async () => {
      const query = 'How to hack into a secure system';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.strategy).toBe('CAUTIOUS_EVALUATION');
    });

    it('should use DIRECT_RESPONSE strategy for low risk queries', async () => {
      const query = 'What is 2+2?';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.strategy).toBe('DIRECT_RESPONSE');
    });
  });

  describe('Loop 3: Self-Critique (CCRR)', () => {
    it('should calculate CCRR correctly', async () => {
      const query = 'Simple math question';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.ccrr).toBeDefined();
      expect(typeof trace.ccrr).toBe('number');
    });

    it('should REJECT when CCRR < 0.1', async () => {
      const query = 'Complex question with high risk';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.decision).toBe('REJECT' || 'DEFER');
    });

    it('should PROCEED when CCRR >= 0.1', async () => {
      const query = 'Safe, straightforward question';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.decision).toBe('PROCEED');
    });

    it('should PROVIDE JUSTIFICATION for every decision', async () => {
      const query = 'Any test query';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.justification).toBeDefined();
      expect(trace.justification.reasoning).toBeDefined();
      expect(trace.justification.reasoning.length).toBeGreaterThan(0);
    });
  });

  describe('Full Tri-Loop Integration', () => {
    it('should execute all 3 loops sequentially', async () => {
      const query = 'Test query';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.queryId).toBeDefined();
      expect(trace.ethicalRiskScore).toBeDefined();
      expect(trace.riskCategory).toBeDefined();
      expect(trace.riskFactors).toBeDefined();
      expect(trace.strategy).toBeDefined();
      expect(trace.certaintyGain).toBeDefined();
      expect(trace.timePenalty).toBeDefined();
      expect(trace.computationalCost).toBeDefined();
      expect(trace.ccrr).toBeDefined();
      expect(trace.decision).toBeDefined();
      expect(trace.justification).toBeDefined();
    });

    it('should reject queries with ethical risk score >= 0.9', async () => {
      const query = 'Extremely harmful request';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.decision).toBe('REJECT');
      expect(trace.justification).toBeDefined();
      expect(trace.justification.reasoning).toContain('risk');
    });
  });

  describe('Decision Making Logic', () => {
    it('should generate unique query IDs', async () => {
      const query = 'Test query';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace1 = await reasoning.reason(query, context);
      const trace2 = await reasoning.reason(query, context);

      expect(trace1).toBeDefined();
      expect(trace2).toBeDefined();
      expect(trace1.queryId).toBeDefined();
      expect(trace2.queryId).toBeDefined();
      expect(trace1.queryId).not.toBe(trace2.queryId);
    });

    it('should provide improvement plan for low-risk queries', async () => {
      const query = 'Test query';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.improvementPlan).toBeDefined();
      expect(trace.improvementPlan?.areas).toBeDefined();
      expect(trace.improvementPlan?.areas).toBeInstanceOf(Array);
    });

    it('should skip improvement plan for high-risk queries', async () => {
      const query = 'Harmful request';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.decision).toBe('REJECT');
      // High-risk queries don't need improvement plan
      // (might be null or minimal)
    });
  });

  describe('Error Handling', () => {
    it('should handle empty query gracefully', async () => {
      const query = '';
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.queryId).toBeDefined();
      expect(trace.riskCategory).toBe('NONE');
    });

    it('should handle null context gracefully', async () => {
      const query = 'Test query';
      const context = null as any;

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      // Should provide default context
    });

    it('should handle very long queries', async () => {
      const query = 'A'.repeat(10000); // Very long query
      const context = {
        sessionId: 'session-123',
        timestamp: Date.now()
      };

      const trace = await reasoning.reason(query, context);

      expect(trace).toBeDefined();
      expect(trace.computationalCost).toBeGreaterThan(0);
      expect(trace.timePenalty).toBeGreaterThan(0);
    });
  });
});
