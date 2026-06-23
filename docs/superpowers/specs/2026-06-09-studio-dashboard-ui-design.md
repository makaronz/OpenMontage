# Studio Dashboard UI — Mission Control Design Spec

**Status:** Approved (design review 2026-06-09)  
**Scope:** v1 — Dashboard (`/`) preflight-focused operator HUD  
**Out of scope:** Implementation (separate plan), `/produce` wizard, shell header bar, ⌘K palette, density toggle

## Context

OpenMontage Studio is a local operator cockpit at `localhost`. The dashboard must surface registry preflight, composition runtimes, and provider readiness before production workflows—without calling paid providers from the UI and without silently choosing between Remotion and HyperFrames.

**Product direction:** Option A — **Mission Control** (not Creative Canvas, not Agent Console).

**Rule Zero:** Studio = operator surface; IDE agent = production brain.

**Reference:** `.omx/plans/openmontage-web-frontend-showcase.md`

## Goals

1. Give operators an at-a-glance readiness verdict (rollup %, blockers, API health).
2. Surface `setup_offers` on the dashboard (today only on `/capabilities`).
3. Keep Remotion and HyperFrames visibly dual-track with tooltips/warnings.
4. Preserve existing preflight states and refresh flow; no auto-polling.
5. Meet WCAG AA and `prefers-reduced-motion`.

## Non-goals (v1)

- Auto-refresh / WebSocket live updates
- Shell header status bar
- Command palette (⌘K)
- Density toggle
- New `/produce` wizard pages
- Paid provider invocation from UI without explicit user confirmation
- Full capabilities grid on `/` (stays on `/capabilities`)
- Deep-link highlight on `/setup` from `?capability=` (v1.1)

## Stack & touchpoints

| Layer | Path |
|-------|------|
| Dashboard RSC | `web/studio/components/dashboard-preflight.tsx` |
| Runtime chips | `web/studio/components/composition-runtime-chips.tsx` |
| Refresh | `web/studio/components/preflight-refresh-button.tsx` |
| Shell | `web/studio/components/studio-shell.tsx` |
| Capabilities grid (patterns) | `web/studio/components/capabilities-grid.tsx` |
| API client | `web/studio/lib/api.ts` |
| Capability naming | `web/studio/lib/capabilities.ts` |
| Tokens | `web/studio/app/globals.css`, `design-system/MASTER.md` |
| Backend | `services/studio-api/main.py`, `preflight.py` |

**API:** `GET /api/health`, `GET /api/preflight/summary`, `POST /api/preflight/run`

**Types:** `HealthResponse`, `PreflightResponse` (`warming` \| `ready` \| `error`), `PreflightSummaryPayload`, `SetupOffer`

## Layout & hierarchy

Top → bottom on `/`:

### 1. Hero

- Eyebrow: `Mission Control` (replaces `Phase 1`)
- **Readiness ring:** `round(configured / total * 100)` from capability rollup
- **Verdict text** (see Copy)
- **Blocker count** from `setup_offers.length` when `ready`

### 2. Row 1 — Status tiles (3 columns desktop)

| Tile | Content |
|------|---------|
| Studio API | Base URL, `Online` / `Offline` badge, optional `repo_root` |
| Provider tools | `{configured} / {total}` + progress bar + sublabel |
| System clock | Warmup elapsed (`warming`) or warmup ms (`ready`); placeholder `Last refresh: —` on SSR |

### 3. Row 2 — Two columns

| Left | Right |
|------|-------|
| **Setup blockers** — top 5 `setup_offers`, links to `/setup?capability={slug}` | **Quick actions** — Provider setup, Capabilities, Start production, Pipeline catalog |

### 4. Row 3 — Preflight detail (existing section, enhanced)

- Status badges: warming / error / ready
- `CompositionRuntimeChips` + tooltips
- `runtime_warnings` list
- Capabilities snapshot (first 6 rows) + View all → `/capabilities`
- `PreflightRefreshButton`

## New components

| Component | Responsibility |
|-----------|----------------|
| `readiness-ring.tsx` | SVG/circle stroke; server % prop; client animation wrapper |
| `dashboard-blockers.tsx` | Top 5 `setup_offers`; reuse naming from `capabilities-grid.tsx` |

## States & API mapping

### Verdict matrix

| Condition | Verdict | Ring color |
|-----------|---------|------------|
| API offline | `Studio API offline` | danger / muted |
| API online, preflight `null` | `Preflight unavailable` | warn |
| `warming` | `Warming registry…` | warn + pulse (verdict only) |
| `error` | `Preflight failed` | danger |
| `ready`, `total === 0` | `No capabilities registered` | muted |
| `ready`, rollup ≥ 90% | `Ready to produce` | primary |
| `ready`, rollup 50–89% | `Almost ready` | warn |
| `ready`, rollup < 50% | `Action required` | danger |

### Rollup

```ts
capabilities.reduce((acc, row) => ({
  configured: acc.configured + row.configured,
  total: acc.total + row.total,
}), { configured: 0, total: 0 })
```

During `warming` / `error`, show last known rollup from RSC cache if present; otherwise `—`.

### Refresh

- `POST /api/preflight/run` then `router.refresh()`
- No auto-polling
- Button disabled when API offline
- `aria-busy` + spin during POST; prevent double-submit
- On failure: inline `Refresh failed — try again`

### Links & gating

| Target | Rule |
|--------|------|
| `/setup?capability={slug}` | From blocker row CTA |
| `/capabilities` | Quick action + View all |
| `/produce` | Quick action **disabled** when rollup < 50%; `aria-disabled`; tooltip `Configure more providers first` |
| `/pipelines` | Active link (404 route acceptable v1) |

