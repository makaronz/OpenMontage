import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const PROJECTS: Record<string, { name: string; status: string; description: string; renders: number }> = {
  "explainer-v1": { name: "Product Explainer v1", status: "completed", description: "30s product explainer", renders: 3 },
  "social-clip-01": { name: "Social Media Clip", status: "draft", description: "15s vertical clip", renders: 1 },
  "tutorial-02": { name: "Feature Tutorial", status: "in-progress", description: "Step-by-step walkthrough", renders: 0 },
  "brand-asset": { name: "Brand Identity Reel", status: "draft", description: "30s brand intro", renders: 0 },
};

type Props = { params: Promise<{ id: string }> };
export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const p = PROJECTS[id];
  if (!p) return <div className="space-y-6">
    <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"><ArrowLeft className="size-4" /> Back</Link>
    <div className="rounded-lg border border-dashed border-white/15 bg-[var(--color-surface)] p-8 text-center"><p className="text-sm text-[var(--color-muted)]">Project not found.</p></div>
  </div>;
  return <div className="space-y-6">
    <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"><ArrowLeft className="size-4" /> Back</Link>
    <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">Phase 3</p><h2 className="mt-2 text-2xl font-semibold">{p.name}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">{p.description}</p></div>
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4"><p className="text-xs text-[var(--color-muted)]">Status</p><p className="mt-1 text-lg font-semibold capitalize">{p.status}</p></div>
      <div className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4"><p className="text-xs text-[var(--color-muted)]">Renders</p><p className="mt-1 text-lg font-semibold">{p.renders}</p></div>
      <div className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4"><p className="text-xs text-[var(--color-muted)]">ID</p><p className="mt-1 font-mono text-sm text-[var(--color-muted)]">{id}</p></div>
    </div>
  </div>;
}