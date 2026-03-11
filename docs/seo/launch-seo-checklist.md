# Launch SEO Checklist

## Purpose
A pre-launch and post-launch SEO checklist to ensure no SEO opportunities are missed when deploying new pages or the entire site.

## Pre-Launch Checklist

### Content & Metadata
- [ ] Every page has a unique, keyword-optimized `<title>` (30–60 chars)
- [ ] Every page has a unique `<meta name="description">` (120–160 chars)
- [ ] Every page has exactly one `<h1>` tag
- [ ] Content matches the intended search intent
- [ ] No placeholder text (Lorem Ipsum) remains
- [ ] No "Coming Soon" or empty pages are indexed

### Technical SEO
- [ ] `robots.txt` is configured correctly (not blocking important content)
- [ ] `sitemap.xml` is generated with all public pages
- [ ] Every page has a correct `<link rel="canonical">` tag
- [ ] Indexing directives are correct (index/noindex)
- [ ] No duplicate pages without canonical tags
- [ ] 404 page exists and returns 404 status code
- [ ] URL structure is clean (lowercase, hyphens, no trailing slashes inconsistency)

### Open Graph & Social
- [ ] `og:title` set on all pages
- [ ] `og:description` set on all pages
- [ ] `og:image` set with a quality image (1200×630px)
- [ ] `og:url` matches canonical URL
- [ ] `og:type` is set (website/article)
- [ ] `twitter:card` is set (summary_large_image)
- [ ] Social share preview tested (Facebook Debugger, Twitter Card Validator)

### Structured Data
- [ ] Organization schema on homepage
- [ ] WebSite schema with SearchAction (if applicable)
- [ ] Relevant page-level schemas (Product, FAQ, Article)
- [ ] JSON-LD validated with Google Rich Results Test
- [ ] No errors or warnings

### Performance
- [ ] Lighthouse Performance score ≥ 90
- [ ] Lighthouse SEO score ≥ 95
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] LCP < 2.5s on mobile
- [ ] CLS < 0.1
- [ ] All images are optimized (WebP, lazy-loaded below fold)
- [ ] No render-blocking resources

### Mobile
- [ ] Viewport meta tag present
- [ ] All content is visible and usable on mobile
- [ ] Touch targets are large enough (44x44px)
- [ ] No horizontal scrolling required

### Links
- [ ] No broken internal links (404)
- [ ] No broken external links
- [ ] Footer links are working (privacy, terms)
- [ ] Navigation links work on all pages
- [ ] Internal linking is logical and supports key pages

### Security
- [ ] HTTPS is working
- [ ] HTTP redirects to HTTPS
- [ ] No mixed content

## Post-Launch Checklist (Day 1)

### Indexing
- [ ] Submit sitemap to Google Search Console
- [ ] Request indexing for key pages via Google Search Console
- [ ] Verify `robots.txt` is accessible at production URL
- [ ] Verify sitemap is accessible at production URL
- [ ] Check that no pages are accidentally noindexed

### Monitoring
- [ ] Google Search Console is configured and verified
- [ ] Analytics tracking is working (page views registering)
- [ ] No 5xx errors in server logs
- [ ] No crawl errors in Search Console

### Verification
- [ ] Google Rich Results Test passes for structured data
- [ ] Facebook Debugger shows correct OG tags
- [ ] Mobile-Friendly Test passes
- [ ] All pages load correctly on Chrome, Firefox, Safari

## Post-Launch Review (Week 1)

- [ ] Key pages are appearing in Google index
- [ ] No unexpected crawl errors
- [ ] Core Web Vitals are within targets
- [ ] No security issues flagged
- [ ] Analytics data looks complete and accurate

## Post-Launch Review (Month 1)

- [ ] Review initial keyword rankings
- [ ] Check for any manual actions in Search Console
- [ ] Review and fix any crawl errors
- [ ] Analyze page speed in field data (CrUX)
- [ ] Plan content optimizations based on initial performance