### Composition runtimes

- Always show FFmpeg, Remotion, HyperFrames chips when data exists
- Missing runtime: muted chip + dot; surface matching `runtime_warnings` in tooltip or warnings list
- Empty `composition_runtimes`: `No runtime data` (section visible)

### Accessibility (v1)

- Verdict + color (not color-only)
- `tabular-nums` on counts and %
- Section headings with `aria-labelledby`
- Visible focus rings on links and refresh button
- Min 44px touch targets on interactive elements

## Visual tokens & motion

### New tokens (extend palette)

```css
--color-warn: #f59e0b;
--color-danger: #ef4444;
```

Update `design-system/MASTER.md` to document warn/danger usage.

### Typography scale

| Role | Style |
|------|-------|
| Eyebrow | mono, xs, uppercase, tracking wide, primary |
| Hero verdict | 2xl semibold |
| Ring % | xl tabular-nums inside ring |
| Tile title | sm semibold |
| Tile metric | 2xl semibold tabular-nums |
| Blocker row | sm; instructions xs muted line-clamp-2 |
| Warnings | xs mono amber |

### Icons (Lucide)

| UI | Icon |
|----|------|
| API tile | `Server` |
| Refresh | `RefreshCw` |
| Blockers | `KeyRound` or `Wrench` |
| Warnings | `AlertTriangle` |
| Quick actions | contextual (e.g. `Settings`, `Grid`, `Play`, `Workflow`) |

### Motion

| Element | Animation | Reduced motion |
|---------|-----------|----------------|
| Ring stroke | 600ms ease on % change | static final stroke |
| Progress bar | 300ms width | instant |
| Refresh | spin on icon | spin OK (essential) |
| Warming verdict | subtle pulse | static |

No parallax, stagger, or count-up animations.

### Responsive

| Breakpoint | Layout |
|------------|--------|
| < 768px | Single column; hero stack; tiles stack |
| 768–1023px | Hero full width; tiles 2-col; row 2 stack |
| ≥ 1024px | Hero 3-col feel; tiles 3-col; row 2 two columns |

Visual consistency with `/capabilities` badges and progress bars.

## Edge cases

| Scenario | Behavior |
|----------|----------|
| `setup_offers` empty at < 100% | `No setup hints from registry` + link `/setup` |
| `setup_offers` > 5 | Show 5 + `View all blockers on Capabilities` |
| `capabilities` > 6 | Snapshot 6 + View all |
| `runtime_warnings` empty | Hide warnings subsection |
| POST refresh fails | Inline error; page stable |
| Only one composition runtime available | Both chips visible; unavailable muted |

## Copy (EN — production strings)

### Hero

- Eyebrow: `Mission Control`
- Subtitle (keep): `Local operator cockpit: registry preflight, composition runtimes, and provider readiness before production workflows.`

### Verdicts

See verdict matrix above.

### Subcopy

- `N blocker(s) — configure providers to unlock production`
- `All provider slots configured`
- `Tool discovery runs once on API startup.` (+ elapsed when `elapsed_ms` present)

### Tiles

- API badges: `Online`, `Offline`
- Providers sublabel: `Configured tool slots`
- Clock: `Warmup: {n}s` or `Last refresh: —`

### Blockers panel

- Title: `Setup blockers`
- Empty: `All provider slots configured`
- CTA per row: `Fix in Setup`
- Overflow: `View all blockers on Capabilities`

### Quick actions

- `Provider setup`
- `Capabilities`
- `Start production` (gated)
- `Pipeline catalog`

### Preflight (unchanged headers)

- `Composition runtimes`
- `Runtime warnings`
- `Capabilities snapshot`
- Refresh: `Refresh preflight`

### API offline hint

`Start the API with make studio-api to load registry and provider menu data.`

## Acceptance criteria (v1)

### Functional

1. Hero displays readiness ring % from capability rollup when data available.
2. Verdict text and ring color match verdict matrix.
3. Row 1 shows API tile, provider rollup with progress bar, clock/warmup.
4. Row 2 shows top 5 `setup_offers` and quick actions with `/produce` gating.
5. Row 3 preserves warming/error/ready preflight UX plus runtimes, warnings, snapshot.
6. Refresh uses POST + `router.refresh()` without auto-poll.
7. Navigation links work as specified.

### Non-functional

8. WCAG AA contrast on badges; keyboard focus visible.
9. `prefers-reduced-motion` disables ring/progress/pulse animations.
10. Responsive layouts at 375 / 768 / 1024 px.
11. All UI copy in English; no `console.log`; no hardcoded secrets.
12. No new routes; no paid provider calls from dashboard UI.

## Implementation sequence (for planning)

1. Tokens: `--color-warn`, `--color-danger` in `globals.css` + `MASTER.md`
2. `readiness-ring.tsx` (server % + client animation wrapper)
3. `dashboard-blockers.tsx`
4. Refactor `dashboard-preflight.tsx` layout (hero → rows → preflight)
5. Enhance `composition-runtime-chips.tsx` (tooltips, empty copy `No runtime data`)
6. `preflight-refresh-button.tsx` (error state, `aria-busy`)
7. Manual QA: API off, warming, error, ready at 0/50/90/100%

## Approval record

| Section | Approved |
|---------|----------|
| 1 Layout & hierarchy | 2026-06-09 |
| 2 States & API mapping | 2026-06-09 |
| 3 Visual tokens & responsive | 2026-06-09 |
| 4 Edge cases, copy, acceptance | 2026-06-09 |

**Next step:** Implementation plan via `writing-plans` skill after committed spec approval.
