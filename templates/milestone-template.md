# Milestone Definition Template

## Milestone: [Milestone Name]

**Goal**: [One-sentence description of what will be delivered]
**Owner**: Studio Orchestrator
**Status**: Not Started | In Progress | Complete
**Target**: [Date or sprint identifier]
**Visibility Mode**: Full Visible (per `docs/operations/visible-orchestration-mode.md`)

---

## Success Criteria

- [ ] [Criterion 1 — measurable and verifiable]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
- [ ] Build passes (`npm run build`)
- [ ] All Lighthouse scores meet thresholds
- [ ] No broken links (SiteOne verified)

---

## Tasks

| # | Task | Agent | Depends On | Status |
|---|---|---|---|---|
| 1 | [Task description] | [Agent name] | — | Not Started |
| 2 | [Task description] | [Agent name] | Task 1 | Not Started |
| 3 | [Task description] | [Agent name] | — | Not Started |
| 4 | [Task description] | [Agent name] | Tasks 2, 3 | Not Started |

---

## Dependency Map

```
Task 1
  ↓
Task 2  ←→  Task 3 (parallel)
  ↓
Task 4
```

---

## Risks & Blockers

| Risk | Impact | Mitigation |
|---|---|---|
| [Risk description] | [High/Medium/Low] | [How to handle] |

---

## Quality Gates

Before marking milestone complete:
- [ ] Full browser smoke test passes
- [ ] Lighthouse audit passes on all affected pages
- [ ] SiteOne crawl shows no new issues
- [ ] All success criteria verified

---

## Delivery Notes

### What was delivered
[Summary after completion]

### What went well
[Notes]

### What was challenging
[Notes]

### Process improvements for next time
[Notes]
