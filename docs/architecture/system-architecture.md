# AI Mini IT-Studio — System Architecture

## Overview

The AI Mini IT-Studio is a multi-agent system built on GitHub Copilot's custom agent framework, enhanced with external tools for quality validation. It orchestrates specialized AI agents to handle web development tasks across code, SEO, design, content, QA, and performance.

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    HUMAN DEVELOPER                           │
│              (initiates tasks, reviews output)               │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                  STUDIO ORCHESTRATOR                         │
│            .github/agents/studio-orchestrator.md             │
│                                                              │
│  Responsibilities:                                           │
│  • Routes tasks to specialist agents                         │
│  • Coordinates multi-agent workflows                         │
│  • Enforces quality gates                                    │
│  • Manages milestone delivery                                │
└──────┬──────┬──────┬──────┬──────┬──────┬──────┬─────────────┘
       │      │      │      │      │      │      │
       ▼      ▼      ▼      ▼      ▼      ▼      ▼
┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────────┐
│Architect││Frontend││SEO Lead││Content ││QA      ││Perf    ││Tech SEO    │
│        ││Builder ││        ││Strateg.││Browser ││Auditor ││Auditor     │
│        ││        ││        ││        ││Tester  ││        ││            │
└────────┘└────────┘└────────┘└────────┘└───┬────┘└───┬────┘└──────┬─────┘
                                            │         │            │
                                            ▼         ▼            ▼
                                     ┌────────────────────────────────────┐
                                     │         EXTERNAL TOOLS            │
                                     │                                    │
                                     │  • Playwright MCP (browser tests) │
                                     │  • Lighthouse CI (perf scores)    │
                                     │  • SiteOne Crawler (SEO crawl)    │
                                     └────────────────────────────────────┘
```

## Three-Layer Architecture

### Layer 1: Native (Zero Dependencies)

Everything that works out of the box with VS Code + Copilot:

| Component | Location | Purpose |
|---|---|---|
| Custom Agents | `.github/agents/*.md` | 9 specialist agent roles |
| Project Context | `AGENTS.md` | Shared project knowledge |
| Documentation | `docs/` | Policies, workflows, standards |
| Templates | `templates/` | Reusable task templates |

### Layer 2: Adapted (Knowledge Extraction)

Concepts and knowledge from external projects, adapted to our context:

| Source | What We Took | Where It Lives |
|---|---|---|
| GSD | Execution loop, context engineering | `docs/workflows/gsd-inspired-execution-loop.md` |
| Marketing Skills | SEO policies, CRO patterns | `docs/seo/`, agent instructions |

### Layer 3: External (Tool Integration)

External tools that provide capabilities Copilot doesn't have natively:

| Tool | Capability | Integration Method |
|---|---|---|
| Playwright MCP | Browser automation | MCP server in VS Code |
| Lighthouse CI | Performance scores | npm CLI + config file |
| SiteOne Crawler | Site-wide crawl | External CLI |

## File System Map

```
project-root/
├── AGENTS.md                          # Project-wide agent context
├── .github/
│   └── agents/                        # 9 custom agent definitions
│       ├── studio-orchestrator.md      # Chief coordinator
│       ├── architect.md                # Technical design
│       ├── frontend-builder.md         # Implementation
│       ├── seo-lead.md                 # SEO strategy
│       ├── technical-seo-auditor.md    # Crawl validation
│       ├── qa-browser-tester.md        # Browser testing
│       ├── performance-auditor.md      # Lighthouse gates
│       ├── content-strategist.md       # Copy & CRO
│       └── integrations-coordinator.md # Tool management
├── docs/
│   ├── architecture/
│   │   └── system-architecture.md      # This file
│   ├── integrations/                   # How tools connect
│   │   ├── copilot-native-layer.md
│   │   ├── gsd-adaptation.md
│   │   ├── marketing-skills-adaptation.md
│   │   ├── playwright-mcp-integration.md
│   │   ├── lighthouse-ci-integration.md
│   │   ├── siteone-crawler-integration.md
│   │   └── native-vs-external-map.md
│   ├── seo/                            # SEO policies & standards
│   │   ├── metadata-policy.md
│   │   ├── indexing-policy.md
│   │   ├── canonical-policy.md
│   │   ├── sitemap-policy.md
│   │   ├── structured-data-policy.md
│   │   ├── internal-linking-policy.md
│   │   ├── content-seo-workflow.md
│   │   ├── technical-audit-checklist.md
│   │   └── launch-seo-checklist.md
│   ├── qa/                             # QA checklists & flows
│   │   ├── browser-smoke-checklist.md
│   │   ├── pre-release-qa-checklist.md
│   │   ├── lighthouse-thresholds.md
│   │   ├── regression-review-flow.md
│   │   ├── audit-to-fix-flow.md
│   │   └── browser-metadata-validation.md
│   ├── workflows/                      # Execution workflows
│   │   ├── new-page-launch.md
│   │   ├── seo-page-production.md
│   │   ├── bugfix-flow.md
│   │   ├── content-update-flow.md
│   │   ├── audit-to-fix-workflow.md
│   │   ├── gsd-inspired-execution-loop.md
│   │   └── milestone-delivery-flow.md
│   └── research/                       # Design decisions & analysis
│       ├── external-tools-map.md
│       ├── why-these-repositories.md
│       └── studio-integration-decisions.md
├── templates/                          # Reusable templates
│   ├── new-page-template.md
│   ├── milestone-template.md
│   ├── audit-report-template.md
│   └── bug-report-template.md
└── src/                                # Application source code
    ├── components/                     # React components
    ├── pages/                          # Page components
    ├── hooks/                          # Custom hooks
    └── lib/                            # Utilities
```

## Agent Interaction Model

### Handoff Protocol

Agents don't communicate directly. The human developer routes between agents based on the Orchestrator's guidance:

```
Developer asks Orchestrator: "Build a new pricing page"
  → Orchestrator says: "Invoke Architect for structure, then Frontend Builder for implementation"
  → Developer invokes @architect → gets component plan
  → Developer invokes @frontend-builder → gets implementation
  → Developer invokes @seo-lead → gets metadata configuration
  → Developer invokes @qa-browser-tester → gets validation results
```

### Trigger Criteria

| When this happens... | Invoke this agent... |
|---|---|
| New feature/page needed | Orchestrator → Architect → Frontend Builder |
| SEO optimization needed | SEO Lead + Technical SEO Auditor |
| Performance check needed | Performance Auditor |
| Content update needed | Content Strategist → Frontend Builder |
| Bug found | Frontend Builder (with QA Browser Tester for verification) |
| Pre-release check | Orchestrator triggers all auditors |

## Quality Enforcement

### Quality Bar (from AGENTS.md)

| Dimension | Minimum | Tool |
|---|---|---|
| Build | Zero errors | `npm run build` |
| Types | Zero errors | `npx tsc --noEmit` |
| Lint | Zero errors | `npm run lint` |
| Performance | Score ≥ 90 | Lighthouse CI |
| Accessibility | Score ≥ 90 | Lighthouse CI |
| SEO | Score ≥ 95 | Lighthouse CI |
| Broken Links | Zero | SiteOne Crawler |
| Console Errors | Zero | Playwright MCP |

### Gate Points

| Workflow Stage | Gate Check |
|---|---|
| After coding | Build + lint + types |
| Before release | Full QA checklist + Lighthouse + SiteOne |
| After release | Browser smoke test + production verification |

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 5.4 |
| Styling | Tailwind CSS 3.4 |
| UI Components | shadcn/ui |
| Hosting | Vercel (static SPA) |
| Repository | GitHub |
| AI | GitHub Copilot |
