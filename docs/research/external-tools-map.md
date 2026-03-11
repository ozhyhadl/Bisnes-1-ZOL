# External Tools Map

## Purpose
Complete mapping of all external tools and repositories referenced in this project, their role in the studio, and how they integrate.

## Tool Overview

| # | Tool | Type | Role in Studio | Integration Method |
|---|---|---|---|---|
| 1 | GitHub Copilot | Native | Code generation, agent orchestration | Built-in to VS Code |
| 2 | GSD | Adapted | Execution methodology | Concepts in docs/workflows |
| 3 | Marketing Skills | Adapted | SEO/CRO knowledge base | Adapted to agent instructions |
| 4 | Playwright MCP | External | Browser automation & testing | MCP server in VS Code |
| 5 | Lighthouse CI | External | Performance quality gates | npm package, CLI |
| 6 | SiteOne Crawler | External | Technical SEO auditing | External CLI tool |

## Detailed Tool Profiles

### 1. GitHub Copilot (Native)
- **Source**: Built-in VS Code feature
- **Repository**: N/A (proprietary)
- **What we use**: Code completion, chat, agent mode, custom agents via `.github/agents/`
- **Configuration**: `.github/agents/*.md` files, `AGENTS.md`
- **Dependencies**: None (native to VS Code)

### 2. GSD (Get Shit Done)
- **Source**: `https://github.com/coleam00/gsd`
- **What it is**: A spec-driven development system for Claude Code with AI-native workflows
- **What we adapted**:
  - discuss → plan → execute → verify loop
  - Context engineering via documentation files
  - Multi-agent orchestration patterns
  - Milestone-based execution
- **Integration**: Concepts adapted into `docs/workflows/gsd-inspired-execution-loop.md`
- **We did NOT use**: Claude Code specific features, MCP server configs, shell scripts

### 3. Marketing Skills
- **Source**: `https://github.com/just-every/marketing`
- **What it is**: Collection of AI agent skills for marketing tasks (SEO, CRO, copywriting, analytics)
- **What we adapted**:
  - SEO optimization knowledge → `docs/seo/` policies
  - CRO patterns → Content Strategist agent instructions
  - Structured data templates → `docs/seo/structured-data-policy.md`
  - Content optimization workflow → `docs/seo/content-seo-workflow.md`
- **Integration**: Knowledge extracted into our agent instructions and policy docs
- **We did NOT use**: Their skill file format directly, their agent framework

### 4. Playwright MCP
- **Source**: `https://github.com/nicobailon/playwright-mcp`
- **What it is**: MCP (Model Context Protocol) server that enables browser automation through Playwright, using accessibility snapshots
- **What we use**:
  - Navigate to pages and verify rendering
  - Check for console errors
  - Validate metadata in the browser
  - Take screenshots for visual verification
  - Test interactive elements
- **Integration**: MCP server configured in VS Code settings
- **Configuration**: See `docs/integrations/playwright-mcp-integration.md`
- **Dependencies**: Node.js, Playwright (auto-installed)

### 5. Lighthouse CI
- **Source**: `https://github.com/nicobailon/lighthouse-ci`
- **What it is**: CLI for running Lighthouse audits in CI/CD with assertion-based quality gates
- **What we use**:
  - Performance score enforcement (≥ 90)
  - Accessibility score enforcement (≥ 90)
  - SEO score enforcement (≥ 95)
  - Core Web Vitals monitoring
- **Integration**: npm install + `.lighthouserc.js` config file
- **Configuration**: See `docs/integrations/lighthouse-ci-integration.md`
- **Dependencies**: `@lhci/cli` npm package

### 6. SiteOne Crawler
- **Source**: `https://github.com/nicobailon/siteone-crawler`
- **What it is**: PHP-based website crawler that analyzes SEO, performance, broken links, security headers
- **What we use**:
  - Detect broken links (internal and external)
  - Find orphan pages
  - Validate metadata across all pages
  - Check redirect chains
  - Verify robots.txt and sitemap
- **Integration**: External CLI tool (download and run)
- **Configuration**: See `docs/integrations/siteone-crawler-integration.md`
- **Dependencies**: PHP 7.4+ or standalone binary

## Integration Architecture

```
┌─────────────────────────────────────────────┐
│              VS Code + Copilot              │
│                (Native Layer)                │
│                                             │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │ .github/    │  │  AGENTS.md           │  │
│  │ agents/     │  │  docs/               │  │
│  │  (9 agents) │  │  (policies, flows)   │  │
│  └─────────────┘  └──────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │    Playwright MCP (MCP Server)     │    │
│  │    Browser automation via MCP      │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │Lighthouse│ │ SiteOne  │ │  GSD &   │
  │   CI     │ │ Crawler  │ │Marketing │
  │(npm CLI) │ │(ext CLI) │ │(adapted) │
  └──────────┘ └──────────┘ └──────────┘
   External     External      Knowledge
    Tool         Tool          Sources
```

## Status & Availability

| Tool | Status | Available Now? |
|---|---|---|
| GitHub Copilot | Active | Yes — built into VS Code |
| GSD Concepts | Adapted | Yes — in docs/workflows |
| Marketing Skills | Adapted | Yes — in docs/seo + agent instructions |
| Playwright MCP | Ready to configure | Needs MCP server config in VS Code |
| Lighthouse CI | Ready to install | `npm install -g @lhci/cli` |
| SiteOne Crawler | Ready to download | Download from GitHub releases |
