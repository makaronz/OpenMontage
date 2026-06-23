# OpenMontage

**MANDATORY: Read `AGENT_GUIDE.md` before responding to ANY user message.**

Do not act on the user's request until you have read AGENT_GUIDE.md.
It contains routing rules that determine your first action based on what the user asked.
Skipping it WILL cause you to take the wrong action.

There are no instructions in this file. All instructions are in AGENT_GUIDE.md.

## Learned User Preferences

- Respond in Polish in chat; write code, comments, GitHub, and documentation in English.
- Invoke `@AGENT_GUIDE.md` and follow its routing as the first action on OpenMontage requests.
- For UI and feature work, complete brainstorming design approval before writing implementation code.
- Confirm design choices with single-letter options (A/B/C/D) or short Polish approvals like "tak".
- "C" in chat means continue the active workflow branch without restarting discovery.
- Use `/ultrawork` with explicit acceptance criteria for parallel, evidence-backed UI and implementation work.

## Learned Workspace Facts

- OpenMontage is an agent-led, instruction-driven video production system; all production runs through `pipeline_defs/` per AGENT_GUIDE Rule Zero.
- v1 web UI scope is Studio-only: a localhost operator cockpit for preflight, setup, and pipelines—not a public Capability Atlas or browser NLE.
- Studio frontend is `web/studio/` (Next.js 16, React 19, Tailwind v4); design tokens live in `design-system/MASTER.md`.
- Studio backend is `services/studio-api/`; start locally with `make studio-api`.
- Active web rollout plan: `.omx/plans/openmontage-web-frontend-showcase.md` (Phase 1 targets Dashboard, Capabilities, Setup).
- Approved design specs are written to `docs/superpowers/specs/` before implementation.
- Studio must surface Remotion and HyperFrames as dual composition runtimes with honest registry-driven preflight.
- First Studio UI iteration prioritizes Dashboard + preflight as the primary operator HUD (Mission Control pattern).
