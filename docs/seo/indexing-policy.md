# Indexing Policy

## Purpose
Control which pages search engines index and how they appear in search results.

## Default Rule
All public-facing pages should be **indexable** unless there is a specific reason to exclude them.

## Indexable Pages (index, follow)
- Homepage
- Product/service pages
- Landing pages
- Blog posts / content pages
- About, contact, pricing pages
- FAQ pages

These pages should have:
```html
<meta name="robots" content="index, follow">
```
Or simply no robots meta tag (default behavior is index, follow).

## Non-Indexable Pages (noindex, follow)
- Thank you / confirmation pages
- Search results pages
- Filtered/sorted variations of the same content
- UTM-tagged duplicates
- Development/staging environments
- Legal pages that don't need search traffic (terms, privacy policy — optional)

These pages must have:
```html
<meta name="robots" content="noindex, follow">
```

## Non-Indexable, No-Follow
- Admin/dashboard pages (should not be publicly accessible)
- Internal tools

```html
<meta name="robots" content="noindex, nofollow">
```

## Rules
1. **Never block CSS/JS** in robots.txt — search engines need them to render pages
2. **Noindex beats robots.txt** — use `noindex` meta tag for granular control, `robots.txt` for crawl budget
3. **Canonical + noindex** — if a page has `noindex`, it should NOT have a canonical pointing to itself; instead point canonical to the preferred version
4. **Check rendered HTML** — SPA apps must verify robots tags appear in rendered (not just source) HTML
5. **Verify with crawler** — use SiteOne Crawler to check actual indexing directives

## Verification Checklist
- [ ] All public pages have `index, follow` (or no robots tag)
- [ ] Thank you / duplicate pages have `noindex`
- [ ] No CSS/JS blocked in robots.txt
- [ ] Staging/dev environments have `noindex` on all pages
- [ ] robots.txt does not contradict meta robots tags
