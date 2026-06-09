type CompositionRuntimeChipsProps = {
  runtimes: Record<string, boolean>;
};

const RUNTIME_LABELS: Record<string, string> = {
  ffmpeg: "FFmpeg",
  remotion: "Remotion",
  hyperframes: "HyperFrames",
};

const RUNTIME_TOOLTIPS: Record<string, string> = {
  ffmpeg: "CLI available for media transforms",
  remotion: "React programmatic video runtime",
  hyperframes: "HTML composition runtime",
};

export function CompositionRuntimeChips({
  runtimes,
}: CompositionRuntimeChipsProps) {
  const entries = Object.entries(runtimes);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-[var(--color-muted)]">No runtime data</p>
    );
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {entries.map(([key, available]) => (
        <li
          key={key}
          title={RUNTIME_TOOLTIPS[key]}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
            available
              ? "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
              : "border-white/10 bg-white/5 text-[var(--color-muted)]"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              available
                ? "bg-[var(--color-primary)]"
                : "bg-[var(--color-danger)]"
            }`}
            aria-hidden
          />
          {RUNTIME_LABELS[key] ?? key}
        </li>
      ))}
    </ul>
  );
}
