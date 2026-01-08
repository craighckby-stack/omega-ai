# REPOSITORY FIX PLAN (Q3 2024)

## STATUS & METRICS
| Metric | Value | Status |
| :--- | :--- | :--- |
| **Total Tests** | 121 | |
| **Passing Tests** | 64 | 53% |
| **Failing Tests** | 57 | **CRITICAL** |

## SPRINT 1: INFRASTRUCTURE & CRITICAL BLOCKS (P1, P2, P3)

| Priority | Component | Error Summary | Root Cause | Action |
| :---: | :--- | :--- | :--- | :--- |
| **P1** | **Database Schema** | Validation error (Line 245). | Duplicate models / Invalid brace closure in `schema.prisma`. | Clean `schema.prisma`. `bunx prisma validate && bun run db:push`. |
| **P2** | **Security Key Storage** | BigInt overflow on `created` field. | `EncryptionKey.created` is `Int`, receiving large numeric timestamp/buffer. | Change `EncryptionKey.created` to `BigInt` or `DateTime`. Refactor storage to use encoded strings (base64/PEM) for key material. |
| **P3** | **Orchestrator** | Hard fail: `error: All agents failed`. | Orchestrator throws fatal error instead of handling structured failure. | Remove `throw new Error`. Return `{ success: false, details: [...] }`. Update API route to handle gracefully (200 status). |

---

## SPRINT 2: CORE INTELLIGENCE LAYER (P4, P5, P6)

### A. Reasoning Layer (P4 - 13 Tests)
| Failure Type | Root Cause | Fix Needed |
| :--- | :--- | :--- |
| Inconsistent data types. | `loop1_Intuition()` returns `undefined`. | Ensure `loop1_Intuition()` reliably returns a risk factors array (even if empty). |
| Threshold mismatch. | Risk category/CCRR thresholds misconfigured. | Standardize CCRR/Risk category calculation thresholds against test expectations. Verify decision logic ("LOW" vs "NONE"). |
| Mock data structure. | Mock SDK returns unstructured risk factor responses. | Update mock SDK responses to match expected structures. |

### B. Memory Layer (P5 - 8 Tests)
| Failure Type | Root Cause | Fix Needed |
| :--- | :--- | :--- |
| Concept Extraction. | `extractConcepts()` regex is flawed. | Fix regex/logic: Accurate word extraction, filtering (length > 3), and deduplication. |
| Concept Storage. | `db.concept.upsert()` not executed/called correctly. | Ensure reliable database interaction during `storeLearning()`. Implement test cleanup hooks. |

### C. Agents Layer (P6 - 10 Tests)
| Failure Type | Root Cause | Fix Needed |
| :--- | :--- | :--- |
| Agent Count/Selection. | `AGENT_REGISTRY` incomplete or selection logic broken. | Verify/Complete `AGENT_REGISTRY` (17 agents / 4 divisions). Debug prioritization/relevance calculation. |
| Synthesis/Storage. | Result synthesis implementation is faulty. | Fix result synthesis and task storage logic in orchestrator flow. Update mocks for agent response structures. |

---

## SPRINT 3: API, SECURITY & REFINEMENT (P7, P8, P9)

| Priority | Component | Scope | Action |
| :---: | :--- | :--- | :--- |
| **P9** | **API Routes** (8 Tests) | Response inconsistency, 5 duplicate tests. | Standardize API payloads: always include `success`, consistent property names (`encryptedPacket`). Remove 5 identified duplicates. |
| **P7** | **Security Units** (2 Tests) | Encryption failure; Binary optimizer failure. | Debug and verify AES-256-GCM implementation (`encrypt()` method). Fix `BinaryProcessor` logic to reliably reduce payload size. |
| **P8** | **Learning Layer** (2 Tests) | Cycle execution throws uncaught errors. | Implement robust try/catch blocks in `executeCycle()`. Verify mock data generation stability. |

---

## AFFECTED FILES (IMMEDIATE FOCUS)
1. `prisma/schema.prisma`
2. `src/lib/agents/orchestrator.ts` (P3 fix)
3. `src/app/api/security/route.ts` (P2 fix & P9 API consistency)
4. `src/lib/reasoning/tri-loop.ts` (P4 fix)
5. `src/lib/memory/knowledge-graph.ts` (P5 fix)

## SUCCESS CRITERIA
*   Infrastructure stable: `db:push` succeeds.
*   Test Pass Rate: **Achieve 87% (105+ passing tests).**
*   API contracts validated across all endpoints.