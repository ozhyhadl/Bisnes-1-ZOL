# SEO Page Production Workflow

## Purpose
Specific workflow for producing pages that are optimized for search engine visibility from the start. This extends the general page launch workflow with SEO-specific steps.

## Pre-Production

### Keyword Research
1. Identify primary target keyword
2. Identify 2–3 secondary keywords
3. Analyze search intent (informational, transactional, navigational)
4. Check keyword difficulty and search volume
5. Review top-ranking competitors for the keyword

### Content Brief
Based on research, define:
- **Primary keyword**: The main term to rank for
- **Secondary keywords**: Related terms to include naturally
- **Search intent**: What the user wants when searching
- **Content angle**: How our page uniquely addresses the intent
- **Target length**: Minimum word count based on competition
- **Content structure**: Recommended heading outline

## Production Steps

### 1. URL Definition
```
Format: /{keyword-slug}
Example: /ai-skills-marketplace
```
- Use primary keyword in URL
- Lowercase, hyphen-separated
- Keep short (3–5 words max)
- No dates, IDs, or parameters

### 2. Title Tag
```html
<title>{Primary Keyword} — {Benefit} | {Brand}</title>
```
- Primary keyword near the beginning
- 30–60 characters
- Unique across all pages
- Compelling for click-through

### 3. Meta Description
```html
<meta name="description" content="{Action-oriented summary including primary keyword. Include a call-to-action. 120–160 characters.}">
```

### 4. Heading Structure
```
H1: {Primary keyword + value proposition}
  H2: {Section covering user need}
    H3: {Sub-point}
    H3: {Sub-point}
  H2: {Section covering benefits}
  H2: {Social proof / testimonials}
  H2: {FAQ section}
  H2: {CTA section}
```

### 5. Content Optimization
- Include primary keyword in first 100 words
- Use secondary keywords naturally throughout
- Write for humans first, search engines second
- Include relevant internal links (2–5)
- Add descriptive alt text to images
- Use short paragraphs (2–4 sentences)
- Include bullet points and lists for scannability

### 6. Technical SEO Implementation
- Set canonical URL
- Set correct indexing directive
- Add Open Graph tags
- Add Twitter Card tags
- Add structured data (JSON-LD)
- Verify page is in sitemap

### 7. Internal Linking
- Link TO the new page from 2–3 relevant existing pages
- Link FROM the new page to 2–3 relevant existing pages
- Use descriptive anchor text containing keywords

## Quality Gates

### SEO Checklist (Before Publish)
- [ ] Primary keyword in URL
- [ ] Primary keyword in title tag
- [ ] Primary keyword in H1
- [ ] Primary keyword in first 100 words
- [ ] Meta description written (120–160 chars)
- [ ] Heading hierarchy is correct (H1 → H2 → H3)
- [ ] Images have descriptive alt text
- [ ] Internal links added (inbound + outbound)
- [ ] Canonical URL set
- [ ] OG tags set
- [ ] Structured data valid
- [ ] Page is indexable (no accidental noindex)

### Performance Checklist
- [ ] Lighthouse SEO score ≥ 95
- [ ] Lighthouse Performance score ≥ 90
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Images optimized

## Post-Publish SEO Tasks

### Day 1
- Submit URL to Google Search Console
- Verify social share previews
- Check page appears in sitemap

### Week 1
- Monitor indexing status in Search Console
- Check for crawl errors
- Verify page renders correctly for Googlebot

### Month 1
- Check initial ranking position
- Review impressions and clicks in Search Console
- Optimize if needed (title, description, content)
