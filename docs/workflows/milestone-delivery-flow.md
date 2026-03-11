# Milestone Delivery Flow

## Purpose
Define how to plan, execute, and deliver milestones — larger bodies of work that contain multiple tasks and involve multiple agents.

## What Is a Milestone?
A milestone is a significant, measurable deliverable. Examples:
- "Launch the marketing landing page"
- "Implement SEO optimization across all pages"
- "Add pricing section with structured data"
- "Complete performance optimization sprint"

## Milestone Structure

```markdown
## Milestone: [Name]

**Goal**: [One sentence describing the outcome]
**Due**: [Target date or "current sprint"]
**Owner**: Studio Orchestrator
**Status**: Not Started / In Progress / Complete

### Success Criteria
- [ ] [Measurable criterion 1]
- [ ] [Measurable criterion 2]
- [ ] [Measurable criterion 3]

### Tasks
1. [Task 1] — [Agent] — [Status]
2. [Task 2] — [Agent] — [Status]
3. [Task 3] — [Agent] — [Status]
```

## Milestone Lifecycle

### 1. Define
- Orchestrator defines the milestone goal and success criteria
- Break into discrete tasks
- Identify task dependencies
- Assign agents to tasks

### 2. Kickoff
- Orchestrator communicates milestone to all involved agents
- Confirm understanding of each task
- Identify risks or blockers
- Set task order based on dependencies

**Visibility**: Show `Stage Started` event with milestone name, all assigned agents, and task breakdown.

### 3. Execute
For each task in the milestone:
1. Follow the GSD-Inspired Execution Loop (discuss → plan → execute → verify)
2. Mark task complete when verified
3. Report progress to Orchestrator
4. Escalate blockers immediately

**Visibility**: Show `Agent Activated` when delegating each task. Show `Task Completed` and `Result Returned` after each task. Show `Handoff Started` between agents. Follow `docs/operations/visible-orchestration-mode.md` (Full Visible Mode).

### 4. Checkpoint
At 50% task completion, Orchestrator checks:
- Are we on track?
- Any scope creep?
- Any blocked tasks?
- Any quality concerns?

### 5. Final Verification
When all tasks are complete:
- Run full audit cycle (see `docs/workflows/audit-to-fix-workflow.md`)
- Verify all success criteria are met
- Check for regressions
- Review overall quality

### 6. Deliver
- Final build and deploy
- Verify production
- Document what was delivered
- Archive milestone record

## Task Dependencies

### Dependency Types
- **Sequential**: Task B cannot start until Task A is complete
- **Parallel**: Tasks can run simultaneously
- **Blocking**: Task requires external input/decision

### Example Dependency Map
```
Task 1: Define page structure (Architect)
  ↓
Task 2: Write content (Content Strategist)  — parallel with →  Task 3: Implement layout (Frontend Builder)
  ↓                                                                ↓
Task 4: Add SEO metadata (SEO Lead)  ←  depends on both 2 and 3
  ↓
Task 5: QA testing (QA Browser Tester)  — parallel with →  Task 6: Performance audit (Performance Auditor)
  ↓
Task 7: Deploy (Orchestrator)
```

## Progress Tracking

### Task States
| State | Meaning |
|---|---|
| Not Started | Task hasn't been picked up yet |
| In Progress | Agent is actively working on it |
| Blocked | Waiting for dependency or input |
| In Review | Work is done, being verified |
| Complete | Verified and accepted |

### Milestone States
| State | Meaning |
|---|---|
| Not Started | No tasks have begun |
| In Progress | At least one task is active |
| At Risk | Behind schedule or blocked |
| In Review | All tasks done, final verification |
| Complete | All success criteria met, delivered |

## Escalation Rules

| Situation | Action |
|---|---|
| Task blocked > 1 hour | Escalate to Orchestrator |
| Quality gate failure | Stop and fix before proceeding |
| Scope change requested | Orchestrator evaluates impact |
| Critical bug found | Pause milestone, fix bug first |
| Tool unavailable | Use alternative approach or escalate |

## Milestone Retrospective

After delivery, briefly note:
- What went well
- What was harder than expected
- What should change for next milestone
- Any process improvements identified
