# Audit-to-Fix Workflow

## Purpose
End-to-end workflow for running quality audits and converting findings into completed fixes. This workflow coordinates multiple agents and tools.

## Participants
- **Studio Orchestrator** — initiates audits, tracks progress
- **Performance Auditor** — runs Lighthouse CI
- **Technical SEO Auditor** — runs SiteOne Crawler
- **QA Browser Tester** — runs Playwright MCP tests
- **SEO Lead** — reviews SEO findings
- **Frontend Builder** — implements fixes

## Workflow

### Phase 1: Run Audits

Orchestrator triggers audits in parallel:

| Audit | Agent | Tool | Focus |
|---|---|---|---|
| Performance | Performance Auditor | Lighthouse CI | Scores, Core Web Vitals |
| SEO Crawl | Technical SEO Auditor | SiteOne Crawler | Broken links, metadata gaps |
| Browser | QA Browser Tester | Playwright MCP | Console errors, rendering |

### Phase 2: Collect Results

Each auditor reports findings in standard format:

```markdown
## Finding Report

**Source**: [Lighthouse / SiteOne / Playwright]
**Date**: YYYY-MM-DD
**Pages Audited**: [list]

### Critical Findings
1. [Finding description] — [Affected page] — [Impact]

### High Findings
1. [Finding description] — [Affected page] — [Impact]

### Medium Findings
1. [Finding description] — [Affected page] — [Impact]

### Low Findings
1. [Finding description] — [Affected page] — [Impact]
```

### Phase 3: Triage

Orchestrator + relevant specialist reviews each finding:

| Decision | Criteria | Action |
|---|---|---|
| Fix Now | Critical or High severity | Assign to Frontend Builder |
| Fix Next | Medium severity | Add to next sprint/cycle |
| Accept | Known limitation | Document acceptance reason |
| Dismiss | False positive | No action |

### Phase 4: Fix

Frontend Builder works through fixes by priority:

1. Pick highest-priority fix
2. Read the finding details
3. Locate the affected code
4. Apply the minimum fix
5. Run local verification:
   ```bash
   npm run build && npm run test && npm run lint
   ```
6. Mark as fixed
7. Move to next fix

### Phase 5: Re-Audit

After all fixes are applied:

1. Re-run the audit(s) that found issues
2. Verify all critical/high findings are resolved
3. Check for regressions (no new issues introduced)
4. Compare scores before/after

### Phase 6: Report

Orchestrator creates a summary:

```markdown
## Audit Cycle Summary

**Date**: YYYY-MM-DD
**Trigger**: [Pre-release / Scheduled / Ad-hoc]

### Before
| Metric | Score |
|---|---|
| Lighthouse Performance | XX |
| Lighthouse SEO | XX |
| Broken Links | XX |
| Console Errors | XX |

### After
| Metric | Score |
|---|---|
| Lighthouse Performance | XX |
| Lighthouse SEO | XX |
| Broken Links | XX |
| Console Errors | XX |

### Fixes Applied
1. [Fix description] — [Impact]

### Accepted/Deferred
1. [Finding] — [Reason for deferral]
```

## Audit Schedule

| Audit Type | Trigger | Frequency |
|---|---|---|
| Full Audit | Pre-release | Every release |
| Lighthouse Only | Performance check | Weekly |
| SiteOne Crawl | Content changes | After content batch |
| Browser Test | Any code change | Every PR |

## Integration with Other Workflows

- **New Page Launch** → triggers post-launch audit
- **Content Update** → triggers SEO re-audit
- **Bugfix** → triggers regression verification
- **Milestone Delivery** → includes full audit cycle
