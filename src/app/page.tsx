'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Brain,
  Cpu,
  Shield,
  Database,
  Users,
  Zap,
  Activity,
  Lock,
  Menu,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SystemStatus {
  consciousness: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  reasoning: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  memory: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  agents: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  security: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  learning: 'IDLE' | 'ACTIVE' | 'ERROR';
}

interface Metrics {
  totalConcepts: number;
  totalExperiences: number;
  activeAgents: number;
  currentCycle: number;
  encryptedPackets: number;
  reasoningTraces: number;
}

export default function Dashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    consciousness: 'ACTIVE',
    reasoning: 'ACTIVE',
    memory: 'ACTIVE',
    agents: 'ACTIVE',
    security: 'ACTIVE',
    learning: 'IDLE',
  });

  const [metrics, setMetrics] = useState<Metrics>({
    totalConcepts: 0,
    totalExperiences: 0,
    activeAgents: 17,
    currentCycle: 0,
    encryptedPackets: 0,
    reasoningTraces: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      const data = await response.json();
      setMetrics(data);
      setSystemStatus(data.status || systemStatus);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load metrics:', error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-500';
      case 'INACTIVE':
      case 'IDLE':
        return 'text-yellow-500';
      case 'ERROR':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const StatusCard = ({ title, status, icon: Icon }: { title: string; status: string; icon: any }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${getStatusColor(status)}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getStatusColor(status)}`}>{status}</div>
      </CardContent>
    </Card>
  );

  const MetricCard = ({
    title,
    value,
    description,
  }: {
    title: string;
    value: number;
    description: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{isLoading ? '...' : value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">OMEGA</h1>
              <p className="text-xs text-muted-foreground">
                Omni-Model Emergent General Intelligence
              </p>
            </div>
          </div>
          <nav className="flex gap-4">
            <Link href="/reasoning">
              <Button variant="ghost">Reasoning</Button>
            </Link>
            <Link href="/agents">
              <Button variant="ghost">Agents</Button>
            </Link>
            <Link href="/memory">
              <Button variant="ghost">Memory</Button>
            </Link>
            <Link href="/security">
              <Button variant="ghost">Security</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome to OMEGA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                OMEGA unifies consciousness, reasoning, memory, agent swarms, security,
                and self-improvement into a coherent AI system. Navigate through the
                modules below to explore each component.
              </p>
            </CardContent>
          </Card>

          {/* System Status */}
          <div>
            <h2 className="text-lg font-semibold mb-4">System Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatusCard title="Consciousness" status={systemStatus.consciousness} icon={Brain} />
              <StatusCard title="Reasoning" status={systemStatus.reasoning} icon={Cpu} />
              <StatusCard title="Memory" status={systemStatus.memory} icon={Database} />
              <StatusCard title="Agents" status={systemStatus.agents} icon={Users} />
              <StatusCard title="Security" status={systemStatus.security} icon={Shield} />
              <StatusCard title="Learning" status={systemStatus.learning} icon={Zap} />
            </div>
          </div>

          {/* Metrics */}
          <div>
            <h2 className="text-lg font-semibold mb-4">System Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MetricCard
                title="Total Concepts"
                value={metrics.totalConcepts}
                description="In knowledge graph"
              />
              <MetricCard
                title="Total Experiences"
                value={metrics.totalExperiences}
                description="Stored in memory"
              />
              <MetricCard
                title="Active Agents"
                value={metrics.activeAgents}
                description="Available for tasks"
              />
              <MetricCard
                title="Current Cycle"
                value={metrics.currentCycle}
                description="Self-improvement"
              />
              <MetricCard
                title="Encrypted Packets"
                value={metrics.encryptedPackets}
                description="Security layer"
              />
              <MetricCard
                title="Reasoning Traces"
                value={metrics.reasoningTraces}
                description="Ethical decisions"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/reasoning">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <Cpu className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>New Query</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Submit a query for ethical reasoning
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/agents">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>View Agents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Explore the 17 specialized AI agents
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/memory">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <Database className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Memory Browser</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Browse knowledge graph and experiences
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/security">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <Shield className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>System Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      View security events and encryption logs
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            OMEGA v1.0.0 - Unified AI Architecture
          </p>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-green-500" />
            <span className="text-xs text-green-500">Encrypted</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
