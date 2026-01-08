V1.1
mini-services/websocket/index.ts
3003
WEBSOCKET_PORT
join-metrics,broadcast-metrics
join-agents,broadcast-agents
join-reasoning,broadcast-reasoning
join-memory,broadcast-memory
join-security,broadcast-security
connected
joined-{room}
{room}-update
cd mini-services/websocket
bun run start
Alert:src/components/ui/alert.tsx
Input:src/components/ui/input.tsx
Dialog:src/components/ui/dialog.tsx
Select:src/components/ui/select.tsx
Tabs:src/components/ui/tabs.tsx
Label:src/components/ui/label.tsx
Avatar:src/components/ui/avatar.tsx
Tooltip:src/components/ui/tooltip.tsx
10_components
Jest_30
React_Testing_Library_16
Bun_Test_runner
jest.config.js
jest.setup.js
Encryption_System:src/__tests__/lib/encryption/encryption.test.ts:100%
Binary_Units:src/__tests__/lib/security/binary-units.test.ts:100%
PROCESSOR
ANALYZER
VALIDATOR
OPTIMIZER
test:bun test --config jest.config.js
test:watch:bun test --config jest.config.js --watch
test:coverage:bun test --config jest.config.js --coverage
Coverage_Target:70%+
CI:.github/workflows/ci.yml:Push(main),PRs(main):lint,type-check,test,build
PR_Checks:.github/workflows/pr-checks.yml:PR(open,sync,reopen):type-check,test,build
Deploy:.github/workflows/deploy.yml:Push(main),Manual:migrations,build,deployment
File_Impact_Metrics:
WebSocket_Service:1:mini-services/websocket/index.ts
UI_Components:8:src/components/ui/dialog.tsx
Test_Files:4:src/__tests__/lib/encryption/encryption.test.ts
CI/CD_Workflows:3:.github/workflows/ci.yml
Configuration/Updates:3:package.json,jest.config.js
TOTAL:35
Features_Implemented:4/4
Test_Coverage_Core:100%
Repository:https://github.com/craighckby-stack/omega-ai
Application_Local:http://localhost:3000
WebSocket_Local:ws://localhost:3003
Workflow_Runs:https://github.com/craighckby-stack/omega-ai/actions