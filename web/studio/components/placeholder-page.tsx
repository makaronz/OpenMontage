type PlaceholderPageProps = {
  title: string;
  description: string;
  phase?: string;
};

export function PlaceholderPage({
  title,
  description,
  phase = "Phase 1+",
}: PlaceholderPageProps) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">
        {phase}
      </p>
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
        {description}
      </p>
      <div className="mt-6 rounded-lg border border-dashed border-white/15 bg-[var(--color-surface)] p-4 text-sm text-[var(--color-muted)]">
        UI wiring lands in a later phase. Production still runs through Cursor
        agents and repo tools.
      </div>
    </div>
  );
}
