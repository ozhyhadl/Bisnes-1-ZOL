# Pre-Release QA Checklist

## Purpose
Comprehensive quality assurance checklist to run before every release. Goes deeper than smoke testing to cover all quality dimensions.

## Code Quality

- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] No ESLint warnings/errors (`npm run lint`)
- [ ] Unit tests pass (`npm run test`)
- [ ] No `console.log` or debug statements in production code
- [ ] No commented-out code blocks left behind
- [ ] No TODO/FIXME items blocking release

## Build & Deploy

- [ ] Production build succeeds (`npm run build`)
- [ ] Build output size is reasonable (no unexplained increases)
- [ ] No build warnings that indicate potential issues
- [ ] Environment variables are configured for production
- [ ] Preview deployment works (Vercel preview)

## Functionality (Full Coverage)

### All Pages
- [ ] Every page loads without errors
- [ ] Every page has correct `<title>` tag
- [ ] Every page has correct meta description
- [ ] Every page has correct canonical URL
- [ ] Every page renders correctly on mobile
- [ ] Every page renders correctly on desktop

### Navigation
- [ ] All nav links point to correct pages
- [ ] Active page indicator works in navigation
- [ ] Footer links work
- [ ] External links open in new tab
- [ ] No dead/broken links

### Components
- [ ] Hero section renders with correct content
- [ ] CTA buttons work and have correct links
- [ ] FAQ accordion expands/collapses correctly
- [ ] Pricing section displays correctly
- [ ] Scroll reveal animations trigger properly
- [ ] Terminal window component renders correctly

## Performance

- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Lighthouse Best Practices ≥ 90
- [ ] Lighthouse SEO ≥ 95
- [ ] No render-blocking resources
- [ ] Images are optimized
- [ ] Bundle size within budget

## SEO (verify via SEO checklist)

- [ ] All metadata policies followed (see `docs/seo/metadata-policy.md`)
- [ ] Structured data valid (see `docs/seo/structured-data-policy.md`)
- [ ] Canonical URLs correct (see `docs/seo/canonical-policy.md`)
- [ ] Internal linking structure intact (see `docs/seo/internal-linking-policy.md`)
- [ ] Robots.txt correct
- [ ] Sitemap valid

## Security

- [ ] No secrets or API keys in client-side code
- [ ] No sensitive data exposed in HTML source
- [ ] HTTPS is enforced
- [ ] No mixed content warnings
- [ ] External scripts are from trusted sources
- [ ] CSP headers are appropriate (if configured)

## Accessibility

- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Keyboard navigation works for interactive elements
- [ ] Focus indicators are visible
- [ ] ARIA labels on icon-only buttons
- [ ] Screen reader can navigate the page structure

## Release Decision

| Category | Status | Notes |
|---|---|---|
| Code Quality | ☐ Pass / ☐ Fail | |
| Build & Deploy | ☐ Pass / ☐ Fail | |
| Functionality | ☐ Pass / ☐ Fail | |
| Performance | ☐ Pass / ☐ Fail | |
| SEO | ☐ Pass / ☐ Fail | |
| Security | ☐ Pass / ☐ Fail | |
| Accessibility | ☐ Pass / ☐ Fail | |

**Release approved**: Only when ALL categories pass.
