# Studio Mission Control Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the Studio `/` dashboard into the approved Mission Control layout: hero readiness ring + verdict, operator tiles, setup blockers, quick actions, and the existing preflight section — without new API routes or v1-out-of-scope features.

**Architecture:** Keep `DashboardPreflight` as the single RSC data fetcher (`fetchHealth`, `fetchPreflightSummary`). Extract pure readiness/verdict math into `lib/dashboard-readiness.ts` (unit-tested). Add two focused presentational components (`readiness-ring`, `dashboard-blockers`) and compose them in the refactored dashboard. Client-only pieces: ring animation wrapper and preflight refresh button.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Lucide, Vitest (new, lib tests only)

**Spec:** `docs/superpowers/specs/2026-06-09-studio-dashboard-ui-design.md`

---

## File map

| File | Action | Responsibility |
|------|--------|----------------|
| `web/studio/app/globals.css` | Modify | Add `--color-warn`, `--color-danger` |
| `design-system/MASTER.md` | Modify | Document warn/danger tokens |
| `web/studio/lib/dashboard-readiness.ts` | Create | Rollup %, verdict label/tone, provider totals |
| `web/studio/lib/dashboard-readiness.test.ts` | Create | Verdict matrix unit tests |
| `web/studio/package.json` | Modify | Add vitest + `test` script |
| `web/studio/components/readiness-ring.tsx` | Create | SVG ring + optional client animation |
| `web/studio/components/dashboard-blockers.tsx` | Create | Top 5 setup offers → `/setup?capability=` |
| `web/studio/components/dashboard-preflight.tsx` | Modify | Full Mission Control layout |
| `web/studio/components/composition-runtime-chips.tsx` | Modify | Tooltips, empty copy per spec |
| `web/studio/components/preflight-refresh-button.tsx` | Modify | `aria-busy`, spin icon, error styling |

---

### Task 1: Design tokens (warn / danger)

**Files:**
- Modify: `web/studio/app/globals.css`
- Modify: `design-system/MASTER.md`

- [ ] **Step 1: Add CSS variables**

In `web/studio/app/globals.css`, inside `:root` (after `--color-muted`):

```css
  --color-warn: #F59E0B;
  --color-danger: #EF4444;
```

- [ ] **Step 2: Document tokens in MASTER.md**

Add rows to the Tokens table:

| `--color-warn` | `#F59E0B` | Warming, almost-ready, caution badges |
| `--color-danger` | `#EF4444` | Action required, API offline, errors |

- [ ] **Step 3: Verify build**

Run: `cd web/studio && npm run build`
Expected: success (no token reference errors yet)

- [ ] **Step 4: Commit**

```bash
git add web/studio/app/globals.css design-system/MASTER.md
git commit -m "feat(studio): add warn and danger design tokens"
```

---

### Task 2: Readiness logic (TDD)

**Files:**
- Create: `web/studio/lib/dashboard-readiness.ts`
- Create: `web/studio/lib/dashboard-readiness.test.ts`
- Modify: `web/studio/package.json`

- [ ] **Step 1: Add Vitest**

In `web/studio/package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run"
},
"devDependencies": {
  ...
  "vitest": "^3.2.4"
}
```

Run: `cd web/studio && npm install`

- [ ] **Step 2: Write failing tests**

Create `web/studio/lib/dashboard-readiness.test.ts`:

```typescript
import { describe, expect, it } from "vitest";

import {
  capabilityRollupPercent,
  providerToolsSummary,
  readinessVerdict,
  type ReadinessInputs,
} from "./dashboard-readiness";

describe("capabilityRollupPercent", () => {
  it("returns 0 when no capabilities", () => {
    expect(capabilityRollupPercent([])).toBe(0);
  });

  it("returns rounded configured/total ratio", () => {
    expect(
      capabilityRollupPercent([
        { capability: "a", configured: 1, total: 2 },
        { capability: "b", configured: 2, total: 2 },
      ]),
    ).toBe(75);
  });
});

describe("readinessVerdict", () => {
  const base: ReadinessInputs = {
    apiOnline: true,
    preflightStatus: "ready",
    capabilities: [{ capability: "x", configured: 9, total: 10 }],
    cachedRollupPercent: null,
  };

  it("api offline", () => {
    const v = readinessVerdict({ ...base, apiOnline: false });
    expect(v.label).toBe("Studio API offline");
    expect(v.tone).toBe("danger");
  });

  it("preflight null", () => {
    const v = readinessVerdict({ ...base, preflightStatus: null });
    expect(v.label).toBe("Preflight unavailable");
    expect(v.tone).toBe("warn");
  });

  it("warming uses cached rollup when present", () => {
    const v = readinessVerdict({
      ...base,
      preflightStatus: "warming",
      cachedRollupPercent: 80,
    });
    expect(v.label).toBe("Warming registry…");
    expect(v.pulse).toBe(true);
    expect(v.displayPercent).toBe(80);
  });

  it("ready at 90%+ is primary", () => {
    const v = readinessVerdict({
      ...base,
      capabilities: [{ capability: "x", configured: 9, total: 10 }],
    });
    expect(v.label).toBe("Ready to produce");
    expect(v.tone).toBe("primary");
  });

  it("50–89% is almost ready", () => {
    const v = readinessVerdict({
      ...base,
      capabilities: [{ capability: "x", configured: 6, total: 10 }],
    });
    expect(v.label).toBe("Almost ready");
    expect(v.tone).toBe("warn");
  });

  it("<50% is action required", () => {
    const v = readinessVerdict({
      ...base,
      capabilities: [{ capability: "x", configured: 2, total: 10 }],
    });
    expect(v.label).toBe("Action required");
    expect(v.tone).toBe("danger");
  });
});

describe("providerToolsSummary", () => {
  it("sums configured and total across capabilities", () => {
    expect(
      providerToolsSummary([
        { capability: "a", configured: 1, total: 3 },
        { capability: "b", configured: 2, total: 2 },
      ]),
    ).toEqual({ configured: 3, total: 5 });
  });
});
```

