import { Clapperboard, Play, DollarSign, Shield, AlertTriangle } from "lucide-react";

const PRODUCTION_TYPES = [
  { id: "explainer", name: "Explainer Video", description: "Generate a 30-90s animated explainer with AI voiceover.", estCost: "$0.50-2.00", duration: "5-10 min", ready: true },
  { id: "social", name: "Social Media Clip", description: "Create a vertical short-form video for social platforms.", estCost: "$0.25-1.00", duration: "3-5 min", ready: true },
  { id: "brand-reel", name: "Brand Reel", description: "Cinematic brand identity piece with custom motion design.", estCost: "$1.00-5.00", duration: "10-20 min", ready: true },
  { id: "caption-burn", name: "Caption Burn-in", description: "Burn SRT/VTT captions into an existing video file.", estCost: "$0.10-0.50", duration: "2-5 min", ready: true },
];

export default function ProducePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">Phase 4</p>
        <h2 className="mt-2 text-2xl font-semibold">Produce</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">Launch a guided production wizard with cost gates for paid providers.</p>
      </div>
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-5 text-[var(--color-warn)]">
        <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 size-4 shrink-0" /><p>Each production consumes API credits. Set budget limits in config.yaml before launching.</p></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {PRODUCTION_TYPES.map((prod) => (
          <div key={prod.id} className="flex flex-col rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
            <h3 className="text-sm font-semibold">{prod.name}</h3>
            <p className="mt-2 flex-1 text-xs leading-5 text-[var(--color-muted)]">{prod.description}</p>
            <div className="mt-4 flex items-center gap-4 text-xs text-[var(--color-muted)]">
              <span className="flex items-center gap-1"><DollarSign className="size-3" />{prod.estCost}</span>
              <span className="flex items-center gap-1"><Play className="size-3" />{prod.duration}</span>
            </div>
            <button disabled className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-[var(--color-muted)] opacity-50 cursor-not-allowed">
              <Shield className="mr-2 size-4" />Start production
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}