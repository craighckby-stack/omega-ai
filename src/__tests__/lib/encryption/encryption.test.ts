import { EncryptionSystem } from '@/lib/security/encryption';
import { BinaryProcessor } from '@/lib/security/binary-units';

describe('EncryptionSystem', () => {
  let encryption: EncryptionSystem;

  beforeEach(() => {
    encryption = new EncryptionSystem();
  });

  describe('generateKey', () => {
    it('should generate a key of correct length', () => {
      const key = encryption['generateKey']();
      expect(key.length).toBe(32); // 256 bits = 32 bytes
    });

    it('should generate different keys each time', () => {
      const key1 = encryption['generateKey']();
      const key2 = encryption['generateKey']();
      expect(key1).not.toBe(key2);
    });
  });

  describe('encrypt', () => {
    it('should encrypt data successfully', async () => {
      const data = 'test message';
      const key = Buffer.from('test-key-test-key-test-key-test-key-test-key-test', 'utf8');
      const encrypted = await encryption['encrypt'](data, key);

      expect(encrypted).toBeDefined();
      expect(encrypted.data).toBeDefined();
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.tag).toBeDefined();
      expect(encrypted.keyId).toBeDefined();
    });

    it('should not produce same ciphertext twice', async () => {
      const data = 'test message';
      const key = Buffer.from('test-key-test-key-test-key-test-key-test-key-test-key-test-key', 'utf8');

      const encrypted1 = await encryption['encrypt'](data, key);
      const encrypted2 = await encryption['encrypt'](data, key);

      expect(encrypted1.data).not.toBe(encrypted2.data); // Due to random IV
    });
  });

  describe('decrypt', () => {
    it('should decrypt data successfully', async () => {
      const originalData = 'test message';
      const key = Buffer.from('test-key-test-key-test-key-test-key-test-key-test-key-test-key-test', 'utf8');

      const encrypted = await encryption['encrypt'](originalData, key);
      const decrypted = await encryption['decrypt'](encrypted, key);

      expect(decrypted).toBe(originalData);
    });

    it('should fail to decrypt with wrong key', async () => {
      const originalData = 'test message';
      const correctKey = Buffer.from('test-key-test-key-test-key-test-key-test-key-test-key-test-key-test-key', 'utf8');
      const wrongKey = Buffer.from('wrong-key-wrong-key-wrong-key-wrong-key-wrong-key', 'utf8');

      const encrypted = await encryption['encrypt'](originalData, correctKey);

      await expect(
        encryption['decrypt'](encrypted, wrongKey)
      ).rejects.toThrow();
    });
  });

  describe('generateKeyId', () => {
    it('should generate unique key IDs', () => {
      const id1 = encryption['generateKeyId']();
      const id2 = encryption['generateKeyId']();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });

    it('should generate key IDs of correct length', () => {
      const id = encryption['generateKeyId']();

      expect(id.length).toBe(32); // 16 bytes = 32 hex characters
    });
  });
});
