import { ExternalLink, DollarSign, Server, AlertTriangle } from "lucide-react";

const PROVIDERS = [
  { name: "fal.ai", cost: "Pay-as-you-go", tier: "Production", doc: "https://fal.ai/docs", key: "FAL_KEY" },
  { name: "OpenAI", cost: "Pay-as-you-go", tier: "Production", doc: "https://platform.openai.com/docs", key: "OPENAI_API_KEY" },
  { name: "ElevenLabs", cost: "Freemium", tier: "Production", doc: "https://elevenlabs.io/docs", key: "ELEVENLABS_API_KEY" },
  { name: "Google AI", cost: "Free tier", tier: "Production", doc: "https://ai.google.dev/docs", key: "GOOGLE_API_KEY" },
  { name: "xAI", cost: "Pay-as-you-go", tier: "Production", doc: "https://docs.x.ai", key: "XAI_API_KEY" },
  { name: "Runway", cost: "Credit-based", tier: "Production", doc: "https://docs.dev.runwayml.com", key: "RUNWAY_API_KEY" },
  { name: "HeyGen", cost: "Subscription", tier: "Production", doc: "https://docs.heygen.com", key: "HEYGEN_API_KEY" },
  { name: "Suno", cost: "Subscription", tier: "Production", doc: "https://docs.sunoapi.org", key: "SUNO_API_KEY" },
  { name: "Pexels", cost: "Free", tier: "Stock", doc: "https://www.pexels.com/api/", key: "PEXELS_API_KEY" },
  { name: "Pixabay", cost: "Free", tier: "Stock", doc: "https://pixabay.com/api/docs/", key: "PIXABAY_API_KEY" },
  { name: "Unsplash", cost: "Free", tier: "Stock", doc: "https://unsplash.com/documentation", key: "UNSPLASH_ACCESS_KEY" },
  { name: "Hugging Face", cost: "Free tier", tier: "ML", doc: "https://huggingface.co/docs", key: "HF_TOKEN" },
];

const TIER_COLORS: Record<string, string> = {
  Production: "bg-[var(--color-primary)]/15 text-[var(--color-primary)]",
  Stock: "bg-blue-500/15 text-blue-300",
  ML: "bg-purple-500/15 text-purple-300",
};

export default function DocsProvidersPage() {
  return <div className="space-y-6">
    <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">Phase 1</p><h2 className="mt-2 text-2xl font-semibold">Provider docs</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">Setup notes, key links, and cost guidance.</p></div>
    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-5 text-[var(--color-warn)]">
      <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 size-4 shrink-0" /><p>Each provider requires an API key in your local .env. Keys are never sent to Studio.</p></div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {PROVIDERS.map((p) => <div key={p.name} className="flex flex-col rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
        <div className="flex items-start justify-between gap-3"><h3 className="text-sm font-semibold">{p.name}</h3><span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${TIER_COLORS[p.tier]}`}>{p.tier}</span></div>
        <div className="mt-3 space-y-1 text-xs text-[var(--color-muted)]"><p className="flex items-center gap-1"><DollarSign className="size-3" />{p.cost}</p><p className="flex items-center gap-1"><Server className="size-3" />Key: <code className="font-mono">{p.key}</code></p></div>
        <div className="mt-4 flex gap-2">
          <a href={p.doc} target="_blank" rel="noopener noreferrer" className="rounded bg-[var(--color-primary)]/10 px-2 py-1 text-xs text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 inline-flex items-center gap-1">Docs <ExternalLink className="size-3" /></a>
          <a href="/setup" className="rounded bg-white/10 px-2 py-1 text-xs text-[var(--color-muted)] hover:bg-white/20">Setup</a>
        </div>
      </div>)}
    </div>
  </div>;
}