"use client";

import { useCallback, useMemo, useState } from "react";

import {
  OPTIONAL_ENV_KEYS,
  PRIMARY_ENV_KEYS,
  optionalProviderCards,
  primaryProviderCards,
  type SetupProviderCard,
} from "@/lib/setup-providers";

type SetupEnvEditorProps = {
  envPath: string;
};

type FieldValues = Record<string, string>;

function cardIsComplete(card: SetupProviderCard, values: FieldValues): boolean {
  return card.fields.every((field) => values[field.envKey]?.trim());
}

async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

export function SetupEnvEditor({ envPath }: SetupEnvEditorProps) {
  const [values, setValues] = useState<FieldValues>({});
  const [includeEmptyOptional, setIncludeEmptyOptional] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const configuredPrimaryCount = useMemo(
    () => PRIMARY_ENV_KEYS.filter((key) => values[key]?.trim()).length,
    [values],
  );

  const envBlock = useMemo(() => {
    const lines = [
      "# OpenMontage API keys",
      "# Generated from Studio setup (copy into local .env)",
      "",
    ];

    for (const key of PRIMARY_ENV_KEYS) {
      lines.push(`${key}=${values[key]?.trim() ?? ""}`);
    }

    lines.push("", "# Optional providers");
    for (const key of OPTIONAL_ENV_KEYS) {
      const value = values[key]?.trim() ?? "";
      if (includeEmptyOptional || value) {
        lines.push(`${key}=${value}`);
      }
    }

    return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
  }, [values, includeEmptyOptional]);

  const updateField = useCallback((key: string, next: string) => {
    setValues((current) => ({ ...current, [key]: next }));
  }, []);

  const flashCopy = useCallback((message: string) => {
    setCopyFeedback(message);
    window.setTimeout(() => setCopyFeedback(null), 1200);
  }, []);

  const handleCopyLine = useCallback(
    async (envKey: string) => {
      await copyText(`${envKey}=`);
      flashCopy(`Copied ${envKey}=`);
    },
    [flashCopy],
  );

  const handleCopyEnv = useCallback(async () => {
    await copyText(envBlock);
    flashCopy("Copied .env block");
  }, [envBlock, flashCopy]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
      <div className="space-y-8">
        <section className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <p>
              <span className="text-[var(--color-muted)]">Configured: </span>
              <strong>{configuredPrimaryCount}</strong>
              <span className="text-[var(--color-muted)]">
                {" "}
                / {PRIMARY_ENV_KEYS.length}
              </span>
            </p>
            <p>
              <span className="text-[var(--color-muted)]">Missing: </span>
              <strong>{PRIMARY_ENV_KEYS.length - configuredPrimaryCount}</strong>
            </p>
          </div>
          <p className="mt-3 text-xs leading-5 text-[var(--color-muted)]">
            Paste values after the equals sign. Nothing is written to disk from
            this page — copy the block below into{" "}
            <code className="font-mono text-[var(--color-text)]">{envPath}</code>
            , then refresh preflight on the dashboard.
          </p>
        </section>

        <ProviderSection title="Core OpenMontage providers" cards={primaryProviderCards} values={values} onChange={updateField} onCopyLine={handleCopyLine} />

        <ProviderSection
          title="Optional extensions"
          cards={optionalProviderCards}
          values={values}
          onChange={updateField}
          onCopyLine={handleCopyLine}
        />
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <section className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
          <h3 className="text-sm font-semibold">Generated .env block</h3>
          <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
            Updates live as you type. Do not commit real keys to Git.
          </p>
          <textarea
            readOnly
            value={envBlock}
            spellCheck={false}
            className="mt-3 h-80 w-full resize-y rounded-md border border-white/10 bg-black/30 p-3 font-mono text-xs text-[var(--color-muted)]"
            aria-label="Generated .env block"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleCopyEnv()}
              className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-xs font-medium text-black hover:opacity-90"
            >
              Copy full .env
            </button>
            <button
              type="button"
              onClick={() => setIncludeEmptyOptional((current) => !current)}
              className="rounded-md border border-white/15 px-3 py-2 text-xs text-[var(--color-muted)] hover:bg-white/5"
            >
              {includeEmptyOptional
                ? "Hide empty optional keys"
                : "Show empty optional keys"}
            </button>
          </div>
          {copyFeedback ? (
            <p className="mt-2 text-xs text-[var(--color-primary)]">
              {copyFeedback}
            </p>
          ) : null}
        </section>
      </aside>
    </div>
  );
}

type ProviderSectionProps = {
  title: string;
  cards: SetupProviderCard[];
  values: FieldValues;
  onChange: (key: string, value: string) => void;
  onCopyLine: (key: string) => void;
};

function ProviderSection({
  title,
  cards,
  values,
  onChange,
  onCopyLine,
}: ProviderSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-4 grid gap-4 lg:grid-cols-2">
        {cards.map((card) => (
          <ProviderCard
            key={card.id}
            card={card}
            values={values}
            onChange={onChange}
            onCopyLine={onCopyLine}
          />
        ))}
      </ul>
    </section>
  );
}

type ProviderCardProps = {
  card: SetupProviderCard;
  values: FieldValues;
  onChange: (key: string, value: string) => void;
  onCopyLine: (key: string) => void;
};

function ProviderCard({
  card,
  values,
  onChange,
  onCopyLine,
}: ProviderCardProps) {
  const complete = cardIsComplete(card, values);

  return (
    <li className="flex flex-col rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{card.title}</h3>
          <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">
            {card.description}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            card.optional
              ? "bg-white/10 text-[var(--color-muted)]"
              : complete
                ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
                : "bg-amber-500/15 text-amber-200"
          }`}
        >
          {card.optional ? "Optional" : complete ? "Set" : "Missing"}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {card.fields.map((field) => (
          <label key={field.envKey} className="block text-xs">
            <span className="font-mono text-[var(--color-text)]">
              {field.envKey}
            </span>
            {field.hint ? (
              <span className="mt-0.5 block text-[var(--color-muted)]">
                {field.hint}
              </span>
            ) : (
              <span className="mt-0.5 block text-[var(--color-muted)]">
                Paste the value after the equals sign
              </span>
            )}
            <input
              type="password"
              autoComplete="off"
              spellCheck={false}
              placeholder={`${field.envKey}=`}
              value={values[field.envKey] ?? ""}
              onChange={(event) => onChange(field.envKey, event.target.value)}
              className="mt-1.5 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]/50"
            />
          </label>
        ))}
      </div>

      {card.note ? (
        <p className="mt-3 text-xs leading-5 text-[var(--color-muted)]">
          {card.note}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={card.primaryLink.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-black hover:opacity-90"
        >
          {card.primaryLink.label}
        </a>
        {card.secondaryLinks?.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-[var(--color-muted)] hover:bg-white/5"
          >
            {link.label}
          </a>
        ))}
        {card.fields.map((field) => (
          <button
            key={field.envKey}
            type="button"
            onClick={() => void onCopyLine(field.envKey)}
            className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-[var(--color-muted)] hover:bg-white/5"
          >
            Copy {field.envKey}=
          </button>
        ))}
      </div>
    </li>
  );
}
