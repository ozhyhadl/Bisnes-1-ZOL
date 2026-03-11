# Content Update Flow

## Purpose
Define the process for updating existing content on the site — text changes, image updates, section modifications — while maintaining SEO integrity and quality.

## When to Use This Flow
- Updating page copy or messaging
- Changing images or media
- Adding/removing page sections
- Updating pricing or product information
- Seasonal content updates

## Flow Overview

```
Request → Impact Assessment → Update → SEO Check → QA → Deploy
```

## Step 1: Request

Define what needs to change:
- **Page**: Which page(s) are affected?
- **Section**: Which section(s) on the page?
- **Change type**: Text / Image / Layout / Data
- **New content**: Exact content to use
- **Reason**: Why is this change needed?

## Step 2: Impact Assessment

Before making changes, assess the impact:

### SEO Impact
- [ ] Does this change affect the H1?
- [ ] Does this change affect the title tag?
- [ ] Does this change affect the meta description?
- [ ] Does this change affect the URL?
- [ ] Does this change remove or add internal links?
- [ ] Does this change affect structured data?

**If any SEO element changes → also update SEO metadata accordingly.**

**If the URL changes → set up a redirect from old URL to new URL.**

### Layout Impact
- [ ] Does this change affect the responsive layout?
- [ ] Does this change affect component reuse on other pages?
- [ ] Does this change add/remove sections?

## Step 3: Update

Make the content changes:

1. Locate the relevant component/page file
2. Update the text/image/data
3. If images changed:
   - Use optimized format (WebP preferred)
   - Include width/height attributes
   - Update alt text
4. If sections added/removed:
   - Maintain heading hierarchy
   - Update internal links if needed

## Step 4: SEO Check

After content update, verify SEO integrity:

- [ ] Title tag still follows policy
- [ ] Meta description still accurate and compelling
- [ ] H1 reflects the page content
- [ ] Heading hierarchy still valid
- [ ] Internal links still working
- [ ] Structured data still accurate
- [ ] No keyword cannibalization with other pages
- [ ] Canonical URL unchanged (or correctly updated)

## Step 5: QA

Quick quality check:

- [ ] Page renders correctly on desktop
- [ ] Page renders correctly on mobile
- [ ] No console errors
- [ ] Images load correctly
- [ ] Updated content is visible and correct
- [ ] No typos or formatting issues
- [ ] Build succeeds (`npm run build`)

## Step 6: Deploy

1. Commit with descriptive message:
   ```
   content: update [page] — [brief description]
   ```
2. Push to GitHub
3. Verify on Vercel preview
4. Verify on production

## Special Cases

### URL Change
If a page URL changes:
1. Set up redirect from old URL to new URL (in `vercel.json` or via middleware)
2. Update all internal links pointing to the old URL
3. Update sitemap
4. Update canonical URL
5. Update any structured data referencing the URL

### Image Update
1. Optimize the new image (compress, convert to WebP)
2. Use same dimensions if possible (prevents CLS)
3. Update alt text to describe the new image
4. Remove the old image file if no longer used

### Pricing/Data Update
1. Update the data in the source of truth
2. Verify structured data reflects new pricing
3. Check that all instances of the data are updated (no stale values)
