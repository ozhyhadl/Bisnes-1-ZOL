# Sitemap Policy

## Purpose
Ensure search engines can discover all important pages through an accurate, up-to-date sitemap.

## Sitemap Requirements

### XML Sitemap (`/sitemap.xml`)
- Must list all indexable pages
- Must NOT include noindex pages
- Must NOT include pages that return 404 or redirect
- Must use absolute URLs with canonical format
- Must be auto-generated on build or crawl

### Format
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-03-11</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2026-03-10</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Priority Guidelines
| Page Type | Priority |
|-----------|----------|
| Homepage | 1.0 |
| Core pages (product, pricing) | 0.8 |
| Content pages | 0.6 |
| Support/utility pages | 0.4 |

### robots.txt Reference
```
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
```

## Rules
1. Sitemap URL must be referenced in `robots.txt`
2. Sitemap must be accessible at `/sitemap.xml`
3. Update sitemap when pages are added, removed, or significantly changed
4. Max 50,000 URLs per sitemap file (use sitemap index for larger sites)
5. Max 50MB uncompressed per sitemap file

## Generation Options
- **Build-time**: Generate during `npm run build` using a Vite plugin
- **SiteOne Crawler**: `./crawler --url=<URL> --sitemap-xml-file=public/sitemap.xml`
- **Manual**: Maintain by hand for small sites

## Verification Checklist
- [ ] `/sitemap.xml` accessible and returns valid XML
- [ ] All indexable pages listed in sitemap
- [ ] No noindex pages in sitemap
- [ ] No 404 or redirect URLs in sitemap
- [ ] `robots.txt` references sitemap URL
- [ ] URLs in sitemap match canonical URLs
