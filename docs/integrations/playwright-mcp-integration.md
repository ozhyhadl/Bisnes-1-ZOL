# Playwright MCP Integration

## Source
- **Name**: Playwright MCP
- **URL**: https://github.com/microsoft/playwright-mcp
- **Purpose**: MCP server for browser automation via Playwright accessibility snapshots

## What We Take From Playwright MCP

### Browser Automation Layer
- Navigate to pages and interact with elements (click, fill, select)
- Read page accessibility snapshots (structured data, not screenshots)
- Validate form behavior and error states
- Check page titles, meta tags, and content in live browser

### Page QA Capabilities
- Smoke test: page loads, renders, no console errors
- Form validation: required fields, error messages, submission
- Navigation testing: links work, redirects resolve
- Responsive testing: viewport resizing

### Metadata Validation
- Read `<title>`, `<meta description>`, OG tags from rendered page
- Verify canonical URL in rendered HTML
- Check robots meta tag (noindex, nofollow)
- Validate structured data renders correctly

## Integration Type
**External MCP server** — requires installation and configuration in VS Code.

## VS Code MCP Configuration
Add to VS Code settings (`.vscode/mcp.json` or user settings):
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

## Key Configuration Options
| Option | Purpose |
|--------|---------|
| `--browser chrome` | Use Chrome (default) |
| `--headless` | Run without visible browser window |
| `--viewport-size 1280x720` | Set viewport dimensions |
| `--device "iPhone 15"` | Emulate mobile device |
| `--isolated` | Clean session per test |

## Available Tool Categories
- **Core automation**: navigate, click, fill, select, hover, screenshot
- **Tab management**: open/close/switch tabs
- **Snapshot**: read page accessibility tree (primary mode)
- **Vision** (opt-in): coordinate-based interactions with screenshots
- **Testing** (opt-in): assertion tools

## How It Integrates Into Copilot Workflow
1. QA Browser Tester agent uses Playwright MCP tools to interact with pages
2. Agent invokes MCP tools via Copilot's tool system
3. Accessibility snapshots provide structured page data for verification
4. Results feed into QA reports

## Adapter Layer
Minimal adapter needed:
- QA checklists in `docs/qa/` define *what* to test
- Playwright MCP provides *how* to test
- Agent definition bridges the two

## Prerequisites
- Node.js 18+
- No separate Playwright installation needed (MCP server handles it)
- First run downloads browser binaries automatically

## Risks / Limitations
- MCP server runs as external process — subject to process management
- Accessibility snapshot mode is token-efficient but may miss visual issues
- Not a security boundary — don't use for security testing
- Browser state is ephemeral unless persistence is configured

## Recommended Usage Mode
**External MCP integration** — install as MCP server in VS Code, use through QA Browser Tester agent for systematic page validation.
