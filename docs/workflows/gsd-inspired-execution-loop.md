# GSD-Inspired Execution Loop

## Purpose
Adapt the key concepts from the GSD (Get Shit Done) spec-driven development system into a practical execution loop for our AI Mini IT-Studio.

## GSD Core Concepts (Adapted)

GSD uses a structured approach: **discuss → plan → execute → verify**. We adapt this for our multi-agent studio context.

## The Execution Loop

> **Orchestration**: Every stage transition in this loop must be visible per `docs/operations/visible-orchestration-mode.md`. Show `Stage Started` at each phase, `Agent Activated` on delegation, `Result Returned` on completion.

```
DISCUSS → PLAN → EXECUTE → VERIFY → DELIVER
```

### 1. DISCUSS (Understand the Task)

**Who**: Studio Orchestrator + relevant specialists
**What**:
- Clarify the request/requirement
- Identify which agents need to be involved
- Define constraints and assumptions
- Determine scope boundaries

**Output**: Clear task description with defined scope

**Key Questions**:
- What exactly needs to be done?
- Which pages/components are affected?
- Are there SEO implications?
- Are there performance implications?
- What does "done" look like?

### 2. PLAN (Design the Solution)

**Who**: Architect + relevant specialists
**What**:
- Break the task into specific, ordered steps
- Identify dependencies between steps
- Assign steps to agents
- Define verification criteria for each step

**Output**: Ordered list of steps with assignments

**Planning Template**:
```markdown
## Task: [Task Name]

### Steps:
1. [Step description] — Agent: [Agent Name] — Verify: [How to verify]
2. [Step description] — Agent: [Agent Name] — Verify: [How to verify]
3. ...

### Dependencies:
- Step 2 depends on Step 1
- Steps 3 and 4 can run in parallel

### Done Criteria:
- [ ] [Criterion 1]
- [ ] [Criterion 2]
```

### 3. EXECUTE (Build the Solution)

**Who**: Frontend Builder + relevant implementers
**What**:
- Work through steps in order
- Respect dependencies
- Run quick checks after each step
- Report blockers immediately

**Rules**:
- One step at a time
- Verify each step before moving to next
- Don't skip steps
- If blocked, escalate to Orchestrator

**Quick Check After Each Step**:
```bash
npm run build  # Still compiles?
npm run lint   # No new lint errors?
```

### 4. VERIFY (Confirm Quality)

**Who**: All relevant auditors
**What**:
- Run quality checks against done criteria
- Each specialist verifies their domain
- Report pass/fail for each criterion

**Verification Matrix**:

| Domain | Agent | Check |
|---|---|---|
| Code Quality | Frontend Builder | Build, lint, tests pass |
| SEO | SEO Lead | Metadata, structure correct |
| Performance | Performance Auditor | Lighthouse scores meet thresholds |
| Browser | QA Browser Tester | No errors, correct rendering |
| Content | Content Strategist | Copy accurate, CTAs clear |

### 5. DELIVER (Ship It)

**Who**: Studio Orchestrator
**What**:
- Final review of all verification results
- Commit with descriptive message
- Push to GitHub
- Verify deployment
- Report completion

**Delivery Checklist**:
- [ ] All verification domains pass
- [ ] Build succeeds
- [ ] Commit message is descriptive
- [ ] Push to GitHub successful
- [ ] Vercel deployment succeeds
- [ ] Production URL verified

## Loop Sizing

Not every task needs the full loop. Size the loop to the task:

| Task Size | DISCUSS | PLAN | EXECUTE | VERIFY | DELIVER |
|---|---|---|---|---|---|
| Typo fix | Skip | Skip | Fix | Quick check | Commit |
| Content update | Brief | Brief | Update | SEO check | Commit |
| New component | Yes | Yes | Full | Full | Full deploy |
| New page | Full | Full | Full | Full | Full deploy |
| Architecture change | Extended | Extended | Phased | Full | Staged deploy |

## Anti-Patterns
- ❌ Executing without understanding the task (skip DISCUSS)
- ❌ Building without a plan (skip PLAN)
- ❌ Shipping without verification (skip VERIFY)
- ❌ Over-planning simple tasks (applying full loop to typo fixes)
- ❌ Not escalating blockers (getting stuck without asking for help)

## Relationship to GSD

| GSD Concept | Our Adaptation |
|---|---|
| Spec-driven development | Agent instruction files define behavior |
| Context engineering | `AGENTS.md` + `docs/` provide shared context |
| Multi-agent orchestration | Studio Orchestrator coordinates agents |
| Milestone execution | Task-sized execution loops |
| Verification gates | Per-domain verification by specialist agents |
