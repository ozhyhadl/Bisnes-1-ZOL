# GSD Adaptation

## Source
- **Name**: Get Shit Done (GSD)
- **URL**: https://github.com/gsd-build/get-shit-done
- **Purpose**: Spec-driven development system with context engineering and multi-agent orchestration

## What We Take From GSD

### Core Workflow Loop
The **discuss → plan → execute → verify** loop is the backbone of our execution model:
1. **Discuss** — capture implementation decisions and preferences before planning
2. **Plan** — research and create atomic task plans with verification steps
3. **Execute** — implement plans in focused contexts with atomic commits
4. **Verify** — confirm deliverables work as expected, fix if not

### Anti-Context-Rot Approach
- Break work into small, atomic tasks
- Each task should be completable in one focused session
- Clean handoffs between tasks to prevent accumulated confusion
- Fresh context for each execution unit

### Milestone-Oriented Execution
- Work organized into milestones with clear scope
- Each milestone has phases, each phase has plans
- Complete → verify → next milestone
- Archive completed milestones cleanly

### Structured Agent Operating Discipline
- Orchestrator coordinates, never does heavy lifting
- Specialized agents for each domain
- Clear handoff artifacts between agents
- Verification at every boundary

## What Is Native vs Non-Native
| GSD Concept | Our Integration | Type |
|-------------|----------------|------|
| discuss → plan → execute → verify loop | Workflow docs + agent collaboration | ✅ Native adaptation |
| Anti-context-rot | Task sizing + handoff docs | ✅ Native adaptation |
| Milestone model | Orchestrator workflow | ✅ Native adaptation |
| Agent orchestration pattern | `.github/agents/` structure | ✅ Native adaptation |
| XML prompt formatting | Not used — Copilot has its own format | ❌ Not applicable |
| Claude Code slash commands | Not used — different runtime | ❌ Not applicable |
| `.planning/` directory structure | Adapted to `docs/` structure | ✅ Native adaptation |
| Subagent spawning | Copilot agent collaboration | ✅ Native adaptation |

## How It Integrates Into Copilot Workflow
- **Workflow runbooks** in `docs/workflows/` encode the GSD loop
- **Agent definitions** in `.github/agents/` mirror GSD's orchestrator-specialist pattern
- **AGENTS.md** defines handoff logic inspired by GSD's wave execution
- **Templates** provide structured formats for plans and verifications

## Adapter Layer
No runtime adapter needed. GSD is a **reference pattern** — we extract workflow principles and encode them as documentation that guides Copilot behavior.

## Risks / Limitations
- GSD is designed for Claude Code — we adapt concepts, not commands
- No runtime enforcement — discipline relies on following documented workflows
- No automatic state management (`STATE.md`) — we use manual tracking

## Recommended Usage Mode
**Reference + Adaptation** — apply GSD's discuss→plan→execute→verify discipline through documented workflows and agent collaboration rules.
