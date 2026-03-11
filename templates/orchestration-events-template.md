# Orchestration Event Templates

> Copy-paste blocks for visible orchestration events. Use these when surfacing orchestration activity in chat per `docs/operations/visible-orchestration-mode.md`.

---

## Stage Header

```
──────────────────────────────────────
📍 Stage: [Stage Name]
🤖 Active Agent: [Agent Name]
🎯 Objective: [One-sentence goal for this stage]
──────────────────────────────────────
```

---

## Agent Activation

```
🤖 Agent Activated: [Agent Name]
   Reason: [Why this agent is needed]
   Task: [Specific subtask assigned]
```

---

## Delegation

```
📋 Delegation: [From Agent] → [To Agent]
   Task: [Task description]
   Using: [doc1.md, doc2.md, checklist.md]
   Expected Output: [What the agent should return]
```

---

## Skill / Doc / Checklist Usage

```
📄 Using: [docs/path/to/document.md]
   Purpose: [Why this doc is being referenced]
   Stage: [Current stage name]
```

---

## Handoff

```
🔄 Handoff: [From Agent] → [To Agent]
   Task: [What is being handed off]
   Artifact: [What the first agent produced]
   Expected Output: [What the next agent should deliver]
```

---

## Task Completed / Result Returned

```
✅ Completed by: [Agent Name]
   Result: [Short summary of what was done]
   Changes: [Files modified, issues found, decisions made]
   Next: [What happens next, or "None — stage complete"]
```

---

## Stage Completed

```
✅ Stage Complete: [Stage Name]
   Summary: [What was achieved in this stage]
   Next Stage: [Next stage name]
   Next Agent: [Who leads next]
```

---

## Next Step

```
⏭️ Next: [Next Stage Name]
   Agent: [Who leads next]
   Task: [What will be done]
   Reason: [Why this stage follows]
```

---

## Orchestration Progress (Compact Mode)

For smaller tasks where full format is unnecessary:

```
🤖 [Agent Name] · [Task] · Using: [doc.md]
✅ Done: [Result summary]
```