- [ ] **Step 3: Run tests — expect FAIL**

Run: `cd web/studio && npm test`
Expected: FAIL — module `./dashboard-readiness` not found

- [ ] **Step 4: Implement minimal module**

Create `web/studio/lib/dashboard-readiness.ts`:

```typescript
import type { CapabilityRow } from "@/lib/capabilities";

export type ReadinessTone = "primary" | "warn" | "danger" | "muted";

export type ReadinessVerdict = {
  label: string;
  tone: ReadinessTone;
  pulse?: boolean;
  displayPercent: number | null;
};

export type ReadinessInputs = {
  apiOnline: boolean;
  preflightStatus: "warming" | "ready" | "error" | null;
  capabilities: CapabilityRow[];
  cachedRollupPercent: number | null;
};

export function capabilityRollupPercent(capabilities: CapabilityRow[]): number {
  let configured = 0;
  let total = 0;
  for (const row of capabilities) {
    configured += row.configured;
    total += row.total;
  }
  if (total === 0) return 0;
  return Math.round((configured / total) * 100);
}

export function providerToolsSummary(capabilities: CapabilityRow[]): {
  configured: number;
  total: number;
} {
  let configured = 0;
  let total = 0;
  for (const row of capabilities) {
    configured += row.configured;
    total += row.total;
  }
  return { configured, total };
}

export function readinessVerdict(input: ReadinessInputs): ReadinessVerdict {
  const rollup = capabilityRollupPercent(input.capabilities);
  const displayFromCache =
    input.preflightStatus === "warming" || input.preflightStatus === "error"
      ? input.cachedRollupPercent
      : null;
  const displayPercent =
    displayFromCache !== null && displayFromCache !== undefined
      ? displayFromCache
      : rollup;

  if (!input.apiOnline) {
    return {
      label: "Studio API offline",
      tone: "danger",
      displayPercent: displayPercent ?? null,
    };
  }

  if (input.preflightStatus === null) {
    return {
      label: "Preflight unavailable",
      tone: "warn",
      displayPercent: null,
    };
  }

  if (input.preflightStatus === "warming") {
    return {
      label: "Warming registry…",
      tone: "warn",
      pulse: true,
      displayPercent: displayPercent ?? null,
    };
  }

  if (input.preflightStatus === "error") {
    return {
      label: "Preflight failed",
      tone: "danger",
      displayPercent: displayPercent ?? null,
    };
  }

  const totalTools = input.capabilities.reduce((sum, row) => sum + row.total, 0);
  if (totalTools === 0) {
    return {
      label: "No capabilities registered",
      tone: "muted",
      displayPercent: 0,
    };
  }

  if (rollup >= 90) {
    return { label: "Ready to produce", tone: "primary", displayPercent: rollup };
  }
  if (rollup >= 50) {
    return { label: "Almost ready", tone: "warn", displayPercent: rollup };
  }
  return { label: "Action required", tone: "danger", displayPercent: rollup };
}

export function toneClass(tone: ReadinessTone): string {
  switch (tone) {
    case "primary":
      return "text-[var(--color-primary)]";
    case "warn":
      return "text-[var(--color-warn)]";
    case "danger":
      return "text-[var(--color-danger)]";
    default:
      return "text-[var(--color-muted)]";
  }
}
```

- [ ] **Step 5: Run tests — expect PASS**

Run: `cd web/studio && npm test`
Expected: all tests PASS

- [ ] **Step 6: Commit**

