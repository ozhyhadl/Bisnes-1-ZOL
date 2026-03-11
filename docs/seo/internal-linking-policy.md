# Internal Linking Policy

## Purpose
Establish a strong internal linking structure that distributes page authority, aids crawlability, and improves user navigation.

## Rules

### Every page must have inbound links
- No orphan pages — every page must be linked from at least one other page
- Important pages should have more inbound links
- Homepage should link to all top-level pages

### Link with descriptive anchor text
- ✅ `<a href="/pricing">View pricing plans</a>` — descriptive
- ❌ `<a href="/pricing">Click here</a>` — meaningless
- ❌ `<a href="/pricing">Read more</a>` — generic

### Navigation structure
- Primary navigation: links to top-level pages (always visible)
- Footer: links to important utility pages (privacy, terms, contact)
- Contextual links: in-content links to related pages
- Breadcrumbs: hierarchical links for pages deeper than level 1

### Link depth
- Every page should be reachable within 3 clicks from homepage
- Critical pages (product, pricing, contact) within 1 click
- Content pages within 2–3 clicks

### Link format
- Use relative paths for internal links: `/pricing`, not `https://example.com/pricing`
- Use `<Link>` component from React Router, not raw `<a>` tags
- No internal links to 404 pages
- No internal redirect chains (link directly to final destination)

## Internal Linking Hierarchy
```
Homepage (/)
├── /features (primary nav)
├── /pricing (primary nav)
├── /about (primary nav)
├── /contact (primary nav)
├── /blog (if applicable)
│   ├── /blog/post-1
│   └── /blog/post-2
└── Footer links
    ├── /privacy
    └── /terms
```

## Anti-Patterns
- ❌ Orphan pages with no inbound links
- ❌ "Click here" or "Read more" as anchor text
- ❌ Broken internal links (404)
- ❌ Links through redirects when direct link is possible
- ❌ Excessive links on a single page (dilutes value)
- ❌ JavaScript-only links that crawlers can't follow

## Verification
- Use SiteOne Crawler to detect orphan pages and broken links
- Use browser testing to verify all navigation links work
- Review internal link structure quarterly

## Verification Checklist
- [ ] No orphan pages (every page has at least 1 inbound link)
- [ ] No broken internal links (404)
- [ ] All pages reachable within 3 clicks from homepage
- [ ] Anchor text is descriptive
- [ ] Navigation links use React Router `<Link>` component
- [ ] Footer links present and working
