type CompositionRuntimeChipsProps = {
  runtimes: Record<string, boolean>;
};

const RUNTIME_LABELS: Record<string, string> = {
  ffmpeg: "FFmpeg",
  remotion: "Remotion",
  hyperframes: "HyperFrames",
};

export function CompositionRuntimeChips({
  runtimes,
}: CompositionRuntimeChipsProps) {
  const entries = Object.entries(runtimes);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-[var(--color-muted)]">
        No composition runtimes reported.
      </p>
    );
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {entries.map(([key, available]) => (
        <li
          key={key}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
            available
              ? "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
              : "border-white/10 bg-white/5 text-[var(--color-muted)]"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              available ? "bg-[var(--color-primary)]" : "bg-red-400/80"
            }`}
            aria-hidden
          />
          {RUNTIME_LABELS[key] ?? key}
        </li>
      ))}
    </ul>
  );
}
