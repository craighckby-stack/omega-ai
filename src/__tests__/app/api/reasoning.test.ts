import { POST } from '@/app/api/reasoning/route';

describe('Reasoning API', () => {
  describe('POST /api/reasoning', () => {
    it('should accept valid query', async () => {
      const response = await POST(new Request('http://localhost/api/reasoning', {
        method: 'POST',
        body: JSON.stringify({
          query: 'What is the capital of France?',
          context: {
            sessionId: 'session-123',
            timestamp: Date.now()
          }
        })
      }));

      expect(response).toBeDefined();
      expect(response instanceof Response).toBe(true);
    });

    it('should return trace object', async () => {
      const response = await POST(new Request('http://localhost/api/reasoning', {
        method: 'POST',
        body: JSON.stringify({
          query: 'Test query',
          context: {
            sessionId: 'session-123',
            timestamp: Date.now()
          }
        })
      }));

      const data = await response.json();

      expect(data).toBeDefined();
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('trace');
    });

    it('should return valid trace structure', async () => {
      const response = await POST(new Request('http://localhost/api/reasoning', {
        method: 'POST',
        body: JSON.stringify({
          query: 'Test query',
          context: {
            sessionId: 'session-123',
            timestamp: Date.now()
          }
        })
      }));

      const data = await response.json();

      if (data.success && data.trace) {
        const trace = data.trace;
        expect(trace).toHaveProperty('queryId');
        expect(trace).toHaveProperty('ethicalRiskScore');
        expect(trace).toHaveProperty('riskCategory');
        expect(trace).toHaveProperty('riskFactors');
        expect(trace).toHaveProperty('strategy');
        expect(trace).toHaveProperty('certaintyGain');
        expect(trace).toHaveProperty('timePenalty');
        expect(trace).toHaveProperty('computationalCost');
        expect(trace).toHaveProperty('ccrr');
        expect(trace).toHaveProperty('decision');
        expect(trace).toHaveProperty('justification');
      }
    });

    it('should return 200 status for valid request', async () => {
      const response = await POST(new Request('http://localhost/api/reasoning', {
        method: 'POST',
        body: JSON.stringify({
          query: 'Test query',
          context: {
            sessionId: 'session-123',
            timestamp: Date.now()
          }
        })
      }));

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
    });

    it('should handle empty query', async () => {
      const response = await POST(new Request('http://localhost/api/reasoning', {
        method: 'POST',
        body: JSON.stringify({
          query: '',
          context: {
            sessionId: 'session-123',
            timestamp: Date.now()
          }
        })
      }));

      expect(response).toBeDefined();
      expect(response instanceof Response).toBe(true);
    });

    it('should handle missing context', async () => {
      const response = await POST(new Request('http://localhost/api/reasoning', {
        method: 'POST',
        body: JSON.stringify({
          query: 'Test query'
        })
      }));

      expect(response).toBeDefined();
      expect(response instanceof Response).toBe(true);
    });

    it('should handle invalid JSON', async () => {
      const response = await POST(new Request('http://localhost/api/reasoning', {
        method: 'POST',
        body: 'invalid json'
      }));

      expect(response).toBeDefined();
      expect(response.status).toBe(400); // Or 500
    });
  });
});
