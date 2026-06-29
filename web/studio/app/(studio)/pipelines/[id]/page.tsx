import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Clock } from "lucide-react";

const STAGES: Record<string, Array<{ name: string; description: string; status: string }>> = {
  explainer: [
    { name: "Script Generation", description: "AI generates narrative script from topic and duration.", status: "ready" },
    { name: "Voiceover Recording", description: "TTS voiceover generated from approved script.", status: "ready" },
    { name: "Visual Storyboard", description: "Scene-by-scene storyboard with transitions.", status: "ready" },
    { name: "Media Assembly", description: "Stock footage, images, and graphics assembled.", status: "ready" },
    { name: "Composition & Render", description: "Remotion composition renders final video.", status: "ready" },
    { name: "Quality Check", description: "Automated validation and manual review.", status: "ready" },
  ],
  "social-clip": [
    { name: "Script & Hook", description: "Short-form script with attention hook in first 3s.", status: "ready" },
    { name: "Visual Assembly", description: "Vertical layout with dynamic text overlays.", status: "ready" },
    { name: "Music & SFX", description: "Background track and sound effects.", status: "ready" },
    { name: "Export & Format", description: "Vertical MP4 with platform-optimized encoding.", status: "ready" },
  ],
  "brand-reel": [
    { name: "Brand Intake", description: "Brand guidelines, color palette, typography.", status: "ready" },
    { name: "Mood Board", description: "Visual direction and reference material.", status: "ready" },
    { name: "Score Composition", description: "Custom sound design and music.", status: "ready" },
    { name: "Animation & Motion", description: "Keyframe animation and motion design.", status: "ready" },
    { name: "Render & Grading", description: "Final render with color grading.", status: "ready" },
  ],
  "caption-burn": [
    { name: "Source Import", description: "Upload source video and caption file (SRT/VTT).", status: "ready" },
    { name: "Style Configuration", description: "Font, size, position, color styling.", status: "ready" },
    { name: "Render Output", description: "Burned-in caption video ready for distribution.", status: "ready" },
  ],
};

const META: Record<string, { name: string }> = {
  explainer: { name: "Explainer Video" },
  "social-clip": { name: "Social Media Clip" },
  "brand-reel": { name: "Brand Reel" },
  "caption-burn": { name: "Caption Burn-in" },
};

type Props = { params: Promise<{ id: string }> };
export default async function PipelineDetailPage({ params }: Props) {
  const { id } = await params;
  const meta = META[id] || { name: id };
  const stages = STAGES[id] || [];
  if (!stages.length) {
    return <div className="space-y-6">
      <Link href="/pipelines" className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"><ArrowLeft className="size-4" /> Back</Link>
      <div className="rounded-lg border border-dashed border-white/15 bg-[var(--color-surface)] p-8 text-center"><p className="text-sm text-[var(--color-muted)]">Pipeline "{meta.name}" not found.</p></div>
    </div>;
  }
  return <div className="space-y-6">
    <Link href="/pipelines" className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"><ArrowLeft className="size-4" /> Back</Link>
    <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">Phase 2</p><h2 className="mt-2 text-2xl font-semibold">{meta.name}</h2></div>
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Stages ({stages.length})</h3>
      {stages.map((s, i) => (
        <div key={s.name} className="flex items-start gap-4 rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
          {s.status === "complete" ? <CheckCircle2 className="mt-0.5 size-5 text-[var(--color-primary)]" /> : <Circle className="mt-0.5 size-5 text-[var(--color-primary)]" />}
          <div><span className="font-mono text-xs text-[var(--color-muted)]">Stage {i + 1}</span><h4 className="text-sm font-semibold">{s.name}</h4><p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">{s.description}</p></div>
        </div>
      ))}
    </div>
  </div>;
}