# Marketing Skills Adaptation

## Source
- **Name**: Marketing Skills for AI Agents
- **URL**: https://github.com/coreyhaines31/marketingskills
- **Purpose**: Markdown skill files for SEO, CRO, copywriting, content strategy, and growth engineering

## What We Take From Marketing Skills

### SEO Thinking Patterns
From `seo-audit`, `ai-seo`, `site-architecture`, `schema-markup`, `programmatic-seo`:
- Technical SEO audit methodology
- AI search optimization (AEO, GEO, LLMO) awareness
- Site architecture and URL structure planning
- Structured data implementation patterns
- Scaled page generation strategies

### CRO-Oriented Review
From `page-cro`, `signup-flow-cro`, `form-cro`, `popup-cro`:
- Landing page conversion optimization frameworks
- Form optimization checklists
- CTA design and placement principles
- Social proof and trust signal patterns

### Copywriting Support
From `copywriting`, `copy-editing`, `cold-email`, `email-sequence`:
- Marketing page copy frameworks (AIDA, PAS)
- Copy review and editing standards
- Heading hierarchy and scanability rules
- CTA copywriting principles

### Content Strategy
From `content-strategy`, `competitor-alternatives`:
- Content planning methodology
- Topic cluster and pillar page strategy
- Competitor comparison page patterns

### Growth Engineering Mindset
From `referral-program`, `free-tool-strategy`, `launch-strategy`, `pricing-strategy`:
- Growth-focused feature prioritization
- Launch planning frameworks

## What Is Native vs Non-Native
| Marketing Skills Concept | Our Integration | Type |
|--------------------------|----------------|------|
| SEO audit methodology | `docs/seo/` policies + SEO Lead agent | ✅ Native adaptation |
| CRO frameworks | Content Strategist agent instructions | ✅ Native adaptation |
| Copywriting patterns | Content Strategist agent instructions | ✅ Native adaptation |
| Schema markup knowledge | SEO Lead agent + structured-data-policy.md | ✅ Native adaptation |
| AI SEO awareness | SEO Lead agent instructions | ✅ Native adaptation |
| Content strategy | Content Strategist agent + workflow docs | ✅ Native adaptation |
| `.agents/skills/` directory | Not used as-is — adapted into agents | ⚡ Concept adapted |
| MCP tools integration | Not used — different architecture | ❌ Not applicable |
| Claude plugin system | Not used — Copilot has its own system | ❌ Not applicable |

## How It Integrates Into Copilot Workflow
- **SEO Lead agent** encodes SEO audit and optimization knowledge
- **Content Strategist agent** applies CRO and copywriting frameworks
- **SEO policy docs** (`docs/seo/`) formalize marketing skills as actionable policies
- **Templates** provide review report formats based on marketing skills checklists

## Adapter Layer
No runtime adapter needed. Marketing Skills content is a **knowledge source** — we extract SEO/CRO/copywriting expertise and encode it into agent definitions and policy documents.

## Risks / Limitations
- Marketing Skills is designed as standalone skill files — we merge and adapt relevant knowledge
- Some skills (paid-ads, analytics-tracking) are out of scope for this project
- No dynamic skill loading — knowledge is baked into agent definitions

## Recommended Usage Mode
**Knowledge adaptation** — extract SEO, CRO, and content strategy expertise into native agent instructions and policy documents.