```bash
git add web/studio/package.json web/studio/package-lock.json \
  web/studio/lib/dashboard-readiness.ts web/studio/lib/dashboard-readiness.test.ts
git commit -m "feat(studio): add dashboard readiness verdict logic with tests"
```

---

### Task 3: Readiness ring component

**Files:**
- Create: `web/studio/components/readiness-ring.tsx`

- [ ] **Step 1: Implement ring (server-safe SVG + client animation wrapper)**

Create `web/studio/components/readiness-ring.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

type ReadinessRingProps = {
  percent: number | null;
  tone?: "primary" | "warn" | "danger" | "muted";
  size?: number;
  label?: string;
};

const STROKE = 8;
const TONE_STROKE: Record<NonNullable<ReadinessRingProps["tone"]>, string> = {
  primary: "var(--color-primary)",
  warn: "var(--color-warn)",
  danger: "var(--color-danger)",
  muted: "var(--color-muted)",
};

export function ReadinessRing({
  percent,
  tone = "primary",
  size = 120,
  label = "Readiness",
}: ReadinessRingProps) {
  const [animated, setAnimated] = useState<number | null>(percent);

  useEffect(() => {
    if (percent === null) {
      setAnimated(null);
      return;
    }
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setAnimated(percent);
      return;
    }
    setAnimated(0);
    const id = requestAnimationFrame(() => setAnimated(percent));
    return () => cancelAnimationFrame(id);
  }, [percent]);

  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const value = animated ?? 0;
  const offset = circumference - (value / 100) * circumference;
  const stroke = TONE_STROKE[tone];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={
        percent === null
          ? `${label}: unavailable`
          : `${label}: ${percent} percent`
      }
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={STROKE}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>
      <span className="absolute text-2xl font-semibold tabular-nums text-[var(--color-text)]">
        {percent === null ? "—" : `${percent}%`}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Lint**

Run: `cd web/studio && npm run lint`
Expected: no errors on new file

- [ ] **Step 3: Commit**

```bash
git add web/studio/components/readiness-ring.tsx
git commit -m "feat(studio): add readiness ring component"
```

---

### Task 4: Dashboard blockers component

**Files:**
- Create: `web/studio/components/dashboard-blockers.tsx`

- [ ] **Step 1: Implement top-5 setup offers list**

Create `web/studio/components/dashboard-blockers.tsx`:

```tsx
import Link from "next/link";

import { formatCapabilityName } from "@/lib/capabilities";
import type { SetupOffer } from "@/lib/api";

type DashboardBlockersProps = {
  setupOffers: SetupOffer[];
  maxItems?: number;
};

function offerTitle(offer: SetupOffer): string {
  const cap = offer.capability
    ? formatCapabilityName(offer.capability)
    : "Unknown capability";
  const tool = offer.tool ?? offer.provider ?? "tool";
  return `${cap} · ${tool}`;
}

