# Studio Integration Decisions

## Purpose
Document the key architectural decisions made when designing the AI Mini IT-Studio, including alternatives considered and reasons for final choices.

---

## Decision 1: Agent Architecture

### Question
How should agents be defined and organized?

### Decision
Use GitHub Copilot custom agents via `.github/agents/*.md` files with a central `AGENTS.md` for project context.

### Alternatives Considered
- **Single monolithic prompt**: One large system prompt with all roles → rejected because too large, hard to maintain, doesn't allow role-specific invocation
- **External agent framework**: Use LangChain, CrewAI, or similar → rejected because adds complexity, dependencies, and doesn't integrate with Copilot natively
- **Repo-level instructions only**: Just `AGENTS.md` without separate agents → rejected because can't invoke specific roles

### Rationale
Native Copilot agents are zero-dependency, version-controlled, and directly usable in the development workflow. Each agent file is focused and maintainable.

---

## Decision 2: Documentation as Configuration

### Question
How should standards, policies, and procedures be managed?

### Decision
Use markdown documentation in `docs/` subdirectories, referenced by agent instructions.

### Alternatives Considered
- **Hardcoded in agent files**: Put all knowledge directly in agent `.md` files → rejected because files would be too large and knowledge would be duplicated
- **External knowledge base**: Use a wiki or Notion → rejected because not version-controlled, not accessible during development
- **YAML/JSON config files**: Machine-readable configs → rejected because less flexible for nuanced policies, harder for AI to interpret

### Rationale
Markdown docs are human-readable, AI-readable, version-controlled, and can be referenced from agent instructions via file paths. They serve as a shared knowledge layer.

---

## Decision 3: Three-Layer Integration Architecture

### Question
How should external tools and knowledge be integrated?

### Decision
Three layers: Native (Copilot), Adapted (concepts from GSD/Marketing), External (Playwright MCP, Lighthouse, SiteOne).

### Alternatives Considered
- **All native**: Only use Copilot features → rejected because missing quality validation capabilities
- **All external**: Heavy automation pipeline → rejected because too complex, too many dependencies for a small project
- **Single tool**: One external tool only → rejected because no single tool covers SEO + performance + browser testing

### Rationale
The three-layer model minimizes dependencies while maximizing coverage. Native layer has zero overhead, adapted layer uses proven knowledge without tool dependencies, external layer is only used where automated validation is needed.

---

## Decision 4: GSD Adaptation Scope

### Question
How much of GSD should we adopt?

### Decision
Adapt the core execution loop (discuss → plan → execute → verify) and context engineering concepts, but not the specific tooling.

### Alternatives Considered
- **Full GSD adoption**: Use GSD's shell scripts, MCP configs, spec system → rejected because designed for Claude Code, not Copilot
- **No GSD**: Develop our own methodology from scratch → rejected because GSD's concepts are well-tested and valuable
- **Partial tooling**: Use some GSD scripts → rejected because fragile cross-framework integration

### Rationale
GSD's intellectual framework is excellent regardless of the AI tool. The execution loop and context engineering concepts translate perfectly. The specific tooling does not.

---

## Decision 5: SEO Knowledge Source

### Question
Where should SEO best practices come from?

### Decision
Extract and adapt from the Marketing Skills repository, supplemented with standard SEO best practices.

### Alternatives Considered
- **Write from scratch**: Research and document all SEO policies ourselves → rejected because slower, more error-prone
- **Use Marketing Skills directly**: Install the skill files as-is → rejected because different format and framework
- **Use a commercial SEO tool**: Integrate Ahrefs, SEMrush, etc. → rejected because adds cost and API dependency

### Rationale
Marketing Skills provides a comprehensive, well-organized SEO knowledge base. Adapting it to our format ensures the knowledge is accessible to our agents without framework dependencies.

---

## Decision 6: Quality Gate Implementation

### Question
How should quality gates be enforced?

### Decision
Use Lighthouse CI for automated scoring with defined thresholds, SiteOne for crawl-based validation, and Playwright MCP for browser-level checks.

### Alternatives Considered
- **Manual review only**: Human checks everything → rejected because inconsistent, slow, doesn't scale
- **Lighthouse only**: One tool for everything → rejected because doesn't catch broken links, cross-page issues
- **Custom test suite**: Write comprehensive Playwright tests → rejected because high maintenance, slow to write

### Rationale
Three complementary tools cover different quality dimensions: performance (Lighthouse), SEO structure (SiteOne), and browser behavior (Playwright). Together they provide comprehensive quality validation with minimal custom code.

---

## Decision 7: Agent Collaboration Model

### Question
How should agents communicate and hand off work?

### Decision
Sequential handoff via the Studio Orchestrator, with standardized output formats and clear trigger criteria.

### Alternatives Considered
- **Free-form**: Agents communicate directly with each other → rejected because Copilot agents don't have inter-agent communication
- **Pipeline**: Fixed linear pipeline for every task → rejected because too rigid, not every task needs every agent
- **Event-driven**: Agents react to events → rejected because requires infrastructure we don't have

### Rationale
The Orchestrator model works within Copilot's capabilities. The human developer acts as the routing layer, invoking specific agents as directed by the Orchestrator's instructions. Standardized output formats ensure smooth handoffs.

---

## Summary

| Decision | Choice | Key Reason |
|---|---|---|
| Agent Architecture | Copilot `.github/agents/` | Zero dependency, native |
| Standards Management | Markdown docs in `docs/` | Version-controlled, AI-readable |
| Integration Layers | Native / Adapted / External | Minimize dependencies |
| GSD Adoption | Concepts only, not tooling | Cross-framework portability |
| SEO Knowledge | Adapted from Marketing Skills | Comprehensive, proven |
| Quality Gates | Lighthouse + SiteOne + Playwright | Complementary coverage |
| Agent Collaboration | Orchestrator-mediated handoff | Works within Copilot model |
