import { POST } from '@/app/api/security/route';

describe('Security API', () => {
  describe('POST /api/security', () => {
    it('should handle encrypt action successfully', async () => {
      const response = await POST(new Request('http://localhost/api/security', {
        method: 'POST',
        body: JSON.stringify({
          action: 'encrypt',
          data: { text: 'test message' }
        })
      }));

      expect(response).toBeDefined();
      expect(response instanceof Response).toBe(true);

      const data = await response.json();
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('encryptedPacket');
    });

    it('should handle decrypt action successfully', async () => {
      const response = await POST(new Request('http://localhost/api/security', {
        method: 'POST',
        body: JSON.stringify({
          action: 'decrypt',
          data: {
            encryptedPacket: {},
            keyId: 'test-key'
          }
        })
      }));

      expect(response).toBeDefined();
      expect(response instanceof Response).toBe(true);
    });

    it('should handle process action successfully', async () => {
      const response = await POST(new Request('http://localhost/api/security', {
        method: 'POST',
        body: JSON.stringify({
          action: 'process',
          data: {
            binary: '101010',
            unitType: 'PROCESSOR'
          }
        })
      }));

      expect(response).toBeDefined();
      expect(response instanceof Response).toBe(true);
    });

    it('should handle generate-key action successfully', async () => {
      const response = await POST(new Request('http://localhost/api/security', {
        method: 'POST',
        body: JSON.stringify({
          action: 'generate-key',
          data: {}
        })
      }));

      expect(response).toBeDefined();
      expect(response instanceof Response).toBe(true);
    });

    it('should return error for invalid action', async () => {
      const response = await POST(new Request('http://localhost/api/security', {
        method: 'POST',
        body: JSON.stringify({
          action: 'invalid-action',
          data: {}
        })
      }));

      expect(response).toBeDefined();
      expect(response.status).toBe(400);
    });

    it('should return error for missing action', async () => {
      const response = await POST(new Request('http://localhost/api/security', {
        method: 'POST',
        body: JSON.stringify({})
      }));

      expect(response).toBeDefined();
      expect(response.status).toBe(400);
    });
  });
});
