import Link from "next/link";
import { Clock, Server, Wrench } from "lucide-react";

import { CompositionRuntimeChips } from "@/components/composition-runtime-chips";
import { DashboardBlockers } from "@/components/dashboard-blockers";
import { PreflightRefreshButton } from "@/components/preflight-refresh-button";
import { ReadinessRing } from "@/components/readiness-ring";
import { fetchHealth, fetchPreflightSummary } from "@/lib/api";
import { formatCapabilityName } from "@/lib/capabilities";
import {
  capabilityRollupPercent,
  providerToolsSummary,
  readinessVerdict,
  toneClass,
} from "@/lib/dashboard-readiness";

function formatElapsedMs(ms: number | null | undefined): string {
  if (ms == null || Number.isNaN(ms)) return "—";
  const seconds = ms / 1000;
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const rem = Math.round(seconds % 60);
  return rem > 0 ? `${minutes}m ${rem}s` : `${minutes}m`;
}

function statusBadgeClass(status: string | undefined): string {
  switch (status) {
    case "ready":
      return "bg-[var(--color-primary)]/15 text-[var(--color-primary)]";
    case "warming":
      return "bg-[var(--color-warn)]/15 text-[var(--color-warn)]";
    case "error":
      return "bg-[var(--color-danger)]/15 text-[var(--color-danger)]";
    default:
      return "bg-white/10 text-[var(--color-muted)]";
  }
}

function quickActionClass(disabled: boolean): string {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";
  if (disabled) {
    return `${base} pointer-events-none cursor-not-allowed border-white/10 opacity-50`;
  }
  return `${base} border-white/15 text-[var(--color-text)] hover:bg-white/5`;
}

export async function DashboardPreflight() {
  const [health, preflight] = await Promise.all([
    fetchHealth(),
    fetchPreflightSummary(),
  ]);

  const payload = preflight?.summary;
  const capabilities = payload?.capabilities ?? [];
  const setupOffers = payload?.setup_offers ?? [];
  const apiOnline = health?.status === "ok";
  const rollup = capabilityRollupPercent(capabilities);
  const verdict = readinessVerdict({
    apiOnline,
    preflightStatus: preflight?.status ?? null,
    capabilities,
    cachedRollupPercent: rollup,
  });
  const tools = providerToolsSummary(capabilities);
  const toolsProgress =
    tools.total > 0 ? Math.round((tools.configured / tools.total) * 100) : 0;
  const produceReady = rollup >= 50 && verdict.tone !== "danger";
  const blockerCount = setupOffers.length;

  const snapshot = [...capabilities]
    .sort((a, b) => a.capability.localeCompare(b.capability))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="flex flex-col gap-6 rounded-xl border border-white/10 bg-[var(--color-surface)] p-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
            Mission Control
          </p>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">
            Operator readiness
          </h1>
          <p
            className={`text-lg font-medium ${toneClass(verdict.tone)} ${
              verdict.pulse ? "animate-pulse motion-reduce:animate-none" : ""
            }`}
          >
            {verdict.label}
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            {blockerCount > 0
              ? `${blockerCount} blocker${blockerCount === 1 ? "" : "s"} — configure providers to unlock production`
              : "All provider slots configured"}
          </p>
        </div>
        <ReadinessRing
          percent={verdict.displayPercent}
          tone={verdict.tone}
          size={128}
        />
      </section>

      {/* Row 1: status tiles */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2 text-[var(--color-muted)]">
            <Server className="size-4" aria-hidden />
            <h2 className="text-xs font-medium uppercase tracking-wide">
              Studio API
            </h2>
          </div>
          <p
            className={`mt-2 text-lg font-semibold ${
              apiOnline
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-danger)]"
            }`}
          >
            {apiOnline ? "Online" : "Offline"}
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">studio-api</p>
        </article>

        <article className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2 text-[var(--color-muted)]">
            <Wrench className="size-4" aria-hidden />
            <h2 className="text-xs font-medium uppercase tracking-wide">
              Provider tools
            </h2>
          </div>
          <p className="mt-2 text-lg font-semibold tabular-nums">
            {tools.configured}/{tools.total}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[var(--color-primary)] transition-all"
              style={{ width: `${toolsProgress}%` }}
            />
          </div>
        </article>

        <article className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-[var(--color-muted)]">
            <Clock className="size-4" aria-hidden />
            <h2 className="text-xs font-medium uppercase tracking-wide">
              System clock
            </h2>
          </div>
          {preflight?.status === "warming" ? (
            <>
              <p className="mt-2 text-lg font-semibold text-[var(--color-warn)]">
                Warming registry…
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                Elapsed {formatElapsedMs(preflight.elapsed_ms)}
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-lg font-semibold tabular-nums">
                {formatElapsedMs(preflight?.warmup_ms ?? preflight?.elapsed_ms)}
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                Last refresh: —
              </p>
            </>
          )}
        </article>
      </section>

      {/* Row 2: blockers + quick actions */}
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
          <h2 className="text-sm font-semibold">Setup blockers</h2>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Top missing provider slots from registry preflight
          </p>
          <div className="mt-4">
            <DashboardBlockers
              setupOffers={setupOffers}
              rollupPercent={rollup}
            />
          </div>
        </article>

        <article className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
          <h2 className="text-sm font-semibold">Quick actions</h2>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Jump to setup, capabilities, or production
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/setup" className={quickActionClass(false)}>
              Provider setup
            </Link>
            <Link href="/capabilities" className={quickActionClass(false)}>
              Capabilities
            </Link>
            <Link
              href="/produce"
              className={quickActionClass(!produceReady)}
              aria-disabled={!produceReady}
              title={
                !produceReady ? "Configure more providers first" : undefined
              }
            >
              Start production
            </Link>
          </div>
        </article>
      </section>

      {/* Row 3: preflight detail */}
      <section className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold">Preflight snapshot</h2>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Registry status, composition runtimes, and capability rollup
            </p>
          </div>
          <PreflightRefreshButton disabled={!apiOnline} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(
              preflight?.status,
            )}`}
          >
            {preflight?.status ?? "unavailable"}
          </span>
          {preflight?.error ? (
            <span className="text-xs text-[var(--color-danger)]">
              {preflight.error}
            </span>
          ) : null}
        </div>

        <div className="mt-4">
          <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
            Composition runtimes
          </h3>
          <div className="mt-2">
            <CompositionRuntimeChips
              runtimes={payload?.composition_runtimes ?? {}}
            />
          </div>
        </div>

        {payload?.runtime_warnings?.length ? (
          <div className="mt-4">
            <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
              Warnings
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-warn)]">
              {payload.runtime_warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-6">
          <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
            Capabilities snapshot
          </h3>
          {snapshot.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              No capabilities in preflight response.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-white/10 rounded-md border border-white/10">
              {snapshot.map((row) => (
                <li
                  key={row.capability}
                  className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                >
                  <span>{formatCapabilityName(row.capability)}</span>
                  <span className="font-mono text-xs text-[var(--color-muted)]">
                    {row.configured}/{row.total}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {capabilities.length > 6 ? (
            <Link
              href="/capabilities"
              className="mt-2 inline-flex min-h-11 items-center text-xs text-[var(--color-primary)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              View all {capabilities.length} capabilities
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
