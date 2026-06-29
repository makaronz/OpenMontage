import { Palette, Plus } from "lucide-react";

const STYLES = [
  { id: "clean-corporate", name: "Clean Corporate", palette: "#1a365d · #2d6da4 · #e2e8f0", description: "Professional clean lines, sans-serif" },
  { id: "bold-energetic", name: "Bold & Energetic", palette: "#ef4444 · #f59e0b · #1e293b", description: "High contrast, dynamic transitions" },
  { id: "dark-premium", name: "Dark Premium", palette: "#0f172a · #22c55e · #f8fafc", description: "Luxury feel, subtle gradients" },
  { id: "neon-electric", name: "Neon Electric", palette: "#a855f7 · #06b6d4 · #ec4899", description: "Cyberpunk aesthetic, glitch effects" },
  { id: "warm-editorial", name: "Warm Editorial", palette: "#7c2d12 · #d97706 · #fef3c7", description: "Earth tones, serif headers" },
  { id: "pastel-soft", name: "Pastel Soft", palette: "#fbcfe8 · #bfdbfe · #bbf7d0", description: "Gentle transitions, rounded corners" },
];

export default function StylesLibraryPage() {
  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">Phase 5</p><h2 className="mt-2 text-2xl font-semibold">Styles</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">Browse visual style guides and brand tokens.</p></div>
      <button className="inline-flex min-h-11 items-center rounded-md border border-white/15 px-4 py-2 text-sm text-[var(--color-text)] hover:bg-white/5"><Plus className="mr-2 size-4" />New style</button>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {STYLES.map((s) => {
        const colors = s.palette.split(" \u00b7 ");
        return <div key={s.id} className="flex flex-col rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
          <div className="flex gap-1">{colors.map((c, i) => <div key={i} className="h-6 flex-1 rounded first:rounded-l-md last:rounded-r-md" style={{ backgroundColor: c.trim() }} title={c.trim()} />)}</div>
          <h3 className="mt-3 text-sm font-semibold">{s.name}</h3>
          <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">{s.description}</p>
          <p className="mt-1 font-mono text-xs text-[var(--color-muted)]">{s.palette}</p>
        </div>;
      })}
    </div>
  </div>;
}