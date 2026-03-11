# Canonical Policy

## Purpose
Prevent duplicate content issues by defining a single authoritative URL for every page.

## Rules

### Every page must have a canonical tag
```html
<link rel="canonical" href="https://example.com/page-url">
```

### Self-referencing canonicals are standard
Most pages should point their canonical to themselves. This is correct and expected.

### Canonical URL format
- Must be absolute URL (include protocol and domain)
- Must use preferred protocol (HTTPS)
- Must use preferred domain version (with or without www — pick one)
- Must NOT include query parameters (unless they define unique content)
- Must NOT include trailing slash inconsistency (pick one pattern and stick to it)

### URL patterns
| Pattern | Canonical |
|---------|-----------|
| `https://site.com/page` | `https://site.com/page` |
| `https://site.com/page?utm_source=x` | `https://site.com/page` (strip UTM) |
| `https://site.com/page/` and `https://site.com/page` | Pick one, redirect the other |
| `http://site.com/page` | `https://site.com/page` (always HTTPS) |

### When to use cross-page canonicals
- Paginated content: page 1 can be canonical, or each page is self-canonical
- Duplicate pages with minor variations: canonical to the primary version
- Syndicated content: canonical to the original source

### Canonicals and noindex
- A `noindex` page should NOT have a self-referencing canonical
- Instead, canonical should point to the preferred indexed version
- If no preferred version exists, omit canonical on noindex pages

## Anti-Patterns (Don't Do This)
- ❌ Relative canonical URLs
- ❌ Different canonical than the actual URL without intent
- ❌ Canonical pointing to a 404 or redirect
- ❌ Canonical pointing to a noindex page
- ❌ Missing canonical tag entirely

## Verification Checklist
- [ ] Every indexable page has a self-referencing canonical
- [ ] Canonical URLs are absolute and use HTTPS
- [ ] No canonical points to a 404 or redirect
- [ ] Query parameter pages canonical to clean URL
- [ ] URL format is consistent (trailing slash or not)
