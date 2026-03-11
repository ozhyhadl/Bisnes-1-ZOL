# Metadata Policy

## Purpose
Define standards for HTML metadata across all pages to ensure consistent SEO performance and social sharing.

## Required Meta Tags (Every Page)

### Title Tag
- **Format**: `[Page Title] — [Site Name]`
- **Length**: 50–60 characters (display limit in Google SERPs)
- **Rules**:
  - Must be unique per page
  - Must contain primary keyword
  - Primary keyword should appear near the beginning
  - No keyword stuffing
  - Must accurately describe page content

### Meta Description
- **Length**: 120–155 characters
- **Rules**:
  - Must be unique per page
  - Must contain primary keyword naturally
  - Must include a call-to-action or value proposition
  - Written as compelling copy, not keyword list
  - Must accurately summarize page content

### Canonical URL
- Every page must have `<link rel="canonical" href="...">` 
- Canonical must be the absolute URL of the current page
- Self-referencing canonicals are correct for most pages
- See `canonical-policy.md` for edge cases

### Viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Charset
```html
<meta charset="UTF-8">
```

## Open Graph Tags (Every Page)
```html
<meta property="og:title" content="[Same as title or social-optimized]">
<meta property="og:description" content="[Same as meta description or social-optimized]">
<meta property="og:type" content="website">
<meta property="og:url" content="[Canonical URL]">
<meta property="og:image" content="[Absolute URL to social image, min 1200x630px]">
```

## Twitter Card Tags (Every Page)
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[Same as og:title]">
<meta name="twitter:description" content="[Same as og:description]">
<meta name="twitter:image" content="[Same as og:image]">
```

## Verification Checklist
- [ ] Title tag present and unique
- [ ] Title 50–60 characters
- [ ] Meta description present and unique
- [ ] Meta description 120–155 characters
- [ ] Canonical URL present and correct
- [ ] og:title, og:description, og:image present
- [ ] twitter:card and twitter tags present
- [ ] No duplicate metadata across pages
