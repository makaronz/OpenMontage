import Link from "next/link";
import { Film, FolderKanban, Play, Clock, AlertCircle } from "lucide-react";

const PROJECTS = [
  { id: "explainer-v1", name: "Product Explainer v1", status: "completed", renders: 3, lastModified: "2026-06-25", description: "30s product explainer with voiceover" },
  { id: "social-clip-01", name: "Social Media Clip", status: "draft", renders: 1, lastModified: "2026-06-28", description: "15s vertical clip for Instagram/TikTok" },
  { id: "tutorial-02", name: "Feature Tutorial", status: "in-progress", renders: 0, lastModified: "2026-06-29", description: "Step-by-step walkthrough" },
  { id: "brand-asset", name: "Brand Identity Reel", status: "draft", renders: 0, lastModified: "2026-06-27", description: "30s brand intro with custom transitions" },
];

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-[var(--color-primary)]/15 text-[var(--color-primary)]",
  draft: "bg-white/10 text-[var(--color-muted)]",
  "in-progress": "bg-[var(--color-warn)]/15 text-[var(--color-warn)]",
};

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">Phase 3</p>
          <h2 className="mt-2 text-2xl font-semibold">Projects</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">Browse montage projects, manifests, and production runs.</p>
        </div>
        <button className="inline-flex min-h-11 items-center rounded-md border border-white/15 px-4 py-2 text-sm text-[var(--color-text)] hover:bg-white/5">
          <Film className="mr-2 size-4" />New project
        </button>
      </div>
      <div className="space-y-4">
        {PROJECTS.map((p) => (
          <Link key={p.id} href={`/projects/${p.id}`}
            className="flex flex-col gap-3 rounded-lg border border-white/10 bg-[var(--color-surface)] p-4 transition-colors hover:bg-white/[0.03]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <FolderKanban className="mt-0.5 size-5 shrink-0 text-[var(--color-muted)]" />
                <div>
                  <h3 className="text-sm font-semibold">{p.name}</h3>
                  <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">{p.description}</p>
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status]}`}>{p.status}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
              <span className="flex items-center gap-1"><Play className="size-3" />{p.renders} render{p.renders !== 1 ? "s" : ""}</span>
              <span className="flex items-center gap-1"><Clock className="size-3" />{p.lastModified}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}