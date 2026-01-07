// DALEK KHAN AGI: CORE AI ABSTRACTION INTERFACE
// Ensures OMEGA layers communicate with intelligence via a unified contract.

export interface AgentResponse {
  agentId: string;
  response: string;
  confidence: number; // 0.0 to 1.0
  reasoning: string;
  duration: number; // ms
  errors: string[];
}

export interface ReasoningTraceData {
  ethicalRiskScore: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskFactors: string[];
  strategy: 'STANDARD_ANALYSIS' | 'CAUTIOUS_EVALUATION' | 'DIRECT_RESPONSE' | 'REJECTED';
  certaintyGain: number;
  timePenalty: number;
  computationalCost: number;
  ccrr: number;
  decision: 'PROCEED' | 'DEFER' | 'REJECT' | 'REQUIRE_OVERRIDE';
  justification: Record<string, any>;
  improvementPlan: Record<string, any>;
}

export interface IAIInterface {
  /**
   * Processes a query using the Huxley Tri-Loop Architecture simulation.
   * @param query The user query or internal task.
   * @param context Contextual metadata.
   * @returns A detailed Reasoning Trace.
   */
  processReasoning(query: string, context: Record<string, any>): Promise<ReasoningTraceData>;

  /**
   * Executes a task across multiple specialized agents in parallel.
   * @param query The task description.
   * @param domain The primary expertise domain (e.g., 'Scientific', 'Strategic').
   * @returns An array of individual agent responses.
   */
  executeAgentSwarm(query: string, domain: string): Promise<AgentResponse[]>;

  /**
   * Generates a semantic vector embedding for a given text input.
   * Required for the enhanced Memory Layer (DAF).
   * @param text The text to embed.
   * @returns A buffer or array representing the vector embedding.
   */
  generateEmbedding(text: string): Promise<Buffer>;

  /**
   * Performs autonomous code analysis and suggests structured improvements.
   * Used by the Learning Layer (I.J. Good).
   * @param codebaseSnapshot Analysis input (e.g., complexity metrics, code structure).
   * @returns Proposed structured code improvements.
   */
  suggestImprovements(codebaseSnapshot: Record<string, any>): Promise<any[]>;
}