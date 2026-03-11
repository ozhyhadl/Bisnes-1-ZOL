# Copilot Native Layer

## Overview
The native layer is what works directly inside VS Code + GitHub Copilot without any external installation or runtime dependencies.

## Native Components

### `.github/agents/`
Agent definition files in markdown. Each file describes a specialized role (architect, SEO lead, QA tester, etc.) with:
- Role and mission
- Responsibilities and constraints
- Input/output contracts
- Collaboration rules and handoff logic

Copilot reads these files to understand contextual roles when working in the repository.

### `AGENTS.md`
Root-level orchestration document that defines:
- Studio mission
- Agent collaboration model
- Handoff and escalation logic
- Code, SEO, QA, and documentation standards
- Quality bar and done criteria

### `docs/` — Operational Documentation
All policy documents, checklists, and workflow runbooks are native. They serve as:
- **Agent instructions** — Copilot reads these to understand how to execute tasks
- **Human reference** — developers can follow them manually
- **Audit trails** — completed checklists serve as verification records

### Repository Instruction Model
The combination of `AGENTS.md` + `.github/agents/` + `docs/` creates a **repository-as-operating-system** where:
1. Copilot understands the project's execution model
2. Every task has a documented workflow
3. Quality gates are embedded in process, not just CI

## What Is Truly Native
| Component | Native? | Notes |
|-----------|---------|-------|
| Agent definitions | ✅ Yes | Markdown files read by Copilot |
| Orchestration model | ✅ Yes | AGENTS.md as collaboration spec |
| SEO policies | ✅ Yes | Docs that guide agent behavior |
| QA checklists | ✅ Yes | Verification lists for agents |
| Workflow runbooks | ✅ Yes | Step-by-step execution guides |
| Templates | ✅ Yes | Reusable doc structures |
| GSD concepts | ✅ Adapted | Workflow principles, not runtime |
| Marketing Skills patterns | ✅ Adapted | SEO/CRO knowledge, not runtime |

## Limitations
- Native layer is **documentation-driven** — it provides instructions, not automation
- External tools are needed for actual browser testing, crawling, and Lighthouse audits
- The native layer cannot enforce quality gates automatically — it relies on agents (human or AI) following the documented process
