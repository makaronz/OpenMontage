---
name: dashboard-ui-design-and-implementation
description: Workflow command scaffold for dashboard-ui-design-and-implementation in OpenMontage.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /dashboard-ui-design-and-implementation

Use this workflow when working on **dashboard-ui-design-and-implementation** in `OpenMontage`.

## Goal

Documents, plans, and implements new dashboard UI features for the Studio, including design specs, rollout plans, and corresponding code changes.

## Common Files

- `docs/superpowers/specs/*.md`
- `docs/superpowers/plans/*.md`
- `web/studio/components/*.tsx`
- `web/studio/app/(studio)/**/*.tsx`
- `web/studio/lib/*.ts`
- `design-system/MASTER.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Write or update design spec in docs/superpowers/specs/*.md
- Write or update implementation plan in docs/superpowers/plans/*.md
- Implement UI components and logic (web/studio/components/*.tsx, web/studio/app/(studio)/**/*.tsx, web/studio/lib/*.ts)
- Update supporting files (design-system/MASTER.md, web/studio/package.json, web/studio/package-lock.json)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.