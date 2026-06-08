import Link from "next/link";

import { fetchHealth, fetchPreflightSummary } from "@/lib/api";

export async function DashboardPreflight() {
  const [health, preflight] = await Promise.all([
    fetchHealth(),
    fetchPreflightSummary(),
  ]);

  const apiOnline = health?.status === "ok";

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">
          Phase 0
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Dashboard</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
          Studio is the local operator cockpit. Use it to inspect capabilities,
          setup, and pipelines before triggering production from the agent
          workflow.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
          <h3 className="text-sm font-semibold">Quick links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="text-[var(--color-primary)] hover:underline" href="/capabilities">
                Capabilities registry
              </Link>
            </li>
            <li>
              <Link className="text-[var(--color-primary)] hover:underline" href="/setup">
                Provider setup
              </Link>
            </li>
            <li>
              <Link className="text-[var(--color-primary)] hover:underline" href="/pipelines">
                Pipeline catalog
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <section className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
        <h3 className="text-sm font-semibold">Preflight summary</h3>
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
              Tool discovery runs once on API startup. Refresh this page in a
              minute if the summary has not appeared yet.
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
          <div className="mt-3 space-y-2">
            <p className="inline-flex rounded-full bg-[var(--color-primary)]/15 px-2 py-1 text-xs font-medium text-[var(--color-primary)]">
              Ready
              {typeof preflight.warmup_ms === "number"
                ? ` · ${Math.round(preflight.warmup_ms / 1000)}s warmup`
                : null}
            </p>
            <pre className="max-h-96 overflow-auto rounded-md bg-black/30 p-3 font-mono text-xs text-[var(--color-muted)]">
              {JSON.stringify(preflight.summary ?? preflight, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
}
