# SiteOne Crawler Integration

## Source
- **Name**: SiteOne Crawler
- **URL**: https://github.com/janreges/siteone-crawler
- **Purpose**: Cross-platform website crawler and analyzer for SEO, security, accessibility, and performance

## What We Take From SiteOne Crawler

### Technical SEO Crawling
- Crawl all pages and report status codes, response times, sizes
- Detect broken links (404), redirect chains, and loops
- Extract and validate titles, descriptions, keywords, headings

### Broken Links Detection
- Find all 404 errors across the site
- Identify external broken links
- Report redirect chains and redirect loops

### Internal Linking Audit
- Map internal link structure
- Identify orphan pages (no inbound links)
- Measure crawl depth per page
- Report pages with excessive outbound links

### Technical Site Inspection
- HTTP header analysis
- Security header checks
- Content type validation
- Response time monitoring
- DOM analysis

### SEO Analysis
- Title and meta description presence/length
- Open Graph tag validation
- Heading structure analysis (h1-h6)
- Sitemap generation capability

## Integration Type
**External CLI tool** — requires separate download and PHP/Swoole runtime (or pre-built binary).

## Installation (macOS)
```sh
# Option 1: Download pre-built binary from releases
# https://github.com/janreges/siteone-crawler/releases

# Option 2: Clone and use with Swoole
git clone https://github.com/janreges/siteone-crawler.git
cd siteone-crawler
# Requires swoole-cli binary for macOS
```

## Key Commands

### Basic crawl
```sh
./crawler --url=http://localhost:8080/
```

### Crawl with SEO columns
```sh
./crawler --url=http://localhost:8080/ \
  --extra-columns="Title(40),Description(50),DOM"
```

### Generate HTML report
```sh
./crawler --url=http://localhost:8080/ \
  --output-html-report=tmp/seo-report.html
```

### Generate JSON output
```sh
./crawler --url=http://localhost:8080/ \
  --output-json-file=tmp/crawl-report.json
```

### Full SEO audit
```sh
./crawler --url=http://localhost:8080/ \
  --extra-columns="Title(40),Description(50),DOM" \
  --output-html-report=tmp/seo-report.html \
  --output-json-file=tmp/crawl-report.json \
  --html-report-options="summary,seo-opengraph,visited-urls,redirects,404-pages,security"
```

### Generate sitemap
```sh
./crawler --url=http://localhost:8080/ \
  --sitemap-xml-file=public/sitemap.xml \
  --sitemap-txt-file=public/sitemap.txt
```

## How It Integrates Into Copilot Workflow
1. Technical SEO Auditor agent defines audit scope
2. Crawler runs as external CLI process against dev/production URL
3. Reports (HTML/JSON/text) are reviewed by Technical SEO Auditor
4. Findings are prioritized by SEO Lead
5. Fix tasks assigned to Frontend Builder

## Adapter Layer
- `docs/seo/technical-audit-checklist.md` → defines what to look for
- Agent definition → bridges checklist and crawler output
- Crawl reports → parsed and summarized by Technical SEO Auditor

## Risks / Limitations
- External binary — not installable via npm
- Requires PHP/Swoole runtime (or prebuilt binary)
- Crawling speed must be configured responsibly (`--max-reqs-per-sec`)
- Not suitable for JavaScript-rendered content without pre-rendering
- macOS arm64 requires specific Swoole binary

## Recommended Usage Mode
**External CLI audit tool** — download binary, run crawls against local dev server or production, feed reports into SEO review workflow.
