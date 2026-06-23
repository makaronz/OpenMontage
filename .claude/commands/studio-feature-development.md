---
name: studio-feature-development
description: Workflow command scaffold for studio-feature-development in OpenMontage.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /studio-feature-development

Use this workflow when working on **studio-feature-development** in `OpenMontage`.

## Goal

Implements or enhances a Studio (Next.js + FastAPI) feature, involving both backend API and frontend UI, often with supporting tests and documentation.

## Common Files

- `services/studio-api/main.py`
- `services/studio-api/preflight.py`
- `web/studio/app/(studio)/**/*.tsx`
- `web/studio/components/*.tsx`
- `web/studio/lib/*.ts`
- `web/studio/lib/*.test.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit or add FastAPI backend files (services/studio-api/*.py)
- Edit or add Next.js frontend files (web/studio/app/(studio)/**/*.tsx, web/studio/components/*.tsx, web/studio/lib/*.ts)
- Update or add Makefile/requirements/pyproject/package files as needed
- Write or update tests (tests/services/*.py, web/studio/lib/*.test.ts)
- Update or add documentation (web/studio/README.md, design-system/MASTER.md)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.