# OpenMontage Studio — Design System

Dark operator dashboard for local OpenMontage control plane.

## Tokens

| Token | Value | Usage |
|-------|-------|--------|
| `--color-bg` | `#0F172A` | App shell background |
| `--color-surface` | `#1E293B` | Cards, panels, sidebar |
| `--color-primary` | `#22C55E` | Primary CTA, success states |
| `--color-text` | `#F8FAFC` | Body text on dark |
| `--color-muted` | `#94A3B8` | Secondary text, labels |
| `--color-warn` | `#F59E0B` | Warming, almost-ready, caution badges |
| `--color-danger` | `#EF4444` | Action required, API offline, errors |
| `--font-mono` | `"Fira Code", ui-monospace, monospace` | Tool names, env keys, JSON |
| `--font-sans` | `"Fira Sans", system-ui, sans-serif` | UI chrome |
| Spacing base | `8px` | Layout grid unit |
| Motion | `150ms–300ms ease` | Hovers; respect `prefers-reduced-motion` |

## Typography

- Headings: Fira Sans, semibold
- Data / code: Fira Code
- Minimum body size: 14px on dashboard; 16px for long-form docs

## Components

- Icons: Lucide only
- Interactive cards: `cursor-pointer`, no layout-shift on hover
- Focus: visible ring for keyboard navigation (WCAG AA target)

## Layout

- Sidebar navigation (240px) + main content
- Breakpoints: 375, 768, 1024, 1440
