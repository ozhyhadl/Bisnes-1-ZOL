# AGENTS.md — AI Mini IT-Studio Orchestration Model

## Mission

This repository operates as an **AI-driven mini IT-studio** — a single orchestrated system for website development, SEO optimization, QA, browser automation, performance auditing, and delivery workflow. All agents work under a unified discipline inspired by GSD (Get Shit Done) methodology.

## Studio Orchestration Model

```
┌─────────────────────────────────────────────────────────────┐
│                   STUDIO ORCHESTRATOR                        │
│        (coordinates all agents, owns delivery flow)         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Architect    │  │  Frontend    │  │  SEO Lead    │      │
│  │              │  │  Builder     │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐      │
│  │  Content     │  │  QA Browser  │  │  Technical   │      │
│  │  Strategist  │  │  Tester      │  │  SEO Auditor │      │
│  └──────────────┘  └──────┬───────┘  └──────────────┘      │
│                           │                                 │
│                    ┌──────┴───────┐  ┌──────────────┐      │
│                    │  Performance │  │ Integrations │      │
│                    │  Auditor     │  │ Coordinator  │      │
│                    └──────────────┘  └──────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Agent Collaboration Rules

### Communication Protocol
1. **No silent assumptions** — every agent must document decisions and reasoning
2. **Handoff via artifacts** — agents pass work through documented outputs (reports, checklists, code)
3. **Escalation to orchestrator** — unresolved conflicts or cross-domain decisions escalate to studio-orchestrator
4. **Sequential validation** — SEO review follows frontend build; QA follows SEO; performance audit follows QA

### Handoff Logic
| From | To | Trigger | Artifact |
|------|-----|---------|----------|
| Architect | Frontend Builder | Architecture approved | Architecture decision doc |
| Frontend Builder | SEO Lead | Feature/page implemented | Page URL + component list |
| SEO Lead | Technical SEO Auditor | SEO review complete | SEO review report |
| SEO Lead | Content Strategist | Content gaps identified | Content brief |
| Frontend Builder | QA Browser Tester | Build ready for testing | Build URL + test scope |
| QA Browser Tester | Performance Auditor | Functional QA passed | QA report |
| Performance Auditor | Studio Orchestrator | Audit complete | Lighthouse report |
| Any Agent | Integrations Coordinator | External tool needed | Integration request |

### Escalation Logic
- **Technical conflict** → Architect makes final call
- **SEO vs UX conflict** → SEO Lead + Architect discuss, Orchestrator decides
- **Quality gate failure** → block release, fix first
- **Scope creep** → Orchestrator reviews against milestone goals

## Code Standards
- TypeScript strict mode
- React functional components only
- Tailwind CSS for styling (no inline styles, no CSS modules)
- shadcn/ui as component library
- ESLint + Prettier enforced
- Atomic commits with conventional commit messages

## SEO Standards
- Every page must have unique `<title>`, `<meta description>`, canonical URL
- Structured data (JSON-LD) on all applicable pages
- All images must have `alt` attributes
- No orphan pages — every page linked from at least one other page
- Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Mobile-first responsive design

## QA Standards
- Browser smoke test before every release
- Lighthouse scores: Performance ≥ 80, Accessibility ≥ 90, SEO ≥ 90, Best Practices ≥ 90
- No broken links (verified by crawler)
- All forms validated for functionality
- Meta tags verified via browser automation

## Documentation Standards
- Every architectural decision documented
- Every workflow has a runbook
- Every external tool has integration docs
- README kept current with system state

## Quality Bar
A feature/page is **done** when:
1. Code passes lint + type check + build
2. SEO checklist completed and verified
3. Browser smoke test passed
4. Lighthouse thresholds met
5. No broken internal links
6. Content reviewed by content strategist
7. Committed with proper message and pushed

## Done Criteria for Milestones
A milestone is **complete** when:
1. All planned pages/features delivered
2. Full site crawl shows zero critical issues
3. Lighthouse CI passes on all pages
4. SEO audit shows no regressions
5. Documentation updated
6. Deployed to production
