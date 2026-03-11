# Browser Smoke Test Checklist

## Purpose
A quick browser-level smoke test to verify core functionality before any release. Can be executed manually or automated via Playwright MCP.

## Test Scope
Smoke tests cover critical user paths — not exhaustive testing, but enough to confirm the site is functional.

## Navigation

- [ ] Homepage loads without errors
- [ ] Primary navigation links work (all menu items)
- [ ] Footer links work
- [ ] Logo links back to homepage
- [ ] Back button works as expected
- [ ] 404 page displays for invalid URLs

## Page Rendering

- [ ] All pages render without blank/white screen
- [ ] No JavaScript console errors on any page
- [ ] Images load correctly (no broken images)
- [ ] Fonts load correctly (no FOUT/FOIT issues)
- [ ] CSS is applied (no unstyled content)
- [ ] No layout shifts visible during load

## Interactive Elements

- [ ] Buttons are clickable and respond
- [ ] Accordion/FAQ sections expand and collapse
- [ ] Modal/dialog components open and close
- [ ] Scroll effects work (scroll reveal, parallax)
- [ ] CTA buttons navigate to correct destinations

## Responsive Design

- [ ] Site works on desktop viewport (1920px, 1440px, 1280px)
- [ ] Site works on tablet viewport (768px, 1024px)
- [ ] Site works on mobile viewport (375px, 390px, 414px)
- [ ] No horizontal scrollbar on any viewport
- [ ] Navigation is usable on mobile (hamburger menu if applicable)
- [ ] Text is readable without zooming on mobile

## Forms (if applicable)

- [ ] Form fields accept input
- [ ] Form validation works (required fields, email format)
- [ ] Form submission works
- [ ] Success/error messages display correctly

## Performance (Visual)

- [ ] Page loads within 3 seconds (perceived)
- [ ] No janky scrolling
- [ ] Animations are smooth (60fps target)
- [ ] No flashing or flickering content

## Cross-Browser

| Browser | Status |
|---|---|
| Chrome (latest) | [ ] |
| Firefox (latest) | [ ] |
| Safari (latest) | [ ] |
| Edge (latest) | [ ] |

## Automated Execution
```
# Via Playwright MCP — ask the browser testing agent to:
1. Navigate to each page URL
2. Check for console errors
3. Verify page title exists
4. Click navigation links and verify navigation
5. Take screenshots at different viewports
```

## Pass/Fail Criteria
- **Pass**: All checks above pass, no critical issues
- **Fail**: Any navigation failure, blank page, or console error
- **Conditional**: Minor visual issues that don't block functionality
