# Bugfix Flow

## Purpose
Define a structured process for identifying, fixing, and verifying bugs to prevent regressions and ensure quality.

## Flow Overview

> **Orchestration**: Use **Compact Visible Mode** for single bugs, **Full Visible Mode** for multi-agent bug triage. See `docs/operations/visible-orchestration-mode.md`.

```
Report → Reproduce → Diagnose → Fix → Verify → Deploy
```

## Step 1: Report

Every bug report should include:
- **What happened** — Description of the bug
- **Expected behavior** — What should have happened
- **Steps to reproduce** — How to trigger the bug
- **Environment** — Browser, viewport, OS
- **Severity** — Critical / High / Medium / Low
- **Screenshots/Logs** — Console errors, visual evidence

### Severity Definitions

| Severity | Definition | Response Time |
|---|---|---|
| Critical | Site is down, data loss, security issue | Fix immediately |
| High | Feature is broken, blocks user flow | Fix within current session |
| Medium | Feature works but with issues | Fix in next cycle |
| Low | Cosmetic, minor inconvenience | Fix when convenient |

## Step 2: Reproduce

Before fixing, reproduce the bug:

1. Follow the exact steps from the report
2. Confirm the bug exists in current code
3. Test on the specified browser/viewport
4. Check if the bug exists on production vs. localhost
5. Note any console errors

If cannot reproduce:
- Ask for more details
- Try different browsers/viewports
- Check if it was already fixed

## Step 3: Diagnose

Identify the root cause:

1. **Read the error** — Console errors, stack traces
2. **Locate the code** — Which component/file is affected?
3. **Understand the logic** — Why is the code behaving this way?
4. **Identify the change** — What recent change might have caused this? (git log)
5. **Scope the impact** — Are other pages/features affected?

### Useful Commands
```bash
# Check recent changes
git log --oneline -10

# Check changes in a specific file
git log --oneline -5 -- src/components/MyComponent.tsx

# Check for TypeScript errors
npx tsc --noEmit

# Check for lint errors
npm run lint
```

## Step 4: Fix

Apply the fix:

1. Make the minimum change needed to fix the bug
2. Don't refactor surrounding code (keep the diff small)
3. Ensure fix doesn't introduce new issues
4. Follow existing code patterns and style

### Fix Verification (Local)
```bash
# Build succeeds
npm run build

# Tests pass
npm run test

# Lint clean
npm run lint
```

## Step 5: Verify

Confirm the fix resolves the issue:

1. [ ] Bug no longer occurs when following original steps
2. [ ] No new console errors introduced
3. [ ] No visual regressions on affected page
4. [ ] Build still passes
5. [ ] Tests still pass
6. [ ] Pages related to the fix still work correctly
7. [ ] Mobile layout not affected (if applicable)

### Extended Verification (for High/Critical bugs)
- [ ] Run browser smoke test (see `docs/qa/browser-smoke-checklist.md`)
- [ ] Run Lighthouse audit on affected page
- [ ] Test on multiple browsers

## Step 6: Deploy

1. Commit with descriptive message:
   ```
   fix: [brief description of what was fixed]
   ```
2. Push to GitHub
3. Verify Vercel deployment succeeds
4. Verify fix on production URL

## Anti-Patterns
- ❌ Fixing without reproducing first
- ❌ Large refactors as part of a bugfix
- ❌ Skipping verification after fixing
- ❌ Not checking for regressions
- ❌ Fixing symptoms instead of root cause
- ❌ Deploying without building first
