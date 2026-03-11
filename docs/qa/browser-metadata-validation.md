# Browser Metadata Validation

## Purpose
Define how to validate that HTML metadata (SEO tags, OG tags, structured data) renders correctly in the browser. This is the final validation layer that catches issues invisible to static analysis.

## Why Browser Validation Matters
- Server-side rendered and client-side rendered metadata can differ
- JavaScript-generated meta tags may not be present at crawl time
- Social media crawlers may see different content than users
- Meta tags in React (via react-helmet or similar) need JS execution

## Validation Targets

### Title Tag
```
Expected: <title>Your Page Title | Brand</title>
```
- [ ] Title is present in `document.title`
- [ ] Title matches the expected value
- [ ] Title is not a default/placeholder value
- [ ] Title is unique per page

### Meta Tags
```html
<meta name="description" content="...">
<meta name="robots" content="index, follow">
<link rel="canonical" href="...">
```
- [ ] Description meta tag is present
- [ ] Description content is not empty
- [ ] Robots meta tag has correct directive
- [ ] Canonical URL is correct and absolute

### Open Graph Tags
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:url" content="...">
<meta property="og:type" content="...">
```
- [ ] All OG tags are present
- [ ] OG values match page content
- [ ] OG image URL is accessible (returns 200)
- [ ] OG URL matches canonical

### Twitter Card Tags
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
```
- [ ] Twitter card type is specified
- [ ] Twitter title and description are present

### Structured Data (JSON-LD)
```html
<script type="application/ld+json">{ ... }</script>
```
- [ ] JSON-LD script tag is present
- [ ] JSON is valid (parseable)
- [ ] `@type` is correct
- [ ] Required properties are present
- [ ] No errors in Google Rich Results Test

## Automated Validation via Playwright MCP

The QA Browser Tester agent can validate metadata automatically:

```
Ask Playwright MCP to:
1. Navigate to the target URL
2. Extract document.title
3. Extract all meta tags from <head>
4. Extract JSON-LD content
5. Verify values match expected specifications
6. Report any missing or incorrect tags
```

### Example Validation Script Concept
```javascript
// Playwright validation logic (conceptual)
const title = await page.title();
const description = await page.$eval('meta[name="description"]', el => el.content);
const canonical = await page.$eval('link[rel="canonical"]', el => el.href);
const ogTitle = await page.$eval('meta[property="og:title"]', el => el.content);
const jsonLd = await page.$eval('script[type="application/ld+json"]', el => JSON.parse(el.textContent));

// Assert
expect(title).toBeTruthy();
expect(description).toBeTruthy();
expect(canonical).toMatch(/^https:\/\//);
expect(ogTitle).toBe(title);
expect(jsonLd['@type']).toBeTruthy();
```

## Page-Specific Expectations

| Page | Title Pattern | Schema Type | OG Image |
|---|---|---|---|
| Homepage | `{Brand Name}` or `{Brand} — {Tagline}` | Organization, WebSite | Required |
| Product/Feature | `{Feature} | {Brand}` | Product or WebPage | Required |
| FAQ | `FAQ | {Brand}` | FAQPage | Optional |
| Pricing | `Pricing | {Brand}` | WebPage | Required |
| 404 | `Page Not Found | {Brand}` | None | Optional |

## When to Run Browser Metadata Validation

- After changing any page's metadata
- After changing the metadata component/helper
- Before every release (as part of pre-release QA)
- After deploying to production (verify production metadata)

## Common Issues

| Issue | Cause | Fix |
|---|---|---|
| Missing meta tags | React helmet not rendering | Check component mounting |
| Duplicate tags | Multiple helmet instances | Ensure single source of truth |
| Empty values | Data not loaded before render | Check data flow / loading states |
| Wrong canonical | Hardcoded URL | Use dynamic URL generation |
| Invalid JSON-LD | Syntax error in template | Validate JSON before rendering |
