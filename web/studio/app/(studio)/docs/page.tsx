import { BookOpen, ExternalLink, FileText, Video, Wrench, Settings } from "lucide-react";
import Link from "next/link";

const SECTIONS = [
  { title: "Getting Started", docs: [
    { name: "Quick Start Guide", href: "https://github.com/calesthio/OpenMontage#quick-start", icon: FileText },
    { name: "Installation", href: "https://github.com/calesthio/OpenMontage#installation", icon: Wrench },
    { name: "Configuration", href: "https://github.com/calesthio/OpenMontage#configuration", icon: Settings },
  ]},
  { title: "Production", docs: [
    { name: "Pipeline Reference", href: "/pipelines", icon: Video },
    { name: "Provider Setup", href: "/docs/providers", icon: Wrench },
    { name: "Provider Docs", href: "https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md", icon: FileText },
  ]},
  { title: "Reference", docs: [
    { name: "Agent Guide", href: "https://github.com/calesthio/OpenMontage/blob/main/AGENT_GUIDE.md", icon: BookOpen },
    { name: "Project Context", href: "https://github.com/calesthio/OpenMontage/blob/main/PROJECT_CONTEXT.md", icon: FileText },
    { name: "Prompt Gallery", href: "https://github.com/calesthio/OpenMontage/blob/main/PROMPT_GALLERY.md", icon: FileText },
  ]},
];

export default function DocsPage() {
  return <div className="space-y-6">
    <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">Phase 1</p><h2 className="mt-2 text-2xl font-semibold">Docs</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">Operator docs and links to repo guides.</p></div>
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {SECTIONS.map((s) => <section key={s.title} className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
        <h3 className="text-sm font-semibold">{s.title}</h3>
        <ul className="mt-3 space-y-2">{s.docs.map((d) => <li key={d.name}><Link href={d.href} className="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]"><d.icon className="size-4 shrink-0" />{d.name}{d.href.startsWith("http") && <ExternalLink className="size-3" />}</Link></li>)}</ul>
      </section>)}
    </div>
  </div>;
}