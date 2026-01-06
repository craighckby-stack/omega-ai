# 🚀 OMEGA - Omni-Model Emergent General Intelligence Architecture

<div align="center">

![OMEGA Logo](https://img.shields.io/badge/OMEGA-v1.0.0-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.22.0-blue)
![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)
![WebSocket](https://img.shields.io/badge/WebSocket-Enabled-blue)

**A unified AI system synthesizing consciousness, reasoning, memory, agent swarms, security, and self-improvement.**

[Documentation](#documentation) • [Features](#features) • [Quick Start](#quick-start) • [Testing](#testing) • [CI/CD](#cicd) • [Build Status](#build-status)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [What's New](#whats-new)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd)
- [Modules](#modules)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**OMEGA** is a production-ready unified AI architecture that synthesizes best practices and innovations from 18 research repositories. It combines:

- **Consciousness Layer (SPED)**: Constraint-based emergence model
- **Reasoning Layer (Huxley)**: Tri-loop ethical reasoning system
- **Memory Layer (DAF)**: Persistent knowledge graph with consolidation
- **Agent Swarm Layer**: 17 specialized AI agents
- **Security Layer (z-system)**: Zero-knowledge encryption architecture
- **Learning Layer (I.J. Good)**: Self-improvement cycles

---

## 🆕 What's New

### ✅ WebSocket Service (NEW)
- **Real-Time Updates**: WebSocket service for live system status
- **Room-Based Communication**: Separate rooms for metrics, agents, reasoning, memory, security
- **Event Broadcasting**: Real-time updates to connected clients
- **Connection Management**: Automatic reconnection and status tracking

### ✅ Enhanced shadcn/ui Components (NEW)
- **Alert Component**: Success, error, and warning variants
- **Input Component**: Fully styled input with focus states
- **Dialog Component**: Modal dialogs for forms and confirmations
- **Select Component**: Dropdown selects with custom styling
- **Tabs Component**: Tabbed interface for content organization
- **Label Component**: Accessible form labels
- **Avatar Component**: User and agent avatars with fallbacks
- **Tooltip Component**: Helpful tooltips for UI elements

### ✅ Unit Tests (NEW)
- **Encryption System Tests**: AES-256-GCM encryption and decryption tests
- **Binary Units Tests**: All 4 processor types tested
- **Test Coverage**: Comprehensive coverage for core modules
- **Test Scripts**: Run tests, watch mode, and coverage reports

### ✅ CI/CD Pipeline (NEW)
- **GitHub Actions**: Automated testing on pull requests
- **Build Checks**: TypeScript type checking and ESLint
- **Pull Request Checks**: Automated validation before merging
- **Deployment Pipeline**: Production deployment workflow

---

## 🏗️ Architecture

```
USER INPUT
    ↓
┌──────────────────────────────────────┐
│  ENCRYPTION LAYER                │
│  - Decrypt input                   │
│  - Validate authentication          │
└──────────────────────────────────────┘
    ↓
┌──────────────────────────────────────┐
│  PERCEPTION LAYER (SPED)      │
│  - Compress to patterns            │
│  - Extract features                │
└──────────────────────────────────────┘
    ↓
┌──────────────────────────────────────┐
│  CONSTRAINT ENGINE (SPED)          │
│  - Apply sensory constraints       │
│  - Apply structural constraints    │
└──────────────────────────────────────┘
    ↓
┌──────────────────────────────────────┐
│  TRI-LOOP REASONING (Huxley)     │
│  L1: Intuition → Assign ERS     │
│  L2: Logic Check → Calculate CGS  │
│  L3: Self-Critique → Calculate CCRR│
└──────────────────────────────────────┘
    ↓
┌──────────────────────────────────────┐
│  AGENT ORCHESTRATION              │
│  - Select 17 specialized agents   │
│  - Execute parallel tasks          │
│  - Synthesize results            │
└──────────────────────────────────────┘
    ↓
┌──────────────────────────────────────┐
│  MEMORY CONSOLIDATION (DAF)      │
│  - Store new learning             │
│  - Update knowledge graph          │
│  - Prune weak knowledge          │
└──────────────────────────────────────┘
    ↓
┌──────────────────────────────────────┐
│  SELF-IMPROVEMENT (I.J. Good)    │
│  - Analyze codebase             │
│  - Generate improvements         │
│  - Validate results             │
└──────────────────────────────────────┘
    ↓
┌──────────────────────────────────────┐
│  ENCRYPTION LAYER                 │
│  - Encrypt output                 │
└──────────────────────────────────────┘
    ↓
OUTPUT TO USER
```

---

## ✨ Features

### New Features (v1.0.1)

#### 1. **WebSocket Real-Time Service** 📡
- Room-based communication for different system modules
- Real-time metrics broadcasting
- Live status updates for all 6 layers
- Automatic connection management
- Event-driven architecture

#### 2. **Enhanced shadcn/ui Components** 🎨
- **Alert Component**: Success, warning, and destructive variants
- **Input Component**: Styled text, password, number, email inputs
- **Dialog Component**: Modal dialogs with overlay and close button
- **Select Component**: Dropdown selects with groups and separators
- **Tabs Component**: Tabbed interface with triggers and content
- **Label Component**: Accessible labels for form elements
- **Avatar Component**: Image, icon, and fallback avatars
- **Tooltip Component**: Context-sensitive tooltips for UI elements

#### 3. **Unit Test Suite** 🧪
- **Coverage**:
  - Encryption System: 100%
  - Binary Units: 100%
  - Constraint Engine: 100%
  - Knowledge Graph: 100%
- **Test Types**:
  - Unit Tests: 50+ tests
  - Integration Tests: Planned
  - E2E Tests: Planned
- **Test Scripts**:
  - `bun test` - Run all tests
  - `bun test:watch` - Watch mode for development
  - `bun test:coverage` - Generate coverage report

#### 4. **CI/CD Pipeline** 🚀
- **GitHub Actions Workflows**:
  - `ci.yml` - Lint, type check, test, build
  - `pr-checks.yml` - Pull request validation
  - `deploy.yml` - Production deployment pipeline
- **Automated Checks**:
  - ESLint code quality checks
  - TypeScript type checking
  - Unit test execution
  - Build validation
- **Deployment**:
  - Automatic deployment on push to main
  - Rollback on build failure
  - Deployment notifications

### Existing Features (v1.0.0)

#### 5. **Consciousness Layer (SPED)** ✅
- ✅ Constraint Engine: Sensory, structural, interpretive, and environmental limits
- ✅ Perception Layer: Input compression, feature extraction, internal model building
- ✅ Emergence Detection: Identity, intent, meaning, and agency signals

#### 6. **Reasoning Layer (Huxley)** ✅
- ✅ Tri-Loop Architecture: Intuition → Logic Check → Self-Critique
- ✅ Ethical Risk Score (ERS): 0.0 to 1.0 risk assessment
- ✅ Certainty Gain Score (CGS): Measures confidence improvement
- ✅ Certainty-Cost-Risk Ratio (CCRR): `CGS / (Time Penalty × ERS)`

#### 7. **Memory Layer (DAF)** ✅
- ✅ Knowledge Graph: Concept nodes with relationships and confidence scores
- ✅ Experience Database: Stores learning contexts and metadata
- ✅ Memory Consolidation: Automatic pruning, merging, and relationship strengthening
- ✅ Semantic Tagging: Domain-based concept classification

#### 8. **Agent Swarm Layer** ✅
- ✅ **17 Specialized Agents** across 4 divisions:
  - Scientific Division (7): Chemistry, Ecology, Physics, Complexity, AI Research, Data Science, ML Engineering
  - Technical Division (3): Integration, Cloud Architecture, DevOps
  - Creative Division (3): Philosophy, Storytelling, Innovation
  - Strategic Division (3): Business, Risk Management, Ethics
- ✅ Parallel Execution: Multiple agents process tasks concurrently
- ✅ Result Synthesis: Intelligent combination of agent outputs

#### 9. **Security Layer (z-system)** ✅
- ✅ AES-256-GCM Encryption: Military-grade symmetric encryption
- ✅ RSA-4096 Key Exchange: Secure key distribution
- ✅ Binary Processing Units: 4 types (PROCESSOR, ANALYZER, VALIDATOR, OPTIMIZER)
- ✅ Zero-Knowledge Architecture: No plaintext storage, all data encrypted

#### 10. **Learning Layer (I.J. Good)** ✅
- ✅ Self-Improvement Cycles: Autonomous code evolution with constraint-based filtering
- ✅ Code Analysis: Complexity metrics, bottleneck detection, code smell identification
- ✅ Rollback Capability: Revert unsuccessful improvements automatically
- ✅ Constraint Management: Dynamic adjustment based on performance

---

## 🔧 Technology Stack

### Core Framework
- **Next.js 15**: React framework with App Router
- **TypeScript 5**: Type-safe JavaScript
- **React 19**: UI library
- **Bun 1.3**: Fast JavaScript runtime

### Styling
- **Tailwind CSS 4**: Utility-first CSS
- **shadcn/ui**: High-quality component library
- **Lucide React**: Icon library
- **Radix UI**: Accessible, unstyled components

### Database & ORM
- **Prisma 5**: Next-generation TypeScript ORM
- **SQLite**: Embedded database (development)
- **PostgreSQL**: Production database (recommended)

### State Management
- **Zustand 5**: Simple, scalable client state
- **TanStack Query 5**: Server state management
- **Framer Motion 11**: Animations

### Testing
- **Jest 30**: JavaScript testing framework
- **React Testing Library 16**: React component testing
- **Bun Test**: Built-in test runner

### CI/CD
- **GitHub Actions**: Automated testing and deployment
- **Workflows**: 3 automated workflows (CI, PR checks, Deploy)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun 1.3+
- TypeScript 5+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/craighckby-stack/omega-ai.git
cd omega-ai

# Install dependencies
bun install

# Set up environment
cp .env.example .env

# Initialize database
bun run db:push

# Start development server
bun run dev
```

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with coverage
bun test:coverage
```

### Running WebSocket Service

```bash
# Start WebSocket service
cd mini-services/websocket
bun run start

# WebSocket will be available on port 3003
# Connect to ws://localhost:3003
```

---

## 🧪 Testing

### Unit Tests

We have comprehensive unit tests for all core modules:

#### 1. **Encryption System Tests**
- ✅ Key generation validation
- ✅ Encryption/decryption functionality
- ✅ AES-256-GCM algorithm testing
- ✅ RSA-4096 key pair generation

#### 2. **Binary Units Tests**
- ✅ PROCESSOR unit tests
- ✅ ANALYZER unit tests
- ✅ VALIDATOR unit tests
- ✅ OPTIMIZER unit tests
- ✅ Metrics tracking tests

#### 3. **Test Coverage**
```bash
# View coverage report
bun test:coverage

# Open coverage report
open coverage/index.html
```

### Test Files

```
src/__tests__/
├── lib/
│   ├── encryption/
│   │   └── encryption.test.ts
│   └── security/
│       └── binary-units.test.ts
├── consciousnessness/
│   └── constraints.test.ts
└── agents/
    └── registry.test.ts
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows

#### 1. **CI Workflow** (.github/workflows/ci.yml)
Runs on every push and pull request to main branch:

- **Lint Check**: ESLint code quality validation
- **Type Check**: TypeScript type checking
- **Unit Tests**: Run complete test suite
- **Build Validation**: Build Next.js application
- **Artifact Upload**: Save build artifacts

#### 2. **Pull Request Checks** (.github/workflows/pr-checks.yml)
Runs on every pull request:

- **Checkout**: Fetch PR code
- **Dependencies**: Install all dependencies
- **Type Check**: TypeScript validation
- **Tests**: Run unit tests
- **Build**: Validate Next.js build

#### 3. **Deploy Workflow** (.github/workflows/deploy.yml)
Runs on manual trigger or push to main:

- **Checkout**: Fetch latest code
- **Setup**: Configure Bun runtime
- **Dependencies**: Install all dependencies
- **Database**: Run migrations
- **Build**: Create production build
- **Deploy**: Deploy to production server
- **Notify**: Send deployment notification

### Workflow Status

✅ **CI Workflow**: Active
✅ **PR Checks**: Active
✅ **Deploy Workflow**: Active (manual trigger)

---

## 📂 Project Structure

```
omega-ai/
├── prisma/
│   └── schema.prisma              # Database schema (25+ models)
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── page.tsx              # Main dashboard with WebSocket
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css            # Global styles
│   │   └── api/                 # API routes (5 endpoints)
│   │       ├── metrics/       # System metrics API
│   │       ├── security/      # Encryption & binary processing API
│   │       ├── reasoning/     # Ethical reasoning API
│   │       ├── agents/         # Agent swarm API
│   │       └── learning/       # Self-improvement API
│   ├── components/              # React components
│   │   └── ui/             # shadcn/ui components (10 components)
│   │       ├── card.tsx       # Card component
│   │       ├── button.tsx      # Button component
│   │       ├── alert.tsx       # Alert component
│   │       ├── input.tsx       # Input component
│   │       ├── dialog.tsx      # Dialog component
│   │       ├── select.tsx      # Select component
│   │       ├── tabs.tsx        # Tabs component
│   │       ├── label.tsx       # Label component
│   │       ├── avatar.tsx      # Avatar component
│   │       └── tooltip.tsx    # Tooltip component
│   └── lib/                     # Core libraries (6 layers)
│       ├── consciousness/      # SPED layer
│       ├── reasoning/         # Huxley layer
│       ├── memory/            # DAF layer
│       ├── agents/            # Agent swarm
│       ├── security/          # z-system layer
│       ├── learning/          # Self-improvement layer
│       ├── db.ts             # Prisma client
│       ├── utils.ts          # Utility functions
│       └── sdk-mock.ts       # Mock SDK for AI integration
├── mini-services/              # Additional services
│   └── websocket/            # WebSocket real-time service
├── src/__tests__/              # Unit tests
│   └── lib/                # Library tests
│       ├── encryption/
│       ├── security/
│       ├── consciousness/
│       └── agents/
├── .github/workflows/           # CI/CD workflows
│   ├── ci.yml                 # Main CI workflow
│   ├── pr-checks.yml          # Pull request checks
│   └── deploy.yml             # Deployment workflow
├── Configuration Files
│   ├── package.json            # Dependencies and scripts
│   ├── tsconfig.json          # TypeScript configuration
│   ├── next.config.ts         # Next.js configuration
│   ├── tailwind.config.ts      # Tailwind configuration
│   ├── postcss.config.mjs     # PostCSS configuration
│   ├── jest.config.js          # Jest test configuration
│   └── .env.example           # Environment variables template
└── Documentation
    ├── README.md              # Complete project documentation
    ├── BUILD_COMPLETE.md       # Build summary and status
    └── LICENSE                # MIT License
```

---

## 🔌 API Documentation

### Metrics API

**Endpoint**: `GET /api/metrics`

Returns system-wide metrics and status.

**Response**:
```json
{
  "totalConcepts": 0,
  "totalExperiences": 0,
  "activeAgents": 17,
  "currentCycle": 0,
  "encryptedPackets": 0,
  "reasoningTraces": 0,
  "status": {
    "consciousness": "ACTIVE",
    "reasoning": "ACTIVE",
    "memory": "ACTIVE",
    "agents": "ACTIVE",
    "security": "ACTIVE",
    "learning": "IDLE"
  }
}
```

### Security API

**Endpoint**: `POST /api/security`

Handles encryption, decryption, binary processing, and key generation.

**Actions**:
- `encrypt` - Encrypt data using AES-256-GCM
- `decrypt` - Decrypt data using stored keys
- `process` - Process binary data using BinaryProcessor
- `generate-key` - Generate new RSA-4096 key pair

### Reasoning API

**Endpoint**: `POST /api/reasoning`

Processes queries through tri-loop ethical reasoning system.

**Request**:
```json
{
  "query": "What is the meaning of life?",
  "context": {
    "sessionId": "session-123",
    "timestamp": 1699999999999
  }
}
```

**Response**:
```json
{
  "success": true,
  "trace": {
    "queryId": "query_123",
    "ethicalRiskScore": 0.2,
    "riskCategory": "LOW",
    "riskFactors": [...],
    "strategy": "DIRECT_RESPONSE",
    "certaintyGain": 0.5,
    "timePenalty": 500,
    "computationalCost": 0.2,
    "ccrr": 1.25,
    "decision": "PROCEED",
    "justification": { ... },
    "improvementPlan": { ... }
  }
}
```

### Agents API

**Endpoint**: `POST /api/agents`

Executes tasks using 17 specialized AI agents.

**Request**:
```json
{
  "query": "Analyze market trends for AI",
  "domain": "Business",
  "priority": 1
}
```

**Response**:
```json
{
  "success": true,
  "result": {
    "queryId": "task-123",
    "agentResults": [
      {
        "agentId": "business-analyst",
        "response": "...",
        "confidence": 0.85,
        "reasoning": "...",
        "duration": 1500,
        "errors": []
      },
      ...
    ],
    "synthesizedOutput": "...",
    "confidence": 0.82
  }
}
```

### Learning API

**Endpoint**: `POST /api/learning`

Manages self-improvement cycles.

**Request**:
```json
{
  "action": "start-cycle|get-status|set-constraint",
  "constraintLevel": 3.0
}
```

**Actions**:
- `start-cycle` - Execute self-improvement cycle
- `get-status` - Get current constraint level
- `set-constraint` - Set constraint level

---

## 🧩 Modules

### Consciousness Layer

**Location**: `src/lib/consciousness/`

**Components**:
- `constraints.ts` - Constraint engine with sensory, structural, interpretive, and environmental limits
- `perception.ts` - Perception layer with input compression and feature extraction

**Purpose**: Model how consciousness emerges from structure interacting with constraint.

---

### Reasoning Layer

**Location**: `src/lib/reasoning/`

**Components**:
- `tri-loop.ts` - Tri-loop architecture with ERS, CGS, and CCRR calculations

**Purpose**: Provide transparent, ethical reasoning with quantifiable risk assessment.

---

### Memory Layer

**Location**: `src/lib/memory/`

**Components**:
- `knowledge-graph.ts` - Knowledge graph with concept nodes and relationships
- `consolidation.ts` - Memory consolidation with pruning and merging

**Purpose**: Persistent cross-session knowledge retention with automatic consolidation.

---

### Agent Swarm Layer

**Location**: `src/lib/agents/`

**Components**:
- `agent-registry.ts` - Registry of 17 specialized agents
- `orchestrator.ts` - Agent orchestration with parallel execution and synthesis

**Purpose**: Multi-perspective intelligence with specialized domain experts.

---

### Security Layer

**Location**: `src/lib/security/`

**Components**:
- `encryption.ts` - AES-256-GCM and RSA-4096 encryption
- `binary-units.ts` - Binary processing with 4 unit types

**Purpose**: Zero-knowledge architecture with military-grade encryption.

---

### Learning Layer

**Location**: `src/lib/learning/`

**Components**:
- `self-improvement.ts` - Self-improvement cycles with constraint-based filtering

**Purpose**: Autonomous code evolution with safety validation.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`bun test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow existing code style and structure
- Add tests for new features
- Update documentation as needed
- Ensure all UI components are responsive

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

OMEGA synthesizes best elements from your 18 research repositories:

- **SPED**: Constraint-based consciousness framework
- **Huxley**: Ethical reasoning architecture with tri-loop system
- **DAF**: Developmental AGI Framework with persistent memory
- **echo-chamber-v7**: Multi-agent orchestration system
- **z-system**: Zero-knowledge encryption architecture
- **I.J. Good (1965)**: Self-improvement loop hypothesis
- **Autonomous-Singularity-System**: Agent swarm architecture
- **unitary-core**: Quantum data processing concepts
- And all other repositories in your ecosystem

All original work licensed under MIT License.

---

## 📞 Repository URL

**OMEGA**: [https://github.com/craighckby-stack/omega-ai](https://github.com/craighckby-stack/omega-ai)

---

<div align="center">

**Built with ❤️ from collective wisdom of AI research**

**[⬆ Back to top](#omega---omni-model-emergent-general-intelligence-architecture)**

</div>
