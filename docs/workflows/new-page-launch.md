# New Page Launch Workflow

## Purpose
Step-by-step process for launching a new page from concept to production. Ensures every page meets quality, SEO, and performance standards.

## Participants
- **Studio Orchestrator** — coordinates the workflow
- **Architect** — defines component structure
- **Frontend Builder** — implements the page
- **SEO Lead** — defines metadata and SEO requirements
- **Content Strategist** — provides copy and CRO guidance
- **QA Browser Tester** — validates in browser
- **Performance Auditor** — runs Lighthouse checks

## Workflow

### Phase 1: Planning

**Orchestrator** kicks off the workflow:

1. **Define the page purpose** — What problem does it solve? What's the user intent?
2. **Define the URL** — following URL policy (lowercase, hyphens, descriptive)
3. **Architect designs component structure**:
   - Which existing components to reuse
   - Which new components to create
   - Layout and section order
4. **SEO Lead defines requirements**:
   - Target keyword
   - Title tag (see `docs/seo/metadata-policy.md`)
   - Meta description
   - Structured data type
   - Canonical URL
   - Index/noindex directive
5. **Content Strategist defines copy**:
   - Headline and subheadline
   - Body content
   - CTA text and placement
   - Social proof elements

### Phase 2: Implementation

**Frontend Builder** creates the page:

1. Create the page component in `src/pages/`
2. Add route in router configuration
3. Implement the layout using designed component structure
4. Add all content from Content Strategist
5. Implement responsive design (mobile-first)
6. Add metadata (title, description, OG tags, canonical)
7. Add structured data (JSON-LD)
8. Add internal links to and from the page

### Phase 3: Review

**Parallel reviews by specialists**:

1. **SEO Lead verifies**:
   - [ ] Title tag follows policy
   - [ ] Meta description follows policy
   - [ ] Canonical URL is correct
   - [ ] Structured data is valid
   - [ ] Internal links are present
   - [ ] Heading hierarchy is correct

2. **QA Browser Tester verifies**:
   - [ ] Page loads without errors
   - [ ] All interactive elements work
   - [ ] Mobile layout is correct
   - [ ] No console errors
   - [ ] Navigation works

3. **Performance Auditor verifies**:
   - [ ] Lighthouse scores meet thresholds
   - [ ] Core Web Vitals in "Good" range
   - [ ] No performance regressions

4. **Content Strategist verifies**:
   - [ ] Copy is accurate and compelling
   - [ ] CTAs are clear and positioned correctly
   - [ ] No placeholder text remaining

### Phase 4: Fix & Iterate

If any review finds issues:
1. Issue is reported back to **Frontend Builder**
2. Builder fixes the issue
3. Reviewer re-checks
4. Repeat until all checks pass

### Phase 5: Deploy

1. Build succeeds: `npm run build`
2. All tests pass: `npm run test`
3. Commit changes with descriptive message
4. Push to GitHub
5. Vercel auto-deploys from push
6. Verify production URL works

### Phase 6: Post-Launch

1. Verify page is accessible at production URL
2. Submit to Google Search Console for indexing
3. Check social share previews (Facebook Debugger)
4. Monitor for errors in first 24 hours
5. Update sitemap if not auto-generated

## Estimated Agent Involvement

| Phase | Agents Active |
|---|---|
| Planning | Orchestrator, Architect, SEO Lead, Content Strategist |
| Implementation | Frontend Builder |
| Review | SEO Lead, QA Browser Tester, Performance Auditor, Content Strategist |
| Fix | Frontend Builder |
| Deploy | Orchestrator |
| Post-Launch | SEO Lead, QA Browser Tester |
