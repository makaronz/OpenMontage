import Link from "next/link";

import { CompositionRuntimeChips } from "@/components/composition-runtime-chips";
import { PreflightRefreshButton } from "@/components/preflight-refresh-button";
import {
  fetchHealth,
  fetchPreflightSummary,
  type CapabilityRow,
} from "@/lib/api";
import { formatCapabilityName } from "@/lib/capabilities";

function totalConfigured(capabilities: CapabilityRow[]): {
  configured: number;
  total: number;
} {
  return capabilities.reduce(
    (acc, row) => ({
      configured: acc.configured + row.configured,
      total: acc.total + row.total,
    }),
    { configured: 0, total: 0 },
  );
}

export async function DashboardPreflight() {
  const [health, preflight] = await Promise.all([
    fetchHealth(),
    fetchPreflightSummary(),
  ]);

  const apiOnline = health?.status === "ok";
  const summary = preflight?.summary;
  const capabilities = summary?.capabilities ?? [];
  const rollup = totalConfigured(capabilities);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">
          Phase 1
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Dashboard</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
          Local operator cockpit: registry preflight, composition runtimes, and
          provider readiness before production workflows.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <section className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
          <h3 className="text-sm font-semibold">Studio API</h3>
          <p className="mt-2 font-mono text-xs text-[var(--color-muted)]">
            {process.env.STUDIO_API_URL ?? "http://127.0.0.1:8000"}
          </p>
          <p
            className={`mt-3 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
              apiOnline
                ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
                : "bg-red-500/15 text-red-300"
            }`}
          >
            {apiOnline ? "Online" : "Offline"}
          </p>
          {health?.repo_root ? (
            <p className="mt-3 break-all font-mono text-xs text-[var(--color-muted)]">
              repo: {health.repo_root}
            </p>
          ) : null}
        </section>

        <section className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
          <h3 className="text-sm font-semibold">Provider tools</h3>
          {preflight?.status === "ready" && capabilities.length > 0 ? (
            <>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {rollup.configured}
                <span className="text-base font-normal text-[var(--color-muted)]">
                  {" "}
                  / {rollup.total}
                </span>
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                Configured tool slots across capabilities
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {apiOnline ? "Waiting for preflight…" : "API offline"}
            </p>
          )}
        </section>

        <section className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4 md:col-span-2 xl:col-span-1">
          <h3 className="text-sm font-semibold">Quick links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                className="text-[var(--color-primary)] hover:underline"
                href="/capabilities"
              >
                Capabilities registry
              </Link>
            </li>
            <li>
              <Link
                className="text-[var(--color-primary)] hover:underline"
                href="/setup"
              >
                Provider setup
              </Link>
            </li>
            <li>
              <Link
                className="text-[var(--color-primary)] hover:underline"
                href="/pipelines"
              >
                Pipeline catalog
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <section className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Preflight</h3>
          <PreflightRefreshButton disabled={!apiOnline} />
        </div>

        {!apiOnline ? (
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            Start the API with{" "}
            <code className="font-mono text-xs">make studio-api</code> to load
            registry and provider menu data.
          </p>
        ) : !preflight ? (
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            API is online but preflight summary is unavailable.
          </p>
        ) : preflight.status === "warming" ? (
          <div className="mt-3 space-y-2">
            <p className="inline-flex rounded-full bg-amber-500/15 px-2 py-1 text-xs font-medium text-amber-200">
              Warming registry…
            </p>
            <p className="text-sm text-[var(--color-muted)]">
              Tool discovery runs once on API startup.
              {typeof preflight.elapsed_ms === "number"
                ? ` (${Math.round(preflight.elapsed_ms / 1000)}s elapsed)`
                : null}
            </p>
          </div>
        ) : preflight.status === "error" ? (
          <div className="mt-3 space-y-2">
            <p className="inline-flex rounded-full bg-red-500/15 px-2 py-1 text-xs font-medium text-red-300">
              Preflight failed
            </p>
            <p className="font-mono text-xs text-red-200">{preflight.error}</p>
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            <p className="inline-flex rounded-full bg-[var(--color-primary)]/15 px-2 py-1 text-xs font-medium text-[var(--color-primary)]">
              Ready
              {typeof preflight.warmup_ms === "number"
                ? ` · ${Math.round(preflight.warmup_ms / 1000)}s warmup`
                : null}
            </p>

            <div>
              <h4 className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                Composition runtimes
              </h4>
              <div className="mt-2">
                <CompositionRuntimeChips
                  runtimes={summary?.composition_runtimes ?? {}}
                />
              </div>
            </div>

            {summary?.runtime_warnings &&
            summary.runtime_warnings.length > 0 ? (
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                  Runtime warnings
                </h4>
                <ul className="mt-2 space-y-1 text-xs text-amber-200/90">
                  {summary.runtime_warnings.map((warning) => (
                    <li key={warning} className="font-mono">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {capabilities.length > 0 ? (
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                    Capabilities snapshot
                  </h4>
                  <Link
                    href="/capabilities"
                    className="text-xs text-[var(--color-primary)] hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <ul className="mt-3 space-y-2">
                  {capabilities.slice(0, 6).map((row) => (
                    <li
                      key={row.capability}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span>{formatCapabilityName(row.capability)}</span>
                      <span className="font-mono text-xs text-[var(--color-muted)]">
                        {row.configured}/{row.total}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
