import { POST } from '@/app/api/agents/route';

describe('Agents API', () => {
  describe('POST /api/agents', () => {
    it('should accept valid task', async () => {
      const response = await POST(new Request('http://localhost/api/agents', {
        method: 'POST',
        body: JSON.stringify({
          query: 'Analyze AI trends',
          domain: 'Strategic',
          priority: 1
        })
      }));

      expect(response).toBeDefined();
      expect(response instanceof Response).toBe(true);
    });

    it('should return result object', async () => {
      const response = await POST(new Request('http://localhost/api/agents', {
        method: 'POST',
        body: JSON.stringify({
          query: 'Test query',
          domain: 'General',
          priority: 1
        })
      }));

      const data = await response.json();

      expect(data).toBeDefined();
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('result');
    });

    it('should return 200 status for valid request', async () => {
      const response = await POST(new Request('http://localhost/api/agents', {
        method: 'POST',
        body: JSON.stringify({
          query: 'Test query',
          domain: 'General',
          priority: 1
        })
      }));

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
    });

    it('should handle empty query', async () => {
      const response = await POST(new Request('http://localhost/api/agents', {
        method: 'POST',
        body: JSON.stringify({
          query: '',
          domain: 'General',
          priority: 1
        })
      }));

      expect(response).toBeDefined();
      expect(response instanceof Response).toBe(true);
    });

    it('should handle missing domain', async () => {
      const response = await POST(new Request('http://localhost/api/agents', {
        method: 'POST',
        body: JSON.stringify({
          query: 'Test query'
        })
      }));

      expect(response).toBeDefined();
      expect(response instanceof Response).toBe(true);
    });

    it('should handle invalid priority', async () => {
      const response = await POST(new Request('http://localhost/api/agents', {
        method: 'POST',
        body: JSON.stringify({
          query: 'Test query',
          domain: 'General',
          priority: 'invalid'
        })
      }));

      expect(response).toBeDefined();
      expect(response instanceof Response).toBe(true);
    });
  });
});
