# Audit-to-Fix Flow

## Purpose
Define the process for taking audit findings (from Lighthouse, SiteOne, Playwright, or manual review) and converting them into actionable fixes.

## Flow Overview

```
Audit Report → Triage → Prioritize → Fix → Verify → Document
```

## Step 1: Audit Report

Audits can come from multiple sources:

| Source | What It Checks | Output |
|---|---|---|
| Lighthouse CI | Performance, Accessibility, SEO, Best Practices | Score report + specific audits |
| SiteOne Crawler | Broken links, metadata, redirects, crawl errors | HTML/JSON report |
| Playwright MCP | Browser behavior, console errors, visual issues | Screenshots + logs |
| Manual Review | Visual quality, content accuracy, UX | Notes/checklist |

## Step 2: Triage

For each finding, determine:

1. **Is it real?** — Not all warnings are actual problems
2. **Is it relevant?** — Does it affect our users or SEO?
3. **Is it actionable?** — Can we actually fix it?

Triage decision:
- **Fix** — Real problem, relevant, actionable → proceed
- **Accept** — Known limitation, not worth fixing → document why
- **Defer** — Real but low priority → add to backlog
- **Dismiss** — False positive or irrelevant → no action needed

## Step 3: Prioritize

Use the impact/effort matrix:

| | Low Effort | High Effort |
|---|---|---|
| **High Impact** | Do First | Plan & Schedule |
| **Low Impact** | Do When Convenient | Consider Skipping |

Priority order:
1. **Critical SEO issues** (broken indexing, missing metadata on key pages)
2. **Critical performance issues** (failed Core Web Vitals)
3. **Accessibility blockers** (missing alt text, broken keyboard nav)
4. **Broken functionality** (dead links, console errors)
5. **Warnings** (non-critical improvements)

## Step 4: Fix

For each fixable item:

1. Identify the affected file(s) and line(s)
2. Make the fix
3. Run local verification:
   ```bash
   npm run build   # Build still passes
   npm run test    # Tests still pass
   npm run lint    # No new lint errors
   ```

### Fix Templates by Category

**Performance Fix**:
- Identify the audit (e.g., "Properly size images")
- Apply the fix (e.g., convert to WebP, add dimensions)
- Re-run Lighthouse for the specific page

**SEO Fix**:
- Identify the issue (e.g., "Missing meta description")
- Apply the fix (e.g., add meta tag)
- Verify with SiteOne Crawler or manual check

**Accessibility Fix**:
- Identify the issue (e.g., "Image missing alt text")
- Apply the fix (e.g., add descriptive alt)
- Re-run Lighthouse accessibility audit

**Browser Fix**:
- Identify the issue (e.g., "Console error on page load")
- Apply the fix (e.g., fix the JavaScript error)
- Verify with Playwright MCP or manual browser check

## Step 5: Verify

After fixing, verify the fix resolved the issue:

- [ ] Re-run the original audit tool
- [ ] Score/metric has improved or issue has disappeared
- [ ] No new issues introduced (regression check)
- [ ] Build still passes
- [ ] Tests still pass

## Step 6: Document

Record what was found and fixed:

```markdown
## Audit Fix Record

**Date**: YYYY-MM-DD
**Source**: [Lighthouse / SiteOne / Playwright / Manual]
**Finding**: [Description of the issue]
**Severity**: [Critical / High / Medium / Low]
**Fix**: [What was changed]
**Files Changed**: [List of files]
**Verification**: [How fix was verified]
**Status**: [Fixed / Deferred / Accepted]
```

## Audit Cadence

| Audit Type | Frequency |
|---|---|
| Lighthouse CI | Every pre-release |
| SiteOne Crawl | Weekly or before release |
| Browser Smoke Test | Every pre-release |
| Full QA Checklist | Before major releases |
| Technical SEO Audit | Monthly |
