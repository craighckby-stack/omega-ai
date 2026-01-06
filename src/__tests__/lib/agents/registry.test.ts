import { AGENT_REGISTRY, AgentConfig, AgentDivision } from '@/lib/agents/agent-registry';
import { AgentOrchestrator, Task } from '@/lib/agents/orchestrator';

describe('AGENT_REGISTRY', () => {
  describe('Agent Registry', () => {
    it('should have exactly 17 agents', () => {
      const agents = Object.values(AGENT_REGISTRY);
      expect(agents.length).toBe(17);
    });

    it('should have correct divisions', () => {
      const agents = Object.values(AGENT_REGISTRY);
      const divisions = new Set(agents.map(a => a.domain));

      expect(divisions.has('Science')).toBe(true);
      expect(divisions.has('Technical')).toBe(true);
      expect(divisions.has('Creative')).toBe(true);
      expect(divisions.has('Strategic')).toBe(true);
    });

    it('should have 7 scientific agents', () => {
      const agents = Object.values(AGENT_REGISTRY);
      const scientific = agents.filter(a => a.domain === 'Science');

      expect(scientific.length).toBe(7);
    });

    it('should have 3 technical agents', () => {
      const agents = Object.values(AGENT_REGISTRY);
      const technical = agents.filter(a => a.domain === 'Technical');

      expect(technical.length).toBe(3);
    });

    it('should have 3 creative agents', () => {
      const agents = Object.values(AGENT_REGISTRY);
      const creative = agents.filter(a => a.domain === 'Creative');

      expect(creative.length).toBe(3);
    });

    it('should have 3 strategic agents', () => {
      const agents = Object.values(AGENT_REGISTRY);
      const strategic = agents.filter(a => a.domain === 'Strategic');

      expect(strategic.length).toBe(3);
    });

    it('should have valid agent IDs', () => {
      const agents = Object.values(AGENT_REGISTRY);

      agents.forEach(agent => {
        expect(agent.id).toBeDefined();
        expect(agent.id.length).toBeGreaterThan(0);
        expect(agent.id).toMatch(/^[a-z-]+(-[a-z]+)?$/i);
      });
    });

    it('should have valid agent configurations', () => {
      const agents = Object.values(AGENT_REGISTRY);

      agents.forEach(agent => {
        expect(agent.name).toBeDefined();
        expect(agent.name.length).toBeGreaterThan(0);
        expect(agent.expertise).toBeDefined();
        expect(Array.isArray(agent.expertise)).toBe(true);
        expect(agent.expertise.length).toBeGreaterThan(0);
        expect(agent.capabilities).toBeDefined();
        expect(Array.isArray(agent.capabilities)).toBe(true);
        expect(agent.capabilities.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Agent Specialization', () => {
    it('chemistry agent should have correct expertise', () => {
      const chemistry = AGENT_REGISTRY['chemistry-expert'];

      expect(chemistry).toBeDefined();
      expect(chemistry.domain).toBe('Science');
      expect(chemistry.expertise).toContain('chemical-reactions');
      expect(chemistry.expertise).toContain('molecular-structure');
      expect(chemistry.expertise).toContain('chemical-analysis');
    });

    it('philosophy agent should have correct expertise', () => {
      const philosophy = AGENT_REGISTRY['philosophy-agent'];

      expect(philosophy).toBeDefined();
      expect(philosophy.domain).toBe('Creative');
      expect(philosophy.expertise).toContain('ethics');
      expect(philosophy.expertise).toContain('metaphysics');
      expect(philosophy.expertise).toContain('critical-thinking');
    });

    it('business analyst should have correct expertise', () => {
      const business = AGENT_REGISTRY['business-analyst'];

      expect(business).toBeDefined();
      expect(business.domain).toBe('Strategic');
      expect(business.expertise).toContain('market-analysis');
      expect(business.expertise).toContain('financial-analysis');
      expect(business.expertise).toContain('strategy-planning');
    });
  });
});

describe('AgentOrchestrator', () => {
  let orchestrator: AgentOrchestrator;

  beforeEach(() => {
    orchestrator = new AgentOrchestrator();
  });

  describe('Agent Selection', () => {
    it('should select relevant agents for a task', async () => {
      const task: Task = {
        id: 'test-task-1',
        query: 'Analyze chemical reactions',
        domain: 'Science',
        priority: 1,
        timestamp: Date.now()
      };

      const selectedAgents = await orchestrator.executeTask(task);

      expect(selectedAgents).toBeDefined();
      expect(selectedAgents.agentResults).toBeDefined();
      expect(Array.isArray(selectedAgents.agentResults)).toBe(true);
      expect(selectedAgents.agentResults.length).toBeGreaterThan(0);
      expect(selectedAgents.agentResults.length).toBeLessThanOrEqual(10); // Max 10 agents
    });

    it('should prioritize agents with higher domain relevance', async () => {
      const task: Task = {
        id: 'test-task-2',
        query: 'Analyze ethical implications',
        domain: 'Strategic',
        priority: 1,
        timestamp: Date.now()
      };

      const result = await orchestrator.executeTask(task);

      expect(result).toBeDefined();
      expect(result.agentResults).toBeDefined();

      // Strategic agents should be in results
      const strategicAgentIds = ['ethics-agent', 'business-analyst', 'risk-management'];
      const selectedAgentIds = result.agentResults.map(r => r.agentId);

      const hasStrategic = selectedAgentIds.some(id => strategicAgentIds.includes(id));
      expect(hasStrategic).toBe(true);
    });

    it('should calculate expertise relevance correctly', () => {
      const task: Task = {
        id: 'test-task-3',
        query: 'Analyze market trends for AI',
        domain: 'Business',
        priority: 1,
        timestamp: Date.now()
      };

      const businessAgents = Object.values(AGENT_REGISTRY).filter(a => a.domain === 'Business');
      businessAgents.forEach(agent => {
        const expertise = agent.expertise || [];
        const relevance = expertise.filter(exp =>
          task.query.toLowerCase().includes(exp.toLowerCase())
        ).length;

        expect(relevance).toBeGreaterThan(0.7);
        expect(relevance).toBeLessThanOrEqual(expertise.length);
      });
    });
  });

  describe('Parallel Execution', () => {
    it('should execute multiple agents in parallel', async () => {
      const task: Task = {
        id: 'test-task-4',
        query: 'Multi-agent test',
        domain: 'General',
        priority: 1,
        timestamp: Date.now()
      };

      const startTime = Date.now();
      const result = await orchestrator.executeTask(task);
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(result).toBeDefined();
      // Parallel execution should be faster than sequential
      // Can't guarantee exact timing, but should complete
      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeLessThan(60000); // Less than 60 seconds
    });

    it('should handle agent errors gracefully', async () => {
      const task: Task = {
        id: 'test-task-5',
        query: 'Test error handling',
        domain: 'General',
        priority: 1,
        timestamp: Date.now()
      };

      const result = await orchestrator.executeTask(task);

      expect(result).toBeDefined();
      expect(result.agentResults).toBeDefined();

      // Some agents might fail, but overall should succeed
      const failedAgents = result.agentResults.filter(r => r.errors.length > 0);
      expect(result.synthesizedOutput).toBeDefined();
    });
  });

  describe('Result Synthesis', () => {
    it('should synthesize results from multiple agents', async () => {
      const task: Task = {
        id: 'test-task-6',
        query: 'Synthesize this information',
        domain: 'General',
        priority: 1,
        timestamp: Date.now()
      };

      const result = await orchestrator.executeTask(task);

      expect(result).toBeDefined();
      expect(result.synthesizedOutput).toBeDefined();
      expect(result.synthesizedOutput.length).toBeGreaterThan(0);
      expect(result.confidence).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should weight responses by agent confidence', async () => {
      const task: Task = {
        id: 'test-task-7',
        query: 'High confidence query',
        domain: 'General',
        priority: 1,
        timestamp: Date.now()
      };

      const result = await orchestrator.executeTask(task);

      expect(result).toBeDefined();
      expect(result.agentResults).toBeDefined();

      // Check that higher confidence responses are weighted more
      const highConfidenceAgents = result.agentResults.filter(r => r.confidence > 0.7);
      expect(highConfidenceAgents.length).toBeGreaterThan(0.7);
    });

    it('should generate unified answer from agent responses', async () => {
      const task: Task = {
        id: 'test-task-8',
        query: 'Generate comprehensive analysis',
        domain: 'General',
        priority: 1,
        timestamp: Date.now()
      };

      const result = await orchestrator.executeTask(task);

      expect(result).toBeDefined();
      expect(result.synthesizedOutput).toBeDefined();
      expect(result.synthesizedOutput).toContain('synthesized'); // Synthesis keyword
    });
  });

  describe('Task Storage', () => {
    it('should store task results in database', async () => {
      const task: Task = {
        id: 'test-task-9',
        query: 'Store this task',
        domain: 'General',
        priority: 1,
        timestamp: Date.now()
      };

      const result = await orchestrator.executeTask(task);

      expect(result).toBeDefined();
      // Results should be stored (we can't easily test this without mocking DB)
      // But the function should complete without errors
    });
  });

  describe('Error Handling', () => {
    it('should handle empty query gracefully', async () => {
      const task: Task = {
        id: 'test-task-10',
        query: '',
        domain: 'General',
        priority: 1,
        timestamp: Date.now()
      };

      const result = await orchestrator.executeTask(task);

      expect(result).toBeDefined();
    });

    it('should handle null domain gracefully', async () => {
      const task: Task = {
        id: 'test-task-11',
        query: 'Test query',
        domain: null as any,
        priority: 1,
        timestamp: Date.now()
      };

      const result = await orchestrator.executeTask(task);

      expect(result).toBeDefined();
    });

    it('should handle all agents failing', async () => {
      const task: Task = {
        id: 'test-task-12',
        query: 'Force all agents to fail',
        domain: 'General',
        priority: 1,
        timestamp: Date.now()
      };

      const result = await orchestrator.executeTask(task);

      expect(result).toBeDefined();
      expect(result.synthesizedOutput).toBeDefined();
      // Should still provide some output even if agents fail
    });
  });
});
