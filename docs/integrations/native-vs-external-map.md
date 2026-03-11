# Native vs External Integration Map

## Overview
This document maps every capability in the AI mini IT-studio to its integration type: native (works inside Copilot directly), external (requires installation), or adapted (concept translated into native format).

## Integration Map

### Native Components (No Installation Required)
| Component | Location | Purpose |
|-----------|----------|---------|
| Agent definitions | `.github/agents/*.md` | Define agent roles readable by Copilot |
| Orchestration model | `AGENTS.md` | Collaboration rules and quality standards |
| SEO policies | `docs/seo/*.md` | Actionable SEO rules and checklists |
| QA checklists | `docs/qa/*.md` | Testing verification lists |
| Workflow runbooks | `docs/workflows/*.md` | Step-by-step execution guides |
| Architecture docs | `docs/architecture/*.md` | System design documentation |
| Integration docs | `docs/integrations/*.md` | Tool configuration guides |
| Templates | `templates/*.md` | Reusable document structures |

### Adapted Components (Concepts Translated to Native Format)
| Source | What We Adapted | Integration Format |
|--------|----------------|-------------------|
| GSD workflow | discuss→plan→execute→verify loop | Workflow runbooks |
| GSD anti-context-rot | Atomic task sizing, clean handoffs | Agent collaboration rules |
| GSD milestone model | Phased delivery with verification | Orchestrator workflow |
| Marketing Skills SEO | SEO audit methodology | SEO policies + SEO Lead agent |
| Marketing Skills CRO | Conversion optimization frameworks | Content Strategist agent |
| Marketing Skills copywriting | Copy review standards | Content Strategist agent |
| Marketing Skills content strategy | Topic planning methodology | Content Strategist agent |

### External Components (Require Installation)
| Tool | Install Command | Used By Agent | Purpose |
|------|----------------|---------------|---------|
| Playwright MCP | `npx @playwright/mcp@latest` (MCP config) | QA Browser Tester | Browser automation and page validation |
| Lighthouse CI | `npm install -g @lhci/cli@0.15.x` | Performance Auditor | Quality gate assertions |
| SiteOne Crawler | Download from [releases](https://github.com/janreges/siteone-crawler/releases) | Technical SEO Auditor | Site crawling and technical SEO |

## Dependency Flow
```
Native Layer (always available)
├── Agent definitions → guide Copilot behavior
├── Policy docs → define standards and requirements
├── Workflow runbooks → prescribe execution steps
└── Templates → standardize outputs

Adapted Layer (knowledge embedded in native)
├── GSD concepts → encoded in workflow docs
└── Marketing Skills → encoded in agent instructions + SEO policies

External Layer (requires setup)
├── Playwright MCP → browser automation runtime
├── Lighthouse CI → quality gate enforcement runtime
└── SiteOne Crawler → crawl audit runtime
```

## What Works Without External Tools
Even without installing any external tools, the system provides:
- Complete agent role definitions for Copilot
- SEO policies and checklists (manually verifiable)
- QA checklists (manually executable)
- Workflow runbooks (followable step-by-step)
- Architecture documentation

External tools **automate** what can be done manually — they don't gate the workflow.
