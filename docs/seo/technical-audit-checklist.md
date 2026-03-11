# Technical SEO Audit Checklist

## Purpose
A comprehensive checklist for auditing the technical SEO health of the site. Run this audit before every major launch and monthly for ongoing monitoring.

## Crawlability & Indexing

### robots.txt
- [ ] `robots.txt` exists at `/robots.txt`
- [ ] Does not accidentally block important pages
- [ ] Allows all major search engine bots
- [ ] Points to sitemap location
- [ ] No wildcard blocking of CSS/JS files

### Sitemap
- [ ] `sitemap.xml` exists and is valid XML
- [ ] Contains all indexable pages
- [ ] Does not contain noindexed pages
- [ ] Does not contain redirected pages
- [ ] Does not contain 404 pages
- [ ] `<lastmod>` dates are accurate
- [ ] Submitted to Google Search Console

### Indexing Directives
- [ ] All public pages have `index, follow`
- [ ] Utility pages (404, admin) have `noindex`
- [ ] No accidental `noindex` on important pages
- [ ] `X-Robots-Tag` headers are not conflicting with meta tags

## Page-Level SEO

### Title Tags
- [ ] Every page has a unique `<title>`
- [ ] Titles are 30–60 characters
- [ ] Target keyword is near the beginning
- [ ] Brand name is included (usually at end)

### Meta Descriptions
- [ ] Every indexable page has a meta description
- [ ] Descriptions are 120–160 characters
- [ ] Descriptions include target keyword
- [ ] Descriptions are unique per page

### Headings
- [ ] Every page has exactly one `<h1>`
- [ ] `<h1>` contains or relates to the target keyword
- [ ] Heading hierarchy is logical (no skipping levels)
- [ ] No empty heading tags

### Canonical URLs
- [ ] Every page has a `<link rel="canonical">`
- [ ] Canonical points to the correct URL
- [ ] No self-referencing canonical on redirected pages
- [ ] Canonical uses absolute URLs with HTTPS

## Performance

### Core Web Vitals
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] FCP (First Contentful Paint) < 1.8s
- [ ] TTFB (Time to First Byte) < 800ms

### Assets
- [ ] Images are optimized (WebP preferred)
- [ ] Images have width and height attributes (CLS prevention)
- [ ] Images below fold are lazy-loaded
- [ ] CSS/JS is minified
- [ ] Unused CSS/JS is removed or code-split
- [ ] Fonts are preloaded or use `font-display: swap`

## Mobile & Accessibility

### Mobile
- [ ] Viewport meta tag is present
- [ ] Content is readable without horizontal scrolling
- [ ] Touch targets are at least 44x44px
- [ ] No content hidden on mobile that's shown on desktop (impacts indexing)

### Accessibility (SEO-relevant)
- [ ] All images have alt text
- [ ] Links are descriptive (not "click here")
- [ ] Form labels are present
- [ ] Color contrast meets minimum ratios

## Links

### Internal Links
- [ ] No broken internal links (404)
- [ ] No orphan pages
- [ ] No redirect chains (A → B → C)
- [ ] Important pages have more inbound internal links

### External Links
- [ ] No broken external links
- [ ] External links use `rel="noopener noreferrer"` where appropriate
- [ ] Sponsored/affiliate links use `rel="sponsored"`

## Security & Protocol

- [ ] Site uses HTTPS everywhere
- [ ] HTTP → HTTPS redirect is working
- [ ] No mixed content warnings
- [ ] HSTS header is present

## Structured Data

- [ ] JSON-LD is valid (Google Rich Results Test)
- [ ] Required properties are present for each schema type
- [ ] No errors in Google Search Console structured data report

## Tools for This Audit

| Check | Tool |
|---|---|
| Crawl & broken links | SiteOne Crawler |
| Performance scores | Lighthouse CI |
| Browser behavior | Playwright MCP |
| Schema validation | Google Rich Results Test |
| Indexing status | Google Search Console |
| Mobile test | Chrome DevTools / Lighthouse |
