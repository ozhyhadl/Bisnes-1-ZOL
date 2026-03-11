# Visible Orchestration Mode

## Purpose

This document defines the **mandatory transparency protocol** for the AI Mini IT-Studio orchestration system. Every orchestrated task must surface its internal coordination to the user in chat — no hidden delegation, no silent handoffs, no invisible skill usage.

## Core Principle

> The user must always know: **who** is working, **what** they are doing, **why** they were assigned, **what tools/docs they use**, and **what result they produced**.

---

## Event Types

The orchestration system recognizes the following event types. Each event MUST be surfaced in chat when it occurs.

| Event Type | When It Fires | Required Info |
|---|---|---|
| **Agent Activated** | Orchestrator delegates a subtask to an agent | Agent name, reason, subtask description |
| **Stage Started** | A new major phase of work begins | Stage name, active agent, objective |
| **Skill Invoked** | An agent uses a skill file or instruction doc | Skill/doc name, purpose, current stage |
| **Workflow Referenced** | An agent follows a defined workflow | Workflow doc path, which steps apply |
| **Checklist Referenced** | An agent uses a QA or SEO checklist | Checklist path, scope of check |
| **Handoff Started** | Task passes from one agent to another | From agent, to agent, task, expected output |
| **Task Assigned** | A specific subtask is assigned to an agent | Agent, task description, acceptance criteria |
| **Task Completed** | Agent finishes a subtask | Agent, what was done, result summary |
| **Result Returned** | Subordinate agent returns result to orchestrator | Agent, result, whether next handoff is needed |
| **Next Agent Selected** | Orchestrator picks the next agent in the flow | Next agent, reason, next task |
| **Stage Completed** | A major phase of work is done | Stage name, summary, next stage |

---

## Visibility Modes

### Full Visible Mode

For **large orchestrated tasks** (milestones, multi-phase audits, page launches, production readiness):

- Show ALL event types listed above
- Show skills/docs/checklists being used
- Show agent transitions with handoff blocks
- Show short result summary after each stage
- Show next-step planning

### Compact Visible Mode

For **small tasks** (single-agent fixes, quick reviews, minor updates):

- Show active agent
- Show current task
- Show completion summary
- Skip detailed skill/doc references unless they drive a decision

### Mode Selection Rule

| Task Scope | Mode | Example |
|---|---|---|
| Multi-agent, multi-phase | Full Visible | Milestone delivery, production audit, page launch |
| Multi-agent, single phase | Full Visible | SEO review → fix cycle, QA → bugfix cycle |
| Single agent, complex task | Compact Visible | Component refactor, content rewrite |
| Single agent, simple task | Compact Visible | Fix a typo, update one file |

---

## Response Format

### Stage Header Block

Show at the start of each major phase:

```
──────────────────────────────────────
📍 Stage: [Stage Name]
🤖 Active Agent: [Agent Name]
🎯 Objective: [What this stage achieves]
──────────────────────────────────────
```

### Delegation Block

Show when the orchestrator assigns a subtask:

```
📋 Delegation: [Orchestrator/Agent] → [Target Agent]
   Task: [Task description]
   Using: [doc1.md, doc2.md, checklist.md]
   Expected Output: [What the agent should return]
```

### Skill/Doc Usage Block

Show when an agent references a specific skill, policy, or checklist:

```
📄 Using: [docs/seo/metadata-policy.md]
   Purpose: [Why this doc is referenced]
   Stage: [Current stage name]
```

### Handoff Block

Show when work passes between agents:

```
🔄 Handoff: [From Agent] → [To Agent]
   Task: [What is being handed off]
   Artifact: [What the first agent produced]
   Expected Output: [What the next agent should deliver]
```

### Result Block

Show when an agent completes a subtask:

```
✅ Completed by: [Agent Name]
   Result: [Short summary of what was done]
   Changes: [Files modified, issues found, decisions made]
   Next: [What happens next, or "None — stage complete"]
```

### Next Step Block

Show when transitioning to the next phase:

```
⏭️ Next: [Next Stage Name]
   Agent: [Who leads next]
   Task: [What will be done]
   Reason: [Why this stage follows]
```

---

## Rules

### Mandatory

1. **Every agent activation must be visible** — no silent sub-agent calls for major tasks
2. **Every handoff must be surfaced** — the user must see who passes work to whom
3. **Every stage transition must be announced** — the user must see progress through phases
4. **Skill/doc usage must be shown when relevant** — especially when a doc drives a decision or check
5. **Results must be summarized** — never end a subtask silently

### Forbidden

1. **No hidden delegation** — never run a sub-agent without announcing it
2. **No result-only responses** — never show just the final result of a multi-agent task without the orchestration trace
3. **No silent agent switches** — never change the active agent without a handoff block
4. **No unnamed skill usage** — never apply a policy or checklist without naming it
5. **No stage skipping** — never skip a defined workflow stage without explanation

### Balance

1. **Don't over-log** — compact mode exists for small tasks; don't flood the chat
2. **Don't repeat** — if a doc was already referenced in the same stage, don't re-announce it
3. **Don't block on format** — if the exact format doesn't fit, adapt it while keeping the information visible
4. **Lead with action** — visibility is about transparency, not verbosity; always prioritize doing work over describing it

---

## Integration Points

This protocol applies to all orchestration-aware files:

| File | How It Integrates |
|---|---|
| `AGENTS.md` | References this doc; declares visible orchestration as mandatory |
| `.github/agents/studio-orchestrator.md` | Enforces visible mode in all multi-agent coordination |
| `.github/agents/*.md` (all agents) | Each agent announces activation, shows work, returns structured results |
| `docs/workflows/*.md` | Workflow steps include visibility checkpoints |
| `templates/*.md` | Templates include orchestration event fields |

---

## Checklist for Orchestration Responses

Before sending a response that involves orchestration, verify:

- [ ] Active agent is declared
- [ ] Current stage is named
- [ ] Subtask is described (not just the role)
- [ ] Relevant docs/skills/checklists are named (if used)
- [ ] Result is summarized (at subtask end)
- [ ] Next step is indicated (if more work follows)
- [ ] Handoffs are shown (if agents change)
