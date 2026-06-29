import { Image, Plus } from "lucide-react";

const ENVIRONMENTS = [
  { id: "office-modern", name: "Modern Office", type: "generated", provider: "FAL", preview: "Bright, open-plan workspace with natural lighting" },
  { id: "studio-dark", name: "Dark Studio", type: "generated", provider: "FAL", preview: "Moody, dramatic studio with accent lighting" },
  { id: "nature-forest", name: "Forest Clearing", type: "stock", provider: "Pexels", preview: "Sunlit forest clearing with dappled shadows" },
  { id: "urban-street", name: "City Street", type: "stock", provider: "Pixabay", preview: "Modern urban streetscape at golden hour" },
];

export default function EnvironmentsLibraryPage() {
  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">Phase 5</p><h2 className="mt-2 text-2xl font-semibold">Environments</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">Browse environment presets, backdrops, and scene templates.</p></div>
      <button className="inline-flex min-h-11 items-center rounded-md border border-white/15 px-4 py-2 text-sm text-[var(--color-text)] hover:bg-white/5"><Plus className="mr-2 size-4" />Add environment</button>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      {ENVIRONMENTS.map((e) => (
        <div key={e.id} className="flex items-start gap-3 rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
          <Image className="mt-1 size-8 shrink-0 rounded bg-[var(--color-primary)]/10 p-1.5 text-[var(--color-primary)]" />
          <div><h3 className="text-sm font-semibold">{e.name}</h3><p className="mt-1 text-xs text-[var(--color-muted)]">{e.type === "generated" ? "AI Generated" : "Stock"} · {e.provider}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{e.preview}</p></div>
        </div>
      ))}
    </div>
  </div>;
}