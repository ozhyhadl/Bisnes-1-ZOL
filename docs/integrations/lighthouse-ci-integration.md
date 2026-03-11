# Lighthouse CI Integration

## Source
- **Name**: Lighthouse CI
- **URL**: https://github.com/GoogleChrome/lighthouse-ci
- **Purpose**: Automate Lighthouse audits for every commit with assertions and quality gates

## What We Take From Lighthouse CI

### CI Quality Gates
- Score thresholds for Performance, Accessibility, SEO, Best Practices
- Automatic pass/fail decisions on PRs and commits
- Prevent regressions in any Lighthouse category

### Assertion System
Configure minimum score requirements:
```js
// .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8080/'],
      startServerCommand: 'npm run preview',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### Performance Tracking
- Compare scores between commits
- Track Core Web Vitals trends (LCP, FID/INP, CLS)
- Set budgets on resource sizes

### GitHub Actions Integration
```yaml
name: Lighthouse CI
on: [push]
jobs:
  lighthouseci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm install && npm install -g @lhci/cli@0.15.x
      - run: npm run build
      - run: lhci autorun
```

## Integration Type
**External CLI + CI** — requires npm installation and CI pipeline configuration.

## How It Integrates Into Copilot Workflow
1. Performance Auditor agent defines thresholds in `docs/qa/lighthouse-thresholds.md`
2. `.lighthouserc.js` config file encodes those thresholds as assertions
3. Local runs: `lhci autorun` against dev server or built files
4. CI runs: GitHub Actions workflow runs Lighthouse on every push
5. Results feed into release go/no-go decision

## Adapter Layer
- `docs/qa/lighthouse-thresholds.md` → human-readable thresholds document
- `.lighthouserc.js` → machine-readable configuration
- Performance Auditor agent → interprets results and makes recommendations

## Prerequisites
```sh
npm install -g @lhci/cli@0.15.x
```

## Local Usage
```sh
# Build the project first
npm run build

# Run Lighthouse CI
lhci autorun

# Or run individual steps
lhci collect --url=http://localhost:8080/
lhci assert
lhci upload --target=temporary-public-storage
```

## Risks / Limitations
- Lighthouse scores vary between runs (mitigated by `numberOfRuns: 3`)
- CI environment may produce different scores than local
- Performance scores depend on machine resources
- Free upload target (temporary-public-storage) has limited retention

## Recommended Usage Mode
**External CI integration** — install `@lhci/cli`, configure `.lighthouserc.js`, run locally and in CI. Use Performance Auditor agent to interpret results.
