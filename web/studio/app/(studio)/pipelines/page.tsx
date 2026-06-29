import Link from "next/link";
import { Layers, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";

const PIPELINES = [
  { id: "explainer", name: "Explainer Video", description: "30-90s animated explainer with voiceover, captions, and music.", stages: 6, ready: true },
  { id: "social-clip", name: "Social Media Clip", description: "Vertical short-form video for Instagram, TikTok, YouTube Shorts.", stages: 4, ready: true },
  { id: "tutorial", name: "Feature Tutorial", description: "Step-by-step walkthrough with screen capture and voiceover.", stages: 5, ready: false },
  { id: "brand-reel", name: "Brand Identity Reel", description: "Cinematic brand intro with custom transitions and sound design.", stages: 7, ready: true },
  { id: "caption-burn", name: "Caption Burn-in", description: "Burn SRT/VTT captions into existing video with configurable styles.", stages: 3, ready: true },
  { id: "avatar-video", name: "Avatar Video", description: "AI avatar presenter with script, background, and caption overlay.", stages: 5, ready: false },
];

export default function PipelinesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">Phase 2</p>
        <h2 className="mt-2 text-2xl font-semibold">Pipelines</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">Available video production pipelines. Click to view YAML definitions, stages, and contracts.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PIPELINES.map((pl) => (
          <Link key={pl.id} href={`/pipelines/${pl.id}`}
            className="flex flex-col rounded-lg border border-white/10 bg-[var(--color-surface)] p-4 transition-colors hover:bg-white/[0.03]">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold">{pl.name}</h3>
              {pl.ready ? <CheckCircle2 className="size-4 shrink-0 text-[var(--color-primary)]" /> : <AlertTriangle className="size-4 shrink-0 text-[var(--color-warn)]" />}
            </div>
            <p className="mt-2 flex-1 text-xs leading-5 text-[var(--color-muted)]">{pl.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-[var(--color-muted)]">{pl.stages} stages</span>
              <span className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)]">View <ArrowRight className="size-3" /></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}