'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brain, Cpu, Shield, Database, Users, Zap, Lock, Activity, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [systemStatus, setSystemStatus] = useState({
    consciousness: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'ERROR',
    reasoning: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'ERROR',
    memory: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'ERROR',
    agents: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'ERROR',
    security: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'ERROR',
    learning: 'IDLE' as 'IDLE' | 'ACTIVE' | 'ERROR',
    websocket: 'DISCONNECTED' as 'CONNECTED' | 'DISCONNECTED'
  });

  const [metrics, setMetrics] = useState({
    totalConcepts: 0,
    totalExperiences: 0,
    activeAgents: 17,
    currentCycle: 0,
    encryptedPackets: 0,
    reasoningTraces: 0,
  });

  const [realtimeUpdates, setRealtimeUpdates] = useState({
    lastUpdate: Date.now(),
    activeConnections: 0
  });

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
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  const StatusCard = ({ title, status, icon: Icon }: { title: string; status: string; icon: any }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <icon className={`h-4 w-4 ${
          status === 'ACTIVE' || status === 'CONNECTED' ? 'text-green-500' :
          status === 'IDLE' ? 'text-yellow-500' :
          'text-red-500'
        }`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{status}</div>
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
        <div className="text-2xl font-bold">{metrics.isLoading ? '...' : value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  const ActionCard = ({
    title,
    description,
    icon: Icon,
    href,
  }: {
    title: string;
    description: string;
    icon: any;
    href: string;
  }) => (
    <Link href={href} className="block">
      <Card className="p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
            <icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );

  const WebSocketStatus = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-4 w-4" />
          WebSocket Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className={`h-3 w-3 rounded-full ${
            systemStatus.websocket === 'CONNECTED' ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <div>
            <p className="text-sm font-medium">
              {systemStatus.websocket === 'CONNECTED' ? 'Connected' : 'Disconnected'}
            </p>
            <p className="text-xs text-muted-foreground">
              {systemStatus.websocket === 'CONNECTED'
                ? `Last update: ${new Date(realtimeUpdates.lastUpdate).toLocaleTimeString()}`
                : 'Real-time updates unavailable'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">OMEGA</h1>
              <p className="text-xs text-muted-foreground">
                Omni-Model Emergent General Intelligence
              </p>
            </div>
          </div>
          <nav className="hidden md:flex gap-4">
            <Link href="/reasoning">
              <Button className="hover:bg-accent/50 transition-colors">Reasoning</Button>
            </Link>
            <Link href="/agents">
              <Button className="hover:bg-accent/50 transition-colors">Agents</Button>
            </Link>
            <Link href="/memory">
              <Button className="hover:bg-accent/50 transition-colors">Memory</Button>
            </Link>
            <Link href="/security">
              <Button className="hover:bg-accent/50 transition-colors">Security</Button>
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
              <p className="text-sm text-muted-foreground mb-4">
                OMEGA unifies consciousness, reasoning, memory, agent swarms, security,
                and self-improvement into a coherent AI system. Navigate through the
                modules below to explore each component.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Real-time updates via WebSocket</span>
              </div>
            </CardContent>
          </Card>

          {/* WebSocket Status */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-4">Real-Time Connection</h2>
            <WebSocketStatus />
          </div>

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

          {/* System Metrics */}
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
              <ActionCard
                title="New Query"
                description="Submit a query for ethical reasoning"
                icon={Cpu}
                href="/reasoning"
              />
              <ActionCard
                title="View Agents"
                description="Explore the 17 specialized AI agents"
                icon={Users}
                href="/agents"
              />
              <ActionCard
                title="Memory Browser"
                description="Browse knowledge graph and experiences"
                icon={Database}
                href="/memory"
              />
              <ActionCard
                title="System Logs"
                description="View security events and encryption logs"
                icon={Shield}
                href="/security"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            OMEGA v1.0.0 - Unified AI Architecture
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500">Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className={`h-4 w-4 ${
                systemStatus.websocket === 'CONNECTED' ? 'text-green-500' : 'text-red-500'
              }`} />
              <span className="text-xs">
                {systemStatus.websocket === 'CONNECTED' ? 'Real-time' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
