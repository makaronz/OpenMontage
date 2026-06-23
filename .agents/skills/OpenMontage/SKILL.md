```markdown
# OpenMontage Development Patterns

> Auto-generated skill from repository analysis

## Overview

OpenMontage is a TypeScript-based project (with Python backend components) focused on building and maintaining the Studio dashboard, its backend APIs, and supporting continual learning features. This skill teaches you the coding conventions, development workflows, and testing patterns used in the repository, enabling consistent contributions and efficient collaboration.

---

## Coding Conventions

### File Naming

- **TypeScript/JavaScript:** Use `camelCase` for file names.
  - Example: `myComponent.tsx`, `apiClient.ts`
- **Tests:** Suffix test files with `.test.ts`.
  - Example: `apiClient.test.ts`

### Import Style

- Mixed usage of default and named imports.
  - Example:
    ```typescript
    import React from "react";
    import { fetchData } from "./apiClient";
    ```

### Export Style

- Both default and named exports are used.
  - Example:
    ```typescript
    // Named export
    export function fetchData() { ... }

    // Default export
    export default MyComponent;
    ```

### Commit Messages

- Use [Conventional Commits](https://www.conventionalcommits.org/) with prefixes:
  - `feat`: New features
  - `fix`: Bug fixes
  - `docs`: Documentation changes
  - `chore`: Maintenance tasks
- Keep messages concise (average ~54 characters).
  - Example: `feat: add user preferences to dashboard`

---

## Workflows

### Studio Feature Development

**Trigger:** When you want to add or improve a Studio dashboard/API feature (backend or frontend).  
**Command:** `/studio-feature`

1. **Backend:** Edit or add FastAPI backend files in `services/studio-api/*.py`.
2. **Frontend:** Edit or add Next.js frontend files:
    - `web/studio/app/(studio)/**/*.tsx`
    - `web/studio/components/*.tsx`
    - `web/studio/lib/*.ts`
3. **Dependencies:** Update `Makefile`, `requirements*.txt`, `pyproject`, or `package.json` as needed.
4. **Testing:** Write or update tests:
    - Python: `tests/services/*.py`
    - TypeScript: `web/studio/lib/*.test.ts`
5. **Documentation:** Update or add docs:
    - `web/studio/README.md`
    - `design-system/MASTER.md`

**Example:**
```typescript
// web/studio/lib/userPreferences.ts
export function getUserPreferences(userId: string) { ... }
```
```python
# services/studio-api/preflight.py
from fastapi import APIRouter
router = APIRouter()
@router.get("/preflight")
def preflight_check():
    return {"status": "ok"}
```

---

### Dashboard UI Design and Implementation

**Trigger:** When introducing or updating a major dashboard UI feature in Studio.  
**Command:** `/dashboard-ui`

1. Write or update a design spec in `docs/superpowers/specs/*.md`.
2. Write or update an implementation plan in `docs/superpowers/plans/*.md`.
3. Implement UI components and logic:
    - `web/studio/components/*.tsx`
    - `web/studio/app/(studio)/**/*.tsx`
    - `web/studio/lib/*.ts`
4. Update supporting files:
    - `design-system/MASTER.md`
    - `web/studio/package.json`
    - `web/studio/package-lock.json`

**Example:**
```markdown
<!-- docs/superpowers/specs/user-preferences.md -->
# User Preferences Feature Spec
...
```
```typescript
// web/studio/components/UserPreferences.tsx
export default function UserPreferences() { ... }
```

---

### Continual Learning State Update

**Trigger:** When recording new learning state, transcript metadata, or updating processing counters.  
**Command:** `/update-continual-learning`

1. Edit `.cursor/hooks/state/continual-learning.json` and/or `.cursor/hooks/state/continual-learning-index.json`.
2. Optionally update `AGENTS.md` or related documentation.

**Example:**
```json
// .cursor/hooks/state/continual-learning.json
{
  "lastProcessed": "2024-06-01T12:00:00Z",
  "counters": { "transcripts": 42 }
}
```

---

### Deployment Configuration Update

**Trigger:** When adjusting deployment settings or fixing deployment issues.  
**Command:** `/deploy-config`

1. Edit `render.yaml` to adjust deployment blueprint.
2. Edit `services/studio-api/main.py` or config files for deployment compatibility.
3. Edit `requirements.txt` or related dependency files.
4. Write or update deployment-related tests:
    - Python: `tests/services/*.py`
    - TypeScript: `web/studio/lib/api.test.ts`

**Example:**
```yaml
# render.yaml
services:
  - type: web
    name: studio-api
    env: python
    buildCommand: "pip install -r requirements.txt"
```

---

## Testing Patterns

- **Framework:** [Vitest](https://vitest.dev/)
- **Test File Pattern:** `*.test.ts`
- **Example:**
    ```typescript
    // web/studio/lib/apiClient.test.ts
    import { fetchData } from "./apiClient";
    import { describe, it, expect } from "vitest";

    describe("fetchData", () => {
      it("returns data for valid input", async () => {
        const data = await fetchData("test");
        expect(data).toBeDefined();
      });
    });
    ```

---

## Commands

| Command                | Purpose                                                        |
|------------------------|----------------------------------------------------------------|
| /studio-feature        | Start a Studio dashboard/API feature development workflow      |
| /dashboard-ui          | Begin a dashboard UI design and implementation workflow        |
| /update-continual-learning | Update continual learning state JSON files                 |
| /deploy-config         | Update deployment configuration and related tests              |
```
