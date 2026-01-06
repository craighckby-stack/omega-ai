import { BinaryProcessor } from '@/lib/security/binary-units';

describe('BinaryProcessor', () => {
  describe('PROCESSOR unit', () => {
    let processor: BinaryProcessor;

    beforeEach(() => {
      processor = new BinaryProcessor('PROCESSOR', {
        maxCycles: 1000,
        errorThreshold: 10,
        operationTimeout: 5000
      });
    });

    it('should process binary data successfully', async () => {
      const binary = '101010';
      const result = await processor.process(binary);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
      expect(result.errors).toEqual([]);
    });

    it('should handle invalid binary data', async () => {
      const binary = '10203';
      const result = await processor.process(binary);

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      expect(result.errors).not.toEqual([]);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('ANALYZER unit', () => {
    let processor: BinaryProcessor;

    beforeEach(() => {
      processor = new BinaryProcessor('ANALYZER', {
        maxCycles: 1000,
        errorThreshold: 10,
        operationTimeout: 5000
      });
    });

    it('should analyze binary patterns', async () => {
      const binary = '101010111010';
      const result = await processor.process(binary);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(JSON.parse(result.data)).toHaveProperty('ratio');
      expect(JSON.parse(result.data)).toHaveProperty('ones');
    });
  });

  describe('VALIDATOR unit', () => {
    let processor: BinaryProcessor;

    beforeEach(() => {
      processor = new BinaryProcessor('VALIDATOR', {
        maxCycles: 1000,
        errorThreshold: 10,
        operationTimeout: 5000
      });
    });

    it('should validate binary data structure', async () => {
      const binary = '1001101011';
      const result = await processor.process(binary);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(JSON.parse(result.data)).toHaveProperty('valid');
      expect(JSON.parse(result.data)).toHaveProperty('bytes');
    });
  });

  describe('OPTIMIZER unit', () => {
    let processor: BinaryProcessor;

    beforeEach(() => {
      processor = new BinaryProcessor('OPTIMIZER', {
        maxCycles: 1000,
        errorThreshold: 10,
        operationTimeout: 5000
      });
    });

    it('should optimize binary data', async () => {
      const binary = '110011001100110101001100110101';
      const result = await processor.process(binary);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(typeof result.data).toBe('string');
      expect(result.data.length).toBeLessThan(binary.length); // Should be optimized
    });
  });

  describe('Metrics tracking', () => {
    let processor: BinaryProcessor;

    beforeEach(() => {
      processor = new BinaryProcessor('PROCESSOR', {
        maxCycles: 1000,
        errorThreshold: 10,
        operationTimeout: 5000
      });
    });

    it('should track operation metrics correctly', async () => {
      const binary = '101010';
      await processor.process(binary);
      const metrics = processor.getMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.cycles).toBe(1);
      expect(metrics.errors).toBe(0);
      expect(metrics.efficiency).toBeGreaterThan(0);
      expect(metrics.efficiency).toBeLessThanOrEqual(1.0);
    });

    it('should reset metrics correctly', async () => {
      const binary = '101010';
      await processor.process(binary);
      processor.resetMetrics();

      const metrics = processor.getMetrics();

      expect(metrics.cycles).toBe(0);
      expect(metrics.errors).toBe(0);
    });
  });
});
