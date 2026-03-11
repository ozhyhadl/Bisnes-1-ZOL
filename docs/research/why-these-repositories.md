# Why These Repositories?

## Purpose
Document the rationale for choosing each of the 6 reference repositories and what value they bring to the AI Mini IT-Studio.

## Selection Criteria

Each repository was evaluated against these criteria:
1. **Relevance** — Does it solve a problem our studio has?
2. **Adaptability** — Can its concepts work in our Copilot + VS Code context?
3. **Quality** — Is it well-documented and maintained?
4. **Practicality** — Can we use it without major infrastructure changes?

---

## 1. GSD (Get Shit Done)
**Repository**: `coleam00/gsd`

### Why selected
- Provides a proven spec-driven development methodology for AI agents
- The discuss → plan → execute → verify loop maps perfectly to our studio workflow
- Its context engineering approach (using markdown files for agent context) aligns with how Copilot custom agents work
- Milestone-based execution prevents scope creep

### What we took
- The structured execution loop (adapted in `docs/workflows/gsd-inspired-execution-loop.md`)
- The concept of documentation-as-context (our `AGENTS.md` and `docs/` directory)
- Multi-agent orchestration patterns (our agent handoff model)

### What we didn't take
- Claude Code specific features (we use Copilot)
- Shell scripts and MCP server configs (different tooling)
- The specific file naming conventions (we use our own)

---

## 2. Marketing Skills
**Repository**: `just-every/marketing`

### Why selected
- Contains practical, actionable SEO and CRO knowledge
- Structured as skill files that translate well into agent instructions
- Covers metadata optimization, content strategy, and conversion optimization
- Saves us from having to research SEO best practices independently

### What we took
- SEO optimization patterns → our 9 `docs/seo/` policy documents
- Content optimization workflow → `docs/seo/content-seo-workflow.md`
- Structured data templates → `docs/seo/structured-data-policy.md`
- CRO knowledge → Content Strategist agent instructions

### What we didn't take
- Their agent framework (we use Copilot agents)
- Analytics-specific skills (out of scope for now)
- Their directory structure (we organize differently)

---

## 3. Playwright MCP
**Repository**: `nicobailon/playwright-mcp`

### Why selected
- Enables browser automation directly from Copilot via MCP
- Uses accessibility snapshots (not screenshots) which are more useful for AI agents
- Can validate real browser behavior, not just static code analysis
- Fills the gap between code quality and user experience quality

### What we use
- Full MCP server integration for browser testing
- Page navigation and content verification
- Console error detection
- Metadata validation in rendered pages
- Interactive element testing

### Why not regular Playwright tests
- MCP integration allows Copilot agents to use the browser interactively
- No need to write test scripts — agents can test ad-hoc
- Better for exploratory testing and validation
- Regular Playwright tests can be added later for regression coverage

---

## 4. Lighthouse CI
**Repository**: `nicobailon/lighthouse-ci`

### Why selected
- Industry standard for web performance measurement
- Provides score-based quality gates that are easy to enforce
- Covers performance, accessibility, SEO, and best practices in one tool
- Can run locally and in CI — consistent results both ways

### What we use
- Performance score thresholds (≥ 90)
- Accessibility score thresholds (≥ 90)
- SEO score thresholds (≥ 95)
- Core Web Vitals monitoring
- `.lighthouserc.js` configuration for assertion-based gates

### Why this over alternatives
- More comprehensive than single-metric tools
- Assertion config allows "fail the build" on regression
- Large community and excellent documentation
- Works with any web framework

---

## 5. SiteOne Crawler
**Repository**: `nicobailon/siteone-crawler`

### Why selected
- Crawls the entire site to find issues that page-level tools miss
- Detects broken links, orphan pages, redirect chains
- Provides SEO-focused analysis (metadata, heading structure)
- Catches cross-page issues that Lighthouse can't see

### What we use
- Broken link detection (internal and external)
- Orphan page detection
- Metadata completeness across all pages
- Redirect chain analysis
- robots.txt and sitemap validation

### Why this over alternatives
- Designed for technical SEO auditing specifically
- Can generate multiple report formats (HTML, JSON, text)
- Lightweight — no cloud service required
- Catches the issues that crawlers like Googlebot would find

---

## 6. Copilot Custom Agents
**Repository**: GitHub documentation / `github/copilot-customization`

### Why selected
- Native feature of our primary dev environment (VS Code + Copilot)
- Allows defining specialized agent roles via markdown files
- No external dependencies — just `.github/agents/*.md` files
- Full integration with Copilot chat and agent mode

### What we use
- 9 custom agent files in `.github/agents/`
- `AGENTS.md` for project-wide context
- Agent-to-agent handoff patterns
- Specialized instructions per role

### Why this architecture
- Zero overhead — no servers, no installs, no configuration
- Agents are version-controlled with the code
- Easy to modify, extend, or remove agents
- Works with the existing Copilot workflow

---

## Summary: Value Matrix

| Repository | Value Added | Integration Effort | Status |
|---|---|---|---|
| GSD | Methodology + workflow | Low (just docs) | ✅ Fully adapted |
| Marketing Skills | SEO/CRO knowledge | Low (docs + instructions) | ✅ Fully adapted |
| Playwright MCP | Browser testing | Medium (MCP config) | ✅ Ready to configure |
| Lighthouse CI | Performance gates | Medium (npm + config) | ✅ Ready to install |
| SiteOne Crawler | Site-wide SEO audit | Low (CLI download) | ✅ Ready to use |
| Copilot Agents | Agent orchestration | Low (markdown files) | ✅ Active |
