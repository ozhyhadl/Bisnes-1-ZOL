# Structured Data Policy

## Purpose
Implement structured data (JSON-LD) to enhance search appearance and enable rich results.

## Format
Always use **JSON-LD** format embedded in `<script type="application/ld+json">` in the `<head>`.

## Required Structured Data by Page Type

### All Pages — Organization
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png"
}
```

### Homepage — WebSite + SearchAction (if applicable)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Site Name",
  "url": "https://example.com"
}
```

### FAQ Pages
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text here?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text here."
      }
    }
  ]
}
```

### Product / Pricing Pages
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "offers": {
    "@type": "Offer",
    "price": "99.00",
    "priceCurrency": "USD"
  }
}
```

### Breadcrumbs (when navigation depth > 1)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com" },
    { "@type": "ListItem", "position": 2, "name": "Page", "item": "https://example.com/page" }
  ]
}
```

## Rules
1. Structured data must match visible page content — no hidden or misleading data
2. Validate using [Google Rich Results Test](https://search.google.com/test/rich-results)
3. One primary type per page (FAQPage, Product, WebSite, etc.)
4. Organization schema can coexist with page-specific schema
5. Use absolute URLs in all schema references

## Anti-Patterns
- ❌ Structured data that doesn't match visible content
- ❌ Multiple conflicting schema types
- ❌ Using Microdata or RDFa instead of JSON-LD
- ❌ Missing required properties for a type

## Verification Checklist
- [ ] JSON-LD script tag present in page `<head>`
- [ ] Schema type matches page purpose
- [ ] All required properties populated
- [ ] Validates in Google Rich Results Test
- [ ] Data matches visible content
