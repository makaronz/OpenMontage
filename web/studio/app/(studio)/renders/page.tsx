import { Zap, Film, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const MOCK_RENDERS = [
  { id: "r-001", name: "Product Explainer - Final", pipeline: "explainer", status: "completed", duration: "45s", format: "MP4 1920x1080", completedAt: "2026-06-25 14:32", size: "12.4 MB" },
  { id: "r-002", name: "Social Clip - Teaser", pipeline: "social-clip", status: "completed", duration: "15s", format: "MP4 1080x1920", completedAt: "2026-06-28 09:15", size: "3.8 MB" },
  { id: "r-003", name: "Brand Reel - Draft 2", pipeline: "brand-reel", status: "rendering", duration: "30s", format: "MP4 1920x1080", completedAt: null, size: null },
  { id: "r-004", name: "Tutorial - Feature Overview", pipeline: "tutorial", status: "failed", duration: "2m 10s", format: "MP4 1920x1080", completedAt: "2026-06-29 07:45", size: null },
];

const STATUS_CFG: Record<string, { icon: any; color: string; label: string }> = {
  completed: { icon: CheckCircle2, color: "text-[var(--color-primary)]", label: "Completed" },
  rendering: { icon: Clock, color: "text-[var(--color-warn)]", label: "Rendering" },
  failed: { icon: AlertCircle, color: "text-[var(--color-danger)]", label: "Failed" },
};

export default function RendersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">Phase 4</p>
        <h2 className="mt-2 text-2xl font-semibold">Renders</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">Track Remotion and HyperFrames outputs, logs, and artifact paths.</p>
      </div>
      <div className="space-y-3">
        {MOCK_RENDERS.map((r) => {
          const cfg = STATUS_CFG[r.status] || STATUS_CFG.completed;
          const Icon = cfg.icon;
          return (
            <div key={r.id} className="flex items-start gap-4 rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
              <Icon className={`mt-0.5 size-5 shrink-0 ${cfg.color}`} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div><h3 className="text-sm font-semibold">{r.name}</h3><p className="mt-0.5 font-mono text-xs text-[var(--color-muted)]">{r.id} · {r.pipeline}</p></div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.color.replace("text-", "bg-/15 text-") || "bg-white/10 text-[var(--color-muted)]"}`}>{cfg.label}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-muted)]">
                  <span className="flex items-center gap-1"><Clock className="size-3" />{r.duration}</span>
                  <span className="flex items-center gap-1"><Film className="size-3" />{r.format}</span>
                  {r.completedAt && <span>{r.completedAt}</span>}
                  {r.size && <span>{r.size}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}