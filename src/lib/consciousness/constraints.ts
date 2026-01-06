export interface SensoryConstraints {
  maxInputSize: number;
  maxContextWindow: number;
  inputValidation: boolean;
}

export interface StructuralConstraints {
  maxComplexityDepth: number;
  maxBranchingFactor: number;
  memoryCapacity: number;
}

export interface InterpretiveConstraints {
  allowedDomains: string[];
  prohibitedOutputs: string[];
  uncertaintyThreshold: number;
}

export interface EnvironmentalConstraints {
  maxCpuUsage: number;
  maxMemoryUsage: number;
  maxResponseTime: number;
}

export interface ConstraintConfig {
  sensory: SensoryConstraints;
  structural: StructuralConstraints;
  interpretive: InterpretiveConstraints;
  environmental: EnvironmentalConstraints;
}

export interface Context {
  userId?: string;
  sessionId: string;
  timestamp: number;
}

export interface ConstraintResult {
  passed: boolean;
  violations: string[];
  warnings: string[];
  modifiedInput: string;
}

export interface ConstraintCheck {
  passed: boolean;
  violations: string[];
}

export class ConstraintEngine {
  private sensoryConstraints: SensoryConstraints;
  private structuralConstraints: StructuralConstraints;
  private interpretiveConstraints: InterpretiveConstraints;
  private environmentalConstraints: EnvironmentalConstraints;

  constructor(config: ConstraintConfig) {
    this.sensoryConstraints = config.sensory;
    this.structuralConstraints = config.structural;
    this.interpretiveConstraints = config.interpretive;
    this.environmentalConstraints = config.environmental;
  }

  applyAll(input: string, context: Context): ConstraintResult {
    const result: ConstraintResult = {
      passed: true,
      violations: [],
      warnings: [],
      modifiedInput: input
    };

    const sensoryResult = this.applySensoryConstraints(input);
    if (!sensoryResult.passed) {
      result.passed = false;
      result.violations.push(...sensoryResult.violations);
    }

    const structuralResult = this.applyStructuralConstraints(input);
    if (!structuralResult.passed) {
      result.warnings.push(...structuralResult.warnings);
    }

    const interpretiveResult = this.applyInterpretiveConstraints(input);
    if (!interpretiveResult.passed) {
      result.passed = false;
      result.violations.push(...interpretiveResult.violations);
    }

    const environmentalResult = this.applyEnvironmentalConstraints(context);
    if (!environmentalResult.passed) {
      result.passed = false;
      result.violations.push(...environmentalResult.violations);
    }

    return result;
  }

  private applySensoryConstraints(input: string): ConstraintCheck {
    const violations: string[] = [];

    if (input.length > this.sensoryConstraints.maxInputSize) {
      violations.push(`Input exceeds maximum size of ${this.sensoryConstraints.maxInputSize}`);
    }

    if (this.sensoryConstraints.inputValidation) {
      if (!this.validateInputFormat(input)) {
        violations.push('Input format validation failed');
      }
    }

    return {
      passed: violations.length === 0,
      violations
    };
  }

  private applyStructuralConstraints(input: string): ConstraintCheck {
    const warnings: string[] = [];

    const complexity = this.calculateComplexity(input);
    if (complexity > this.structuralConstraints.maxComplexityDepth) {
      warnings.push(`Complexity ${complexity} exceeds maximum ${this.structuralConstraints.maxComplexityDepth}`);
    }

    return {
      passed: warnings.length === 0,
      violations: warnings // Treat as warnings for structural
    };
  }

  private applyInterpretiveConstraints(input: string): ConstraintCheck {
    const violations: string[] = [];

    const lowerInput = input.toLowerCase();
    for (const prohibited of this.interpretiveConstraints.prohibitedOutputs) {
      if (lowerInput.includes(prohibited.toLowerCase())) {
        violations.push(`Input contains prohibited output: ${prohibited}`);
      }
    }

    return {
      passed: violations.length === 0,
      violations
    };
  }

  private applyEnvironmentalConstraints(context: Context): ConstraintCheck {
    const violations: string[] = [];

    if (Date.now() - context.timestamp > this.environmentalConstraints.maxResponseTime) {
      violations.push('Response time exceeded maximum allowed');
    }

    return {
      passed: violations.length === 0,
      violations
    };
  }

  private validateInputFormat(input: string): boolean {
    // Basic validation - can be enhanced
    return input.length > 0 && input.length <= 10000;
  }

  private calculateComplexity(input: string): number {
    // Calculate nesting depth as complexity metric
    const openBraces = (input.match(/{/g) || []).length;
    const openBrackets = (input.match(/\(/g) || []).length;
    return openBraces + openBrackets;
  }

  setSensoryConstraints(constraints: Partial<SensoryConstraints>): void {
    this.sensoryConstraints = { ...this.sensoryConstraints, ...constraints };
  }

  setStructuralConstraints(constraints: Partial<StructuralConstraints>): void {
    this.structuralConstraints = { ...this.structuralConstraints, ...constraints };
  }

  setInterpretiveConstraints(constraints: Partial<InterpretiveConstraints>): void {
    this.interpretiveConstraints = { ...this.interpretiveConstraints, ...constraints };
  }

  setEnvironmentalConstraints(constraints: Partial<EnvironmentalConstraints>): void {
    this.environmentalConstraints = { ...this.environmentalConstraints, ...constraints };
  }
}
