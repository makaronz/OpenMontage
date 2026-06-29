import { Library, User, Plus } from "lucide-react";

const CHARACTERS = [
  { id: "narrator-01", name: "Professional Narrator", type: "voice", provider: "ElevenLabs", preview: "Male, mid-range, English (US)" },
  { id: "explainer-01", name: "Friendly Explainer", type: "voice", provider: "ElevenLabs", preview: "Female, warm, English (UK)" },
  { id: "avatar-maya", name: "Maya (AI Avatar)", type: "avatar", provider: "HeyGen", preview: "Female presenter, business casual" },
  { id: "avatar-james", name: "James (AI Avatar)", type: "avatar", provider: "HeyGen", preview: "Male presenter, smart casual" },
];

export default function CharactersLibraryPage() {
  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">Phase 5</p><h2 className="mt-2 text-2xl font-semibold">Characters</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">Browse reusable character rigs and reference assets.</p></div>
      <button className="inline-flex min-h-11 items-center rounded-md border border-white/15 px-4 py-2 text-sm text-[var(--color-text)] hover:bg-white/5"><Plus className="mr-2 size-4" />New character</button>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      {CHARACTERS.map((c) => (
        <div key={c.id} className="flex items-start gap-3 rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
          <User className="mt-1 size-8 shrink-0 rounded-full bg-[var(--color-primary)]/10 p-1.5 text-[var(--color-primary)]" />
          <div><h3 className="text-sm font-semibold">{c.name}</h3><p className="mt-1 text-xs text-[var(--color-muted)]">{c.type === "voice" ? "Voice" : "AI Avatar"} · {c.provider}</p><p className="mt-1 text-xs text-[var(--color-muted)]">{c.preview}</p></div>
        </div>
      ))}
    </div>
  </div>;
}