# ðŸš€ SYSTEMATIC REPOSITORY FIX PLAN
## **Start to Finish - Making Everything Functional**

---

## ðŸ“Š **CURRENT STATUS**

### **Tests Run**: 121 total, 64 passing (53%), 57 failing

### **Critical Issues Identified**:

## **PRIORITY 1: Database Schema Validation Error**

**Error**: `Error validating: This line is invalid. It does not start with any known Prisma schema keyword. --> prisma/schema.prisma:245`

**Root Cause**: Duplicate models or invalid closing braces in `schema.prisma`.

**Impact**: Blocking database push, blocking all schema-dependent tests.

**Fix Needed**:
1. Clean up `schema.prisma`: Remove duplicates, fix syntax, verify brace closure.
2. Validate schema: `bunx prisma validate`.
3. Push database changes: `bun run db:push`.
4. Regenerate client: `bun run db:generate`.

**Status**: ðŸ”´ **CRITICAL** - Infrastructure Blocked

---

## **PRIORITY 2: Security API Encryption Key Storage**

**Error**: `Conversion failed: Value 1767667874381 does not fit in an INT column, try migrating to 'created' column type to BIGINT`

**Root Cause**: Attempting to store large numeric values (likely timestamps or serialized buffers) in the `created` field, defined as `Int`.

**Current Model Snippet (Lines 191-201)**:
```prisma
model EncryptionKey {
  // ... fields ...
  created     Int // <-- This is the issue
  // ... fields ...
}
```

**Impact**: Breaking security API tests (3 tests failing).

