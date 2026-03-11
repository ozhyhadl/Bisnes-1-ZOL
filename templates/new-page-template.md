# New Page Template

## Page: [Page Name]
## URL: /[page-slug]

**Orchestration**: Full Visible Mode — follow `docs/operations/visible-orchestration-mode.md` for all agent handoffs during page creation.

---

## SEO Configuration

### Metadata
- **Title**: `[Page Title] | [Brand Name]` (30–60 chars)
- **Description**: `[Action-oriented description with target keyword]` (120–160 chars)
- **Canonical**: `https://[domain]/[page-slug]`
- **Robots**: `index, follow`

### Open Graph
- **og:title**: `[Same as title or shorter variant]`
- **og:description**: `[Same as meta description]`
- **og:image**: `[1200x630px image URL]`
- **og:url**: `[Same as canonical]`
- **og:type**: `website`

### Twitter Card
- **twitter:card**: `summary_large_image`
- **twitter:title**: `[Same as og:title]`
- **twitter:description**: `[Same as og:description]`

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "[WebPage / Product / FAQPage / etc.]",
  "name": "[Page Name]",
  "url": "[Canonical URL]"
}
```

---

## Content Structure

### H1: [Primary heading with target keyword]

### Section 1: [Section Name]
**H2**: [Section heading]
- [Content description]
- [Key points to cover]

### Section 2: [Section Name]
**H2**: [Section heading]
- [Content description]

### Section 3: [Section Name]
**H2**: [Section heading]
- [Content description]

### CTA Section
**H2**: [CTA heading]
- **CTA text**: [Button text]
- **CTA link**: [Destination URL]

---

## Component List

| Component | Source | Props |
|---|---|---|
| [ComponentName] | existing / new | [key props] |

---

## Internal Links

### Links TO this page (from existing pages)
- [Page Name] → anchor text: `[text]`

### Links FROM this page (to existing pages)
- [Page Name] → section: [where in the page]

---

## Pre-Launch Checklist
- [ ] URL follows naming convention
- [ ] Title tag is unique and within 30–60 chars
- [ ] Meta description is unique and within 120–160 chars
- [ ] H1 is present and contains keyword
- [ ] Heading hierarchy is correct
- [ ] Canonical URL is set
- [ ] OG tags are complete
- [ ] Structured data is valid
- [ ] Internal links added (inbound + outbound)
- [ ] Mobile responsive
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse SEO ≥ 95
- [ ] No console errors
