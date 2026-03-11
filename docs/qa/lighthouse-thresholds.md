# Lighthouse Performance Thresholds

## Purpose
Define minimum performance thresholds that every page must meet before release. These thresholds are enforced via Lighthouse CI.

## Score Thresholds

| Category | Minimum Score | Target Score | Blocking? |
|---|---|---|---|
| Performance | 90 | 95+ | Yes |
| Accessibility | 90 | 95+ | Yes |
| Best Practices | 90 | 95+ | Yes |
| SEO | 95 | 100 | Yes |

**Blocking** = release cannot proceed if score is below minimum.

## Core Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5–4.0s | > 4.0s |
| FID (First Input Delay) | < 100ms | 100–300ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1–0.25 | > 0.25 |
| FCP (First Contentful Paint) | < 1.8s | 1.8–3.0s | > 3.0s |
| TTFB (Time to First Byte) | < 800ms | 800–1800ms | > 1800ms |
| TBT (Total Blocking Time) | < 200ms | 200–600ms | > 600ms |
| SI (Speed Index) | < 3.4s | 3.4–5.8s | > 5.8s |

**Requirement**: All metrics must be in "Good" range for release.

## Lighthouse CI Configuration

```js
// .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:8080/',
        'http://localhost:8080/404',
      ],
      startServerCommand: 'npm run preview',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'speed-index': ['error', { maxNumericValue: 3400 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

## Per-Page Requirements

| Page | Performance | Accessibility | SEO | Notes |
|---|---|---|---|---|
| Homepage (`/`) | ≥ 90 | ≥ 90 | ≥ 95 | Primary landing page — highest priority |
| 404 Page | ≥ 90 | ≥ 90 | N/A | noindex — SEO score not critical |
| All new pages | ≥ 90 | ≥ 90 | ≥ 95 | Default requirement |

## Running Lighthouse Audits

### Local (Manual)
```bash
npx @lhci/cli@latest autorun
```

### Local (Specific URL)
```bash
npx lighthouse http://localhost:8080/ --output=json --output-path=./lighthouse-report.json
```

### CI (GitHub Actions)
See `docs/integrations/lighthouse-ci-integration.md` for full CI setup.

## Budget File (Optional)

```json
// budget.json
[
  {
    "path": "/*",
    "timings": [
      { "metric": "first-contentful-paint", "budget": 1800 },
      { "metric": "largest-contentful-paint", "budget": 2500 },
      { "metric": "cumulative-layout-shift", "budget": 0.1 },
      { "metric": "total-blocking-time", "budget": 200 }
    ],
    "resourceSizes": [
      { "resourceType": "script", "budget": 200 },
      { "resourceType": "stylesheet", "budget": 50 },
      { "resourceType": "image", "budget": 500 },
      { "resourceType": "total", "budget": 1000 }
    ]
  }
]
```

## Failure Protocol

When a Lighthouse score is below threshold:

1. **Identify** which audit(s) failed
2. **Analyze** the Lighthouse report for specific opportunities
3. **Fix** the highest-impact issues first
4. **Re-run** Lighthouse to verify fix
5. **Document** what was fixed and why

Common fixes:
- Low Performance → optimize images, defer non-critical JS, reduce bundle size
- Low Accessibility → add alt text, fix contrast, add ARIA labels
- Low SEO → add meta tags, fix heading structure, add structured data
- Low Best Practices → fix console errors, update deprecated APIs, fix HTTPS