export function DashboardBlockers({
  setupOffers,
  maxItems = 5,
}: DashboardBlockersProps) {
  const items = setupOffers.slice(0, maxItems);

  if (items.length === 0) {
    return (
      <p className="text-sm text-[var(--color-muted)]">
        No setup blockers — all reported tools are configured.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((offer, index) => {
        const slug = offer.capability ?? "";
        const href = slug ? `/setup?capability=${encodeURIComponent(slug)}` : "/setup";
        return (
          <li key={`${slug}-${offer.tool ?? index}`}>
            <Link
              href={href}
              className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              <span className="font-medium text-[var(--color-text)]">
                {offerTitle(offer)}
              </span>
              <span className="shrink-0 text-xs text-[var(--color-warn)]">
                Configure
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 2: Lint + commit**

Run: `cd web/studio && npm run lint`

```bash
git add web/studio/components/dashboard-blockers.tsx
git commit -m "feat(studio): add dashboard setup blockers list"
```

---

### Task 5: Mission Control layout in dashboard-preflight

**Files:**
- Modify: `web/studio/components/dashboard-preflight.tsx`

- [ ] **Step 1: Refactor layout**

Replace the Phase 1 eyebrow + 3-tile-only layout with:

1. **Hero:** eyebrow `Mission Control`, `ReadinessRing`, verdict text (with optional pulse via `animate-pulse motion-reduce:animate-none` when `verdict.pulse`), blocker count from `setup_offers.length`
2. **Row 1:** three tiles — Studio API (online/offline), Provider tools (`X/Y` + progress bar from `providerToolsSummary`), System clock (warmup/elapsed from preflight)
3. **Row 2:** `DashboardBlockers` | Quick actions (`/setup`, `/capabilities`, `/produce` — disable `/produce` link styling when rollup &lt; 50%)
4. **Row 3:** existing preflight section (status badge, runtimes, warnings, 6-row capabilities snapshot, refresh)

Wire imports:

```tsx
import { ReadinessRing } from "@/components/readiness-ring";
import { DashboardBlockers } from "@/components/dashboard-blockers";
import {
  capabilityRollupPercent,
  providerToolsSummary,
  readinessVerdict,
  toneClass,
} from "@/lib/dashboard-readiness";
```

Compute:

```tsx
const capabilities = summary?.capabilities ?? [];
const setupOffers = summary?.setup_offers ?? [];
const rollup = capabilityRollupPercent(capabilities);
const verdict = readinessVerdict({
  apiOnline: health !== null,
  preflightStatus: preflight?.status ?? null,
  capabilities,
  cachedRollupPercent: rollup,
});
const tools = providerToolsSummary(capabilities);
const produceReady = rollup >= 50 && verdict.tone !== "danger";
```

Quick actions: use `<Link>` with `aria-disabled` + `pointer-events-none opacity-50` when `!produceReady` for `/produce`.

- [ ] **Step 2: Build + lint**

Run:
```bash
cd web/studio && npm run lint && npm run build
```
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add web/studio/components/dashboard-preflight.tsx
git commit -m "feat(studio): Mission Control dashboard layout on home"
```

---

### Task 6: Composition runtime chips

**Files:**
- Modify: `web/studio/components/composition-runtime-chips.tsx`

- [ ] **Step 1: Update empty copy and add title tooltips**

Change empty message to: `No runtime data`

Add `title` on each chip:
- FFmpeg: `CLI available for media transforms`
- Remotion: `React programmatic video runtime`
- HyperFrames: `HTML composition runtime`

Use native `title` attribute (no new deps). Unavailable chips use `--color-danger` dot instead of hardcoded `red-400`.

- [ ] **Step 2: Commit**

```bash
git add web/studio/components/composition-runtime-chips.tsx
git commit -m "fix(studio): polish composition runtime chips copy and tooltips"
```

---

### Task 7: Preflight refresh button a11y

**Files:**
- Modify: `web/studio/components/preflight-refresh-button.tsx`

- [ ] **Step 1: Add aria-busy, Loader2 spin, danger token for errors**

```tsx
import { Loader2 } from "lucide-react";

// on button:
aria-busy={pending}

// button content:
{pending ? (
  <>
    <Loader2 className="mr-2 inline size-4 animate-spin motion-reduce:animate-none" aria-hidden />
    Refreshing preflight…
  </>
) : (
  "Refresh preflight"
)}

// error line:
<p className="mt-2 text-xs text-[var(--color-danger)]">{error}</p>
```

- [ ] **Step 2: Lint + commit**

```bash
git add web/studio/components/preflight-refresh-button.tsx
git commit -m "fix(studio): improve preflight refresh button a11y and feedback"
```

---

### Task 8: Verification & manual QA

**Files:** none (validation only)

- [ ] **Step 1: Automated checks**

```bash
cd web/studio && npm test && npm run lint && npm run build
cd ../.. && python -m pytest tests/services/test_studio_preflight.py -q
```
Expected: all pass

- [ ] **Step 2: Manual QA matrix** (with `make studio-api` + `make studio-dev`)

| Scenario | Expected verdict / UI |
|----------|----------------------|
| API stopped | `Studio API offline`, ring `—` or cached |
| Preflight warming | `Warming registry…`, pulse on verdict |
| Preflight error | `Preflight failed` |
| Ready, 0 capabilities | `No capabilities registered` |
| Ready, rollup 50–89% | `Almost ready`, `/produce` enabled |
| Ready, rollup &lt;50% | `Action required`, `/produce` disabled |
| Refresh POST failure | Inline error on button, `aria-busy` clears |
| 375 / 768 / 1024 px | Hero stacks; tiles wrap; no horizontal scroll |

- [ ] **Step 3: Spec acceptance checklist**

Map to spec sections 8–12: English strings only, WCAG focus rings on links/buttons, reduced-motion respected on ring and refresh spinner, no new API routes, no auto-polling.

---

## Spec coverage self-review

| Spec requirement | Task |
|------------------|------|
| Hero + readiness ring | 3, 5 |
| Verdict matrix | 2, 5 |
| Row 1 tiles | 5 |
| Setup blockers top 5 | 4, 5 |
| Quick actions + produce gate | 5 |
| Preflight section preserved | 5 |
| warn/danger tokens | 1 |
| Runtime chip tooltips | 6 |
| Refresh a11y | 7 |
| Unit tests for verdict logic | 2 |
| Manual responsive QA | 8 |

**Placeholder scan:** none — all steps include concrete paths and code.

---

## Out of scope (do not implement)

- ⌘K command palette, density toggle, shell header status bar
- Auto-polling preflight
- Paid provider calls from UI
- New `/produce` wizard pages