**Fix Needed**:
1. Update `EncryptionKey` model: Ensure `created` is `BigInt` or `DateTime`. (Prefer `DateTime` if it's a timestamp).
2. Refactor key storage logic: Store key material in `publicKey`/`privateKey` (String/Text fields) as encoded strings (e.g., PEM, base64), not as numeric representations or buffers converted to numbers.
3. Ensure no Buffer objects are accidentally stored as `Int`.

**Status**: ðŸ”´ **CRITICAL** - Security API broken

---

## **PRIORITY 3: Agent Orchestrator Error Handling**

**Error**: `error: All agents failed`

**Root Cause**: Orchestrator throws a hard error when all subordinate agents fail, instead of handling gracefully. (Line 173 in `src/lib/agents/orchestrator.ts`).

**Impact**: Breaking agents API tests (5 tests failing).

**Fix Needed**:
1. Remove `throw new Error('All agents failed')` from orchestrator.
2. Return a structured result object with `success: false` and error details.
3. Update API routes to handle failed orchestrator results (200 status with failure payload, not 500).

**Status**: ðŸ”´ **CRITICAL** - Agent failures mismanaged

---

## **PRIORITY 4: Reasoning Layer Test Failures (13 tests)**

**Key Failures**: Risk factors returning `undefined`; threshold mismatch for CCRR/Risk Score; incorrect decision logic ("LOW" vs "NONE", "REJECT" vs "PROCEED/DEFER").

**Root Cause**:
1. `loop1_Intuition()` returns inconsistent data types (sometimes `undefined`).
2. Risk category and CCRR thresholds are misconfigured relative to test expectations.
3. Mock SDK is providing unstructured/incorrect risk factor responses.

**Fix Needed**:
1. Fix `loop1_Intuition()` to reliably return a risk factors array (even if empty).
2. Standardize CCRR and risk category calculation thresholds.
3. Update mock SDK responses to match expected risk factor structures.
4. Verify decision logic thresholds in the main reasoning pipeline.

**Status**: ðŸ”´ **HIGH** - 13 tests failing

---

## **PRIORITY 5: Memory Layer Test Failures (8 tests)**

**Key Failures**: Concept extraction failures; concepts not stored in DB during `storeLearning()`.

**Root Cause**:
1. `extractConcepts()` regex is flawed (e.g., failing to match capitalized words, or poor filtering).
2. Database write for concepts (`db.concept.upsert()`) is not being called or executed correctly within `storeLearning()`.

**Fix Needed**:
1. Fix `extractConcepts()` regex/logic for accurate word extraction and filtering (length > 3, deduplication).
2. Ensure reliable database interaction during `storeLearning`.
3. Implement test database cleanup hooks.

**Status**: ðŸ”´ **HIGH** - 8 tests failing

---

## **PRIORITY 6: Agents Layer Test Failures (10 tests)**

**Key Failures**: Incorrect agent counts (e.g., not 17 total, division counts wrong); selection algorithm failing; synthesis failure; DB storage failure.

**Root Cause**:
1. `AGENT_REGISTRY` definition is incomplete or incorrect (missing agents).
2. Agent selection logic (relevance/prioritization) is broken.
3. Result synthesis implementation is faulty.

**Fix Needed**:
1. Verify and complete the `AGENT_REGISTRY` definition (17 agents across 4 divisions).
2. Debug and fix agent selection algorithm (prioritization/relevance calculation).
3. Fix result synthesis and task storage logic in the orchestrator flow.
4. Update mock SDK to return expected agent response structures.

**Status**: ðŸ”´ **HIGH** - 10 tests failing

---

## **PRIORITY 7: Security Units Test Failures (2 tests)**

**Failing Tests**: Encryption system failure; Binary optimizer not reducing output length.

**Root Cause**:
1. Implementation error in the `encrypt()` method (e.g., incorrect IV/key handling, padding).
2. Binary optimizer logic is ineffective or non-functional.

**Fix Needed**:
1. Debug and verify AES-256-GCM implementation in `EncryptionSystem`.
2. Fix `BinaryProcessor` optimization logic to reliably reduce payload size.

**Status**: ðŸŸ¡ **MEDIUM** - 2 tests failing

---

## **PRIORITY 8: Learning Layer Test Failures (2 tests)**

**Failing Tests**: Self-Improvement Cycle throws errors; error handling fails.

**Root Cause**: Execution flow in `executeCycle()` is throwing uncaught exceptions.

**Fix Needed**:
1. Implement robust try/catch blocks in `executeCycle()`.
2. Verify mock data generation to prevent upstream failures.

**Status**: ðŸŸ¡ **MEDIUM** - 2 tests failing

---

## **PRIORITY 9: API Routes Test Failures (8 tests)**

**Key Failures**: Inconsistent response properties (`success` missing, `encryptedData` vs `encryptedPacket`); status codes incorrect (500 instead of 200/400); 5 duplicate tests identified.

**Root Cause**: API handlers return objects that do not conform to standardized response structures; duplicate tests creating noise.

**Fix Needed**:
1. Standardize API response payloads across security and agents routes (e.g., always include `success`, use consistent property names).
2. Remove the 5 identified duplicate tests.
3. Ensure agents API returns 200 status with failure payload (per P3 fix).

**Status**: ðŸŸ¡ **MEDIUM** - 8 tests failing / Duplication issue

---

## ðŸ“‹ **FIX PRIORITY ORDER**

### **Phase 1: Critical Infrastructure (25+ Tests)**
1. **P1**: Schema Validation (`schema.prisma`)
2. **P2**: Security Key Storage (`EncryptionKey` model / storage logic)
3. **P3**: Agent Orchestrator Error Handling (`orchestrator.ts`)

### **Phase 2: Core Layer Logic (20+ Tests)**
4. **P4**: Reasoning Layer Fixes (Risk calculation, thresholds)
5. **P5**: Memory Layer Fixes (Concept extraction/storage)
6. **P6**: Agents Layer Fixes (Registry, Selection, Synthesis)

### **Phase 3: Cleanup & Refinement (12+ Tests)**
7. **P9**: API Route Consistency & Duplication Removal
8. **P7**: Security Unit Fixes (Encryption, Binary Optimizer)
9. **P8**: Learning Layer Fixes (Cycle stability)

---

## ðŸš€ **EXECUTION PLAN SUMMARY**

| Phase | Days | Priority | Goal |
| :---: | :---: | :---: | :--- |
| **P1** | 1-7 | 1, 2, 3 | Infrastructure stable, DB functional, Security/Agent APIs stable. |
| **P2** | 8-22 | 4, 5, 6 | Core intelligence layers functional (Reasoning, Memory, Agents). |
| **P3** | 23-35 | 9, 7, 8 | Endpoint standardization, security logic verified, learning cycles stable. |

---

## ðŸ“¦ **CRITICAL FILES TO FIX**

1. `prisma/schema.prisma`
2. `src/lib/agents/orchestrator.ts`
3. `src/lib/reasoning/tri-loop.ts`
4. `src/lib/memory/knowledge-graph.ts`
5. `src/lib/agents/agent-registry.ts`
6. `src/app/api/security/route.ts` (API response & Key storage logic)
7. `src/app/api/agents/route.ts` (API response)
8. Relevant `src/__tests__` files (for expectation updates and duplicate removal)

---

## ðŸŽ¯ **SUCCESS CRITERIA**

**Goal**: Achieve 105+ passing tests (87%+ pass rate).

1. All infrastructure actions (db:push, db:generate) succeed.
2. Critical core layer tests (P4, P5, P6) pass 100%.
3. API endpoints return predictable, standardized responses.

---

## ðŸš€ **NEXT IMMEDIATE ACTIONS**

1. Fix `prisma/schema.prisma`.
   ```bash
   bunx prisma validate
   bun run db:push
   ```
2. Begin debug and update of `EncryptionKey` model and storage logic (P2).

---
**Status**: ðŸŸ¡ **WORK IN PROGRESS** - Execution Begins Now.