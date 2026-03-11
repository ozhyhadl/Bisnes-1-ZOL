# Bisnes-1-ZOL — AI Mini IT-Studio

An AI-driven mini IT-studio built inside VS Code + GitHub Copilot. Combines website development, SEO optimization, QA automation, performance auditing, and delivery workflow into a single orchestrated system.

## Architecture Layers

| Layer | Purpose | Source |
|-------|---------|--------|
| **Copilot Native** | Agent definitions, collaboration rules, repository instructions | `.github/agents/`, `AGENTS.md` |
| **GSD-Inspired Workflow** | Spec-driven execution: discuss → plan → execute → verify | Adapted from [GSD](https://github.com/gsd-build/get-shit-done) |
| **Marketing & SEO Skills** | SEO audit, CRO review, copywriting, content strategy | Adapted from [Marketing Skills](https://github.com/coreyhaines31/marketingskills) |
| **Browser Automation** | Page QA, form validation, metadata checks, smoke testing | [Playwright MCP](https://github.com/microsoft/playwright-mcp) |
| **CI Quality Gates** | Lighthouse assertions, performance/accessibility/SEO thresholds | [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) |
| **Technical SEO Crawler** | Broken links, internal linking audit, technical site inspection | [SiteOne Crawler](https://github.com/janreges/siteone-crawler) |

## What Is Native vs External

### Native (works inside Copilot/VS Code directly)
- `.github/agents/*.md` — agent role definitions read by Copilot
- `AGENTS.md` — orchestration model and collaboration rules
- `docs/` — all policies, checklists, workflows as operational docs
- GSD workflow concepts (adapted as doc-driven execution patterns)
- Marketing Skills SEO/CRO patterns (adapted as agent instructions)

### External (requires installation/runtime setup)
- **Playwright MCP** — install as MCP server: `npx @playwright/mcp@latest`
- **Lighthouse CI** — install CLI: `npm install -g @lhci/cli@0.15.x`
- **SiteOne Crawler** — download from [releases](https://github.com/janreges/siteone-crawler/releases)

## Quick Start

### Local Development
```sh
npm install
npm run dev
```

### Build & Preview
```sh
npm run build
npm run preview
```

### Run Tests
```sh
npm test
```

### Setup External Tools (Optional)
```sh
# Playwright MCP — browser automation via VS Code MCP
# Add to VS Code MCP settings:
# { "mcpServers": { "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] } } }

# Lighthouse CI — quality gates
npm install -g @lhci/cli@0.15.x
lhci autorun

# SiteOne Crawler — technical SEO audit
# Download from https://github.com/janreges/siteone-crawler/releases
./crawler --url=http://localhost:8080/ --output=text
```

## Tech Stack
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Vercel (deployment)

## Project Structure
```
.github/agents/     — Copilot agent definitions
docs/
  architecture/     — System architecture docs
  integrations/     — Tool integration guides
  workflows/        — Execution workflow runbooks
  seo/              — SEO policies and checklists
  qa/               — QA checklists and audit flows
  operations/       — Operational procedures
  research/         — Research and decision logs
templates/          — Reusable templates for reports, workflows, SEO
AGENTS.md           — Orchestration model and collaboration rules
src/                — Application source code
```

## How to Use This System in VS Code + Copilot

1. **Read `AGENTS.md`** to understand the orchestration model
2. **Check `.github/agents/`** for specialized agent roles you can invoke
3. **Follow `docs/workflows/`** for step-by-step execution guides
4. **Use `docs/seo/`** policies when creating or reviewing pages
5. **Run QA checklists from `docs/qa/`** before every release
6. **Use `templates/`** for standardized reports and reviews

## Extending the System
- Add new agents in `.github/agents/`
- Add new SEO policies in `docs/seo/`
- Add new workflow runbooks in `docs/workflows/`
- Add integration docs for new tools in `docs/integrations/`

## Deployment
Deployed on Vercel as a static Vite SPA. Configuration in `vercel.json`.
