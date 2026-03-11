# Regression Review Flow

## Purpose
Define how to detect, handle, and prevent regressions when making changes to the codebase.

## What Is a Regression?
A regression is when a previously working feature breaks due to new changes. Examples:
- Navigation link stops working after refactoring components
- SEO metadata disappears after page restructuring
- Layout breaks on mobile after CSS changes
- Performance drops after adding new dependencies

## Regression Detection

### Before Every Change
1. Run the full test suite: `npm run test`
2. Build the project: `npm run build`
3. Note current Lighthouse scores (baseline)

### After Every Change
1. Re-run tests: `npm run test`
2. Re-build: `npm run build`
3. Run browser smoke test (see `docs/qa/browser-smoke-checklist.md`)
4. Compare Lighthouse scores to baseline
5. Visually inspect affected pages on mobile and desktop

## Automated Regression Checks

### Build Regression
```bash
# Build must succeed — any failure is a regression
npm run build
```

### Type Regression
```bash
# TypeScript must compile — any new error is a regression
npx tsc --noEmit
```

### Lint Regression
```bash
# No new lint errors allowed
npm run lint
```

### Test Regression
```bash
# All existing tests must pass
npm run test
```

### Performance Regression
```bash
# Lighthouse scores must not drop below thresholds
npx @lhci/cli@latest autorun
```

## Regression Review Process

### When a regression is found:

1. **Stop** — Do not proceed with the release
2. **Identify** — What change caused the regression?
3. **Assess** — Is it critical (blocking) or minor?
4. **Fix or Revert**:
   - If fixable quickly → fix and re-test
   - If complex → revert the change and investigate separately
5. **Verify** — Run full QA checklist after fix
6. **Document** — Note what caused the regression and how it was fixed

### Severity Levels

| Severity | Description | Action |
|---|---|---|
| Critical | Site is broken, blank pages, navigation failure | Block release, fix immediately |
| High | Feature is broken, data is wrong | Block release, fix before deploy |
| Medium | Visual issue, minor functionality gap | Fix in next cycle, don't block |
| Low | Cosmetic, text issue | Track and fix when convenient |

## Prevention

### Code Review Checks
- Does this change affect shared components?
- Could this change break any existing pages?
- Are there tests covering the affected code?
- Was the change tested on mobile?

### Automated Prevention
- TypeScript strict mode catches type regressions
- ESLint catches code quality regressions
- Unit tests catch logic regressions
- Lighthouse CI catches performance regressions
- Playwright MCP catches browser behavior regressions

## Common Regression Patterns

| Pattern | Cause | Prevention |
|---|---|---|
| Missing metadata | Component restructuring | SEO audit after component changes |
| Broken layout | CSS changes | Visual regression testing |
| Dead links | Route changes | SiteOne crawl after route changes |
| Performance drop | New dependencies | Bundle size monitoring |
| Type errors | Interface changes | TypeScript strict mode |
